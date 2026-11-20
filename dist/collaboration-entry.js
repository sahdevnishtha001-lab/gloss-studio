'use strict';

// This demo has its own browser storage and never writes portfolio account data.
(() => {
  const key = 'gloss-shoot-studio-demo-v3';
  const profession = new URLSearchParams(location.search).get('profession');
  const entry = {
    model:{actor:'mira',url:'/studio/models',label:'Model studio'},
    makeup:{actor:'sana',url:'/studio/makeup',label:'Makeup studio'},
    hair:{actor:'ishaan',url:'/studio/hair',label:'Hair studio'}
  }[profession] || {actor:'mira',url:'/studio/models',label:'Model studio'};
  let snapshot;
  try { snapshot = JSON.parse(localStorage.getItem(key)); } catch {}
  if (snapshot?.modelContent?.glossShootStudio) {
    snapshot.modelContent.glossShootStudio.actor = entry.actor;
    snapshot.modelContent.glossShootStudio.view = 'board';
  } else {
    // The complete example is seeded by the workspace before this actor is selected.
    snapshot = null;
  }
  window.glossDemo = {
    widgetState: snapshot,
    setWidgetState: async value => {
      try { localStorage.setItem(key,JSON.stringify(value)); } catch {}
    }
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const back = document.getElementById('collaboration-back');
    back.href = entry.url;
    back.textContent = entry.label;
    const actor = document.querySelector('#gloss-shoot-studio [data-actor]');
    if (actor && actor.value !== entry.actor) {
      actor.value=entry.actor;
      actor.dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
})();
