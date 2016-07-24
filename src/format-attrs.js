const _ = require('lodash');

module.exports = function formatAttrs(attrs = {}) {
  return _
    .entries(attrs)
    .filter(([, value]) => !_.isUndefined(value))
    .map(([key, value]) => `${key}="${String(value).replace(/"/g, '\\"')}"`)
    .join(' ');
};
