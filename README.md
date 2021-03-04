# todo
- rootUrl (add to layout as variable)
- better example
- stawge init

maybe
- auto generate .md ?
- auto clean dist dir? danger!
- incremental (check dependencies against allGenerated?)
- less verbose build watch
- stream generate, allGenerated in memory without content?

# docs

## done
- watch build
- no single exec (damn, no imports from executable...)

## basic use
- stawge init
- stawge 
- stage build

## concept
.js files export default an async function, 
that can return or a string or [{file, content},...]

that function receives parameter {util}

dynamic/_parts must be imported with util.importPart to prevent import caching

## change /dist dir
optionally change dist dir in stawgeConfig.js
```js
export default {
  dist : 'build/cntg'
}
```

## vscode
- es6-string-html
- es6-string-css
- es6-string-markdown
- es6-string-html
- vs color picker (pick coler in string css

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
