import marked from 'https://unpkg.com/marked@1.0.0/lib/marked.esm.js'
import mdParts from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/markdown/md_parts.ts'

export default async function(util, changedEvt) {
  const blogSrcDir = util.srcDynamicDir + '/blog';
  const blogDistDir = util.distDir + '/blog';
  const ret = []

  // -- manage incremental removed pages
  if (changedEvt.kind === 'remove') {
    let removedSlug = changedEvt.path.replace(blogSrcDir,'').split('.')[1];
    util.remove
    ret.push({distFile: `${blogDistDir}/${removedSlug}/index.html`, content: ''});
  }

  // -- build all md pages
  const layoutMain = await util.importPart('layouts/main.js');
  const layoutPost = await util.importPart('layouts/post.js');  

  for (const dirEntry of Deno.readDirSync( blogSrcDir + '/_posts')) {
    if (!dirEntry.name.endsWith('.md')) { continue; }
    const [date, slug] = dirEntry.name.split('.');
    const parts = mdParts(Deno.readTextFileSync(blogSrcDir + '/_posts/' + dirEntry.name));

    ret.push({
      distFile: blogDistDir + '/' + slug + '/index.html',
      content: layoutPost({
        title: parts.frontmatter.title,
        body: marked(parts.content)
      }),
      title: parts.frontmatter.title,
      date: date,
      url: `${slug}`
    })
  }

  // -- add index
  ret.push({
    distFile: blogDistDir + '/index.html',
    content: layoutMain({
      title: 'Blog index',
      body: `
        <h1>Blog index B</h1>
        <ul class="blog-list">
          ${ret.map(r=>`
            <li><a href="./${r.url}">${r.title}</a></li>
          `).join('\n')}
        </ul>
      `
    }),
    url: '',
    title: 'Blog index',
  })

  return ret;
}


