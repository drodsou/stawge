
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
    
    currentMenu.innerHTML += "<b>penacho</b>" // TODO list of ##

    // TODO: dark / light theme

    currentMenuContainer = currentMenu.parentElement.parentElement;
    if (currentMenuContainer.classList.contains("menu-vertical-nested")) {
      currentMenuContainer.classList.add("open");
      currentMenuContainer.classList.add("current");
    }



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
