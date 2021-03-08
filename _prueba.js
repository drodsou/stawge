import {httpLiveServerStart, httpLiveServerReload} from '../denolib/ts/http_live_server/mod.js'

setInterval(()=>{
  console.log('-- recarjando');
  httpLiveServerReload("recarjando!");
},2000);
await httpLiveServerStart({path:'dist', spa:false});
