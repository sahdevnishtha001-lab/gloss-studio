import {handleNetwork} from './agency-network.mjs';
import hotelRoles from './dist/hotel-roles.js';
import {handleWebinar} from './webinar.mjs';
const MAX_FILE=25*1024*1024, MAX_TOTAL=65*1024*1024;
const ROLES=['Aviation','Model','Modeling agency','Makeup artist','Hairstylist','Nail artist','Salon','Content creator',...Object.keys(hotelRoles)];
const TYPES=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];
const ID=/^[a-f0-9-]{36}$/;
const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const headers={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{...headers,'content-type':'application/json;charset=utf-8'}});
const fail=(message,status=400)=>{const error=new Error(message);error.status=status;throw error;};
const one=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).first();
const run=(env,sql,...args)=>env.DB.prepare(sql).bind(...args).run();
async function limitedBody(request,limit){const length=Number(request.headers.get('content-length'));if(length>limit)fail('This upload is too large.',413);const reader=request.body?.getReader();if(!reader)return new Uint8Array();let total=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>limit){await reader.cancel();fail('This upload is too large.',413);}chunks.push(value);}const result=new Uint8Array(total);let offset=0;for(const c of chunks){result.set(c,offset);offset+=c.byteLength;}return result;}
async function requestJSON(request){try{return JSON.parse(new TextDecoder().decode(await limitedBody(request,40000)));}catch(e){if(e.status)throw e;fail('Please send valid portfolio data.');}}
function validateDocument(input){if(!input||typeof input!=='object'||!input.profile||!Array.isArray(input.assets))fail('The portfolio is incomplete.');const profile={};const limits={name:80,title:100,city:100,role:40,bio:900,email:120,phone:50,link:200,height:30,measurements:70,hair:30,eyes:30,specialty:250,experience:1600,education:800,skills:350,template:20,languages:300,availability:300,hotelFocus:450,hotelOperations:450,hotelStandards:450};for(const [key,max]of Object.entries(limits)){if(input.profile[key]!==undefined&&typeof input.profile[key]!=='string')fail('Invalid profile field.');profile[key]=String(input.profile[key]||'').slice(0,max);}if(!profile.name.trim())fail('Add your name before publishing.');if(!ROLES.includes(profile.role))fail('Choose a profession.');if(!['editorial','minimal','noir'].includes(profile.template))profile.template='editorial';const hotel=Object.hasOwn(hotelRoles,profile.role);if(input.assets.length>13)fail('Publish up to 13 photos/videos, including your portrait.');let total=0,portraits=0;const seen=new Set();const assets=input.assets.map(a=>{if(!a||!ID.test(a.id)||seen.has(a.id)||!TYPES.includes(a.mime)||!Number.isInteger(a.size)||a.size<1||a.size>MAX_FILE)fail('One of the media files is invalid or too large.');seen.add(a.id);if(a.mime.startsWith('image/')&&a.size>5*1024*1024)fail('Photos must be 5 MB or smaller.');if(a.slot!=='portrait'&&a.slot!=='work')fail('Invalid media slot.');if(a.slot==='portrait'&&(!a.mime.startsWith('image/')||++portraits>1))fail('Choose one portrait image.');total+=a.size;return {id:a.id,mime:a.mime,size:a.size,slot:a.slot,type:a.mime.startsWith('video/')?'video':'image',title:String(a.title||'Selected work').slice(0,100),note:String(a.note||'').slice(0,250),category:String(a.category||'Selected work').slice(0,40),featured:a.featured===true};});if(total>MAX_TOTAL)fail('Your published media must total 65 MB or less.');if(!hotel&&!assets.some(a=>a.slot==='work'))fail('Add at least one portfolio photo or video before publishing.');return {profile,assets,makeupDirectoryRequested:input.makeupDirectoryRequested===true&&profile.role==="Makeup artist"&&!!profile.city.trim()};}
function signatureMatches(bytes,mime){if(mime==='image/jpeg')return bytes[0]===255&&bytes[1]===216;if(mime==='image/png')return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;if(mime==='image/webp')return new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';if(mime==='video/webm')return bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163;if(mime==='video/mp4')return new TextDecoder().decode(bytes.slice(4,8))==='ftyp';return false;}
async function ownedBuild(env,revision,owner){const build=await one(env,'SELECT * FROM publication_builds WHERE id = ? AND owner_id = ?',revision,owner);if(!build)fail('This upload session was not found.',404);if(Date.now()-Date.parse(build.created_at)>86400000)fail('This upload session expired. Start publishing again.',410);return build;}
const mediaKey=(id,revision,asset)=>`portfolios/${id}/${revision}/${asset}`;
async function cleanup(env,id,revision){if(!revision)return;let cursor;do{const listing=await env.BUCKET.list({prefix:`portfolios/${id}/${revision}/`,cursor});const keys=listing.objects.map(o=>o.key);if(keys.length)await env.BUCKET.delete(keys);cursor=listing.truncated?listing.cursor:undefined;}while(cursor);}
async function publicRecord(env,id){return one(env,'SELECT * FROM portfolios WHERE id = ? AND published = 1',id);}
function publicModelCasting(role, work, player) {
  const intros = role === 'Model' ? work.filter(a => a.category === 'Intro video' && a.mime.startsWith('video/')) : [];
  const photos = role === 'Model' ? work.filter(a => a.category === 'Polaroids' && a.mime.startsWith('image/')) : [];
  const caption = a => `<figcaption><b>${escape(a.title)}</b>${a.note ? `<p>${escape(a.note)}</p>` : ''}</figcaption>`;
  const section = (title, content) => `<section class="book-casting-section" aria-label="${title}"><h3>${title}</h3>${content}</section>`;
  const intro = intros.length ? section('Intro video', intros.map(a => `<figure class="book-intro-video">${player(a)}${caption(a)}</figure>`).join('')) : '';
  const polaroids = photos.length ? section('Polaroids', `<div class="book-polaroids">${photos.map(a => `<figure>${player(a)}${caption(a)}</figure>`).join('')}</div>`) : '';
  return { html: intro + polaroids, regular: work.filter(a => !intros.includes(a) && !photos.includes(a)) };
}
function publicPage(row){const {profile:p,assets}=JSON.parse(row.document_json),e=escape;const src=a=>`/media/${row.id}/${row.revision}/${a.id}`,portrait=assets.find(a=>a.slot==='portrait'),selected=assets.filter(a=>a.slot==='work');const player=(a,hero=false)=>a.type==='video'?`<video controls playsinline preload="metadata" ${hero?'autoplay muted loop':''} aria-label="${e(a.title)}" src="${src(a)}"></video>`:`<img src="${src(a)}" alt="${e(a.title)}" loading="${hero?'eager':'lazy'}">`;
const hotel=Object.hasOwn(hotelRoles,p.role)?hotelRoles[p.role]:null;
const hotelFields=hotel?Object.entries(hotel.fields).filter(([key])=>p[key]?.trim()).map(([key,[label]])=>`<h3>${e(label)}</h3><p class="hotel-field-value" style="font:14px/1.8 Arial">${e(p[key])}</p>`).join(''):'';
const casting=publicModelCasting(p.role,selected,player),work=casting.regular,featured=work.find(a=>a.featured)||work.find(a=>a.type==='video')||work[0],categories=[...new Set(work.map(a=>a.category))];
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(p.name)} / GLOSS portfolio</title><meta name="description" content="${e(p.title)} — selected work by ${e(p.name)}"><link rel="stylesheet" href="/public/lookbook.css"><style>*{box-sizing:border-box}body{margin:0;background:#251e24;font-family:Arial,sans-serif}.living-book{max-width:1100px;min-height:100vh;margin:auto;padding:45px 7%}.book-identity h2{font-size:clamp(42px,7vw,85px)}.featured-frame,.featured-frame.motion-frame{aspect-ratio:16/11}.book-portrait{max-width:170px}.book-filters button{font-size:12px;padding:8px 15px}.book-outro>p{font-size:24px}.work-tile p{font-size:12px}.book-contact{font-size:14px}.featured-caption h3{font-size:33px}.public-note{font-size:10px;padding:20px 0;color:var(--book-soft)}.filter-empty{padding:35px;border:1px solid var(--book-line);text-align:center}@media(max-width:650px){.living-book{padding:25px 6%}.featured-frame,.featured-frame.motion-frame{aspect-ratio:3/4}.book-filters button{font-size:10px;padding:7px 12px}.book-portrait{max-width:90px}}</style></head><body><main class="living-book ${e(p.template)}"><div class="book-masthead"><span>GLOSS / ${e(p.role)} PORTFOLIO</span><span>${hotel&&!selected.length?'HOSPITALITY RÉSUMÉ':`${selected.length} SELECTED WORKS`}</span></div><div class="book-identity">${portrait?`<img class="book-portrait" src="${src(portrait)}" alt="Portrait of ${e(p.name)}">`:''}<p class="eyebrow">${e(p.city)}</p><h2>${e(p.name)}<em>${e(p.title)}</em></h2><p>Stills. Motion. A point of view.</p></div>${casting.html}${featured?`<div class="book-filters" role="group" aria-label="Filter portfolio"><button type="button" data-category="All" aria-pressed="true">All ${work.length}</button>${categories.map(c=>`<button type="button" data-category="${e(c)}" aria-pressed="false">${e(c)}</button>`).join('')}</div><div class="filter-summary" id="filter-summary" role="status">Showing all work · ${work.length} items</div><section class="public-featured" data-work-category="${e(featured.category)}"><div class="featured-frame ${featured.type==='video'?'motion-frame':''}">${player(featured,true)}<div class="frame-label"><span>${featured.type==='video'?'▶ MOTION':'▧ STILL'} / ${e(featured.category)}</span><span>SELECTED WORK</span></div></div><div class="featured-caption"><div><small>01 / IN THE SPOTLIGHT</small><h3>${e(featured.title)}</h3><p>${e(featured.note)}</p></div></div></section><div class="book-grid">${work.filter(a=>a.id!==featured.id).map((a,i)=>`<article class="work-tile" data-work-category="${e(a.category)}">${player(a)}<div><small>${String(i+2).padStart(2,'0')} / ${e(a.category)}</small><h3>${e(a.title)}</h3><p>${e(a.note)}</p></div></article>`).join('')}</div><div class="filter-empty" hidden>No work in this category.</div>`: ''}<section class="book-outro"><span>THE PERSON BEHIND THE WORK</span><p>${e(p.bio)}</p>${p.role==='Model'?`<div class="book-stats">${['height','measurements','hair','eyes'].filter(k=>p[k]).map(k=>`<span><small>${e(k)}</small>${e(p[k])}</span>`).join('')}</div>`:''}${p.experience?`<h3>${e(hotel?.experienceLabel||'Selected experience')}</h3><p style="font:14px/1.8 Arial;white-space:pre-line">${e(p.experience)}</p>`:''}${p.education?`<h3>${e(hotel?.educationLabel||'Training')}</h3><p style="font:14px/1.8 Arial;white-space:pre-line">${e(p.education)}</p>`:''}${hotelFields}${hotel&&p.skills?`<h3>${e(hotel.skillsLabel)}</h3><p style="font:14px/1.8 Arial">${e(p.skills)}</p>`:''}${p.role==='Aviation'?['languages','availability'].filter(k=>p[k]).map(k=>`<h3>${k==='languages'?'Languages':'Availability & preferred base'}</h3><p style="font:14px/1.8 Arial">${e(p[k])}</p>`).join(''):''}<div class="book-contact">${[p.email,p.phone,p.link].filter(Boolean).map(e).join(' · ')}</div></section><div class="book-footer"><b>GLOSS.</b><span>YOUR TALENT, IN FOCUS.</span></div><p class="public-note">Published by the portfolio owner. Anyone with this link can view it.<br><a href="/agencies" style="color:inherit">Explore the GLOSS agency network ↗</a></p></main><script>document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{let count=0;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('[data-work-category]').forEach(x=>{const show=b.dataset.category==='All'||x.dataset.workCategory===b.dataset.category;x.hidden=!show;if(show)count++;else x.querySelectorAll('video').forEach(v=>v.pause());});document.querySelector('.filter-empty').hidden=count>0;document.querySelector('#filter-summary').textContent=(b.dataset.category==='All'?'Showing all work':'Showing '+b.dataset.category)+' · '+count+' items';});</script></body></html>`;}
export function createWorker(staticAssets={}){return {async fetch(request,env,ctx={waitUntil(){}}){try{const url=new URL(request.url),path=url.pathname,method=request.method;const owner=request.headers.get('oai-authenticated-user-id');
const webinarResponse=await handleWebinar(request,env,{headers,escape,limitedBody});if(webinarResponse)return webinarResponse;
const networkResponse=await handleNetwork(request,env,staticAssets);if(networkResponse)return networkResponse;
if (!owner && staticAssets.guestHomepage && ['GET', 'HEAD'].includes(method)) {
  if (path === '/') {
    const page = new TextDecoder().decode(Uint8Array.from(atob(staticAssets.guestHomepage.body), character => character.charCodeAt(0)));
    const signin = '/signin-with-chatgpt?return_to=' + encodeURIComponent('/' + url.search + '#builder');
    return new Response(method === 'HEAD' ? null : page.replaceAll('__GLOSS_STUDIO_SIGNIN__', signin), {
      headers: { ...headers, 'content-type': staticAssets.guestHomepage.type }
    });
  }
  if (['/style.css', '/lookbook.css', '/assets/hero-model.jpg'].includes(path) && staticAssets[path]) {
    return assetResponse(staticAssets[path], method);
  }
}
const sampleAsset = {
  '/samples/aviation': '/aviation-sample.html',
  '/samples/aviation-portrait.png': '/assets/hero-aviation.png',
  '/samples/aviation-full-length.png': '/assets/aviation-sample-full-length.png',
  '/samples/model': '/model-sample.html',
  '/samples/model/': '/model-sample.html',
  '/samples/model-portrait.jpg': '/assets/model-sample-editorial.jpg',
  '/samples/model-beauty.jpg': '/assets/model-sample-beauty.jpg',
  '/samples/model-jewellery.jpg': '/assets/model-sample-jewellery.jpg',
  '/samples/model-commercial.jpg': '/assets/model-sample-commercial.jpg',
  '/samples/model-digitals.jpg': '/assets/model-sample-digitals.jpg',
  '/samples/model-polaroid-front.jpg': '/assets/model-sample-polaroid-front.jpg',
  '/samples/model-polaroid-profile.jpg': '/assets/model-sample-polaroid-profile.jpg',
  '/samples/model-polaroid-three-quarter.jpg': '/assets/model-sample-polaroid-three-quarter.jpg',
  '/samples/model-intro.jpg': '/assets/model-sample-intro.jpg',
  '/samples/model-intro.mp4': '/assets/model-sample-intro.mp4',
  '/samples/model-intro-en.vtt': '/assets/model-sample-intro-en.vtt',
  '/samples/model-runway.jpg': '/assets/model-sample-runway.jpg',
  '/samples/model-runway.mp4': '/assets/model-sample-runway.mp4',
  '/samples/makeup': '/makeup-sample.html',
  '/samples/makeup-bridal-film.jpg': '/assets/makeup-sample-bridal-film.jpg',
  '/samples/makeup-bridal-film.mp4': '/assets/makeup-sample-bridal-film.mp4',
  '/samples/makeup-shoot-beauty.jpg': '/assets/makeup-sample-shoot-beauty.jpg',
  '/samples/makeup-shoot-fashion.jpg': '/assets/makeup-sample-shoot-fashion.jpg',
  '/samples/makeup-shoot-bridal.jpg': '/assets/makeup-sample-shoot-bridal.jpg',
  '/samples/makeup-demo.jpg': '/assets/makeup-sample-demo.jpg',
  '/samples/makeup-demo.mp4': '/assets/makeup-sample-demo.mp4',
  '/samples/makeup-portrait.jpg': '/assets/hero-makeup.jpg',
  '/samples/makeup-headshot.jpg': '/assets/makeup-sample-headshot.jpg',
  '/samples/makeup-bridal.jpg': '/assets/makeup-sample-bridal.jpg',
  '/samples/makeup-party.jpg': '/assets/makeup-sample-party.jpg',
  '/samples/makeup-glamour.jpg': '/assets/makeup-sample-glamour.jpg',
  '/samples/makeup-matte.jpg': '/assets/makeup-sample-matte.jpg',
  '/samples/makeup-hd.jpg': '/assets/makeup-sample-hd.jpg',
  '/samples/chef': '/chef-sample.html',
  '/samples/chef/': '/chef-sample.html',
  '/samples/chef-portrait.jpg': '/assets/hero-hotel-chef.jpg',
  '/samples/chef-kitchen-work.jpg': '/assets/chef-sample-kitchen-work.jpg',
  '/samples/receptionist': '/receptionist-sample.html',
  '/samples/receptionist/': '/receptionist-sample.html',
  '/samples/receptionist-portrait.jpg': '/assets/hero-hotel-reception.jpg',
  '/samples/receptionist-lobby.jpg': '/assets/hero-hotel-lobby.jpg',
  '/samples/staff': '/staff-sample.html',
  '/samples/staff/': '/staff-sample.html',
  '/samples/staff-portrait.jpg': '/assets/hero-hotel-staff.jpg',
  '/samples/staff-service-work.jpg': '/assets/staff-sample-service-work.jpg',
  '/samples/hair': '/hair-sample.html',
  '/samples/hair-headshot.jpg': '/assets/hair-sample-headshot.jpg',
  '/samples/hair-bridal-film.jpg': '/assets/hair-sample-bridal-film.jpg',
  '/samples/hair-bridal-film.mp4': '/assets/hair-sample-bridal-film.mp4',
  '/samples/hair-extensions-film.jpg': '/assets/hair-sample-extensions-film.jpg',
  '/samples/hair-extensions-film.mp4': '/assets/hair-sample-extensions-film.mp4',
  '/samples/hair-waves.jpg': '/assets/hair-sample-waves.jpg',
  '/samples/hair-updos.jpg': '/assets/hair-sample-updos.jpg',
  '/samples/hair-braids.jpg': '/assets/hair-sample-braids.jpg',
  '/samples/hair-blowouts.jpg': '/assets/hair-sample-blowouts.jpg',
  '/samples/hair-bridal.jpg': '/assets/hair-sample-bridal.jpg',
  '/samples/hair-shoot-fashion.jpg': '/assets/hair-sample-shoot-fashion.jpg',
  '/samples/hair-shoot-beauty.jpg': '/assets/hair-sample-shoot-beauty.jpg',
  '/samples/hair-shoot-bridal.jpg': '/assets/hair-sample-shoot-bridal.jpg',
  '/samples/hair-wavy-french-bob.jpg': '/assets/hair-sample-wavy-french-bob.jpg',
  '/samples/hair-wavy-shag.jpg': '/assets/hair-sample-wavy-shag.jpg',
  '/samples/hair-wavy-long-layers.jpg': '/assets/hair-sample-wavy-long-layers.jpg',
  '/samples/hair-curly-bob.jpg': '/assets/hair-sample-curly-bob.jpg',
  '/samples/hair-curly-shag.jpg': '/assets/hair-sample-curly-shag.jpg',
  '/samples/hair-curly-long-layers.jpg': '/assets/hair-sample-curly-long-layers.jpg',
  '/samples/hair-straight-blunt-bob.jpg': '/assets/hair-sample-straight-blunt-bob.jpg',
  '/samples/hair-straight-lob.jpg': '/assets/hair-sample-straight-lob.jpg',
  '/samples/hair-straight-long-layers.jpg': '/assets/hair-sample-straight-long-layers.jpg',
  '/samples/hair-french-twist.jpg': '/assets/hair-sample-french-twist.jpg',
  '/samples/hair-high-textured-bun.jpg': '/assets/hair-sample-high-textured-bun.jpg',
  '/samples/hair-pinned-curly-updo.jpg': '/assets/hair-sample-pinned-curly-updo.jpg',
  '/samples/hair-fishtail-braid.jpg': '/assets/hair-sample-fishtail-braid.jpg',
  '/samples/hair-double-dutch-braids.jpg': '/assets/hair-sample-double-dutch-braids.jpg',
  '/samples/hair-crown-braid.jpg': '/assets/hair-sample-crown-braid.jpg',
  '/samples/hair-bridal-pearl-half-up.jpg': '/assets/hair-sample-bridal-pearl-half-up.jpg',
  '/samples/hair-bridal-sleek-ponytail.jpg': '/assets/hair-sample-bridal-sleek-ponytail.jpg',
  '/samples/hair-extensions-straight.jpg': '/assets/hair-sample-extensions-straight.jpg',
  '/samples/hair-extensions-wavy.jpg': '/assets/hair-sample-extensions-wavy.jpg',
  '/samples/hair-extensions-curly.jpg': '/assets/hair-sample-extensions-curly.jpg',
  '/samples/hair-colour-global-chocolate.jpg': '/assets/hair-sample-colour-global-chocolate.jpg',
  '/samples/hair-colour-caramel-streaks.jpg': '/assets/hair-sample-colour-caramel-streaks.jpg',
  '/samples/hair-colour-smoky-ash.jpg': '/assets/hair-sample-colour-smoky-ash.jpg',
  '/samples/hair-colour-orchid-panels.jpg': '/assets/hair-sample-colour-orchid-panels.jpg',
}[path];
if (sampleAsset && ['GET', 'HEAD'].includes(method) && staticAssets[sampleAsset]) {
  if (path.endsWith('.mp4')) {
    return sampleVideoResponse(staticAssets[sampleAsset], request);
  }
  return assetResponse(staticAssets[sampleAsset], method);
}
if(path==='/public/lookbook.css'&&['GET','HEAD'].includes(method)){const asset=staticAssets['/lookbook.css'];if(!asset)return new Response('Not found',{status:404});return assetResponse(asset,method);}
let match=path.match(/^\/p\/([a-f0-9-]{36})\/?$/);if(match&&['GET','HEAD'].includes(method)){const row=await publicRecord(env,match[1]);if(!row)return new Response('This portfolio is not published.',{status:404,headers});return new Response(method==='HEAD'?null:publicPage(row),{headers:{...headers,'content-type':'text/html;charset=utf-8','content-security-policy':"default-src 'none'; img-src 'self'; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"}});}
match=path.match(/^\/media\/([a-f0-9-]{36})\/([a-f0-9-]{36})\/([a-f0-9-]{36})$/);if(match&&['GET','HEAD'].includes(method)){const [,id,revision,assetId]=match,row=await publicRecord(env,id);if(!row||row.revision!==revision)fail('This media is not published.',404);const doc=JSON.parse(row.document_json),asset=doc.assets.find(a=>a.id===assetId);if(!asset)fail('Media not found.',404);const key=mediaKey(id,revision,assetId),head=await env.BUCKET.head(key);if(!head)fail('Media not found.',404);let range,status=200;const rangeHeader=request.headers.get('range');if(rangeHeader){const parsed=/^bytes=(\d*)-(\d*)$/.exec(rangeHeader);if(!parsed||(!parsed[1]&&!parsed[2]))return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${head.size}`}});let start,end;if(!parsed[1]){start=Math.max(0,head.size-Number(parsed[2]));end=head.size-1;}else{start=Number(parsed[1]);end=parsed[2]?Math.min(Number(parsed[2]),head.size-1):head.size-1;}if(start> end||start>=head.size)return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${head.size}`}});range={offset:start,length:end-start+1};status=206;}const responseHeaders={...headers,'content-type':asset.mime,'accept-ranges':'bytes','content-length':String(range?range.length:head.size),'content-disposition':'inline'};if(range)responseHeaders['content-range']=`bytes ${range.offset}-${range.offset+range.length-1}/${head.size}`;if(method==='HEAD')return new Response(null,{status,headers:responseHeaders});const object=await env.BUCKET.get(key,range?{range}:undefined);if(!object)fail('Media not found.',404);return new Response(object.body,{status,headers:responseHeaders});}
if(!owner){if(path.startsWith('/api/'))return json({error:'Sign in to publish or manage your portfolio.'},401);return Response.redirect(new URL('/signin-with-chatgpt?return_to='+encodeURIComponent(path+url.search),url.origin),302);}
if(path.startsWith('/api/')&&!['GET','HEAD'].includes(method)&&request.headers.get('origin')!==url.origin)fail('This request must come from your GLOSS editor.',403);
if(path==='/api/publication'&&method==='GET'){const row=await one(env,'SELECT * FROM portfolios WHERE owner_id = ?',owner);return json(row?{id:row.id,published:row.published===1,url:`${url.origin}/p/${row.id}`,updatedAt:row.updated_at,revision:row.revision}: {published:false});}
if(path==='/makeup-artists'&&['GET','HEAD'].includes(method)&&staticAssets['/makeup-directory.html']) {
  return assetResponse(staticAssets['/makeup-directory.html'], method);
}
if(path==='/api/makeup-directory'&&['GET','POST'].includes(method)) {
  return await makeupDirectory(request, env, url);
}
if(path==='/api/publish/start'&&method==='POST'){const doc=validateDocument(await requestJSON(request)),now=new Date().toISOString();await run(env,'INSERT OR IGNORE INTO portfolios (id, owner_id, updated_at) VALUES (?, ?, ?)',crypto.randomUUID(),owner,now);const row=await one(env,'SELECT * FROM portfolios WHERE owner_id = ?',owner),revision=crypto.randomUUID();await run(env,'INSERT INTO publication_builds (id, portfolio_id, owner_id, generation, document_json, created_at) VALUES (?, ?, ?, ?, ?, ?)',revision,row.id,owner,row.generation,JSON.stringify(doc),now);return json({id:row.id,revision,assets:doc.assets.map(a=>({id:a.id,uploadUrl:`/api/publish/${revision}/asset/${a.id}`}))});}
match=path.match(/^\/api\/publish\/([a-f0-9-]{36})\/asset\/([a-f0-9-]{36})$/);if(match&&method==='PUT'){const build=await ownedBuild(env,match[1],owner),doc=JSON.parse(build.document_json),asset=doc.assets.find(a=>a.id===match[2]);if(!asset)fail('This asset was not requested.',404);if(request.headers.get('content-type')?.split(';')[0]!==asset.mime)fail('The file type does not match.');const bytes=await limitedBody(request,asset.size);if(bytes.byteLength!==asset.size||!signatureMatches(bytes,asset.mime))fail('This file is incomplete or its format is not supported.');await env.BUCKET.put(mediaKey(build.portfolio_id,build.id,asset.id),bytes,{httpMetadata:{contentType:asset.mime}});return json({uploaded:true});}
match=path.match(/^\/api\/publish\/([a-f0-9-]{36})\/finish$/);if(match&&method==='POST'){const build=await ownedBuild(env,match[1],owner),doc=JSON.parse(build.document_json);for(const a of doc.assets){const head=await env.BUCKET.head(mediaKey(build.portfolio_id,build.id,a.id));if(!head||head.size!==a.size)fail('Some media has not finished uploading. Please retry publishing.',409);}const previous=await one(env,'SELECT revision FROM portfolios WHERE id = ?',build.portfolio_id);const now=new Date().toISOString(),result=await run(env,'UPDATE portfolios SET published = 1, generation = generation + 1, revision = ?, document_json = ?, updated_at = ? WHERE id = ? AND owner_id = ? AND generation = ?',build.id,build.document_json,now,build.portfolio_id,owner,build.generation);if(result.meta?.changes!==1)fail('This portfolio changed in another tab. Please publish again.',409);await run(env,'DELETE FROM publication_builds WHERE id = ?',build.id);ctx.waitUntil(cleanup(env,build.portfolio_id,previous?.revision).catch(()=>{}));return json({published:true,url:`${url.origin}/p/${build.portfolio_id}`,updatedAt:now});}
if(path==='/api/publication/unpublish'&&method==='POST'){const row=await one(env,'SELECT * FROM portfolios WHERE owner_id = ?',owner);if(!row)fail('No published portfolio was found.',404);await run(env,'UPDATE portfolios SET published = 0, generation = generation + 1, updated_at = ? WHERE id = ? AND owner_id = ?',new Date().toISOString(),row.id,owner);ctx.waitUntil(cleanup(env,row.id,row.revision).catch(()=>{}));return json({published:false,url:`${url.origin}/p/${row.id}`});}
if(path.startsWith('/api/'))return json({error:'Not found.'},404);
if(!['GET','HEAD'].includes(method))return new Response('Method not allowed',{status:405,headers});const asset=staticAssets[path==='/'?'/index.html':path];return asset?assetResponse(asset,method):new Response('Not found',{status:404,headers});
}catch(error){return json({error:error.status?error.message:'GLOSS could not complete that request. Please try again.'},error.status||500);}}};}
function assetResponse(asset,method){const binary=atob(asset.body),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));return new Response(method==='HEAD'?null:bytes,{headers:{...headers,'content-type':asset.type}});}
export default createWorker();

