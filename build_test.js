/*
tests: static
- create test.html (ignored)
- modify test.html (copied)
  - modify again (copied + browser refresh)
- rename test.html to test2.html (same on dist)
- delete test.html (same dist)

*/

import build, {getAllStaticFiles, getAllDynamicFiles, generateSearchJSON} from './build.js';
import getConfig from './getConfig.js'

Deno.chdir(Deno.cwd() + '/example');
const cfg = await getConfig();

// console.log(cfg)
// console.log(getAllStaticFiles(cfg))
// console.log(getAllDynamicFiles(cfg))

console.log(generateSearchJSON(cfg));

// Deno.test("build", function () {
//   //throw new Error('test3 failed');
  
// });

