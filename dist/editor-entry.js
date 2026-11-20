'use strict';

(async () => {
  const professions = {
    model:{role:'Model',label:'Model',studio:'/studio/models'},
    makeup:{role:'Makeup artist',label:'Makeup artist',studio:'/studio/makeup'},
    hair:{role:'Hairstylist',label:'Hair artist',studio:'/studio/hair'},
    chef:{role:'Chef',label:'Chef',studio:'/studio/hotel/chef'},
    reception:{role:'Reception',label:'Receptionist',studio:'/studio/hotel/reception'},
    staff:{role:'Staff',label:'Hotel staff',studio:'/studio/hotel/staff'}
  };
  const header = document.createElement('header');
  header.className = 'editor-header';
  header.innerHTML = '<a href="/" class="editor-brand">GLOSS</a><nav aria-label="Portfolio editor navigation"><a id="editor-studio-link" href="/">Your studio</a><a href="/#studio-samples">Sample portfolios</a></nav>';
  document.body.prepend(header);
  // Move the existing chooser so its normal change handler remains available.
  form.elements.role.closest('label').after(hotelPicker);
  function syncHeader() {
    const current = Object.values(professions).find(item=>item.role===state.role) || professions.model;
    const back = document.getElementById('editor-studio-link');
    back.href = current.studio;
    back.textContent = current.label + ' studio';
    document.title = current.label + ' portfolio editor · GLOSS';
    const heading = document.querySelector('#builder .section-heading h2');
    heading.textContent = 'Your ' + current.label.toLowerCase() + ' portfolio.';
  }
  await draftReady;
  const requested = new URLSearchParams(location.search).get('profession');
  if (Object.hasOwn(professions,requested)) switchDraftRole(professions[requested].role);
  syncHeader();
  form.elements.role.addEventListener('change',syncHeader);
  hotelPicker.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',syncHeader));
  document.body.classList.add('editor-ready');
})();
