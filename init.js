import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {runCmd} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/run_cmd/mod.ts';
import {copyDirSyncFilter} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/copy_dir_sync_filter/mod.ts';

/** creates default structure */
export default async function init() {
  
  if ([...Deno.readDirSync(Deno.cwd())].length !== 0) {
    console.log(`\nERROR: Current directory must be empty before executing "stawge init"`)
    Deno.exit(1);
  }

  const tmpDir = Deno.makeTempDirSync({prefix: 'stawge'});
  
  console.log('downloading template');
  const zip = await fetch('https://raw.githubusercontent.com/drodsou/stawge/main/example.zip?' + Math.random());
  const zipBuffer = await zip.arrayBuffer();
  const destFile = slashJoin(tmpDir, '/stawge-example.zip');
  Deno.writeFileSync(destFile, new Uint8Array(zipBuffer) );
    
  console.log('uncompressing');
  let unzipResult;
  if (Deno.env.get('WINDIR')) {
    unzipResult = await runCmd (`powershell expand-archive ${destFile} ${tmpDir}`)
  } else {
    unzipResult = await runCmd (`unzip ${destFile} -d ${tmpDir}`)
  }
  if (!unzipResult.success) {
    console.log('\nERROR unzipping:', unzipResult.output)
    Deno.exit(1);
  }

  console.log('copying from', tmpDir );
  // copyDirSyncFilter(slashJoin(tmpDir, '/stawge-master/default'), Deno.cwd());
  copyDirSyncFilter(slashJoin(tmpDir, '/example'), Deno.cwd());

  console.log('cleaning tmp');
  Deno.removeSync(tmpDir, { recursive: true });

  console.log(`Ready, now: 
  - Open vscode (code .)  -make sure to have deno extension, and live server extension
  - Open vscode console and type "stawge" to build /dist (and watch)
  - Right click open with live server dist/index.html
  `);
 
}