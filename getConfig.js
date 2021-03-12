import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {red as colorRed, green as colorGreen} from 'https://deno.land/std/fmt/colors.ts';
import marked from 'https://unpkg.com/marked@1.0.0/lib/marked.esm.js';
import mdParts from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/markdown/md_parts.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';
import VERSION from './version.js';

export default async function getConfig() {
  const userConfig = await getUserConfig();
  const cfg = {}
  cfg.version = VERSION;
  cfg.rootDir = slashJoin( Deno.cwd() );
  cfg.srcDir = cfg.rootDir + '/src';
  cfg.srcstaticDirRel = '/src/static';
  cfg.srcstaticDir = cfg.rootDir + cfg.srcstaticDirRel;
  cfg.srcdynDirRel = '/src/dynamic';
  cfg.srcdynDir = cfg.rootDir + cfg.srcdynDirRel;
  cfg.distDirRel = userConfig.dist || '/dist';
  cfg.distDir = cfg.rootDir + cfg.distDirRel;
  cfg.port = 8010;
  cfg.changedEvts = [];
  cfg.util = createUtil(cfg);

  return cfg;
}

/**/
function createUtil (cfg) {
  return {
    rootDir: cfg.rootDir, distDir:cfg.distDir, srcDir:cfg.srcDir, srcDynamicDir: cfg.srcdynDir,
    importPart : async (part)=>{
      return (await import('file://' 
        + cfg.srcdynDir + '/_parts/' 
        + part + '?' + Math.random()
      )).default;
    },
    generateFile: (distFile, content) =>{
      const distPath = distFile.split('/').slice(0,-1).join('/');
      ensureDirSync(distPath);
      console.log(colorGreen(`• Generating ${distFile}`));
      Deno.writeTextFileSync(distFile, content);
    },
    removeFile : (file) => {
      try {
        Deno.removeSync(file);
        console.log(colorGreen(`• Removed: ${file}`));
      } catch (e) {
        console.log(colorRed(`• ERROR: Removing: ${file}`));
      }
    },
    marked: marked,
    mdTitle: (md)=>md.trim().match(/\# (.*)/)[1],
    mdParts: mdParts
  }
}


async function getUserConfig() {

  const rootDir = slashJoin( Deno.cwd() );

  // -- import user config if exists
  let userConfig = {};
  try {
    userConfig = (await import('file://' + rootDir + '/stawgeConfig.js')).default;
    // const userConfigFn = (await import('file://' + rootDir + '/stawgeConfig.js')).default;
    // userConfig = await userConfigFn();
    console.log(colorGreen(`• Using ${rootDir + '/stawgeConfig.js'}`));
  } catch (e) { 
    console.log(`• INFO: No stawgeConfig.js found, using defaults`);
  }

  // verify config
  if (userConfig.dist) {
    console.log(`• INFO: Setting 'dist' dir to '${userConfig.dist}'`);
    userConfig.dist =  slashJoin(userConfig.dist);
    if (!userConfig.dist.startsWith('/'))
      userConfig.dist = '/' + userConfig.dist;
  }

  // console.dir(userConfig);
  // Deno.exit(0)

  return userConfig;
}