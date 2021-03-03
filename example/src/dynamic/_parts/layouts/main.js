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
  <nav></nav>
  ${props.body||''}
</body>
</html>

  `;
}