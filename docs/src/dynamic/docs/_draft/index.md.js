
export default function(util) {
  // const layout = await util.importPart('layouts/main.js');
  const distBlogDir = `${util.distDir}/blog`;
  
  const posts = [...Deno.readDirSync(distBlogDir)]
    .filter(d=>d.isDirectory)
    .map(d=>{
      const htmlPath = `${distBlogDir}/${d.name}/index.html`;
      const title = Deno.readTextFileSync(htmlPath)
        .match(/<title>([^<]*)/)[1];
      return {slug:d.name, title};
    });

  // return layout({
  //   title: 'blog',
  //   body : body(posts)
  // })

    const postsLIs = posts.map(p=>`
      <li><a href="/blog/${p.slug}">${p.title}</a></li>
    `).join('\n')

    return `
      ---
      title: blog list
      ---

      <ul class="blog-list">
        ${postsLIs}
      </ul>
    `;

}


var body = (posts)=>/*html*/`
---
title: blog list
---



`;

