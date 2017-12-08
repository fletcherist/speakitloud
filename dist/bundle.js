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
var input = document.querySelector('#input-textarea');
var button = document.querySelector('#button');

var ALPHABET = {
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

var detectLangByWord = function detectLangByWord(word) {
  var firstCharCode = word.toLowerCase().charCodeAt(0);
  for (var alphabet in ALPHABET) {
    if (firstCharCode >= ALPHABET[alphabet].unicode[0] && firstCharCode <= ALPHABET[alphabet].unicode[1]) {
      return alphabet;
    }
  }
  return 'en';
};

var isTheSameLanguage = function isTheSameLanguage(word1, word2) {
  return word1.lang === word2.lang;
};

var joinOneLanguageWords = function joinOneLanguageWords(words) {
  console.log(words);
  var sentences = [];
  words.forEach(function (word) {
    if (sentences.length === 0) return sentences.push(word);
    isTheSameLanguage(sentences[sentences.length - 1], word) ? sentences[sentences.length - 1].token = [sentences[sentences.length - 1].token, word.token].join(' ') : sentences.push(word);
  });
  return sentences;
};

var text = input.value;

console.log(text);
var textTokens = text.split(' ');
textTokens = textTokens.map(function (token) {
  return {
    lang: detectLangByWord(token),
    token: token
  };
});

console.log(joinOneLanguageWords(textTokens));

var speakEvents = joinOneLanguageWords(textTokens).map(function (sentence) {
  var utterThis = new SpeechSynthesisUtterance(sentence.token);
  utterThis.lang = sentence.lang;
  utterThis.rate = 1.3;
  return utterThis;
});

speakEvents.forEach(function (utter) {
  return synth.speak(utter);
});

// button.addEventListener('click', (event) => {})

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGFhNzEyYmZlYzc2NWNmNGVlNjkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaW5wdXQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJidXR0b24iLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJ2b2ljZXMiLCJnZXRWb2ljZXMiLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidGV4dCIsInRhcmdldCIsInZhbHVlIiwiZGV0ZWN0TGFuZ0J5V29yZCIsIndvcmQiLCJmaXJzdENoYXJDb2RlIiwidG9Mb3dlckNhc2UiLCJjaGFyQ29kZUF0IiwiYWxwaGFiZXQiLCJpc1RoZVNhbWVMYW5ndWFnZSIsIndvcmQxIiwid29yZDIiLCJsYW5nIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJsZW5ndGgiLCJwdXNoIiwidG9rZW4iLCJqb2luIiwidGV4dFRva2VucyIsInNwbGl0IiwibWFwIiwic3BlYWtFdmVudHMiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJzZW50ZW5jZSIsInJhdGUiLCJzcGVhayIsInV0dGVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7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QWEsWUFBVUcsSUFBVixHQUFpQixHQUFqQjtBQUNBLFNBQU9ILFNBQVA7QUFDRCxDQU5pQixDQUFwQjs7QUFTQUQsWUFBWVIsT0FBWixDQUFvQjtBQUFBLFNBQVMvQixNQUFNNEMsS0FBTixDQUFZQyxLQUFaLENBQVQ7QUFBQSxDQUFwQjs7QUFFQSxrRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkYWE3MTJiZmVjNzY1Y2Y0ZWU2OSIsIi8vIEBmbG93XG5cbmNvbnN0IHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEnKVxuY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbicpXG5cbmNvbnN0IEFMUEhBQkVUID0ge1xuICAncnUtUlUnOiB7XG4gICAgdW5pY29kZTogWzEwNzIsIDExMDNdXG4gIH1cbn1cblxuY29uc3Qgdm9pY2VzID0gc3ludGguZ2V0Vm9pY2VzKClcbmNvbnNvbGUubG9nKHZvaWNlcylcblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKGV2ZW50KVxuICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlXG5cbn0pXG5cblxuY29uc3QgZGV0ZWN0TGFuZ0J5V29yZCA9ICh3b3JkOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZmlyc3RDaGFyQ29kZSA9IHdvcmQudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgaWYgKGZpcnN0Q2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgZmlyc3RDaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgfVxuICB9XG4gIHJldHVybiAnZW4nXG59XG5cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuXG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZ1xuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8T2JqZWN0PikgPT4ge1xuICBjb25zb2xlLmxvZyh3b3JkcylcbiAgY29uc3Qgc2VudGVuY2VzID0gW11cbiAgd29yZHMuZm9yRWFjaCh3b3JkID0+IHtcbiAgICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2Uoc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXSwgd29yZClcbiAgICAgID8gc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiA9XG4gICAgICAgICAgW3NlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4sIHdvcmQudG9rZW5dLmpvaW4oJyAnKVxuICAgICAgOiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICB9KVxuICByZXR1cm4gc2VudGVuY2VzXG59XG5cbmNvbnN0IHRleHQgPSBpbnB1dC52YWx1ZVxuXG5jb25zb2xlLmxvZyh0ZXh0KVxubGV0IHRleHRUb2tlbnMgPSB0ZXh0LnNwbGl0KCcgJylcbnRleHRUb2tlbnMgPSB0ZXh0VG9rZW5zLm1hcCgodG9rZW46IHN0cmluZykgPT4gKHtcbiAgbGFuZzogZGV0ZWN0TGFuZ0J5V29yZCh0b2tlbiksXG4gIHRva2VuOiB0b2tlblxufSkpXG5cbmNvbnNvbGUubG9nKGpvaW5PbmVMYW5ndWFnZVdvcmRzKHRleHRUb2tlbnMpKVxuXG5jb25zdCBzcGVha0V2ZW50cyA9IGpvaW5PbmVMYW5ndWFnZVdvcmRzKHRleHRUb2tlbnMpLm1hcChcbiAgc2VudGVuY2UgPT4ge1xuICAgIGNvbnN0IHV0dGVyVGhpcyA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2Uoc2VudGVuY2UudG9rZW4pXG4gICAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gICAgdXR0ZXJUaGlzLnJhdGUgPSAxLjNcbiAgICByZXR1cm4gdXR0ZXJUaGlzXG4gIH1cbilcblxuc3BlYWtFdmVudHMuZm9yRWFjaCh1dHRlciA9PiBzeW50aC5zcGVhayh1dHRlcikpXG5cbi8vIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge30pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==