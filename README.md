# broccoli-symbolizer

[![Build Status](https://travis-ci.org/ivanvotti/broccoli-symbolizer.svg?branch=master)](https://travis-ci.org/ivanvotti/broccoli-symbolizer)
[![Greenkeeper badge](https://badges.greenkeeper.io/ivanvotti/broccoli-symbolizer.svg)](https://greenkeeper.io/)

Broccoli plugin to combine SVG files into one as symbol elements.

It's related to [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore) and [gulp-svgstore](https://github.com/w0rm/gulp-svgstore).

## Installation

`npm install --save-dev broccoli-symbolizer`

## Usage

```js
var Symbolizer = require('broccoli-symbolizer');
var outputNode = new Symbolizer(inputNode, {
  outputFile: '/assets/symbols.svg',
  prefix: 'icon-',
  svgAttrs: { xmlns: 'http://www.w3.org/2000/svg' }
});
```

The output file content could be:

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-person" viewBox="0 0 16 16">
    <title>Person icon</title>
    <path d=""/>
  </symbol>
  <symbol id="icon-mobile" viewBox="0 0 24 24"><path d=""/></symbol>
</svg>
```

## Options

### outputFile

Type: `String`  
This option is **required**.

A path to the resulting SVG file that will content symbol elements.

### prefix

Type: `String`  
Default: `''`

A string that is used to prefix each symbol ID.

### svgAttrs

An object that is used to generate attributes for the resulting SVG file.

Type: `Object`  
Default:

```js
  {
    style: 'position: absolute; width: 0; height: 0;',
    width: '0',
    height: '0',
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink'
  }
```

will result in:

```svg
<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
[...]
```

### stripPath

Type: `Boolean`  
Default: `true`

Remove filepaths from symbol IDs.

### idGen

Type: `Function`  
Default: ``(path, { prefix }) => `${prefix}${path}`.replace(/[\s]/g, '-')``

This option accepts a function which takes a relative SVG filepath and a symbol ID prefix. It returns a string which will be used as a symbol ID.

### persist

Type: `Boolean`  
Default: `true`

Enable\disable a persistent cache to improve build performance across restarts. Check out [broccoli-persistent-filter](https://github.com/stefanpenner/broccoli-persistent-filter) for more details.

## Running Tests

```
npm install
npm test
```

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
