# node-sass-importer

Creates an importer function for [node-sass](https://github.com/sass/node-sass) with no-hassle exception handling.

This is just a try/catch wrapper to provide a user-friendly fix for https://github.com/sass/node-sass/issues/1048 that works for both `render` and `renderSync` methods.

From https://github.com/sass/node-sass/issues/1048#issuecomment-130451079:
>So, during the next rewrite of the binding code this will be taken into account. For now there is no easy solution (except for `process.kill`). Sorry for that!

When that issue is fixed, this library will no longer be needed.

## Simpler importer functions

This helpfully allows you to always write sync or async importers regardless of the render method; you would otherwise have to change `return` to `done()` when changing `renderSync` to `render`.

### Example

```js
function mySyncImporter() {
    throw new Error('something bad happened');
}
```

```js
sass.renderSync({
    importer: mySyncImporter
});
```
:+1: process exits with error message

But if we change it to async:
```js
sass.render({
    importer: mySyncImporter
});
```
:-1: error is shown but process hangs because done() is never called

node-sass-importer solves this:
```js
var sassImporter = require('node-sass-importer');
sass.render({
    importer: sassImporter(mySyncImporter)
});
```
:+1: process exits with error message

## Async process hanging

If you are using `sass.renderSync()`, you won't have any problems with exception handling.

If you are using the asynchronous method `sass.render()` and an error is thrown in the importer function before `done()` is called, the node process will hang. See https://github.com/sass/node-sass/issues/1048.

Whilst that issue is unfixed, this library does the simple thing of capturing an exception and correctly ending the async task by calling `done()` with the error so the async process won't be left hanging. node-sass will then end its compilation and log the error.

## Useful for

Some libraries that use node-sass don't yet allow the choice of using `renderSync`. Use node-sass-importer in those cases.

If you know of a library not listed below, or one of them now supports `renderSync` and should be removed from the list, please post an issue.

- [grunt-sass](https://github.com/sindresorhus/grunt-sass)
