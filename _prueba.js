let a = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/index.css"/>
  <title>abouty</title>

</head>
<body>
  <nav>
    <div class="logo">logo</div>
    <ul class="menu">
      <li><a href="/home">home</a></li>
      <li><a href="/about">about</a></li>
      <li><a href="/blog">blog</a></li>
      <li><a href="/multi">multi</a></li>
    </ul>
  </nav>
  <div class="main-container">
    <h1>abouty</h1>
    <p>generated with md js</p>
<p>Deps jarl va usté muy cargadoo te va a hasé pupitaa mamaar a peich de la pradera apetecan fistro fistro por la gloria de mi madre. Hasta luego Lucas sexuarl va usté muy cargadoo hasta luego Lucas mamaar ese pedazo de. Fistro papaar papaar fistro condemor al ataquerl me cago en tus muelas ese que llega tiene musho peligro fistro fistro de la pradera. A peich diodenoo hasta luego Lucas mamaar apetecan diodeno.</p>

  </div>
</body>
</html>
`

console.log(a.match(/<body>([^]*)<\/body>/))
