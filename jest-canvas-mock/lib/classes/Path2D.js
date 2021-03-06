"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CanvasRenderingContext2D = _interopRequireDefault(require("./CanvasRenderingContext2D"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Path2D.prototype
const Path2DFunc = ['addPath'];
const borrowedFromCanvas = ['closePath', 'moveTo', 'lineTo', 'bezierCurveTo', 'quadraticCurveTo', 'arc', 'arcTo', 'ellipse', 'rect'];

class Path2D {
  constructor() {
    _defineProperty(this, "_path", []);

    _defineProperty(this, "_events", []);

    _defineProperty(this, "_stackIndex", 0);

    _defineProperty(this, "_transformStack", [[1, 0, 0, 1, 0, 0]]);

    borrowedFromCanvas.forEach(key => {
      this[key] = jest.fn(_CanvasRenderingContext2D.default.prototype[key].bind(this));
    });
    Path2DFunc.forEach(key => {
      this[key] = jest.fn(this[key].bind(this));
    });
  }

  addPath(path) {
    if (arguments.length < 1) throw new TypeError('Failed to execute \'addPath\' on \'Path2D\': 1 argument required, but only 0 present.');
    if (!(path instanceof Path2D)) throw new TypeError('Failed to execute \'addPath\' on \'Path2D\': parameter 1 is not of type \'Path2D\'.');
    this._path = this._path.concat(path._path);
  }

}

exports.default = Path2D;