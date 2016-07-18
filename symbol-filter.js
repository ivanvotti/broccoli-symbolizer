'use strict';

var path = require('path');
var stringify = require('json-stable-stringify');
var Filter = require('broccoli-persistent-filter');
var cheerio = require('cheerio');
var defaults = require('lodash.defaults');

function defaultIDGen(filePath, options) {
  return options.prefix + path.basename(filePath)
    .replace(/\.[^/.]+$/, '')
    .replace(/[\s]/g, '-');
}

function SymbolFilter(inputNode, _options) {
  var options = _options || {};

  if (!options.hasOwnProperty('persist')) {
    options.persist = true;
  }

  Filter.call(this, inputNode, options);

  this.options = defaults(options, {
    idGen: defaultIDGen
  });
}

SymbolFilter.prototype = Object.create(Filter.prototype);
SymbolFilter.prototype.constructor = SymbolFilter;
SymbolFilter.prototype.extensions = ['svg'];
SymbolFilter.prototype.targetExtension = 'svg';

SymbolFilter.prototype.baseDir = function() {
  return __dirname;
};

SymbolFilter.prototype.processString = function(svgContent, filePath) {
  var $svgWrapper = cheerio.load(svgContent, { xmlMode: true });
  var $svg = $svgWrapper('svg');

  var symbolId = this.options.idGen(filePath, { prefix: this.options.prefix });
  var viewBox = $svg.attr('viewBox');
  var symbolContent = '<symbol id="' + symbolId + '" viewBox="' + viewBox + '"></symbol>';

  var $symbolWrapper = cheerio.load(symbolContent, { xmlMode: true });
  var $symbol = $symbolWrapper('symbol');

  $symbol.html($svg.html());
  return $symbolWrapper.html();
};

SymbolFilter.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    this._optionsHash = stringify(this.options);
  }

  return this._optionsHash;
};

SymbolFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() +
    Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
};

module.exports = SymbolFilter;
