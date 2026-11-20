import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
export function localBindings(directory){
  if(directory)fs.mkdirSync(directory,{recursive:true});
  const sqlite=new DatabaseSync(directory?path.join(directory,'database.sqlite'):':memory:');
  if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='portfolios'").get())sqlite.exec(fs.readFileSync('drizzle/0000_portfolios.sql','utf8'));
  if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='agency_listings'").get())sqlite.exec(fs.readFileSync('drizzle/0001_agency_network.sql','utf8'));
  if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='agency_accounts'").get())sqlite.exec(fs.readFileSync('drizzle/0002_agency_accounts.sql','utf8'));
  if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='webinar_registrations'").get())sqlite.exec(fs.readFileSync('drizzle/0003_webinar_registrations.sql','utf8'));
  if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='talent_accounts'").get())sqlite.exec(fs.readFileSync('drizzle/0004_talent_studio.sql','utf8'));
  const objects=new Map(),mediaRoot=directory?path.join(directory,'media'):null;
  if(mediaRoot)fs.mkdirSync(mediaRoot,{recursive:true});
  const objectPath=key=>path.join(mediaRoot,...key.split('/'));
  const read=key=>mediaRoot?(fs.existsSync(objectPath(key))?fs.readFileSync(objectPath(key)):null):objects.get(key)||null;
  const DB={prepare(sql){return {bind(...args){return {
    async first(){return sqlite.prepare(sql).get(...args)||null;},
    async all(){return {results:sqlite.prepare(sql).all(...args)};},
    async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}};}
  };}};}};
  const BUCKET={
    async put(key,value){const bytes=value instanceof Uint8Array?value:new Uint8Array(value);if(mediaRoot){fs.mkdirSync(path.dirname(objectPath(key)),{recursive:true});fs.writeFileSync(objectPath(key),bytes);}else objects.set(key,bytes);return {key,size:bytes.byteLength};},
    async head(key){const value=read(key);return value?{key,size:value.byteLength}:null;},
    async get(key,options){const value=read(key);if(!value)return null;const bytes=options?.range?value.slice(options.range.offset,options.range.offset+options.range.length):value;return {body:bytes,size:value.byteLength};},
    async delete(keys){for(const key of Array.isArray(keys)?keys:[keys]){if(mediaRoot){if(fs.existsSync(objectPath(key)))fs.unlinkSync(objectPath(key));}else objects.delete(key);}},
    async list({prefix}){let keys;if(mediaRoot){keys=[];function walk(dir,parts=[]){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const next=[...parts,item.name];if(item.isDirectory())walk(path.join(dir,item.name),next);else keys.push(next.join('/'));}}walk(mediaRoot);}else keys=[...objects.keys()];return {objects:keys.filter(key=>key.startsWith(prefix)).map(key=>({key})),truncated:false};}
  };
  return {DB,BUCKET,close(){sqlite.close();}};
}
