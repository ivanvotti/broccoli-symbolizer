'use strict';

var defaults = require('lodash.defaults');
var Concat = require('broccoli-concat');
var SymbolFilter = require('./symbol-filter');
var makeSVGTag = require('./make-svg-tag');

module.exports = function(inputNode, options) {
  if (!options || !options.outputFile) {
    throw new Error('outputFile is required');
  }

  var config = defaults(options || {}, {
    stripPath: true,
    prefix: '',
    persist: true,
    allowNone: true,
    svgAttrs: {
      style: 'position: absolute; width: 0; height: 0;',
      width: '0',
      height: '0',
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    }
  });

  var symbolsNode = new SymbolFilter(inputNode, {
    idGen: config.idGen,
    stripPath: config.stripPath,
    prefix: config.prefix,
    persist: config.persist
  });

  return new Concat(symbolsNode, {
    outputFile: config.outputFile,
    header: makeSVGTag(config.svgAttrs),
    footer: '</svg>',
    allowNone: config.allowNone,
    sourceMapConfig: { enabled: false }
  });
};
