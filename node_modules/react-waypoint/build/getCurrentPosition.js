'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCurrentPosition;

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {object} bounds An object with bounds data for the waypoint and
 *   scrollable parent
 * @return {string} The current position of the waypoint in relation to the
 *   visible portion of the scrollable parent. One of `constants.above`,
 *   `constants.below`, or `constants.inside`.
 */
function getCurrentPosition(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return _constants2.default.invisible;
  }

  // top is within the viewport
  if (bounds.viewportTop <= bounds.waypointTop && bounds.waypointTop <= bounds.viewportBottom) {
    return _constants2.default.inside;
  }

  // bottom is within the viewport
  if (bounds.viewportTop <= bounds.waypointBottom && bounds.waypointBottom <= bounds.viewportBottom) {
    return _constants2.default.inside;
  }

  // top is above the viewport and bottom is below the viewport
  if (bounds.waypointTop <= bounds.viewportTop && bounds.viewportBottom <= bounds.waypointBottom) {
    return _constants2.default.inside;
  }

  if (bounds.viewportBottom < bounds.waypointTop) {
    return _constants2.default.below;
  }

  if (bounds.waypointTop < bounds.viewportTop) {
    return _constants2.default.above;
  }

  return _constants2.default.invisible;
}
module.exports = exports['default'];