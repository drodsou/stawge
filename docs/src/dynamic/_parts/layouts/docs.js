
// const __dirname = new URL('.', import.meta.url).pathname;
// const layoutMain = await import(`file://${__dirname}/main.js?${Math.random()}`);

export default function (props) {
  return /*html*/`

<!DOCTYPE html>
<html theme="light" lang="${props.lang||'en'}">
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
      <button>theme</button>
      <ul class="menu-vertical">
        ${mItem('one', '/docs/one')}

        ${mItem('two', [
          ['two-a', '/docs/two/a'],
          ['two-b', '/docs/two/b'],
        ])}

        ${mItem('three', [
          ['three-a', '/docs/three/a'],
          ['three-b', '/docs/three/b'],
        ])}

        ${mItem('four', '/docs/four')}
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
        //document.querySelectorAll(".menu-vertical-nested").forEach(e=>e.classList.remove("open"));
        if (!wasOpen) e.target.parentElement.classList.add("open");
      }
    });

    let currentPage = window.location.pathname.replace(/\\/(index.html)*$/,'');
    let currentMenuSelector = 'a[href$="' + currentPage + '"]'
    let currentMenu = document.querySelector(currentMenuSelector).parentElement;
    currentMenu.classList.add("current");
    
    let h2Elements = [...document.querySelectorAll("h2")];
    let h2Links = '';
    h2Links += '<ul class="sections">';
    h2Links += h2Elements
      .map(h2=>'<li><a href="#'+ h2.id +'">'+ h2.innerText +'</a></li>')
      .join('');
    h2Links += '</ul>';
    currentMenu.innerHTML += h2Links

    // TODO: dark / light theme

    currentMenuContainer = currentMenu.parentElement.parentElement;
    if (currentMenuContainer.classList.contains("menu-vertical-nested")) {
      currentMenuContainer.classList.add("open");
      currentMenuContainer.classList.add("current");
    }

    // --theme
    document.querySelector("nav button").addEventListener("click",()=>{
      let e = document.querySelector("html")
      if (e.getAttribute("theme") === "dark") {
        e.setAttribute("theme","light")
      } else {
        e.setAttribute("theme","dark")
      }
    })

  </script>
</body>
</html>

  `;
}

function mItem(text,dest){
  if (typeof dest === "string") {
    return `
      <li>
        <span class="caret"><i>&nbsp;</i></span><a href="${dest}">${text}</a>
      </li>`
  } else {
    return `
      <li class="menu-vertical-nested">
        <span class="caret"><i>►</i></span><span class="text">${text}</span>
        <ul>
        ${dest.map(d=>mItem(d[0],d[1])).join('\n')}
        </ul>
      </li>
    `;
  }

}
