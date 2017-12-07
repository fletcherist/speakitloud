/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _text, _mainTextArea, _mutatorMap;

var _button = __webpack_require__(1);

var _button2 = _interopRequireDefault(_button);

var _textArea = __webpack_require__(2);

var _textArea2 = _interopRequireDefault(_textArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

var APP_STATE = {
  mainTextArea: (_mainTextArea = {
    get text() {
      return this._text || '';
    }
  }, _text = 'text', _mutatorMap = {}, _mutatorMap[_text] = _mutatorMap[_text] || {}, _mutatorMap[_text].set = function (value) {
    this._text = value;
    render();
  }, _defineEnumerableProperties(_mainTextArea, _mutatorMap), _mainTextArea)
};
window.__codex_covers_state__ = APP_STATE;

var HeadlineButton = void 0;
var MainTextButton = void 0;
var AttachImageButton = void 0;
var MainTextArea = void 0;

var App = function App() {
  return '\n    ' + HeadlineButton().component + '\n    ' + MainTextButton().component + '\n    ' + AttachImageButton().component + '\n    <div>\n      <svg xmlns="http://www.w3.org/2000/svg"\n           width="500" height="40" viewBox="0 0 500 40">\n        ' + MainTextArea().component + '\n      </svg>\n    </div>\n';
};

function render() {
  console.log('rerendering', APP_STATE);
  HeadlineButton = _button2.default.bind(null, {
    id: 'headline-button',
    label: 'Headline'
  });

  MainTextButton = _button2.default.bind(null, {
    id: 'main-text-button',
    label: 'Main text'
  });

  AttachImageButton = _button2.default.bind(null, {
    id: 'attach-image-button',
    label: 'Image'
  });

  MainTextArea = _textArea2.default.bind(null, {
    id: 'main-text-area',
    text: APP_STATE.mainTextArea.text
  });
  document.body.innerHTML = App();
}
render();

var attachListener = function attachListener(type, elementId, func) {
  return document.getElementById(elementId).addEventListener(type, func);
};

var attachClickListener = attachListener.bind(null, 'click');

attachClickListener(HeadlineButton().id, function () {
  return console.log('im func');
});
attachClickListener(MainTextButton().id, function () {
  return console.log('im another func');
});
attachClickListener(AttachImageButton().id, function () {
  return console.log('im third func');
});

attachClickListener(MainTextArea().id, function (event) {
  console.log(event);
});

attachListener('keydown', MainTextArea().id, function (event) {
  console.log(event);
});

window.addEventListener('keydown', function (event) {
  console.log(event);
  var key = event.key;

  APP_STATE.mainTextArea.text = APP_STATE.mainTextArea.text + key;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = Button;
var ButtonStyles = "\n    color: blue;\n    font-size: 34px;\n";

function Button(props) {
  var label = props.label,
      id = props.id;

  var componentId = Math.random().toString().slice(2);
  return _extends({}, props, {
    component: "\n      <button style=\"" + ButtonStyles + "\"\n        id=\"" + (id || componentId) + "\">\n        " + label + "\n      </button>\n    "
  });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = TextArea;
function TextArea(props) {
  var id = props.id,
      text = props.text;

  var componentId = Math.random().toString().slice(2);
  return _extends({}, props, {
    component: '\n      <text x="0" y="35" font-family="Verdana" font-size="35"\n        id="' + (id || componentId) + '">\n        ' + (text || '') + '\n      </text>\n    '
  });
}

/***/ })
/******/ ]);