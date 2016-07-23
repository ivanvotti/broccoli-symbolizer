const _ = require('lodash');

module.exports = function makeSVGTag(svgAttrs = {}) {
  let attrs = _
    .entries(svgAttrs)
    .map(([key, value]) => `${key}="${value.replace(/"/g, '\\"')}"`)
    .join(' ');

  return `<svg ${attrs}>`;
};
