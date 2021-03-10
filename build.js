import {walkSync} from 'https://deno.land/std/fs/walk.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';
import * as path from "https://deno.land/std@0.89.0/path/mod.ts";

import {copyDirSyncFilter} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/copy_dir_sync_filter/mod.ts';
import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';
import {red as colorRed, green as colorGreen, yellow as colorYellow} from 'https://deno.land/std/fmt/colors.ts';

/**
 * Build: copies 'src/static' to 'dist' and generates from 'src/dynamic' into 'dist'
*/
export default function build(cfg) {
  const timeStart = Date.now();  

  // -- full build
  if (cfg.changedFiles.length === 0) {
    copyStaticFiles(getAllStaticFiles());
    buildDynamicFiles(getAllDynamicFiles());
    buildDone(timeStart);
    return;
  }

  // -- incremental build
  for (const changedFile of cfg.changedFiles) {
    const chCase = changedCase(changedFile);
    if (chCase = 'remove') {

    }



  }



  
  

  // -- STATIC COPY
  if (changedFile ) {
    // -- incremental copy
    if (changedFile.path.includes(cfg.srcstaticDir)) {
      const distFile = changedFile.path.replace(cfg.srcstaticDir, cfg.distDir);

      if (changedFile.kind === 'remove') {
        // -- remove static file in dist
        try {
          Deno.removeSync(distFile);
          console.log(colorGreen(`• Removed: ${distFile}`));
        } catch (e) {
          console.log(colorRed(`• ERROR: Removing: ${distFile}`));
        }
      }
      else {
        // -- copy changed static file to dist
        try {
          ensureDirSync(path.dirname(distFile));
          Deno.copyFileSync(changedFile.path, distFile);
          console.log(colorGreen(`• Copying incremental: ${distFile}`));
        } catch (e) {
          console.log(colorRed(`• ERROR copying incremental: ${distFile}`))
          return;
        }
      }
    }
  } else {
    action.copyAllStaticToDist();
  }


  // -- DYNAMIC BUILD: GET SRC FILES

  const inDataFolder = (file )=> file.replace(cfg.rootDir,'').includes('/_');
  let dynFiles = []
  if (changedFile) {
    // -- incremental build
    if (changedFile.path.includes(cfg.srcdynDir) 
      && !changedFile.path.includes('_test')
    ) {
      // -- changed file is dynamic file
      if (!inDataFolder(changedFile.path)) {
        // -- and it is a builder file (js/ts)
        if (changedFile.kind === 'remove') {
          // -- that has been deleted
          if (changedFile.path.match(/\..*\..*$/)) {
            // -- and emits single file: delete dist file
            const distFile = changedFile.path
              .replace(cfg.srcdynDir, cfg.distDir)
              .replace(/(.js|.ts)$/,'');
            try {
              Deno.removeSync(distFile);
              console.log(colorGreen(`• Removed: ${distFile}`));
            } catch (e) {
              console.log(colorRed(`• ERROR: Removing: ${distFile}`));
            }
            dynFiles = [];
          } else {
            // -- and emits unknown files: manual delete required
            console.log(colorYellow(`• WARNING: deleted source file ${changedFile.path} generated unknown files in ${cfg.distDir}. You must remove former results there manually or perform a full build (stawge build)`));
            dynFiles = [];
          }
        } else {
          // -- that changed
          dynFiles = [changedFile.path]
        }
      } else {
        // -- and it is data file, need to find its builder file
        const parentBuilderFolder = (changedFile.path.replace(/_[^_]*$/,''));
        const parentBuilder = [...Deno.readDirSync(parentBuilderFolder)]
          .filter(
            d=>d.isFile 
            && d.name.match(/(js|ts)$/) 
            && !d.name.match(/_test/)
          )[0].name;
        dynFiles = [parentBuilderFolder + parentBuilder];
      }
    } else {
      // -- changed file is not dynamic file
      dynFiles = []
    }
  } else {
    action.getAllDynamicFiles()
  }


  // -- DYNAMIC BUILD: BUILD SRC FILES

  // TODO: ordenar con index al final


  if (!changedFile) {
    //TODO: generate search.json from generated and copied html files
  }

  console.log(`--- build done in ${Date.now() - timeStart}ms`);
  // console.log(allGenerated.map(a=>a.file));

} // build main function



// ------------------------ HELPERS

