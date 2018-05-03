'use strict';

const path = require('path');
const crypto = require('crypto');
const _ = require('lodash');
const PersistentFilter = require('broccoli-persistent-filter');
const stringify = require('json-stable-stringify');
const cheerio = require('cheerio');
const formatAttrs = require('./format-attrs');

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function stringifyFunction(fn) {
  return _.isFunction(fn) ? String(fn) : fn;
}

function createOptionsHash(options) {
  let optionsString = stringify(_.mapValues(options, stringifyFunction));

  return crypto.createHash('md5')
    .update(optionsString, 'utf8')
    .digest('hex');
}

class SymbolFilter extends PersistentFilter {
  constructor(inputNode, options) {
    options = options || {};

    super(inputNode, {
      name: 'SymbolFilter',
      extensions: ['svg'],
      targetExtension: 'svg',
      persist: _.isUndefined(options.persist) ? true : options.persist,
      async: options.async,
      annotation: options.annotation
    });

    this.optionsHash = createOptionsHash(options);
    this.options = options;
  }

  processString(svgContent, filePath) {
    let $svgWrapper = cheerio.load(svgContent, { xmlMode: true });
    let $svg = $svgWrapper('svg');

    let { idGen, stripPath, prefix } = this.options;
    let idGenPath = stripPath ? path.basename(filePath) : filePath;
    let symbolId = idGen(stripExtension(idGenPath), { prefix });
    let symbolAttrs = {
      id: symbolId,
      viewBox: $svg.attr('viewBox')
    };
    let symbolContent = `<symbol ${formatAttrs(symbolAttrs)}></symbol>`;
    let $symbolWrapper = cheerio.load(symbolContent, { xmlMode: true });
    let $symbol = $symbolWrapper('symbol');

    $symbol.html($svg.html());
    return $symbolWrapper.html();
  }

  cacheKeyProcessString(string, relativePath) {
    return super.cacheKeyProcessString(`${string}${this.optionsHash}`, relativePath);
  }

  baseDir() {
    return __dirname;
  }
}

module.exports = SymbolFilter;
