
// const __dirname = new URL('.', import.meta.url).pathname;
// const layoutMain = await import(`file://${__dirname}/main.js?${Math.random()}`);

export default function (props) {
  return /*html*/`

<!DOCTYPE html>
<html lang="${props.lang||'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/assets/index.css"/>
  <title>${props.title||'Document'}</title>
  ${props.head||''}
</head>
<body>
  <div class="container">
    <nav class="nav-left"> 
      <ul class="menu-vertical">
        ${mItem('one', '/one')}

        ${mItem('two', [
          ['two-a', '/two/a'],
          ['two-b', '/two/b'],
        ])}

        ${mItem('three', [
          ['three-a', '/three/a'],
          ['three-b', '/three/b'],
        ])}

        ${mItem('four', '/four')}
      </ul>
    </nav>
    <main>
      <h1>${props.title}</h1>
      ${props.body||''}
    </main>
  </div>

  <script>
    document.querySelector(".menu-vertical").addEventListener('click',e=>{
      if (e.target.localName === "span") {
        let wasOpen = e.target.parentElement.classList.contains("open");
        document.querySelectorAll(".menu-vertical-nested").forEach(e=>e.classList.remove("open"));
        if (!wasOpen) e.target.parentElement.classList.add("open");
      }
    });

  </script>
</body>
</html>

  `;
}

function mItem(text,dest){
  if (typeof dest === "string") {
    return `<li><a href="${dest}">${text}</a></li>`
  } else {
    return `
      <li class="menu-vertical-nested"><span class="text">${text}</span><span class="caret">►<span>
        <ul>
        ${dest.map(d=>mItem(d[0],d[1])).join('\n')}
        </ul>
      </li>
    `;
  }

}
