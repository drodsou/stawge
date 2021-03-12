import {pathSort} from './build.js';

let x = ["/a/b", "/z/b/c/d", "/index.html", "/tomates/verdes/fritos"]

console.log(x.sort(pathSort))
