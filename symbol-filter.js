'use strict';

var path = require('path');
var crypto = require('crypto');
var defaults = require('lodash.defaults');
var mapValues = require('lodash.mapvalues');
var Filter = require('broccoli-persistent-filter');
var stringify = require('json-stable-stringify');
var cheerio = require('cheerio');

function trimExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function defaultIDGen(filePath, options) {
  return options.prefix + path.basename(filePath).replace(/[\s]/g, '-');
}

function stringifyFunc(value) {
  return (typeof value === 'function') ? value + '' : value;
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

  var symbolId = this.options.idGen(trimExtension(filePath), {
    prefix: this.options.prefix
  });
  var viewBox = $svg.attr('viewBox');
  var symbolContent = '<symbol id="' + symbolId + '" viewBox="' + viewBox + '"></symbol>';

  var $symbolWrapper = cheerio.load(symbolContent, { xmlMode: true });
  var $symbol = $symbolWrapper('symbol');

  $symbol.html($svg.html());
  return $symbolWrapper.html();
};

SymbolFilter.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    var options = mapValues(this.options, stringifyFunc);
    this._optionsHash = crypto.createHash('md5')
      .update(stringify(options), 'utf8')
      .digest('hex');
  }

  return this._optionsHash;
};

SymbolFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() +
    Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
};

module.exports = SymbolFilter;