function buildDone (timeStart) {
  console.log(`--- build done in ${Date.now() - timeStart}ms`);
}

function getAllStaticFiles (cfg) {
  try {
    const staticFiles = [...walkSync(cfg.srcstaticDir,{} )]
      .map(e=> slashJoin( e.path))
    return staticFiles;
  } catch (e) {
    console.log(colorRed(`ERROR: Processing directory: ${cfg.srcstaticDir}`));
    Deno.exit(1)
  }
}


function copyStaticFiles (cfg, staticFiles) {
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


function getAllDynamicFiles (cfg) {
  try {
    const dynFiles = [...walkSync(cfg.srcdynDir,{ exts:['js','ts']} )]
      .map(e=> slashJoin( e.path))
      .filter(page=>!(page.replace(cfg.rootDir,'')).includes('_'));
    return dynFiles;
  } catch (e) {
    console.log(colorRed(`ERROR: Processing directory: ${cfg.srcdynDir}`));
    Deno.exit(1)
  }
}

// -- BUILD DYNAMIC
function buildDynamicFiles (cfg, dynFiles)  {  
  const util = createUtil(cfg);
  const allGenerated = [];
  for (const dynFile of dynFiles) {
    const srcPath = dynFile.split('/').slice(0,-1).join('/');
    let dynFunc
    try {
      dynFunc = (await import('file://' + dynFile + '?' + Math.random())).default;
      if (typeof(dynFunc) !== 'function') 
        throw new Error(`File must 'export default' a function`);
    } catch (e) {
      console.log(colorRed(`ERROR: Processing file: ${dynFile}\n${e}`));
      // Deno.exit(1)
      return;
    }

    // -- call .js/.ts file generator function
    let srcRes = await dynFunc(util, changedFile);
    if (!Array.isArray(srcRes)) {
      srcRes = [{
        distFile: dynFile.replace(cfg.srcdynDirRel, cfg.distDirRel).replace(/\.(js|ts)/,''), 
        content: srcRes, 
        title: '',
      }]
    }
    
    // -- for each distFile (object) returned by generator funcion
    srcRes.forEach(srcObj=>{
      srcObj.dynFile = dynFile;
      const distFile = srcObj.distFile;
      if (!distFile) {
        console.log(colorRed(unindent(`
          ERROR in src file: ' + ${dynFile} 
          When multiple files are returned by a src file, it must be in this form:
            [
              { 
                distFile: "absolute path to dist file in disk",
                content : "final html of the file",
                title   : not mandatory,
                date    : not mandatory,
                etc...
              },
              ... 
            ]
        `)));
        return;
        // Deno.exit(1);
      }
      if (!distFile.startsWith(cfg.distDir)) {
        console.log(colorRed(unindent(`
          ERROR: Generated file must have absolute path to dist directory ${cfg.distDir}
            Generated file: ' + distFile);
            From src file : ' + dynFile);
        `)));
        return;
        // Deno.exit(1);
      }

      if (allGenerated[distFile]) {
        console.log(colorRed(unindent(`
          ERROR: Dist file is being generated more than once
            Dist file    : ${distFile}
            Generated by : ${dynFile}
          has already been 
            Generated by : ${allGenerated[distFile].dynFile}
        `)));
        return;
        // Deno.exit(1);
      }

      const distPath = distFile.split('/').slice(0,-1).join('/');
      ensureDirSync(distPath);
      console.log(colorGreen(`• Generating ${distFile}`));
      Deno.writeTextFileSync(distFile, srcObj.content);
      allGenerated[distFile] = srcObj;
    }) // each distFile generated by one dynFile
  } // each dynFiles
}

function createUtil (cfg) {
  return {
    rootDir: cfg.rootDir, distDir:cfg.distDir, srcDir:cfg.srcDir,
    importPart : async (part)=>{
      return (await import('file://' 
        + cfg.srcDir + '/dynamic/_parts/' 
        + part + '?' + Math.random()
      )).default;
    }
  }
};

/**
 */
function changedCase (changedFile) {
  if (path.basename(changedFile.path).includes('.')) {
    return 'dir';
  }
  try {
    Deno.stat(changedFile.path);
    if (changedFile.kind === 'create') { return 'create'}
    return 'modify';
  } catch (e) {
    return 'remove';
  }
}

function srcType (cfg, file) {
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
    return 'dynMulti'
  }
  
  return 'ignored';
}


