import fs from 'node:fs';import path from 'node:path';
import hotelRoles from './dist/hotel-roles.js';
const types={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.vtt':'text/vtt;charset=utf-8'};const assets={};for(const name of fs.readdirSync('dist')){const full=path.join('dist',name);if(fs.statSync(full).isFile()&&types[path.extname(name)])assets['/'+name]={body:fs.readFileSync(full).toString('base64'),type:types[path.extname(name)]};}for(const name of fs.readdirSync('dist/assets')){const full=path.join('dist/assets',name);if(fs.statSync(full).isFile())assets['/assets/'+name]={body:fs.readFileSync(full).toString('base64'),type:types[path.extname(name)]||'application/octet-stream'};}let source=fs.readFileSync('worker.mjs','utf8');
source=source.replace("import hotelRoles from './dist/hotel-roles.js';",'const hotelRoles = '+JSON.stringify(hotelRoles)+';');
source=source.replace("import {handleTalent,talentAccount,talentAllowedRoles,talentPublishGuard} from './talent-studio.mjs';",fs.readFileSync('talent-studio.mjs','utf8').replaceAll('export ',''));
source=source.replace("import {handleWebinar} from './webinar.mjs';",fs.readFileSync('webinar.mjs','utf8').replace('export async function handleWebinar','async function handleWebinar'));
const guestBoundary = '<!-- End signed-out homepage -->';
const home = fs.readFileSync('dist/index.html', 'utf8');
const [guestStart, editor] = home.split(guestBoundary);
const sampleLinks = editor?.match(/<section class="studio-samples" id="studio-samples"[\s\S]*?<\/section>/)?.[0];
if (!editor || !sampleLinks || guestStart.includes('<script') || guestStart.includes('id="profile-form"')) {
  throw new Error('The public homepage must end before the portfolio editor.');
}
const professionSection = editor.split('<!-- End profession choices -->')[0];
if (!professionSection.includes('profession=designer') || !professionSection.includes('profession=agency')) throw new Error('Public profession choices are missing.');
const studioStart = home.indexOf('<section class="studio section" id="builder">');
const sections = /<\/?section\b[^>]*>/g; sections.lastIndex = studioStart;
let depth = 0, studioEnd = -1, section;
while ((section = sections.exec(home))) { depth += section[0].startsWith('</') ? -1 : 1; if (!depth) { studioEnd = sections.lastIndex; break; } }
if (studioStart < 0 || studioEnd < 0) throw new Error('Portfolio editor boundary missing.');
const publicEnd = home.indexOf('</main>', studioEnd);
const guestHome = (home.slice(0, studioStart) + home.slice(studioEnd, publicEnd) + '</main><script src="/entry.js"></script></body></html>')
 .replaceAll('href="#builder"', 'href="#made-for"');
assets.guestHomepage = { body: Buffer.from(guestHome).toString('base64'), type: types['.html'] };
source=source.replace("import {handleNetwork} from './agency-network.mjs';",fs.readFileSync('agency-network.mjs','utf8').replace("import {handleSimpleNetwork} from './agency-simple.mjs';",fs.readFileSync('agency-simple.mjs','utf8').replace('export async function handleSimpleNetwork','async function handleSimpleNetwork')).replace('export async function handleNetwork','async function handleNetwork'));source=source.replace('export default createWorker();','export default createWorker('+JSON.stringify(assets)+');');fs.mkdirSync('dist/server',{recursive:true});fs.writeFileSync('dist/server/index.js',source);fs.mkdirSync('dist/.openai',{recursive:true});fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');console.log('Built GLOSS publishing Worker with '+Object.keys(assets).length+' embedded editor assets.');
