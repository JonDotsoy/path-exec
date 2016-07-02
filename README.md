# Path-Exec
A simple route control to execute actions.

## How Install
Use [npm][] to install [path-exec][]

```bash
npm install --save path-exec
```

## How Used
Create a paths control, this save a function and is executed when matched with `path.exec()`

```javascript
const PathExec = require('path-exec')

let paths = new PathExec()
```

## `paths.use(pathName, keys, execFunction)`
Write a path match with `paths.use()`

```javascript
paths.use('/say/:name', ['name'], function () {
    // run this function with paths.exec('/say/...'), Ej: /say/jhon, /say/abc, /say/any, ...
})
```

> The `pathName` use [path-to-regexp][]

## `paths.exec()`
Use to match all paths defined with `paths.use`.

```javascript
// paths.use('/say/:name' ...
// paths.use('/say/:name?/role' ...
// paths.use('/say/:name?/setting/:option' ...
paths
.exec('/say/role')
.then(function () {
    // has run '/say/:name?/role'
})
```

### Customize parameters
Defined with path value.

```javascript
// Use
paths
.use('/say/:action', ['action'], function (params, valued, next) {
    console.log(`Is Say ${params.action} with ${valued}`)

    next()
})
```

```javascript
// Execut
paths
.exec('/say/hello', 34)
.then(function () {
    console.log('is ok') // § ~ . ・§
})
```

# Change Logs
Please see the changelog on [CHANGELOG.md][]

# License
Please see the **license MIT** on [LICENSE][]

[npm]: https://www.npmjs.com/
[path-exec]: https://www.npmjs.com/package/path-exec
[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[CHANGELOG.md]: ./CHANGELOG.md
[LICENSE]: ./LICENSE

