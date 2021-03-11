import {slashJoin} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/mod.ts';
import {red as colorRed, green as colorGreen} from 'https://deno.land/std/fmt/colors.ts';
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

  return cfg;
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