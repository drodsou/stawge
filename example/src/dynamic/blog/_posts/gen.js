
var md = (title) =>`
---
title: ${title}
---

# ${title}

Lorem fistrum no te digo trigo por no llamarte Rodrigor llevame al sircoo va usté muy cargadoo fistro ese hombree pupita ese que llega está la cosa muy malar llevame al sircoo a peich. No te digo trigo por no llamarte Rodrigor condemor por la gloria de mi madre sexuarl tiene musho peligro pupita fistro. Ese hombree se calle ustée va usté muy cargadoo mamaar ese que llega mamaar al ataquerl tiene musho peligro tiene musho peligro. De la pradera pupita hasta luego Lucas diodenoo. Te voy a borrar el cerito te voy a borrar el cerito la caidita al ataquerl caballo blanco caballo negroorl de la pradera ahorarr. Ahorarr la caidita torpedo la caidita.

Torpedo tiene musho peligro benemeritaar caballo blanco caballo negroorl pecador va usté muy cargadoo condemor qué dise usteer quietooor. Apetecan te voy a borrar el cerito diodeno me cago en tus muelas se calle ustée quietooor a gramenawer te voy a borrar el cerito pecador. Te voy a borrar el cerito quietooor amatomaa a wan ese hombree a gramenawer por la gloria de mi madre. Ese hombree papaar papaar se calle ustée pupita. La caidita va usté muy cargadoo no te digo trigo por no llamarte Rodrigor fistro hasta luego Lucas te voy a borrar el cerito amatomaa a gramenawer de la pradera. A wan a peich torpedo condemor fistro pecador amatomaa. Sexuarl tiene musho peligro papaar papaar al ataquerl a wan diodeno caballo blanco caballo negroorl condemor jarl. Me cago en tus muelas está la cosa muy malar te va a hasé pupitaa al ataquerl a peich benemeritaar pecador diodeno amatomaa.

Ahorarr diodeno diodenoo a peich. A gramenawer tiene musho peligro te voy a borrar el cerito fistro qué dise usteer fistro amatomaa benemeritaar mamaar. Apetecan qué dise usteer la caidita te va a hasé pupitaa benemeritaar ese hombree te va a hasé pupitaa la caidita. Al ataquerl por la gloria de mi madre ese pedazo de te voy a borrar el cerito está la cosa muy malar diodenoo. Ese pedazo de papaar papaar te voy a borrar el cerito a peich pupita tiene musho peligro llevame al sircoo quietooor. Te va a hasé pupitaa de la pradera papaar papaar amatomaa a wan jarl de la pradera no puedor. Quietooor fistro se calle ustée de la pradera está la cosa muy malar papaar papaar de la pradera tiene musho peligro benemeritaar. Torpedo tiene musho peligro benemeritaar de la pradera benemeritaar pecador. Apetecan tiene musho peligro pupita a peich a gramenawer papaar papaar diodenoo te voy a borrar el cerito la caidita ese hombree caballo blanco caballo negroorl.
`;

console.log(typeof(md))
for (let n=0; n<10; n++) {
  let title = 'post' + n;
  Deno.writeTextFileSync(`${Deno.cwd()}/${title}.md`, md(title) )
}