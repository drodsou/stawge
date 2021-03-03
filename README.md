# todo
- single exec (damn no user imports...)
- more interesting example
- stawge init
- move to github drodsou/stawge and stawge to stawge-mega

maybe
- incremental (check dependencies against allGenerated?)
- less verbose build watch
- stream generate, allGenerated in memory without content?
- auto clean dist dir? danger!
- auto generate .md ?


# docs

## done
- watch build

## basic use
- stawge init
- stawge 
- stage build

## concept
.js files export default an async function, 
that can return or a string or [{file, content},...]

that function receives parameter {util}

## change /dist dir
optionally change dist dir in stawgeConfig.js
```js
export default {
  dist : 'build/cntg'
}
```

## change base url in live server
if using VSCode Live Server Extension, change the base url of the http server in `.vscode/settings.json` so you dirs folder is `/` in the url for example:
```json
{
  "liveServer.settings.root" : "/dist",
  "deno.enable": true,
  "deno.lint": true,
  "search.exclude": {
    "**/.git": true,
  },
}

If you are using liveserver from npm just start it in the folder you want to be `/`
