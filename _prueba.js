//import redaxios from 'https://cdn.skypack.dev/redaxios';

try {
let data = await (fetch('https://api.lyrics.ovh/v1/Pink Floyd/Time').then(r=>r.json()));


console.log(data)
} catch (e) {
  console.log('error', e);
}

;
