import layoutMain from '../_parts/layouts/main.js';
import layoutPost from '../_parts/layouts/post.js';
import marked from 'https://unpkg.com/marked@1.0.0/lib/marked.esm.js'
import mdParts from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/markdown/md_parts.ts'


export default function(util) {
  const ret = []
  
  // -- add md pages
  const blogSrcDir = util.srcDir + '/dynamic/blog';
  const blogDistDir = util.distDir + '/blog';
  for (const dirEntry of Deno.readDirSync(blogSrcDir + '/_posts')) {
    const [date, slug] = dirEntry.name.split('.');
    const parts = mdParts(Deno.readTextFileSync(blogSrcDir + '/_posts/' + dirEntry.name));

    ret.push({
      distFile: blogDistDir + '/' + slug + '/index.html',
      url: `${slug}`,
      title: parts.frontmatter.title,
      date: date,
      content: layoutPost({
        title: parts.frontmatter.title,
        body: marked(parts.content)
      })
    })
  }

  // -- add index
  ret.push({
    distFile: blogDistDir + '/index.html',
    url: '',
    title: 'Blog index',
    content: layoutMain({
      title: 'Blog index',
      body: `
        <ul>
          ${ret.map(r=>`
            <li><a href="./${r.url}">${r.title}</a></li>
          `).join('\n')}
        </ul>
      `
    })
  })

  return ret;
}


