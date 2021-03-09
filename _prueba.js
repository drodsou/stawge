

console.log(
  Deno.statSync('c:/tmp').isFile === false ? 'dir' :'file'
);