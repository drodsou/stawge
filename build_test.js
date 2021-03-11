import build, {getAllStaticFiles, getAllDynamicFiles} from './build.js';
import getConfig from './getConfig.js'

Deno.chdir(Deno.cwd() + '/example');
const cfg = await getConfig();

console.log(cfg)
console.log(getAllStaticFiles(cfg))
console.log(getAllDynamicFiles(cfg))

// Deno.test("build", function () {
//   //throw new Error('test3 failed');
  
// });

