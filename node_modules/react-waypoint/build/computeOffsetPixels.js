'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = computeOffsetPixels;

var _parseOffsetAsPercentage = require('./parseOffsetAsPercentage');

var _parseOffsetAsPercentage2 = _interopRequireDefault(_parseOffsetAsPercentage);

var _parseOffsetAsPixels = require('./parseOffsetAsPixels');

var _parseOffsetAsPixels2 = _interopRequireDefault(_parseOffsetAsPixels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string|number} offset
 * @param {number} contextHeight
 * @return {number} A number representing `offset` converted into pixels.
 */
function computeOffsetPixels(offset, contextHeight) {
  var pixelOffset = (0, _parseOffsetAsPixels2.default)(offset);

  if (typeof pixelOffset === 'number') {
    return pixelOffset;
  }

  var percentOffset = (0, _parseOffsetAsPercentage2.default)(offset);
  if (typeof percentOffset === 'number') {
    return percentOffset * contextHeight;
  }
}
module.exports = exports['default'];