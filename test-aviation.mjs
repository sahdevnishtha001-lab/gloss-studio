import assert from 'node:assert/strict';
import {createWorker} from './worker.mjs';
import {localBindings} from './local-storage.mjs';
const env=localBindings(),worker=createWorker(),tasks=[],origin='https://gloss.test';
async function request(path,method='GET',body){return worker.fetch(new Request(origin+path,{method,headers:{'oai-authenticated-user-id':'aviation-test',origin,...(body instanceof Uint8Array?{'content-type':'image/png'}:{'content-type':'application/json'})},body:body instanceof Uint8Array?body:body?JSON.stringify(body):undefined}),env,{waitUntil:p=>tasks.push(p)});}
try{
 const bytes=new Uint8Array([137,80,78,71,13,10,26,10,1,2,3,4]);
 const id=crypto.randomUUID(),portrait=crypto.randomUUID();
 const legacyDoc={profile:{name:'Aviation applicant',title:'Aspiring Cabin Crew',role:'Aviation',template:'editorial',languages:'English — fluent; Hindi — native',availability:'Open to relocation <script>bad()</script>'},assets:[{id,mime:'image/png',size:bytes.length,slot:'work',title:'Introduction photo',category:'Professional photos'},{id:portrait,mime:'image/png',size:bytes.length,slot:'portrait',title:'Profile photo',category:'Portrait'}]};
 const build={id:crypto.randomUUID(),revision:crypto.randomUUID()};
 await env.DB.prepare('INSERT INTO portfolios (id,owner_id,published,revision,document_json,updated_at) VALUES (?,?,?,?,?,?)').bind(build.id,'aviation-test',1,build.revision,JSON.stringify(legacyDoc),new Date().toISOString()).run();
 await request('/api/talent/account','POST',{profession:'hotel',name:'Legacy owner',city:'Mumbai',confirm:true});
 assert.equal((await request('/api/publish/start','POST',legacyDoc)).status,403,'New aviation publishing is closed');
 const page=await request(`/p/${build.id}`),html=await page.text();assert.equal(page.status,200);
 for(const value of ['Aviation applicant','Aspiring Cabin Crew','English — fluent; Hindi — native','Availability & preferred base',`/media/${build.id}/${build.revision}/${portrait}`])assert.ok(html.includes(value),value);
 assert.ok(!html.includes('<script>bad()</script>'));assert.ok(html.includes('&lt;script&gt;bad()&lt;/script&gt;'));
 console.log('Archived aviation links remain readable; new publishing requires the registered current profession.');
}finally{await Promise.all(tasks);env.close();}
