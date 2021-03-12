
export default async function(util, changedEvt) {
  const mySrcDir = util.srcDynamicDir + '/multi';
  const myDistDir = util.distDir + '/multi';
  
  function fakeDataFetch() {
    return new Promise(resolve=>{
      setTimeout(()=>{
        resolve(JSON.parse(Deno.readTextFileSync(mySrcDir + '/_data/data.json')));
      }, 500);
    })
  };

  // // -- manage incremental removed pages
  // if (changedEvt.kind === 'remove') {
  //   let removedSlug = changedEvt.path.replace(blogSrcDir,'').split('.')[1];
  //   util.remove
  //   ret.push({distFile: `${blogDistDir}/${removedSlug}/index.html`, content: ''});
  // }

  // -- build all md pages
  const layout = await util.importPart('layouts/main.js');

  let data = await fakeDataFetch();

  for (const entry of data) {
    let content = layout({
      title: entry.title,
      body: entry.body
    });
    util.generateFile(`${myDistDir}/${entry.title}.html`,content);
  }
  // -- add index
  return layout({
    title: 'Multi index',
    body: `
      <h1>Multi index B</h1>
      <ul class="blog-list">
        ${data.map(d=>`
          <li><a href="/multi/${d.title}.html">${d.title}</a></li>
        `).join('\n')}
      </ul>
    `
  })
}


