'use strict';

module.exports = function makeSVGTag(svgAttrs) {
  var attrs = svgAttrs || {};
  var attrsStrings = Object.keys(attrs).map(function(attrName) {
    var attrValue = attrs[attrName].replace(/"/g, '\\"');
    return attrName + '=' + '"' + attrValue + '"';
  });

  return '<svg ' + attrsStrings.join(' ') + '>';
};
