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


var synth = window.speechSynthesis;
var input = document.createElement('textarea');

var button = document.createElement('button');
button.innerText = 'Play';

var ALPHABETS = {
  'ru-RU': {
    unicode: [1072, 1103]
  }

};

var voices = synth.getVoices();
console.log(voices);

input.addEventListener('paste', function (event) {
  console.log(event);
  var text = event.target.value;
});

document.body.appendChild(input);
document.body.appendChild(button);

var detectLanguageByWord = function detectLanguageByWord(word) {
  var firstCharCode = word.charCodeAt(0);
  for (var alphabet in ALPHABETS) {
    if (firstCharCode >= ALPHABETS[alphabet].unicode[0] && firstCharCode <= ALPHABETS[alphabet].unicode[1]) {
      return alphabet;
    }
  }
  return 'en';
};

var joinOneLanguageWords = function joinOneLanguageWords(sentences) {
  var newSentences = [];
  newSentences.push(sentences[0]);
  console.log(sentences);
  for (var i = 1; i < sentences.length; i++) {
    if (sentences[i].language === sentences[i - 1].language) {
      newSentences[i - 1].token = [newSentences[newSentences.length - 1].token, sentences[i].token].join(' ');
    } else {
      newSentences.push(sentences[i]);
    }
  }
  return newSentences;
};

button.addEventListener('click', function (event) {
  var text = input.value;
  var textTokens = text.split(' ');
  textTokens = textTokens.map(function (token) {
    return {
      language: detectLanguageByWord(token),
      token: token
    };
  });

  var speakEvents = joinOneLanguageWords(textTokens).map(function (sentence) {
    var utterThis = new SpeechSynthesisUtterance(sentence.token);
    utterThis.lang = sentence.language;
    return utterThis;
  });
  console.log(speakEvents);
  speakEvents.forEach(function (utter) {
    return synth.speak(utter);
  });
});

/***/ })
/******/ ]);