import {watch} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/watch_throttled/mod.ts';
import {runCmd} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/run_cmd/mod.ts';

if (Deno.args[0] === 'init') {
  await init();
  Deno.exit(0);
} 


copyPublic();
await build();

// -- example
console.log('watching src');
watch({dirs:['src'], exclude:[], fn: async (dirs:any)=>{
  // TODO: update changes only (if not .js/.ts/.md get neares parent?)
  // warning: what happens with summary when doing incremental ?
  copyPublic();
  await build();
}});