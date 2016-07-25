const path = require('path');
const crypto = require('crypto');
const _ = require('lodash');
const Filter = require('broccoli-persistent-filter');
const stringify = require('json-stable-stringify');
const cheerio = require('cheerio');
const formatAttrs = require('./format-attrs');

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function SymbolFilter(inputNode, options = {}) {
  this.options = _.defaults(options, {
    persist: true
  });

  Filter.call(this, inputNode, this.options);
}

SymbolFilter.prototype = Object.create(Filter.prototype);
SymbolFilter.prototype.constructor = SymbolFilter;
SymbolFilter.prototype.extensions = ['svg'];
SymbolFilter.prototype.targetExtension = 'svg';

SymbolFilter.prototype.baseDir = function() {
  return __dirname;
};

SymbolFilter.prototype.processString = function(svgContent, filePath) {
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
};

SymbolFilter.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    let options = _.mapValues(this.options, (value) => (
      _.isFunction(value) ? String(value) : value
    ));

    this._optionsHash = crypto.createHash('md5')
      .update(stringify(options), 'utf8')
      .digest('hex');
  }

  return this._optionsHash;
};

SymbolFilter.prototype.baseDir = function() {
  return path.join(__dirname, '../');
};

SymbolFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() +
    Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
};

module.exports = SymbolFilter;
