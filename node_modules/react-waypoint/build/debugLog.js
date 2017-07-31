'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debugLog;
function debugLog() {
  if (process.env.NODE_ENV !== 'production') {
    console.log(arguments); // eslint-disable-line no-console
  }
}
module.exports = exports['default'];