async function makeupDirectory(request, env, url) {
  const email = request.headers.get('oai-authenticated-user-email')?.toLowerCase();
  const canManage = !!env.AGENCY_ADMIN_EMAIL && email === env.AGENCY_ADMIN_EMAIL.toLowerCase();
  const eligible = `published = 1
    AND json_extract(document_json, '$.profile.role') = 'Makeup artist'
    AND json_extract(document_json, '$.makeupDirectoryRequested') = 1
    AND trim(json_extract(document_json, '$.profile.city')) <> ''`;
  if (request.method === 'POST') {
    if (!canManage) return json({error: 'Only the GLOSS owner can manage listings.'}, 403);
    const {id, revision, approved} = await requestJSON(request);
    const uuid = /^[a-f0-9-]{36}$/i;
    if (typeof id !== 'string' || typeof revision !== 'string' || !uuid.test(id) || !uuid.test(revision) || typeof approved !== 'boolean') {
      return json({error: 'Invalid listing update.'}, 400);
    }
    const result = await run(env, `UPDATE portfolios
      SET document_json = json_set(document_json, '$.makeupDirectoryApproved', ?)
      WHERE id = ? AND revision = ? AND ${eligible}`, approved ? 1 : 0, id, revision);
    return result.meta?.changes === 1 ? json({ok: true}) : json({error: 'This portfolio changed. Reload and review the current version.'}, 409);
  }
  const city = (url.searchParams.get('city') || '').trim().slice(0, 100);
  const cityField = "trim(json_extract(document_json, '$.profile.city'))";
  const approved = "json_extract(document_json, '$.makeupDirectoryApproved') = 1";
  const fields = `id, revision, json_extract(document_json, '$.profile.name') AS name,
    ${cityField} AS city, json_extract(document_json, '$.profile.specialty') AS specialty`;
  const cities = await env.DB.prepare(`SELECT min(${cityField}) AS city FROM portfolios
    WHERE ${eligible} AND ${approved} GROUP BY lower(${cityField}) ORDER BY city COLLATE NOCASE`).bind().all();
  const listings = await env.DB.prepare(`SELECT ${fields} FROM portfolios
    WHERE ${eligible} AND ${approved} AND (? = '' OR lower(${cityField}) = lower(?))
    ORDER BY name COLLATE NOCASE LIMIT 100`).bind(city, city).all();
  const requests = canManage ? (await env.DB.prepare(`SELECT ${fields},
    coalesce(json_extract(document_json, '$.makeupDirectoryApproved'), 0) AS approved
    FROM portfolios WHERE ${eligible} ORDER BY updated_at DESC LIMIT 100`).bind().all()).results : [];
  return json({cities: cities.results.map(row => row.city), listings: listings.results.map(({id, name, city, specialty}) => ({id, name, city, specialty})), canManage, requests});
}

function sampleVideoResponse(asset, request) {
  const bytes = Uint8Array.from(atob(asset.body), character => character.charCodeAt(0));
  const size = bytes.length;
  const responseHeaders = {
    ...headers,
    'content-type': 'video/mp4',
    'content-length': String(size),
    'accept-ranges': 'bytes',
  };
  if (request.method === 'HEAD') return new Response(null, {headers: responseHeaders});
  const requestedRange = request.headers.get('range');
  if (!requestedRange) return new Response(bytes, {headers: responseHeaders});

  const match = /^bytes=(\d*)-(\d*)$/.exec(requestedRange);
  if (match && (match[1] || match[2])) {
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
    if (start <= end) {
      responseHeaders['content-range'] = `bytes ${start}-${end}/${size}`;
      responseHeaders['content-length'] = String(end - start + 1);
      return new Response(bytes.subarray(start, end + 1), {status: 206, headers: responseHeaders});
    }
  }
  responseHeaders['content-range'] = `bytes */${size}`;
  delete responseHeaders['content-length'];
  return new Response(null, {status: 416, headers: responseHeaders});
}
