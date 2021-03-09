//import {watch} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/watch_throttled/mod.ts';
import {watch} from '../denolib/ts/watch_throttled/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';
import {httpLiveServerStart, httpLiveServerReload} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/http_live_server/mod.js'
// import {httpLiveServerStart, httpLiveServerReload} from '../denolib/ts/http_live_server/mod.js';
import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';

import init from './init.js';
import build from './build.js';
import VERSION from './version.js';
import getUserConfig from './getUserConfig.js';

// -- version
if (['version', '-v', '--version'].includes(Deno.args[0])) {
  console.log('Stawge v' + VERSION);
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

const userConfig = await getUserConfig();
const cfg = {}
cfg.version = VERSION;
cfg.rootDir = slashJoin( Deno.cwd() );
cfg.srcDir = cfg.rootDir + '/src';
cfg.srcstaticDirRel = '/src/static';
cfg.srcstaticDir = cfg.rootDir + cfg.srcstaticDirRel;
cfg.srcdynDirRel = '/src/dynamic';
cfg.srcdynDir = cfg.rootDir + cfg.srcdynDirRel;
cfg.distDirRel = userConfig.dist || '/dist';
cfg.distDir = cfg.rootDir + cfg.distDirRel;
cfg.port = 8010;



if (Deno.args[0] === 'build') {
  // one time build, no watch
  await build(cfg);
} 
else {
  // default, build and watch
  console.log('\nWatching /src...');
  await build(cfg);
  
  watch({dirs:['src'], exclude:[], options:{throttle:50}, fn: async (changedFiles)=>{
    const changedFile = changedFiles[0];
    changedFile.path = slashJoin(changedFile.path);
    if (changedFile.kind === 'create') {return}
    try {
      // changed directory, ignore
      if (Deno.statSync(changedFile.path).isFile === false) return;
    } catch (e) { true }
    // -- proper file changed
    console.log('changed', changedFile)
    await build(cfg, changedFile);
    httpLiveServerReload("reload " + changedFile.path.includes('.css') ? 'css' : 'js');
  }});
  // console.log(`Serving ${cfg.distDir} at localhost:${cfg.port}`);
  httpLiveServerStart({path:cfg.distDir, spa:false, port: cfg.port});
}
