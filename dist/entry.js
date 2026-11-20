'use strict';
document.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();const role=button.dataset.role;location.href='/join?profession='+({Model:'model','Makeup artist':'makeup',Hairstylist:'hair',Reception:'hotel',Chef:'hotel',Staff:'hotel'}[role]||'model');}));
document.querySelectorAll('[data-template]').forEach(button=>button.addEventListener('click',()=>location.href='/join?profession=model'));
document.querySelectorAll('[data-hotel-management]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();const picker=document.querySelector('#hotel-role-picker');picker.hidden=!picker.hidden;button.setAttribute('aria-expanded',String(!picker.hidden));if(!picker.hidden)picker.scrollIntoView({behavior:'smooth'});}));
