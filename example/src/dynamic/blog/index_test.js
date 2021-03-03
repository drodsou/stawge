import index from './index.js';

Deno.test("blog-index", function () {
  //throw new Error('test3 failed');
  console.log(JSON.stringify(index(),null,2));
});

