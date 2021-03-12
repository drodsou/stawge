import getConfig from '../../../../getConfig.js';
import index from './index.js';

let cfg = await getConfig();
let generated = await index(cfg.util);

for (let g of generated) {
  console.log(g.distFile);
}






// Deno.test("blog-index", function () {
//   //throw new Error('test3 failed');
// });

