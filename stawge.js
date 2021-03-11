//import {watch} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/watch_throttled/mod.ts';
import {watch} from '../denolib/ts/watch_throttled/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';
// import {httpLiveServerStart, httpLiveServerReload} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/http_live_server/mod.js'
import {httpLiveServerStart, httpLiveServerReload} from '../denolib/ts/http_live_server/mod.js';
import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';

import init from './init.js';
import build from './build.js';
import getConfig from './getConfig.js';

const cfg = await getConfig();

// -- version
if (['version', '-v', '--version'].includes(Deno.args[0])) {
  console.log('Stawge v' + cfg.version);
  console.log('Deno static website generator')
  console.log('https://github.com/drodsou/stawge')
  Deno.exit(0);
} 

// -- help
if (['help'].includes(Deno.args[0])) {
  console.log(unindent(`
  Stawge commands:
    stawge init    : create sample project
    stawge         : build project and watch for changes
    stawge build   : build project once
    stawge version : show version
    stawge help    : show this help
  
  To view resulting site use eg Live Server extension for VSCode
  `));
  Deno.exit(0);
} 

// -- init
if (Deno.args[0] === 'init') {
  await init();
  Deno.exit(0);
} 

// ------ BUILD



// TODO: getcfg, build_test, typescript


// -- full build, one time, no watch
if (Deno.args[0] === 'build') {

  try {
    // -- dist exists, delete?
    Deno.statSync(cfg.distDir);
    const answer = prompt(`Delete folder ${cfg.distDir}? (y/N) `);
    if ((answer||'').toLowerCase() !== 'y') {
      console.log('Aborted delete and build');
      Deno.exit(1);
    }
  } catch (e) { true }

  // dist does not exist
  console.log('Deleting and building')
  Deno.removeSync(cfg.distDir, {recursive:true});
  
  await build(cfg);
  Deno.exit(0);
} 


// -- default, build and watch
console.log(`\nWatching ${cfg.srcDir}`);

// -- initial full build?
try {
  Deno.statSync(cfg.distDir)
  // -- no, as dist exists
  console.log(`Omiting full build as dist folder already exists: ${cfg.distDir}`);
  console.log(`(delete it or do 'stawge build' for a fuild build)`);
} catch (e) {
  // -- yes, as dist does not exist
  console.log(`Doing initial full build into: ${cfg.distDir}`);
  await build(cfg);
}

// -- watch, incremental build on src changes, and liveserver reload
watch({dirs:[cfg.srcDir], exclude:[], options:{throttle:50}, fn: async (changedEvts)=>{
  console.log(changedEvts)

  cfg.changedEvts = changedEvts;
  const buildResult = await build(cfg);
  // httpLiveServerReload("reload " + (changedFile.path.includes('.css') ? 'css' : 'js'));
  if (buildResult) { httpLiveServerReload("reload"); }
}});

// -- live server start
httpLiveServerStart({path:cfg.distDir, spa:false, port: cfg.port});

