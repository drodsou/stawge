export default async function(util) {
  const layout = await util.importPart('layouts/main.js');
  return layout({
    title: util.mdTitle(bodymd),
    body : util.marked(bodymd)
  });
}

// --
var myDate = '20210101';  // await fetch from somewhere
var bodymd = /*md*/`

# about

From markdown on ${myDate}

mamaar a peich de la pradera apetecan fistro fistro por la gloria de mi madre. Hasta luego Lucas sexuarl va usté muy cargadoo hasta luego Lucas mamaar ese pedazo de. Fistro papaar papaar fistro condemor al ataquerl me cago en tus muelas ese que llega tiene musho peligro fistro fistro de la pradera. A peich diodenoo hasta luego Lucas mamaar apetecan diodeno.
    
`;
