'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureChildrenIsSingleDOMElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isDOMElement = require('./isDOMElement');

var _isDOMElement2 = _interopRequireDefault(_isDOMElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Raise an error if "children" isn't a single DOM Element
 *
 * @param {React.element|null} children
 * @return {undefined}
 */
function ensureChildrenIsSingleDOMElement(children) {
  if (children) {
    _react2.default.Children.only(children);

    if (!(0, _isDOMElement2.default)(children)) {
      throw new Error('You must wrap any Component Elements passed to Waypoint in a DOM Element (eg; a <div>).');
    }
  }
}
module.exports = exports['default'];