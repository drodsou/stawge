
export default async function(util) {
  const layout = await util.importPart('layouts/main.js');
  const distBlogDir = `${util.distDir}/blog`;
  
  const posts = [...Deno.readDirSync(distBlogDir)]
    .filter(d=>d.isDirectory)
    .map(d=>{
      let htmlPath = `${distBlogDir}/${d.name}/index.html`;
      let title = Deno.readTextFileSync(htmlPath)
        .match(/<title>([^<]*)/)[1];
      return {slug:d.name, title};
    });

  return layout({
    title: 'blog',
    body : body(posts)
  })
}


var body = (posts)=>/*html*/`

<h1> blog </h1>
<ul class="blog-list">
  ${posts.map(p=>`
    <li><a href="/blog/${p.slug}">${p.title}</a></li>
  `).join('\n')}
</ul>

`;

