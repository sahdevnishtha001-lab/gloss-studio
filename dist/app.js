'use strict';
const example={role:'Model',name:'Aya Mehra',title:'Editorial & runway model',city:'Mumbai, India',email:'aya@example.com',phone:'',link:'@aya.example',bio:'A fresh perspective, a strong walk, and a love for visual storytelling. Exploring editorial, beauty and runway work with an expressive, collaborative approach.',height:'175 cm',measurements:'',hair:'Dark brown',eyes:'Brown',specialty:'Editorial, runway, beauty',experience:'Independent editorial test shoot — 2026\nCollaborated with a creative team on a studio portrait series.\n\nRunway workshop showcase — 2025\nPractised walk, movement and backstage preparation.',education:'Runway & posing workshop — 2025',skills:'Runway, Posing, Editorial, Movement, Collaboration',template:'editorial',portrait:'assets/hero-model.jpg',portfolio:[],languages:'',availability:'',hotelFocus:'',hotelOperations:'',hotelStandards:''};
const form=document.querySelector('#profile-form'),resume=document.querySelector('#resume'),feedback=document.querySelector('#feedback');let state=structuredClone(example),step=0;if(window.GLOSS_ACCOUNT){for(const k of Object.keys(state))state[k]=typeof state[k]==='string'?'':[];Object.assign(state,{role:window.GLOSS_ACCOUNT.roles[0],name:window.GLOSS_ACCOUNT.name,city:window.GLOSS_ACCOUNT.city,template:'editorial'});}const key=window.GLOSS_ACCOUNT?'gloss-draft-'+window.GLOSS_ACCOUNT.id:'gloss-independent-studio-v1';
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object'){for(const k of Object.keys(example)){if(typeof example[k]==='string'&&typeof saved[k]==='string')state[k]=saved[k];}if(Array.isArray(saved.portfolio))state.portfolio=saved.portfolio.filter(x=>typeof x==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(x)).slice(0,4);if(!['editorial','minimal','noir'].includes(state.template))state.template='editorial';if(!/^data:image\/(jpeg|png|webp);base64,/.test(state.portrait)&&state.portrait!==example.portrait)state.portrait='';document.querySelector('#draft-status').textContent='Saved draft restored';}}catch{}
function professionImage(role){return ({Reception:'assets/hero-hotel-reception.jpg',Chef:'assets/hero-hotel-chef.jpg',Staff:'assets/hero-hotel-staff.jpg',Model:'assets/hero-model.jpg','Makeup artist':'assets/hero-makeup.jpg',Hairstylist:'assets/hero-hairstylist.jpg'})[role]||'assets/hero-model.jpg';}
function hotelProfile(){
  return Object.hasOwn(hotelRoles,state.role)?hotelRoles[state.role]:null;
}
function hotelDetailsMarkup(){
  const hotel=hotelProfile();
  if(!hotel)return '';
  return Object.entries(hotel.fields).filter(([key])=>state[key]?.trim())
    .map(([key,[label]])=>`<h4>${escapeHTML(label)}</h4><p class="hotel-field-value">${escapeHTML(state[key])}</p>`).join('');
}
function hasPersonalPortrait(){return !!state.portrait&&!state.portrait.startsWith('assets/');}
function profilePictureMarkup(className){return `<figure class="profile-picture ${className==='book-portrait'?'book-profile-picture':'resume-profile-picture'}"><img class="${className}" src="${escapeHTML(hasPersonalPortrait()?state.portrait:professionImage(state.role))}" alt="${hasPersonalPortrait()?'Profile photo':'Example image — add your profile photo'}">${hasPersonalPortrait()?'':'<figcaption>Your photo here</figcaption>'}</figure>`;}
function escapeHTML(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){const e=escapeHTML,hotel=hotelProfile();resume.className='resume '+state.template;const stats=state.role==='Model'?['height','measurements','hair','eyes'].filter(k=>state[k]).map(k=>`<span><b>${k.toUpperCase()}</b><br>${e(state[k])}</span>`).join(''):'';resume.innerHTML=`<div class="resume-top"><span>GLOSS / TALENT PROFILE</span><span>${e(state.role)}</span></div><div class="resume-main"><div>${profilePictureMarkup('portrait')}</div><div><h2>${e(state.name||'Your name')}</h2><div class="profile-title">${e(state.title)}</div><div class="location">${e(state.city)}</div></div></div>${stats?`<div class="stats">${stats}</div>`:''}${state.bio?`<h4>${hotel?'Professional summary':'In focus'}</h4><p>${e(state.bio)}</p>`:''}${state.specialty?`<p>${e(state.specialty)}</p>`:''}${state.experience?`<h4>${e(hotel?.experienceLabel||'Selected experience')}</h4><p>${e(state.experience)}</p>`:''}${state.education?`<h4>${e(hotel?.educationLabel||'Training & certifications')}</h4><p>${e(state.education)}</p>`:''}${state.skills?`<h4>${e(hotel?.skillsLabel||'The skill set')}</h4><div class="skills">${state.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span>${e(s)}</span>`).join('')}</div>`:''}${state.portfolio.length?`<div class="portfolio-strip">${state.portfolio.map((p,i)=>`<img src="${e(p)}" alt="Portfolio image ${i+1}">`).join('')}</div>`:''}${hotelDetailsMarkup()}<h4>Let's connect</h4><p class="contact">${[state.email,state.phone,state.link].filter(Boolean).map(e).join(' · ')||'Add your preferred contact details'}</p>`;document.querySelector('#model-fields').hidden=state.role!=='Model';const hotelFields=document.querySelector('#hotel-fields');hotelFields.hidden=!hotel;hotelFields.disabled=!hotel;}
function syncRolePicker(){
  if(window.GLOSS_ACCOUNT){const allowed=window.GLOSS_ACCOUNT.roles;form.elements.role.innerHTML=allowed.map(r=>'<option value="'+escapeHTML(r)+'">'+escapeHTML(r)+'</option>').join('');form.elements.role.value=state.role;form.elements.role.disabled=allowed.length===1;return;}
  const currentHotelRole=document.querySelector('#current-hotel-role');
  const hotel=hotelProfile();
  currentHotelRole.hidden=!hotel;
  currentHotelRole.value=hotel?state.role:'';
  currentHotelRole.textContent=hotel?`Hotel Management · ${state.role}`:'';
  form.elements.role.value=state.role;
}
function fill(){
  syncRolePicker();
  for(const el of form.elements)if(el.name&&el.name!=='role'&&typeof state[el.name]==='string')el.value=state[el.name];
  render();
}
function dirty(){document.querySelector('#draft-status').textContent='Unsaved changes';feedback.textContent='';render();}
form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',e=>{if(e.target.name&&e.target.name!=='role'){state[e.target.name]=e.target.value;dirty();}});form.addEventListener('change',e=>{if(e.target.name&&e.target.name!=='role'){state[e.target.name]=e.target.value;dirty();}});
function setStep(n){step=Math.max(0,Math.min(2,n));document.querySelectorAll('[data-panel]').forEach(el=>el.hidden=Number(el.dataset.panel)!==step);document.querySelectorAll('[data-step]').forEach(el=>{el.classList.toggle('active',Number(el.dataset.step)===step);el.setAttribute('aria-pressed',String(Number(el.dataset.step)===step));});document.querySelector('#back').hidden=step===0;document.querySelector('#next').hidden=step===2;document.querySelector('#next').textContent=step===0?'Your work →':'Style & export →';}
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>setStep(Number(b.dataset.step)));document.querySelector('#back').onclick=()=>setStep(step-1);document.querySelector('#next').onclick=()=>setStep(step+1);
const hotelPicker=document.querySelector('#hotel-role-picker');
const hotelTriggers=document.querySelectorAll('[data-hotel-management]');
function showHotelRoles(open){
  hotelPicker.hidden=!open;
  hotelTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
  if(open){
    hotelPicker.scrollIntoView({behavior:'smooth',block:'nearest'});
    hotelPicker.querySelector('button').focus({preventScroll:true});
  }
}
hotelTriggers.forEach(trigger=>trigger.addEventListener('click',event=>{
  event.preventDefault();
  showHotelRoles(hotelPicker.hidden);
}));
document.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>{
  switchDraftRole(button.dataset.role);
  showHotelRoles(false);
  setStep(0);
  document.querySelector('#builder').scrollIntoView({behavior:'smooth'});
  if(hotelPicker.contains(button))form.elements.role.focus({preventScroll:true});
}));
document.querySelectorAll('[data-template]').forEach(b=>b.onclick=()=>{state.template=b.dataset.template;fill();dirty();setStep(2);document.querySelector('#builder').scrollIntoView({behavior:'smooth'});});
async function readImage(file){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Please choose a JPG, PNG or WebP image.');if(file.size>5*1024*1024)throw Error('Each image must be 5 MB or smaller.');const url=URL.createObjectURL(file);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('This image could not be opened.'));img.src=url;});const ratio=Math.min(1,1200/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*ratio);canvas.height=Math.round(img.height*ratio);const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.82);}finally{URL.revokeObjectURL(url);}}
document.querySelector('#portrait').onchange=async e=>{if(!e.target.files[0])return;try{state.portrait=await readImage(e.target.files[0]);dirty();feedback.textContent='Portrait added to your preview.';}catch(err){feedback.textContent=err.message;}e.target.value='';};
/* Legacy image-only upload removed.
document.querySelector('#portfolio').onchange=async e=>{const files=[...e.target.files];if(!files.length)return;try{if(files.length>4)throw Error('Choose up to 4 portfolio images.');state.portfolio=await Promise.all(files.map(readImage));dirty();feedback.textContent='Portfolio added to your preview.';}catch(err){feedback.textContent=err.message;}e.target.value='';};
*/
document.querySelector('#remove-portrait').onclick=()=>{state.portrait='';dirty();};
document.querySelector('#save').onclick=()=>{try{localStorage.setItem(key,JSON.stringify(state));document.querySelector('#draft-status').textContent='Saved on this device';feedback.textContent='Draft saved, including images. It will be here when you return in this browser.';}catch{feedback.textContent='Device storage is unavailable or full. Export your profile data instead.';}};
document.querySelector('#reset').onclick=()=>{try{localStorage.removeItem(key);}catch{}state=structuredClone(example);fill();document.querySelector('#draft-status').textContent='Example restored';feedback.textContent='Example restored. Any saved draft on this device has been removed.';};
document.querySelector('#download').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gloss-profile.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback.textContent='Profile data exported. This prototype does not include an import tool.';};
document.querySelector('#print').onclick=()=>{if(!form.reportValidity())return;window.print();};fill();setStep(0);
