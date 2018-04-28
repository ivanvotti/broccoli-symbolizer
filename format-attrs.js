'use strict';

const _ = require('lodash');

module.exports = function formatAttrs(attrs) {
  attrs = attrs || {};

  return _
    .entries(attrs)
    .filter((keyValue) => !_.isUndefined(keyValue[1]))
    .map((keyValue) => `${keyValue[0]}="${String(keyValue[1]).replace(/"/g, '\\"')}"`)
    .join(' ');
};
