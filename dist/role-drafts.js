'use strict';
// Keep identities and uploads separate, including when returning to an unsaved draft.
let professionDrafts=Object.create(null),draftsReady=false;
function blankProfession(role){const blank={};for(const k of Object.keys(example))blank[k]=typeof example[k]==='string'?'':[];return {...blank,role,template:'editorial',media:[],portfolio:[]};}
function cleanProfession(saved,role){const next=blankProfession(role);if(!saved||typeof saved!=='object')return next;for(const k of Object.keys(example))if(typeof next[k]==='string'&&typeof saved[k]==='string')next[k]=saved[k];next.role=role;if(!['editorial','minimal','noir'].includes(next.template))next.template='editorial';if(!imageSource(next.portrait))next.portrait='';next.media=Array.isArray(saved.media)?saved.media.filter(m=>validMedia(m)&&!m.sample&&m.role===role).slice(0,30):[];return next;}
function draftBundle(){professionDrafts[state.role]=structuredClone(state);return {version:2,activeRole:state.role,professions:structuredClone(professionDrafts)};}
function updateProfessionUI(){
  const hotel=hotelProfile();
  const hints={
    Model:'Editorial, runway, beauty',
    'Makeup artist':'Party, glamour, matte, HD, skin prep',
    Hairstylist:'Styling, texture, curls, cut & colour'
  };
  const defaultSkills={'Makeup artist':'Skin prep, blending, colour matching',Hairstylist:'Blow-dry, curls, updos, colour'};
  document.querySelector('#specialty-label input').placeholder=hotel?.specialty||hints[state.role]||'Your specialties';
  form.elements.title.placeholder=hotel?.title||'';
  form.elements.bio.placeholder=hotel?.summary||'';
  form.elements.experience.placeholder=hotel?.experience||'';
  form.elements.education.placeholder=hotel?.education||'';
  form.elements.skills.placeholder=hotel?.skills||defaultSkills[state.role]||'Your skills, separated with commas';
  document.querySelector('#experience-label').textContent=hotel?.experienceLabel||'Experience / selected projects';
  document.querySelector('#education-label').textContent=hotel?.educationLabel||'Training / certifications';
  document.querySelector('#skills-label').textContent=hotel?.skillsLabel||'Skills';
  if(hotel){
    document.querySelector('#hotel-fields-label').textContent=state.role+' details';
    for(const [key,[label,hint]] of Object.entries(hotel.fields)){
      document.querySelector('#'+key+'-label').textContent=label;
      form.elements[key].placeholder=hint;
    }
  }
  portraitStatus.textContent='';
  document.querySelector('#publication-feedback')?.replaceChildren();
}
function switchDraftRole(role){if(!Object.hasOwn(worlds,role))return;if(!draftsReady||mediaBusy||storageBusy||(typeof publicationWorking!=='undefined'&&publicationWorking)){form.elements.role.value=state.role;feedback.textContent='Please wait for the current draft to finish loading, saving or uploading.';return;}if(role===state.role){form.elements.role.value=state.role;return;}professionDrafts[state.role]=structuredClone(state);state=structuredClone(professionDrafts[role]||blankProfession(role));activeFilter='All';revision++;fill();editorMarkup();updateProfessionUI();document.querySelector('#draft-status').textContent=state.name?'Separate '+role+' draft':'Fresh '+role+' draft';feedback.textContent='This profession has its own details, portrait and collections. Save on this device to keep all your drafts.';}
document.querySelector('#save').onclick=async()=>{if(!draftsReady||mediaBusy||storageBusy)return;storageBusy=true;const version=revision,snapshot=draftBundle();try{await dbAction('readwrite',s=>s.put(snapshot,'current'));try{localStorage.removeItem(key);}catch{}document.querySelector('#draft-status').textContent=version===revision?'All profession drafts saved':'Saved earlier changes · new edits unsaved';feedback.textContent='Separate profession drafts and media saved in this browser.';}catch{feedback.textContent='Could not save on this device. Download your web portfolio to keep your work.';}finally{storageBusy=false;}};
document.querySelector('#reset').onclick=async()=>{if(!draftsReady||mediaBusy||storageBusy)return;storageBusy=true;const role=state.role,previous=professionDrafts[role];try{professionDrafts[role]=blankProfession(role);const snapshot={version:2,activeRole:role,professions:structuredClone(professionDrafts)};await dbAction('readwrite',s=>s.put(snapshot,'current'));state=structuredClone(professionDrafts[role]);activeFilter='All';revision++;fill();editorMarkup();updateProfessionUI();document.querySelector('#draft-status').textContent='Fresh '+role+' draft';feedback.textContent='This profession’s draft is now blank. Other profession drafts are kept.';}catch{professionDrafts[role]=previous;feedback.textContent='Could not clear this draft. Your current information has been kept.';}finally{storageBusy=false;}};
const savedRoles=[...Object.keys(worlds),...archivedRoles];
const draftReady=dbAction('readonly',s=>s.get('current')).then(saved=>{
  if(saved?.version===2&&saved.professions){
    for(const role of savedRoles){
      if(saved.professions[role])professionDrafts[role]=cleanProfession(saved.professions[role],role);
    }
    const role=Object.hasOwn(worlds,saved.activeRole)?saved.activeRole:'Model';
    state=structuredClone(professionDrafts[role]||blankProfession(role));
  }else{
    const legacy=saved||state;
    const role=savedRoles.includes(legacy.role)?legacy.role:'Model';
    professionDrafts[role]=cleanProfession(legacy,role);
    for(const other of savedRoles){
      const media=(legacy.media||[]).filter(m=>validMedia(m)&&!m.sample&&m.role===other);
      if(other!==role&&media.length)professionDrafts[other]={...blankProfession(other),media};
    }
    const activeRole=Object.hasOwn(worlds,role)?role:'Model';
    state=structuredClone(professionDrafts[activeRole]||blankProfession(activeRole));
  }
  document.querySelector('#draft-status').textContent=saved?'Saved profession draft restored':'Device draft ready';
}).catch(()=>{
  if(!Object.hasOwn(worlds,state.role)){
    const previousRole=state.role;
    if(savedRoles.includes(previousRole))professionDrafts[previousRole]=cleanProfession(state,previousRole);
    state=blankProfession('Model');
  }
  professionDrafts[state.role]=structuredClone(state);
  feedback.textContent='Device storage is unavailable. You can still edit and download this session.';
}).finally(()=>{
  draftsReady=true;
  fill();
  editorMarkup();
  updateProfessionUI();
});
