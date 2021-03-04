import {watch} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/watch_throttled/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';

import init from './init.js';
import build from './build.js';

const VERSION="0.1";

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

if (Deno.args[0] === 'build') {
  // one time build, no watch
  build();
} 
else {
  // default, build and watch
  console.log('\nWatching /src...');
  build();
  watch({dirs:['src'], exclude:[], fn: async (dirs)=>{
    await build();
  
  }});
}
