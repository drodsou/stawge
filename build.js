import {walkSync} from 'https://deno.land/std/fs/walk.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';
import * as path from "https://deno.land/std@0.89.0/path/mod.ts";

import {copyDirSyncFilter} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/copy_dir_sync_filter/mod.ts';
import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {unindent} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/unindent/mod.ts';
import {red as colorRed, green as colorGreen} from 'https://deno.land/std/fmt/colors.ts';


/**
 * Build: copies 'src/static' to 'dist' and generates 'src/dynamic' into 'dist'
*/
export default async function build(cfg, changedFile) {
  const timeStart = Date.now();  

  // -- user function passed argument, helpers
  const util = {
    rootDir: cfg.rootDir, distDir:cfg.distDir, srcDir:cfg.srcDir,
    importPart : async (part)=>{
      return (await import('file://' 
        + cfg.srcDir + '/dynamic/_parts/' 
        + part + '?' + Math.random()
      )).default;
    }
  }

  // -- STATIC COPY
  if (changedFile ) {
    // -- incremental copy
    if (changedFile.path.includes(cfg.srcstaticDir)) {
      const distFile = changedFile.path.replace(cfg.srcstaticDir, cfg.distDir);

      if (changedFile.kind === 'remove') {
        try {
          Deno.removeSync(distFile);
          console.log(colorGreen(`• Removed: ${distFile}`));
        } catch (e) {
          console.log(colorRed(`• ERROR: Removing: ${distFile}`));
        }
      }
      else {
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
    // -- full copy
    console.log(colorGreen(`• Copying ${cfg.srcDir + '/static'} to ${cfg.distDir}`));
    copyDirSyncFilter( cfg.srcDir + '/static', cfg.distDir);
  }

  // -- DYNAMIC BUILD
  const inDataFolder = (file )=> file.replace(cfg.rootDir,'').includes('/_');
  let srcFiles = []
  if (changedFile) {
    if (changedFile.path.includes(cfg.srcdynDir) 
      && !changedFile.path.includes('_test')
    ) {
      // -- incremental build
      if (!inDataFolder(changedFile.path)) {
        // builder file
        srcFiles = [changedFile.path]
      } else {
        const parentBuilderFolder = (changedFile.path.replace(/_[^_]*$/,''));
        const parentBuilder = [...Deno.readDirSync(parentBuilderFolder)]
          .filter(
            d=>d.isFile 
            && d.name.match(/(js|ts)$/) 
            && !d.name.match(/_test/)
          )[0].name;
        srcFiles = [parentBuilderFolder + parentBuilder];
      }
    }
  } else {
    // -- full build
    try {
      srcFiles = [...walkSync(cfg.srcdynDir,{ exts:['js','ts']} )]
        .map(e=> slashJoin( e.path))
        .filter(page=>!(page.replace(cfg.rootDir,'')).includes('_'));
    } catch (e) {
      console.log(colorRed(`ERROR: Processing directory: ${cfg.srcdynDir}`));
      Deno.exit(1)
    }
  }

  // TODO: ordenar con index al final
  const allGenerated = [];
  for (const srcFile of srcFiles) {
    const srcPath = srcFile.split('/').slice(0,-1).join('/');
    let srcFunc
    try {
      srcFunc = (await import('file://' + srcFile + '?' + Math.random())).default;
      if (typeof(srcFunc) !== 'function') 
        throw new Error(`File must 'export default' a function`);
    } catch (e) {
      console.log(colorRed(`ERROR: Processing file: ${srcFile}\n${e}`));
      // Deno.exit(1)
      return;
    }
    let srcRes = await srcFunc(util, changedFile);
    if (!Array.isArray(srcRes)) {
      srcRes = [{
        distFile: srcFile.replace(cfg.srcdynDirRel, cfg.distDirRel).replace(/\.(js|ts)/,''), 
        content: srcRes, 
        title: '',
      }]
    }
    
    srcRes.forEach(srcObj=>{
      srcObj.srcFile = srcFile;
      const distFile = srcObj.distFile;
      if (!distFile) {
        console.log(colorRed(unindent(`
          ERROR in src file: ' + ${srcFile} 
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
            From src file : ' + srcFile);
        `)));
        return;
        // Deno.exit(1);
      }

      if (allGenerated[distFile]) {
        console.log(colorRed(unindent(`
          ERROR: Dist file is being generated more than once
            Dist file    : ${distFile}
            Generated by : ${srcFile}
          gas already bn 
            Generated by : ${allGenerated[distFile].srcFile}
        `)));
        return;
        // Deno.exit(1);
    }


      const distPath = distFile.split('/').slice(0,-1).join('/');
      ensureDirSync(distPath);
      console.log(colorGreen(`• Generating ${distFile}`));
      Deno.writeTextFileSync(distFile, srcObj.content);
      allGenerated[distFile] = srcObj;
    })
  }

  console.log(`--- build done in ${Date.now() - timeStart}ms`);
  // console.log(allGenerated.map(a=>a.file));

} // build






