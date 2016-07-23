const _ = require('lodash');
const Concat = require('broccoli-concat');
const SymbolFilter = require('./symbol-filter');
const makeSVGTag = require('./make-svg-tag');

module.exports = function(inputNode, options = {}) {
  if (!options.outputFile) {
    throw new Error('outputFile is required');
  }

  let config = _.defaults(options, {
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

  let symbolsNode = new SymbolFilter(inputNode, {
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
