"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reduceCssCalc = _interopRequireDefault(require("reduce-css-calc"));

var _getStringWidth = _interopRequireDefault(require("./util/getStringWidth"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Text =
/*#__PURE__*/
function (_Component) {
  _inherits(Text, _Component);

  function Text(props) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, props));
    _this.state = {
      wordsByLines: []
    };
    return _this;
  }

  _createClass(Text, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.updateWordsByLines(this.props, true);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var needCalculate = this.props.children !== nextProps.children || this.props.style !== nextProps.style;
      this.updateWordsByLines(nextProps, needCalculate);
    }
  }, {
    key: "updateWordsByLines",
    value: function updateWordsByLines(props, needCalculate) {
      // Only perform calculations if using features that require them (multiline, scaleToFit)
      if (props.width || props.scaleToFit) {
        if (needCalculate) {
          var words = props.children ? props.children.toString().split(/\s+/) : [];
          this.wordsWithComputedWidth = words.map(function (word) {
            return {
              word: word,
              width: (0, _getStringWidth["default"])(word, props.style)
            };
          });
          this.spaceWidth = (0, _getStringWidth["default"])("\xA0", props.style);
        }

        var wordsByLines = this.calculateWordsByLines(this.wordsWithComputedWidth, this.spaceWidth, props.width * props.scale);
        this.setState({
          wordsByLines: wordsByLines
        });
      } else {
        this.updateWordsWithoutCalculate(props);
      }
    }
  }, {
    key: "updateWordsWithoutCalculate",
    value: function updateWordsWithoutCalculate(props) {
      var words = props.children ? props.children.toString().split(/\s+/) : [];
      this.setState({
        wordsByLines: [{
          words: words
        }]
      });
    }
  }, {
    key: "calculateWordsByLines",
    value: function calculateWordsByLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
      var scaleToFit = this.props.scaleToFit;
      return wordsWithComputedWidth.reduce(function (result, _ref) {
        var word = _ref.word,
            width = _ref.width;
        var currentLine = result[result.length - 1];

        if (currentLine && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < lineWidth)) {
          // Word can be added to an existing line
          currentLine.words.push(word);
          currentLine.width += width + spaceWidth;
        } else {
          // Add first word to line or word is too long to scaleToFit on existing line
          var newLine = {
            words: [word],
            width: width
          };
          result.push(newLine);
        }

        return result;
      }, []);
    }
  }, {
    key: "leftShift",
    value: function leftShift() {
      var _this$props = this.props,
          align = _this$props.align,
          width = _this$props.width,
          x = _this$props.x;

      switch (align) {
        case 'left':
          return x;

        case 'center':
          return width / 2;

        case 'right':
          return width;

        default:
          console.error("unsupported align value ".concat(align));
          return x;
      }
    }
  }, {
    key: "textAnchor",
    value: function textAnchor() {
      var align = this.props.align;

      switch (align) {
        case 'left':
          return 'start';

        case 'center':
          return 'middle';

        case 'right':
          return 'end';

        default:
          console.error("unsupported align value ".concat(align));
          return 'start';
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          dx = _this$props2.dx,
          dy = _this$props2.dy,
          textAnchor = _this$props2.textAnchor,
          verticalAnchor = _this$props2.verticalAnchor,
          scale = _this$props2.scale,
          align = _this$props2.align,
          defs = _this$props2.defs,
          scaleToFit = _this$props2.scaleToFit,
          angle = _this$props2.angle,
          lineHeight = _this$props2.lineHeight,
          capHeight = _this$props2.capHeight,
          lineProps = _this$props2.lineProps,
          innerRef = _this$props2.innerRef,
          textProps = _objectWithoutProperties(_this$props2, ["dx", "dy", "textAnchor", "verticalAnchor", "scale", "align", "defs", "scaleToFit", "angle", "lineHeight", "capHeight", "lineProps", "innerRef"]);

      var wordsByLines = this.state.wordsByLines;
      var x = textProps.x,
          y = textProps.y;
      var startDy;

      switch (verticalAnchor) {
        case 'start':
          startDy = (0, _reduceCssCalc["default"])("calc(".concat(capHeight, ")"));
          break;

        case 'middle':
          startDy = (0, _reduceCssCalc["default"])("calc(".concat((wordsByLines.length - 1) / 2, " * -").concat(lineHeight, " + (").concat(capHeight, " / 2))"));
          break;

        default:
          startDy = (0, _reduceCssCalc["default"])("calc(".concat(wordsByLines.length - 1, " * -").concat(lineHeight, ")"));
          break;
      }

      var transforms = [];

      if (scaleToFit && wordsByLines.length) {
        var lineWidth = wordsByLines[0].width;
        var sx = this.props.width * scale / lineWidth;
        var sy = sx;
        var originX = x - sx * x;
        var originY = y - sy * y;
        transforms.push("matrix(".concat(sx, ", 0, 0, ").concat(sy, ", ").concat(originX, ", ").concat(originY, ")"));
      }

      if (angle) {
        transforms.push("rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"));
      }

      if (transforms.length) {
        textProps.transform = transforms.join(' ');
      }

      return _react["default"].createElement("svg", {
        ref: innerRef,
        x: dx,
        y: dy,
        fontSize: textProps.fontSize,
        style: {
          overflow: 'visible'
        }
      }, _react["default"].createElement("defs", null, defs), _react["default"].createElement("text", _extends({}, textProps, {
        textAnchor: textAnchor
      }), wordsByLines.map(function (line, index) {
        return _react["default"].createElement("tspan", _extends({
          x: _this2.leftShift(),
          textAnchor: _this2.textAnchor(),
          dy: index === 0 ? startDy : lineHeight
        }, lineProps, {
          key: index
        }), line.words.join(' '));
      })));
    }
  }]);

  return Text;
}(_react.Component);

Text.defaultProps = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  lineHeight: '1em',
  capHeight: '0.71em',
  // Magic number from d3
  scaleToFit: false,
  textAnchor: 'start',
  verticalAnchor: 'end',
  // default SVG behavior
  scale: 1,
  align: 'left',
  defs: null,
  lineProps: {}
};
Text.propTypes = {
  scaleToFit: _propTypes["default"].bool,
  angle: _propTypes["default"].number,
  textAnchor: _propTypes["default"].oneOf(['start', 'middle', 'end', 'inherit']),
  verticalAnchor: _propTypes["default"].oneOf(['start', 'middle', 'end']),
  style: _propTypes["default"].objectOf(_propTypes["default"].string),
  scale: _propTypes["default"].number,
  align: _propTypes["default"].oneOf(['left', 'center', 'right']),
  defs: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].node), _propTypes["default"].node]),
  innerRef: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].object]),
  x: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  y: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  dx: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  dy: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  lineHeight: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  capHeight: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  lineProps: _propTypes["default"].objectOf(_propTypes["default"].string)
};
var _default = Text;
exports["default"] = _default;