import assert from 'node:assert/strict';
import {createWorker} from './worker.mjs';
import {localBindings} from './local-storage.mjs';
const env=localBindings(),worker=createWorker(),tasks=[],origin='https://gloss.test';
async function request(path,method='GET',body){return worker.fetch(new Request(origin+path,{method,headers:{'oai-authenticated-user-id':'aviation-test',origin,...(body instanceof Uint8Array?{'content-type':'image/png'}:{'content-type':'application/json'})},body:body instanceof Uint8Array?body:body?JSON.stringify(body):undefined}),env,{waitUntil:p=>tasks.push(p)});}
try{
 const bytes=new Uint8Array([137,80,78,71,13,10,26,10,1,2,3,4]);
 const id=crypto.randomUUID(),portrait=crypto.randomUUID();
 const response=await request('/api/publish/start','POST',{profile:{name:'Aviation applicant',title:'Aspiring Cabin Crew',role:'Aviation',template:'editorial',languages:'English — fluent; Hindi — native',availability:'Open to relocation <script>bad()</script>'},assets:[{id,mime:'image/png',size:bytes.length,slot:'work',title:'Introduction photo',category:'Professional photos'},{id:portrait,mime:'image/png',size:bytes.length,slot:'portrait',title:'Profile photo',category:'Portrait'}]});
 assert.equal(response.status,200);const build=await response.json();
 for(const asset of build.assets)assert.equal((await request(asset.uploadUrl,'PUT',bytes)).status,200);
 assert.equal((await request(`/api/publish/${build.revision}/finish`,'POST')).status,200);
 const page=await request(`/p/${build.id}`),html=await page.text();assert.equal(page.status,200);
 for(const value of ['Aviation applicant','Aspiring Cabin Crew','English — fluent; Hindi — native','Availability & preferred base',`/media/${build.id}/${build.revision}/${portrait}`])assert.ok(html.includes(value),value);
 assert.ok(!html.includes('<script>bad()</script>'));assert.ok(html.includes('&lt;script&gt;bad()&lt;/script&gt;'));
 console.log('Aviation publishing passed: role, languages, availability, own portrait and escaped public content.');
}finally{await Promise.all(tasks);env.close();}
