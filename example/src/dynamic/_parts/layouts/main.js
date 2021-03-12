export default function (props) {
  return /*html*/`

<!DOCTYPE html>
<html lang="${props.lang||'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/index.css"/>
  <title>${props.title||'Document'}</title>
  ${props.head||''}
</head>
<body>
  <nav> 
    <div class="logo">logo</div>
    <ul class="menu">
      <li><a href="/home">home</a></li>
      <li><a href="/blog">blog</a></li>
      <li><a href="/multi">multi</a></li>
    </ul>
  </nav>
  <div class="main-container">
    ${props.body||''}
  </div>
</body>
</html>

  `;
}