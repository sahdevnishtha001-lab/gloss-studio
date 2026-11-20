'use strict';

(() => {
  const creative = {
    models: {
      label: 'Model studio', profession: 'model', role: 'Model', image: 'model-sample-editorial.jpg',
      eyebrow: 'Your look. Your range. Your next introduction.',
      title: 'Give your next chapter a face.',
      intro: 'Create a portfolio that moves, build the team for your first shoots, and introduce your work to enrolled agencies.',
      sample: 'model', sampleName: 'Mira Sen', sampleImage: 'model-sample-editorial.jpg',
      sampleDescription: 'Introduction, Polaroids, runway motion, and collections for every kind of shoot.',
      tabs: [['overview','Your studio'],['portfolio','My portfolio'],['collaborations','Collaborations'],['network','Agency network']],
      categories: ['Runway','Editorial','Beauty','Jewellery','Commercial','Digitals','Polaroids','Intro video'],
      cards: [
        ['Build your portfolio','Your face, stats, shoot collections, and walk in one living portfolio.','Create a model portfolio','/builder?profession=model'],
        ['Make work together','Plan a shoot, explore posted concepts, and try selecting a creative team.','Explore collaborations','/studio/models?view=collaborations'],
        ['Find your agency','Search enrolled agencies by city and modelling field when your portfolio is ready.','Explore the agency network','/agencies']
      ]
    },
    makeup: {
      label: 'Makeup studio', profession: 'makeup', role: 'Makeup artist', image: 'makeup-sample-headshot.jpg',
      eyebrow: 'The person behind the look',
      title: 'Let your signature be seen.',
      intro: 'Show the finish and the transformation. Bring your bridal, beauty, and shoot work together, then find creative teams to work with.',
      sample: 'makeup', sampleName: 'The makeup artist sample', sampleImage: 'makeup-sample-headshot.jpg',
      sampleDescription: 'A professional portrait, bridal and beauty collections, shoot work, and a classic résumé.',
      tabs: [['overview','Your studio'],['portfolio','My portfolio'],['collaborations','Collaborations'],['directory','Get discovered']],
      categories: ['Bridal','Party','Glamour','Matte','HD','Shoot experience'],
      cards: [
        ['Show your range','Introduce yourself alongside your signature looks, transformations, and experience.','Create a makeup portfolio','/builder?profession=makeup'],
        ['Join the creative team','Post a beauty concept or send a request to join a model’s or photographer’s shoot.','Explore collaborations','/studio/makeup?view=collaborations'],
        ['Be discoverable','Publish your portfolio and choose to request a city-based makeup directory listing.','Explore discoverability','/studio/makeup?view=directory']
      ]
    },
    hair: {
      label: 'Hair studio', profession: 'hair', role: 'Hairstylist', image: 'hair-sample-headshot.jpg',
      eyebrow: 'Shape. Texture. Your signature.',
      title: 'Put your craft in motion.',
      intro: 'Give every cut, texture, and transformation its own place. Build your portfolio and connect your craft with a creative shoot team.',
      sample: 'hair', sampleName: 'Mira Sethi', sampleImage: 'hair-sample-headshot.jpg',
      sampleDescription: 'Haircuts by texture, bridal styling, updos, braids, extensions, colour, and shoot experience.',
      tabs: [['overview','Your studio'],['portfolio','My portfolio'],['collections','Techniques & looks'],['collaborations','Collaborations']],
      categories: ['Straight','Wavy','Curly','Updos','Braids','Bridal','Extensions','Colour','Shoots'],
      cards: [
        ['Build your portfolio','Your portrait, technical skills, selected work, and classic résumé in one place.','Create a hair portfolio','/builder?profession=hair'],
        ['Show the technique','Organise looks by texture, style, extension work, and colour.','Explore collections','/studio/hair?view=collections'],
        ['Create with a team','Bring a hair concept to the studio or join a posted shoot looking for your skills.','Explore collaborations','/studio/hair?view=collaborations']
      ]
    }
  };
  const hospitality = {
    chef: {
      label: 'Chef studio', profession: 'chef', role: 'Chef', image: 'hero-hotel-chef.jpg',
      eyebrow: 'Your work, from prep to the pass',
      title: 'Let your kitchen work speak.',
      intro: 'Show the cuisines you cook, the stations you know, and what you bring to a service.',
      sample: 'chef', sampleName: 'Arjun Rao', sampleImage: 'hero-hotel-chef.jpg',
      sampleDescription: 'Cuisines, plated dishes, banquet preparation, training, and a classic chef résumé.',
      tabs: [['overview','Your studio'],['portfolio','My coursefolio'],['collections','Cuisines & kitchen work']],
      categories: ['Cuisines','Plated dishes','Menu development','Banquets','Kitchen operations','Food safety'],
      cards: [
        ['Introduce the chef','Your portrait, culinary background, stations, cuisines, and training.','Create a chef coursefolio','/builder?profession=chef'],
        ['Show how you work','Present dishes with your role, techniques, and service decisions.','Explore kitchen work','/studio/hotel/chef?view=collections'],
        ['Take it to the next kitchen','Publish selected work with a shareable link and keep a printable classic résumé.','View a chef sample','/samples/chef']
      ]
    },
    reception: {
      label: 'Receptionist studio', profession: 'reception', role: 'Reception', image: 'hero-hotel-reception.jpg',
      eyebrow: 'A good stay starts with a good welcome',
      title: 'Show the service behind the smile.',
      intro: 'Present your front-office experience, guest communication, languages, and the systems you have used.',
      sample: 'receptionist', sampleName: 'Aditi Shah', sampleImage: 'hero-hotel-reception.jpg',
      sampleDescription: 'Front-desk responsibilities, guest scenarios, training, systems, and a classic résumé.',
      tabs: [['overview','Your studio'],['portfolio','My coursefolio'],['collections','Front-office experience']],
      categories: ['Arrivals','Reservations','Guest relations','Billing','Languages','Training'],
      cards: [
        ['Introduce yourself','Your profile picture, front-office experience, languages, and qualifications.','Create a receptionist coursefolio','/builder?profession=reception'],
        ['Make service concrete','Describe how you handled arrivals, booking changes, and guest requests.','Explore front-office work','/studio/hotel/reception?view=collections'],
        ['Prepare your introduction','Share your living coursefolio alongside a printable classic résumé.','View a receptionist sample','/samples/receptionist']
      ]
    },
    staff: {
      label: 'Hotel staff studio', profession: 'staff', role: 'Staff', image: 'hero-hotel-staff.jpg',
      eyebrow: 'The people who make the stay work',
      title: 'Bring your service into focus.',
      intro: 'Present your hotel department, hands-on skills, training, and the details that make a shift run well.',
      sample: 'staff', sampleName: 'Neha Kulkarni', sampleImage: 'hero-hotel-staff.jpg',
      sampleDescription: 'Housekeeping, banquet setup, food and beverage, guest support, and a classic résumé.',
      tabs: [['overview','Your studio'],['portfolio','My coursefolio'],['collections','Service experience']],
      categories: ['Housekeeping','Banquets','Food & beverage','Guest support','Shift handovers','Training'],
      cards: [
        ['Present your experience','Your portrait, department, daily responsibilities, and service training.','Create a hotel staff coursefolio','/builder?profession=staff'],
        ['Show the details','Document room preparation, service setup, guest requests, and handovers.','Explore service work','/studio/hotel/staff?view=collections'],
        ['Share your next step','Keep a living coursefolio and a printable résumé ready for introductions.','View a hotel staff sample','/samples/staff']
      ]
    }
  };
  const main = document.getElementById('studio-view');
  const menu = document.getElementById('studio-navigation');
  const picker = document.getElementById('studio-switch');
  const breadcrumb = document.getElementById('studio-breadcrumb');
  const e = value => String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[character]));
  const link = (label, href, primary = false) => '<a class="button' + (primary ? ' primary' : '') + '" href="' + href + '">' + e(label) + '</a>';
  const image = (file, alt, css = '') => '<img class="' + css + '" src="/assets/' + file + '" alt="' + e(alt) + '">';
  const tiles = cards => '<div class="studio-grid">' + cards.map(([title, text, label, href]) =>
    '<article class="studio-tile"><h3>' + e(title) + '</h3><p>' + e(text) + '</p><a href="' + href + '">' + e(label) + '</a></article>').join('') + '</div>';
  let current;
  let path;

  function sample(config) {
    return '<section class="studio-section studio-sample">' + image(config.sampleImage, config.sampleName + ' fictional sample portrait') +
      '<div><p class="eyebrow">Open a fictional sample</p><h2>' + e(config.sampleName) + '</h2><p>' +
      e(config.sampleDescription) + '</p><div class="actions">' + link('View sample portfolio & résumé', '/samples/' + config.sample) + '</div></div></section>';
  }
  function overview(config) {
    return '<section class="studio-hero"><div><p class="eyebrow">' + e(config.eyebrow) + '</p><h1>' + e(config.title) +
      '</h1><p>' + e(config.intro) + '</p><div class="actions">' +
      link(config.profession === 'model' || ['makeup','hair'].includes(config.profession) ? 'Create my portfolio' : 'Create my coursefolio',
        '/builder?profession=' + config.profession, true) +
      '<a class="quiet-link" href="/samples/' + config.sample + '">View a sample</a></div></div>' +
      image(config.image, config.label + ' visual example') + '</section>' +
      '<section class="studio-section"><h2>Your next move.</h2>' + tiles(config.cards) + '</section>' + sample(config);
  }
  function portfolio(config) {
    return '<section class="page-intro"><p class="eyebrow">' + e(config.label) + '</p><h1>Your work, with a world of its own.</h1>' +
      '<p>Introduce yourself with a profile photo, your experience, and selected work. Build a living portfolio and keep a classic résumé alongside it.</p>' +
      '<div class="role-pills">' + config.categories.map(category => '<span>' + e(category) + '</span>').join('') + '</div>' +
      '<div class="actions">' + link('Open my portfolio editor', '/builder?profession=' + config.profession, true) +
      link('View the sample', '/samples/' + config.sample) + '</div></section>' + sample(config);
  }
  function collaborations(config) {
    return '<section class="page-intro"><p class="eyebrow">The team behind the work</p><h1>Start with a concept.<br>Bring the people together.</h1>' +
      '<p>Post a shoot, send a request to join, and select collaborators into a shared shoot workspace. Any creative can organise the concept.</p>' +
      '<div class="actions">' + link('Try the collaboration studio', '/collaborations?profession=' + config.profession, true) + '</div>' +
      '<p class="demo-callout">The collaboration studio is a working demo with fictional posts and profiles. Requests and team selections are saved in this browser.</p>' +
      '</section><section class="studio-section">' + tiles([
        ['Plan the concept','Set the look, venue plan, roles, images, and credits. Save a draft while you plan.','Open Shoot Studio','/collaborations?profession='+config.profession],
        ['Find the team','Browse posted shoots or review requests for your own concept. Select people for each role.','Explore posted shoots','/collaborations?profession='+config.profession],
        ['Create the work','Finalize the assigned group and try a completed-work example with team credits.','Try the team workspace','/collaborations?profession='+config.profession]
      ]) + '</section>';
  }
  function collections(config) {
    return '<section class="page-intro"><p class="eyebrow">' + e(config.label) + '</p><h1>' +
      (config.profession === 'hair' ? 'A place for every technique.' : 'Experience they can explore.') +
      '</h1><p>' + e(config.sampleDescription) + '</p><div class="role-pills">' +
      config.categories.map(category=>'<span>'+e(category)+'</span>').join('') + '</div><div class="actions">' +
      link('Build my collections','/builder?profession='+config.profession,true) +
      link('Explore the sample','/samples/'+config.sample+(config.profession==='hair'?'#looks':'')) + '</div></section>' + sample(config);
  }
  function modelNetwork() {
    return '<section class="page-intro"><p class="eyebrow">Your portfolio’s next introduction</p><h1>Choose where you want to be seen.</h1>' +
      '<p>Search enrolled agencies by city and modelling field, review their information, and choose who you want to approach with your portfolio.</p>' +
      '<div class="actions">' + link('Find enrolled agencies','/agencies',true) + link('Open my portfolio','/builder?profession=model') +
      '</div><p class="demo-callout">The directory shows enrolled agencies matching both filters. You can share your published portfolio through an agency’s listed contact details.</p></section>' +
      '<section class="studio-section">' + tiles([
        ['Prepare your work','Keep your current portrait, digitals, selected shoots, and walk together.','Create my portfolio','/builder?profession=model'],
        ['Find your fit','Review agencies in your city and the kind of modelling they work with.','Open the agency network','/agencies'],
        ['Make the introduction','Publish your portfolio, then send its link through your chosen agency’s listed contact channel.','See a model sample','/samples/model']
      ]) + '</section>';
  }
  function discoverability() {
    return '<section class="page-intro"><p class="eyebrow">Makeup artist directory</p><h1>Let nearby teams find your work.</h1>' +
      '<p>Publish your makeup portfolio and request a directory listing from the editor. Approved profiles can be discovered by location.</p>' +
      '<div class="actions">' + link('Prepare my makeup profile','/builder?profession=makeup',true) +
      link('Explore the makeup artist directory','/makeup-artists') + '</div></section>' + sample(creative.makeup);
  }
  function hotel() {
    return '<section class="studio-hero"><div><p class="eyebrow">Hotel Management</p><h1>Every role has<br>its own story.</h1>' +
      '<p>Choose your hotel role. Your coursefolio, résumé fields, and work examples will follow the profession you select.</p></div>' +
      image('hero-hotel-team.jpg','Receptionist, chef, and hotel service associate together','team-image') + '</section>' +
      '<section class="studio-section"><h2>Choose your hotel role.</h2><div class="role-grid">' +
      Object.entries(hospitality).map(([key,config])=>'<a class="hotel-role" href="/studio/hotel/'+key+'">'+
        image(config.image,config.role+' professional example')+'<div><h3>'+e(config.role==='Reception'?'Receptionist':config.role==='Staff'?'Hotel staff':'Chef')+
        '</h3><p>'+e(config.intro)+'</p></div></a>').join('')+'</div></section>';
  }
  function agencyStudio(view) {
    if (view === 'partners') {
      return '<section class="page-intro"><p class="eyebrow">The people behind the shoot</p><h1>Build your creative connections.</h1>' +
        '<p>Explore published makeup artist profiles by location, or try the creative collaboration demo to see how a team forms around a shoot.</p><div class="actions">' +
        link('Find makeup artists','/makeup-artists',true) + link('Try collaboration demo','/collaborations?profession=model') + '</div></section>';
    }
    return '<section class="studio-hero"><div><p class="eyebrow">For the people who discover people</p><h1>A clearer way<br>to connect.</h1>' +
      '<p>Enrol your agency in the GLOSS network and use your agency dashboard to review referral activity and qualifying commission.</p><div class="actions">' +
      link('Open agency dashboard','/agency-dashboard',true) + '<a class="quiet-link" href="/agencies">View the network</a></div></div>' +
      image('model-sample-commercial.jpg','A commercial modelling example') + '</section><section class="studio-section"><h2>Your agency, on GLOSS.</h2>' +
      tiles([
        ['Agency enrolment','Request an agency account and provide the details for your network listing.','Enrol or sign in','/agency-dashboard'],
        ['Referrals & commission','Review your referral code, referred model sign-ins, and commission on qualifying paid purchases.','Open referral dashboard','/agency-dashboard'],
        ['Creative partners','Explore nearby makeup professionals and the collaboration workflow.','Explore creative partners','/studio/agencies?view=partners']
      ]) + '</section>';
  }
  function render() {
    const parts = location.pathname.split('/').filter(Boolean);
    const key = parts[1] || 'models';
    const hotelKey = key === 'hotel' ? parts[2] : null;
    current = hotelKey ? hospitality[hotelKey] : creative[key];
    path = '/studio/' + key + (hotelKey && current ? '/' + hotelKey : '');
    const tabs = current?.tabs || (key==='agencies' ?
      [['overview','Agency studio'],['partners','Creative partners']] : [['overview','Hotel roles']]);
    const requested = new URLSearchParams(location.search).get('view') || 'overview';
    const view = tabs.some(([id])=>id===requested) ? requested : 'overview';
    picker.value = ['models','makeup','hair','agencies','hotel'].includes(key) ? key : 'models';
    const label = current?.label || (key==='agencies'?'Agency studio':'Hotel Management');
    document.title = label + ' · GLOSS';
    breadcrumb.textContent = 'GLOSS / ' + label;
    menu.innerHTML = tabs.map(([id,label])=>'<a href="'+path+(id==='overview'?'':'?view='+id)+'" data-studio-view'+
      (view===id?' aria-current="page"':'')+'>'+e(label)+'</a>').join('') +
      (key==='agencies'?'<a href="/agency-dashboard">Referral dashboard</a>':'') +
      (hotelKey?'<a href="/studio/hotel">Other hotel roles</a>':'');
    if (key==='agencies') main.innerHTML=agencyStudio(view);
    else if (key==='hotel' && !current) main.innerHTML=hotel();
    else {
      current = current || creative.models;
      main.innerHTML = ({
        overview:()=>overview(current), portfolio:()=>portfolio(current), collaborations:()=>collaborations(current),
        collections:()=>collections(current), network:modelNetwork, directory:discoverability
      }[view] || (()=>overview(current)))();
    }
  }
  menu.addEventListener('click',event=>{
    const anchor=event.target.closest('[data-studio-view]');
    if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState({},'',anchor.href);
    render();
  });
  picker.addEventListener('change',()=>{location.href='/studio/'+picker.value;});
  window.addEventListener('popstate',render);
  render();
})();
