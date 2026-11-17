import assert from 'node:assert/strict';
import {createWorker} from './worker.mjs';
import {localBindings} from './local-storage.mjs';

const env = localBindings();
env.AGENCY_ADMIN_EMAIL = 'owner@example.test';
const worker = createWorker();
const origin = 'https://gloss.test';
const tasks = [];
const path = '/api/makeup-directory';

function request(path, {method = 'GET', user = 'artist', email, body} = {}) {
  const headers = {origin};
  if (user) headers['oai-authenticated-user-id'] = user;
  if (email) headers['oai-authenticated-user-email'] = email;
  if (body) headers['content-type'] = body instanceof Uint8Array ? 'image/png' : 'application/json';
  return worker.fetch(new Request(origin + path, {
    method, headers, body: body instanceof Uint8Array ? body : body && JSON.stringify(body),
  }), env, {waitUntil: promise => tasks.push(promise)});
}

try {
  assert.equal((await request(path, {user: null})).status, 401);
  const photo = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
  const start = await request('/api/publish/start', {method: 'POST', body: {
    profile: {name: 'Directory test artist', role: 'Makeup artist', city: 'Mumbai', specialty: 'HD', phone: 'private-test-number'},
    makeupDirectoryRequested: true,
    makeupDirectoryApproved: true,
    assets: [{id: crypto.randomUUID(), mime: 'image/png', size: photo.length, slot: 'work', title: 'Look', category: 'HD'}],
  }});
  assert.equal(start.status, 200);
  const {id, revision, assets} = await start.json();
  assert.equal((await request(assets[0].uploadUrl, {method: 'PUT', body: photo})).status, 200);
  assert.equal((await request(`/api/publish/${revision}/finish`, {method: 'POST'})).status, 200);
  const pending = await (await request(path)).json();
  assert.deepEqual(pending.listings, []);
  assert.deepEqual(pending.requests, []);
  const admin = {user: 'owner', email: env.AGENCY_ADMIN_EMAIL};
  const review = await (await request(path, admin)).json();
  assert.equal(review.requests[0].id, id);
  const approval = {method: 'POST', body: {id, revision, approved: true}};
  assert.equal((await request(path, approval)).status, 403);
  assert.equal((await request(path, {...approval, ...admin})).status, 200);
  const matching = await (await request(path + '?city=mumbai')).json();
  assert.deepEqual(matching.cities, ['Mumbai']);
  assert.deepEqual(matching.listings, [{id, name: 'Directory test artist', city: 'Mumbai', specialty: 'HD'}]);
  assert.deepEqual((await (await request(path + '?city=Delhi')).json()).listings, []);
  assert.equal((await request('/api/publication/unpublish', {method: 'POST'})).status, 200);
  assert.deepEqual((await (await request(path)).json()).listings, []);
  console.log('Directory checks passed for sign-in, explicit opt-in, owner approval, city filtering, limited fields and unpublishing.');
} finally {
  await Promise.all(tasks);
  env.close();
}
