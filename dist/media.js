'use strict';
// Draft media stays on this device until the visitor chooses to publish.
const worlds={
 'Fashion designer':{label:'The design edit',line:'Concept. Craft. Collection.',motion:'The collection in motion',categories:['Collections','Editorial','Garment details','Draping','Sketches','Runway'],prompt:'Show your silhouettes, materials, construction and finished pieces.'},
 Photographer:{label:'The photography edit',line:'Light. Story. Perspective.',motion:'Behind the frame',categories:['Editorial','Portraits','Beauty','Commercial','Behind the scenes'],prompt:'Bring your selected stills and films together.'},
 ...Object.fromEntries(Object.entries(hotelRoles).map(([role,hotel])=>[role,{
   label:'Hotel Management / '+role,
   line:hotel.intro,
   motion:'Your work',
   categories:hotel.categories,
   prompt:hotel.intro
 }])),
 Model:{label:'The model edit',line:'A face. A feeling. A point of view.',motion:'The walk',categories:['Runway','Editorial','Beauty','Jewellery','Commercial','Digitals'],prompt:'Your walk in motion. Your range in frames.'},
 'Makeup artist':{label:'The makeup edit',line:'Every face. A different story.',motion:'The transformation',categories:['Party','Glamour','Matte','HD','Bridal','Editorial','Creative'],prompt:'From soft matte to full glamour. Show the finish, the detail, the transformation.'},
 Hairstylist:{label:'The hair edit',line:'Shape. Texture. A signature.',motion:'The movement',categories:['Editorial','Bridal','Cut & colour','Texture & curls','Updos','Extensions'],prompt:'Let the movement speak. Separate your looks by technique and occasion.'},
};
const archivedRoles=['Aviation','Modeling agency','Nail artist','Salon','Content creator'];
const seedMedia=[];
state.media=[...structuredClone(seedMedia),...state.portfolio.filter(imageSource).map((src,i)=>({id:'legacy-'+i,role:state.role,category:'Selected work',title:'Portfolio frame '+(i+1),note:'',type:'image',src,sample:false}))];let activeFilter='All',previewFormat='lookbook',mediaBusy=false,storageBusy=false,revision=0;
const editor=document.querySelector('#collections-editor'),canvas=document.querySelector('#lookbook-preview');const E=escapeHTML;const getWorld=()=>worlds[state.role]||worlds.Model;
function imageSource(src){return typeof src==='string'&&(/^data:image\/(jpeg|png|webp);base64,/.test(src)||(/^assets\/hero-(model|hairstylist|makeup|beauty|creator)\.jpg$/.test(src)||src==='assets/hero-aviation.png'||/^assets\/hero-hotel-(reception|chef|staff)\.jpg$/.test(src)));}
function videoSource(src){return typeof src==='string'&&/^data:video\/(mp4|webm);base64,/.test(src);}
function validMedia(item){return item&&typeof item.id==='string'&&(Object.hasOwn(worlds,item.role)||archivedRoles.includes(item.role))&&typeof item.title==='string'&&typeof item.category==='string'&&((item.type==='image'&&imageSource(item.src))||(item.type==='video'&&videoSource(item.src)));}
function ownMedia(){return state.media.filter(m=>m.role===state.role&&!m.sample);}
function categories(){return [...new Set([...getWorld().categories,...ownMedia().map(m=>m.category)])];}
function mediaElement(item,featured=false){if(item.type==='video')return `<video ${featured?'autoplay muted loop ':''}controls playsinline preload="metadata" src="${E(item.src)}" aria-label="${E(item.title||'Portfolio video')}"></video>`;return `<img src="${E(item.src)}" alt="${E(item.title||item.category)}" loading="lazy">`;}
function modelCastingKind(item){
  if(item.role!=='Model')return '';
  if(item.category==='Intro video'&&item.type==='video')return 'intro';
  if(item.category==='Polaroids'&&item.type==='image')return 'polaroid';
  return '';
}
function modelCastingInputs(){
  if(state.role!=='Model')return '';
  return `<section class="casting-uploads" aria-label="Model casting media">
    <h3>Casting media</h3>
    <label class="video-upload-control">Intro video
      <small>Upload a short introduction or a narrated slideshow of your casting photos. MP4 or WebM, up to 25 MB.</small>
      <input type="file" data-casting-category="Intro video" accept="video/mp4,video/webm,.mp4,.webm" aria-describedby="casting-status">
    </label>
    <label class="video-upload-control">Polaroids
      <small>Add front, side, three-quarter or full-length photos. JPG, PNG or WebP, up to 5 MB each.</small>
      <input type="file" data-casting-category="Polaroids" multiple accept="image/jpeg,image/png,image/webp" aria-describedby="casting-status">
    </label>
    <p id="casting-status" role="status" aria-live="polite"></p>
  </section>`;
}
function modelCastingMarkup(items, interactive){
  const intro=items.filter(m=>modelCastingKind(m)==='intro');
  const photos=items.filter(m=>modelCastingKind(m)==='polaroid');
  const caption=m=>`<figcaption><b>${E(m.title)}</b>${m.note?`<p>${E(m.note)}</p>`:''}</figcaption>`;
  return [
    intro.length?`<section class="book-casting-section" aria-label="Intro video"><h3>Intro video</h3>${intro.map(m=>`<figure class="book-intro-video">${mediaElement(m)}${caption(m)}</figure>`).join('')}</section>`:'',
    photos.length?`<section class="book-casting-section" aria-label="Polaroids"><h3>Polaroids</h3><div class="book-polaroids">${photos.map(m=>`<figure>${interactive?`<button type="button" data-open-media="${E(m.id)}" aria-label="View ${E(m.title)}">${mediaElement(m)}</button>`:mediaElement(m)}${caption(m)}</figure>`).join('')}</div></section>`:''
  ].join('');
}
function editorMarkup(){const w=getWorld();editor.innerHTML=`<div class="collection-intro"><p class="eyebrow">YOUR CRAFT, IN COLLECTIONS</p><h3>${E(w.prompt)}</h3><p class="hint">Choose a category, then add photos or a film. Collections change with your profession. Work for other professions stays in your draft.</p></div>${modelCastingInputs()}<div class="category-pills" role="group" aria-label="Suggested work categories">${w.categories.map(c=>`<button type="button" data-pick-category="${E(c)}">${E(c)}</button>`).join('')}</div><div class="media-composer"><label>Collection<select id="media-category">${categories().map(c=>`<option>${E(c)}</option>`).join('')}</select></label><label>Project / look title<input id="media-title" maxlength="100" placeholder="e.g. Studio story / look 01"></label><label>Credits / context <small>optional — only claim work you did</small><input id="media-note" maxlength="250" placeholder="Your role, collaborator credits, year"></label><label class="media-drop">＋ Add photos or video<small>JPG / PNG / WebP up to 5 MB · MP4 / WebM up to 25 MB<br>Up to 12 items and 60 MB of original media per draft</small><input id="collection-files" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"></label><label class="video-upload-control">▶ Add a video<small>Choose an MP4 or WebM file · up to 25 MB</small><input id="video-files" type="file" accept="video/mp4,video/webm,.mp4,.webm" aria-describedby="media-status"></label><div class="custom-category"><label>Need another category?<input id="custom-category" maxlength="40" placeholder="e.g. Swimwear"></label><button type="button" class="outline" id="add-category">Add</button></div><p class="hint">Video starts muted in the featured frame where your browser permits. Use the player controls for sound. MP4 (H.264) gives the broadest browser support.</p><p id="media-status" role="status" aria-live="polite"></p></div><div class="collection-list"><div class="list-heading"><b>Your collection</b><span>${ownMedia().length} uploaded</span></div>${ownMedia().map(m=>`<div class="asset-row"><span class="asset-kind">${m.type==='video'?'▶':'▧'}</span><div><b>${E(m.title)}</b><small>${E(m.category)}${m.sample?' · EXAMPLE':''}${m.featured?' · FEATURED':''}</small></div>${modelCastingKind(m)?'':`<button type="button" data-feature="${E(m.id)}" aria-label="Feature ${E(m.title)}" title="Feature this work">${m.featured?'★':'☆'}</button>`}<button type="button" data-remove="${E(m.id)}" aria-label="Remove ${E(m.title)}" title="Remove this work">×</button></div>`).join('')||'<p class="hint">Your first collection starts here. Add a photo or video above.</p>'}</div>`;
editor.querySelectorAll('[data-pick-category]').forEach(b=>b.onclick=()=>{editor.querySelector('#media-category').value=b.dataset.pickCategory;editor.querySelectorAll('[data-pick-category]').forEach(x=>x.classList.toggle('selected',x===b));});
editor.querySelector('#add-category').onclick=()=>{const input=editor.querySelector('#custom-category'),value=input.value.trim();if(!value)return;const select=editor.querySelector('#media-category');if(![...select.options].some(o=>o.value===value))select.add(new Option(value,value));select.value=value;input.value='';};
editor.querySelectorAll('#collection-files, #video-files, [data-casting-category]').forEach(input=>input.onchange=uploadCollection);
editor.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.media=state.media.filter(m=>m.id!==b.dataset.remove);mediaChanged();});
editor.querySelectorAll('[data-feature]').forEach(b=>b.onclick=()=>{state.media.forEach(m=>{if(m.role===state.role)m.featured=m.id===b.dataset.feature;});mediaChanged();});}
function portfolioMarkup(interactive=true){const w=getWorld(),actual=ownMedia(),all=actual.filter(m=>!modelCastingKind(m)),filtered=activeFilter==='All'?all:all.filter(m=>m.category===activeFilter),featured=filtered.find(m=>m.featured)||filtered.find(m=>m.type==='video')||filtered[0];const workCategories=[...new Set([...w.categories,...all.map(m=>m.category)])];return `<div class="living-book ${E(state.template)}"><div class="book-masthead"><span>GLOSS / ${E(w.label)}</span><span>${actual.length?`${actual.length} SELECTED WORKS`:'YOUR PERSONAL PORTFOLIO'}</span></div><div class="book-identity">${profilePictureMarkup('book-portrait')}<p class="eyebrow">${E(state.city||'YOUR WORLD. YOUR STAGE.')}</p><h2>${E(state.name||'Your name')}<em>${E(state.title||state.role)}</em></h2><p>${E(w.line)}</p></div>${modelCastingMarkup(actual,interactive)}${all.length||interactive?`<div class="book-filters" role="group" aria-label="Filter portfolio by category">${['All',...workCategories].map(c=>`<button type="button" data-filter="${E(c)}" aria-pressed="${activeFilter===c}">${E(c)}${c==='All'?` <small>${all.length}</small>`:''}</button>`).join('')}</div><div class="filter-summary"><span>${activeFilter==='All'?`Showing all your work · ${all.length} items`:`Showing ${E(activeFilter)} · ${filtered.length} of ${all.length} items`}</span>${interactive&&activeFilter!=='All'?'<button type="button" data-show-all>Show all work ↗</button>':''}</div>${featured?`<div class="featured-frame ${featured.type==='video'?'motion-frame':''}">${mediaElement(featured,true)}<div class="frame-label"><span>${featured.type==='video'?'▶ MOTION':'▧ STILL'} / ${E(featured.category)}</span><span>${featured.sample?'EXAMPLE IMAGE':'SELECTED WORK'}</span></div></div><div class="featured-caption"><div><small>01 / IN THE SPOTLIGHT</small><h3>${E(featured.title)}</h3><p>${E(featured.note||'')}</p></div>${interactive&&featured.type==='image'?`<button type="button" data-open-media="${E(featured.id)}" aria-label="View ${E(featured.title)} full screen">↗</button>`:''}</div>`:`<div class="empty-collection"><span>✳</span><h3>${E(activeFilter==='All'?'Your next great first impression.':`${activeFilter}, in your own way.`)}</h3><p>${hotelProfile()?'You can add work photos or videos to support your résumé.':`No work in this collection yet. Add your ${activeFilter==='Runway'?'walk video or runway images':'photos or videos'} to bring it to life.`}</p>${interactive?'<button type="button" class="outline" data-add-work>Add your work ↗</button>':''}</div>`}${interactive&&!hotelProfile()&&!actual.some(m=>m.type==='video')&&activeFilter==='All'?`<div class="motion-invite"><span>▶</span><div><b>${E(w.motion)}. In motion.</b><p>No demo film pretending to be yours. Add your own video to see it play here.</p></div>${interactive?'<button type="button" data-add-work aria-label="Add a portfolio video">＋</button>':''}</div>`:''}${filtered.length>1?`<div class="book-grid">${filtered.filter(m=>m!==featured).map((m,i)=>`<article class="work-tile">${mediaElement(m)}<div><small>${String(i+2).padStart(2,'0')} / ${E(m.category)}${m.sample?' · EXAMPLE':''}</small><h3>${E(m.title)}</h3><p>${E(m.note||'')}</p>${interactive&&m.type==='image'?`<button type="button" data-open-media="${E(m.id)}" aria-label="View ${E(m.title)}">View frame ↗</button>`:''}</div></article>`).join('')}</div>`:''}`:''}<div class="book-outro"><span>THE PERSON BEHIND THE WORK</span><p>${E(state.bio)}</p>${state.role==='Model'?`<div class="book-stats">${['height','measurements','hair','eyes'].filter(k=>state[k]).map(k=>`<span><small>${E(k)}</small>${E(state[k])}</span>`).join('')}</div>`:''}${hotelDetailsMarkup()}<div class="book-contact">${[state.email,state.phone,state.link].filter(Boolean).map(E).join(' · ')}</div></div><div class="book-footer"><b>GLOSS.</b><span>YOUR TALENT, IN FOCUS.</span></div></div>`;}
function wirePortfolio(target){target.querySelectorAll('[data-show-all]').forEach(b=>b.onclick=()=>{activeFilter='All';renderPortfolio();});target.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;renderPortfolio();});target.querySelectorAll('[data-add-work]').forEach(b=>b.onclick=()=>{document.querySelector('#portfolio-dialog').close();setStep(1);document.querySelector('#collections-editor').scrollIntoView({behavior:'smooth'});});target.querySelectorAll('[data-open-media]').forEach(b=>b.onclick=()=>{const m=state.media.find(x=>x.id===b.dataset.openMedia);if(!m)return;document.querySelector('#media-viewer').innerHTML=mediaElement(m)+`<h3>${E(m.title)}</h3><p>${E(m.note||'')}</p>`;document.querySelector('#media-dialog').showModal();});target.querySelectorAll('video').forEach(v=>v.addEventListener('error',()=>{if(v.parentNode.querySelector('.video-error'))return;const p=document.createElement('p');p.className='video-error';p.textContent='This video could not play in this browser. Try an H.264 MP4 or another browser.';v.after(p);}));}
function renderPortfolio(){canvas.innerHTML=portfolioMarkup();wirePortfolio(canvas);const dialog=document.querySelector('#portfolio-dialog');if(dialog.open){document.querySelector('#full-lookbook').innerHTML=portfolioMarkup();wirePortfolio(document.querySelector('#full-lookbook'));}canvas.hidden=previewFormat!=='lookbook';resume.hidden=previewFormat!=='resume';if(previewFormat!=='lookbook')canvas.querySelectorAll('video').forEach(v=>v.pause());document.querySelector('#view-lookbook').setAttribute('aria-pressed',String(previewFormat==='lookbook'));document.querySelector('#view-resume').setAttribute('aria-pressed',String(previewFormat==='resume'));}
const resumeRender=render;render=function(){resumeRender();const work=ownMedia().filter(m=>!m.sample),photos=work.filter(m=>m.type==='image').slice(0,4),films=work.filter(m=>m.type==='video');if(photos.length||films.length){resume.querySelector('.portfolio-strip')?.remove();const selected=document.createElement('section');selected.className='resume-selected-work';selected.innerHTML='<h4>Selected portfolio work</h4>'+ (photos.length?`<div class="portfolio-strip">${photos.map(m=>`<div><img src="${E(m.src)}" alt="${E(m.title)}"><p>${E(m.category)} · ${E(m.title)}</p></div>`).join('')}</div>`:'')+(films.length?`<p>Motion work — available in the web portfolio:<br>${films.map(m=>`${E(m.category)} · ${E(m.title)}`).join('<br>')}</p>`:'');resume.append(selected);}renderPortfolio();};
function mediaChanged(){revision++;dirty();editorMarkup();}
form.addEventListener('input',e=>{if(e.target.name)revision++;});
form.addEventListener('change',e=>{
  if(e.target.name!=='role')return;
  if(e.target.value==='hotel-management'){
    syncRolePicker();
    showHotelRoles(true);
    return;
  }
  showHotelRoles(false);
  switchDraftRole(e.target.value);
});
function fileData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Could not read that file. Please try again.'));reader.readAsDataURL(file);});}
async function uploadCollection(event){
  const input=event.target,castingCategory=input.dataset.castingCategory;
  const statusSelector=castingCategory?'#casting-status':'#media-status';
  const status=editor.querySelector(statusSelector);
  if(mediaBusy||storageBusy){
    status.textContent='Wait for the current upload or save to finish.';
    input.value='';
    return;
  }
  const files=[...input.files];
  if(!files.length)return;
  const role=state.role,category=castingCategory||editor.querySelector('#media-category').value;
  const title=castingCategory?'':editor.querySelector('#media-title').value.trim();
  const note=castingCategory?'':editor.querySelector('#media-note').value.trim();
  try{
    if(state.media.filter(m=>!m.sample).length+files.length>12)throw Error('Keep up to 12 uploaded items in this draft. Remove an item to add another.');
    let total=state.media.reduce((n,m)=>n+(m.bytes||0),0);
    for(const file of files){
      const video=['video/mp4','video/webm'].includes(file.type);
      if(!video&&!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choose JPG, PNG, WebP, MP4 or WebM files.');
      if(role==='Model'&&category==='Intro video'&&!video)throw Error('Choose an MP4 or WebM for your intro video.');
      if(role==='Model'&&category==='Polaroids'&&video)throw Error('Choose JPG, PNG or WebP photos for your Polaroids.');
      if(file.size>(video?25:5)*1024*1024)throw Error(video?'Each video must be 25 MB or smaller.':'Each photo must be 5 MB or smaller.');
      total+=file.size;
    }
    if(total>60*1024*1024)throw Error('Keep the total uploaded media under 60 MB for this prototype.');
    mediaBusy=true;
    document.querySelector('#save').disabled=true;
    document.querySelector('#reset').disabled=true;
    status.textContent='Preparing your media…';
    input.disabled=true;
    const added=[];
    for(const [index,file] of files.entries()){
      const video=file.type.startsWith('video/');
      const fileTitle=file.name.replace(/\.[^.]+$/,'');
      const itemTitle=title?(files.length>1?`${title} / ${index+1}`:title):fileTitle;
      added.push({id:crypto.randomUUID(),role,category,title:itemTitle,note,type:video?'video':'image',src:video?await fileData(file):await readImage(file),bytes:file.size,sample:false});
    }
    state.media=state.media.filter(m=>!m.sample);
    if(!modelCastingKind(added[0])){
      state.media.forEach(m=>{if(m.role===role)m.featured=false;});
      (added.find(m=>m.type==='video')||added[0]).featured=true;
    }
    state.media.push(...added);
    activeFilter='All';
    previewFormat='lookbook';
    mediaChanged();
    const count=`${added.length} item${added.length===1?'':'s'}`;
    editor.querySelector(statusSelector).textContent=`Added ${count} to ${category}.`;
    feedback.textContent=`${count} added. Open Living portfolio to see your work.`;
  }catch(error){
    status.textContent=error.message;
  }finally{
    mediaBusy=false;
    document.querySelector('#save').disabled=false;
    document.querySelector('#reset').disabled=false;
    input.disabled=false;
    input.value='';
  }
}
document.querySelector('#view-lookbook').onclick=()=>{previewFormat='lookbook';renderPortfolio();};document.querySelector('#view-resume').onclick=()=>{previewFormat='resume';renderPortfolio();};
function openLookbook(){const d=document.querySelector('#portfolio-dialog');d.showModal();document.querySelector('#full-lookbook').innerHTML=portfolioMarkup();wirePortfolio(document.querySelector('#full-lookbook'));canvas.querySelectorAll('video').forEach(v=>v.pause());}
document.querySelector('#expand-lookbook').onclick=openLookbook;document.querySelector('#open-lookbook').onclick=openLookbook;document.querySelector('#close-lookbook').onclick=()=>document.querySelector('#portfolio-dialog').close();document.querySelector('#portfolio-dialog').addEventListener('close',()=>{document.querySelector('#full-lookbook').innerHTML='';});document.querySelector('#close-media').onclick=()=>document.querySelector('#media-dialog').close();document.querySelector('#media-dialog').addEventListener('close',()=>{document.querySelector('#media-viewer').innerHTML='';});
let dbPromise;function database(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(window.GLOSS_ACCOUNT?'gloss-living-'+window.GLOSS_ACCOUNT.id:'gloss-living-portfolio',1);req.onupgradeneeded=()=>req.result.createObjectStore('drafts');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Device storage is busy in another tab.'));});return dbPromise;}
async function dbAction(mode,action){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('drafts',mode),req=action(tx.objectStore('drafts'));let value;req.onsuccess=()=>{value=req.result;};tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function exportLookbook(){const button=document.querySelector('#export-lookbook');button.disabled=true;const filterBefore=activeFilter;try{feedback.textContent='Packing your web portfolio, including media…';activeFilter='All';let html=portfolioMarkup(false);const sources=[...new Set([hasPersonalPortrait()?state.portrait:professionImage(state.role),...state.media.map(m=>m.src)].filter(s=>s&&s.startsWith('assets/')))];for(const source of sources){const response=await fetch(source);if(!response.ok)throw Error('An image could not be packaged. Please try again.');const data=await fileData(await response.blob());html=html.split(E(source)).join(data);}const style=await fetch('lookbook.css').then(r=>{if(!r.ok)throw Error('Portfolio styles could not be packaged.');return r.text();});const safeTitle=E(state.name||'GLOSS portfolio');const documentText=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle} / GLOSS</title><style>body{margin:0;background:#211b20;font-family:Arial,sans-serif}*{box-sizing:border-box}button{font:inherit;cursor:pointer}.living-book{max-width:1100px;margin:auto}.book-filters button[aria-pressed="true"]{background:#d4e2b8;color:#271c24} ${style}</style></head><body>${html}<script>document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.work-tile').forEach(el=>{el.hidden=category!=='All'&&!el.querySelector('small').textContent.includes('/ '+category);});const featured=document.querySelector('.featured-frame');if(featured){const show=category==='All'||featured.querySelector('.frame-label').textContent.includes('/ '+category);featured.hidden=!show;featured.nextElementSibling.hidden=!show;featured.querySelectorAll('video').forEach(v=>{if(!show)v.pause();});}}));<\/script></body></html>`;const url=URL.createObjectURL(new Blob([documentText],{type:'text/html'})),a=document.createElement('a');a.href=url;a.download='GLOSS-living-portfolio.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback.textContent='Web portfolio downloaded with embedded media. Open the HTML file in a browser. It is a file, not a public profile link.';}catch(error){feedback.textContent=error.message;}finally{activeFilter=filterBefore;button.disabled=false;}}
document.querySelector('#export-lookbook').onclick=exportLookbook;
// Printing is always the classic resume; browsers do not embed playable video in PDF.
document.querySelector('#print').onclick=()=>{if(!form.reportValidity())return;window.print();};
window.addEventListener('beforeunload',event=>{if(mediaBusy||storageBusy){event.preventDefault();event.returnValue='';}});
editorMarkup();renderPortfolio();
