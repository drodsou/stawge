import {walkSync} from 'https://deno.land/std/fs/walk.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';
import * as path from "https://deno.land/std@0.89.0/path/mod.ts";

import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';
import {red as colorRed, green as colorGreen, yellow as colorYellow} from 'https://deno.land/std/fmt/colors.ts';

/**
 * Build: copies 'src/static' to 'dist' and generates from 'src/dynamic' into 'dist'
*/
export default async function build(cfg) {
  const timeStart = Date.now();  

  // -- full build
  if ( cfg.changedEvts.length === 0 
    || cfg.changedEvts.some(ev=>ev.path.includes(`${cfg.srcdynDir}/_parts`)) 
  ) {
    copyStaticFiles(cfg, getAllStaticFiles(cfg));
    await buildDynamicFiles(cfg, getAllDynamicFiles(cfg));
    buildDone(timeStart);
    return true;
  }

  // -- incremental build
  let built = false;
  for (const changedEvt of cfg.changedEvts) {
    const changedCase = getChangedCase(changedEvt);
    const srcType = getSrcType(cfg, changedEvt.path);
    
    console.log('*** ',srcType, changedCase, changedEvt.path);

    if (changedCase === 'create') { continue; }
    if (srcType === 'ignored') { continue; }
    
    if (srcType === 'static' && changedCase === 'modify') {
      copyStaticFiles(cfg, [changedEvt.path]);
      built = true;
      continue;
    }
    if (srcType === 'static' && changedCase === 'remove' ) {
      const fileToRemove = changedEvt.path.replace(cfg.srcstaticDir, cfg.distDir);
      cfg.util.removeFile(fileToRemove);
      built = true;
      continue;
    }

    if (srcType === 'dynSimple' && changedCase === 'modify') {
      await buildDynamicFiles(cfg, [changedEvt.path]);
      built = true;
      continue;
    }

    if (srcType === 'dynSimple' && changedCase === 'remove') {
      const fileToRemove = getDynDistFile(cfg, changedEvt.path)
      cfg.util.removeFile(fileToRemove);
      built = true;
      continue;
    }

    // TODO: keep this or remove it?
    if (srcType === 'dynData' && (changedCase === 'modify' || changedCase === 'remove')) {
      const dataBuilder = getDataBuilder(changedEvt.path);
      await buildDynamicFiles(cfg, [dataBuilder], {path: changedEvt.path, kind: changedCase} );
      built = true;
      continue;
    }

  }
  if (built) { buildDone(timeStart); }
  return built;
}



// ------------------------ HELPERS

// -- BUILD DYNAMIC
export async function buildDynamicFiles (cfg, dynFiles, changedEvt)  {  

  for (const dynFile of dynFiles) {
    const srcPath = dynFile.split('/').slice(0,-1).join('/');
    let dynFunc
    try {
      dynFunc = (await import('file://' + dynFile + '?' + Math.random())).default;
      if (typeof(dynFunc) !== 'function') 
        throw new Error(`File must 'export default' a function`);

      // -- call .js/.ts file builder function
      let srcRes = await dynFunc(cfg.util, changedEvt );
      cfg.util.generateFile(getDynDistFile(cfg, dynFile), srcRes);        

    } catch (e) {
      console.log(colorRed(`ERROR: Processing file: ${dynFile}\n${e}`));
      console.log(colorRed(e.stack.split('\n')
        .filter(l=>l.includes(cfg.srcdynDir))
        .map(l=>l.replace(/\?[^:]*/,''))
        .join('\n')
      ));
      // Deno.exit(1)
      return;
    }



  } // each dynFiles
}

function getDynDistFile (cfg, dynFile) {
  return dynFile
    .replace(cfg.srcdynDirRel, cfg.distDirRel)
    .replace(/\.(js|ts)/,'')
    .replace(/\(.*\)/,'');
}


export function buildDone (timeStart) {
  console.log(`--- build done in ${Date.now() - timeStart}ms`);
}

export function getAllStaticFiles (cfg) {
  try {
    const staticFiles = [...walkSync(cfg.srcstaticDir,{} )]
      .filter(e=>e.isFile)
      .map(e=> slashJoin( e.path));
    return staticFiles;
  } catch (e) {
    console.log(colorRed(`ERROR: Processing directory: ${cfg.srcstaticDir}`));
    Deno.exit(1)
  }
}


export function copyStaticFiles (cfg, staticFiles) {
  for (const staticFile of staticFiles) {
    const distFile = staticFile.replace(cfg.srcstaticDir, cfg.distDir);
    try {
      ensureDirSync(path.dirname(distFile));
      Deno.copyFileSync(staticFile, distFile);
      console.log(colorGreen(`• Copying static: ${distFile}`));
    } catch (e) {
      console.log(colorRed(`• ERROR copying static: ${distFile}`))
      return;
    }
  }
}

export function pathSort (a,b) {
  // -- "/a/b/c/d"  => "05d"
  const sortConv = str => str.split('/').length.toString().padStart(2,"0") 
    + str.split('/').slice(-1);

  return sortConv(a) > sortConv(b) ? -1 : 1;
}

export function getAllDynamicFiles (cfg) {
  try {
    // all /dynamic .js|.ts files not in a path with '_' 
    // sorted from deeper path to shallower, so summary pages are processed last
    const dynFiles = [...walkSync(cfg.srcdynDir,{ exts:['js','ts']} )]
      .map(e=> slashJoin( e.path))
      .filter(page=>!(page.replace(cfg.rootDir,'')).includes('_'))
      .sort(pathSort);
    return dynFiles;
  } catch (e) {
    console.log(colorRed(`ERROR: Processing directory: ${cfg.srcdynDir}`));
    Deno.exit(1)
  }
}


// -- incremental helpers

/**
 */
 export function getChangedCase (changedEvt) {
  try {
    Deno.statSync(changedEvt.path);
    if (changedEvt.kind === 'create') { return 'create'}
    return 'modify';
  } catch (e) {
    return 'remove';
  }
}

export function getSrcType (cfg, file) {
  if (!path.basename(file).includes('.')) {
    return 'ignored';
  }
  if (file.includes(cfg.srcstaticDir)) { return 'static'; }

  const relFile = file.replace(cfg.rootDir);
  if (path.basename(relFile).includes('_')) { 
    // eg xx_test.js
    return 'ignored'; 
  }

  if (relFile.includes('_') 
    && path.basename(relFile).match(/\.(ts|js)$/)) { 
      // .js/.ts file inside _data foldder
      return 'ignored'; 
  }

  if (relFile.includes('_')) { return 'dynData'; }

  if (path.basename(relFile).match(/\..*\.(ts|js)$/)) {
    return 'dynSimple'
  }

  if (path.basename(relFile).match(/\.(ts|js)$/)) {
    return 'ignored';  // old multi-generator
  }
  
  return 'ignored';
}

export function getDataBuilder (filePath) {
  const parentBuilderDir = (filePath.replace(/_[^_]*$/,''));
  const parentBuilder = [...Deno.readDirSync(parentBuilderDir)]
    .filter(
      d=>d.isFile 
      && d.name.match(/\.(js|ts)$/) 
      && !d.name.match(/_test/)
    )[0].name;
  return parentBuilderDir + parentBuilder;
}
