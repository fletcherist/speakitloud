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


var input = document.querySelector('#input-textarea');
var button = document.querySelector('#button');

var ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  }
};

var app = {
  version: '0.0.1',
  synth: window.speechSynthesis,
  getVersion: function getVersion() {
    console.log(this.version);
  },

  player: {
    isPlaying: false,
    play: function play() {
      this.isPlaying = true;
    },
    pause: function pause() {
      this.isPlaying = false;
    },
    playPause: function playPause() {
      this.isPlaying = !this.isPlaying;
    }
  },
  speaker: {}
};

input.addEventListener('paste', function (event) {
  console.log(event);
  var text = event.target.value;
});

/*
 * Analyses the first letter in the word
 * Now it can guess between cyrilic and latin letter only
 */
var detectLangByStr = function detectLangByStr(str) {
  var firstCharCode = str.toLowerCase().charCodeAt(0);
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
  var sentences = [];
  words.forEach(function (word) {
    if (sentences.length === 0) return sentences.push(word);
    isTheSameLanguage(sentences[sentences.length - 1], word) ? sentences[sentences.length - 1].token = [sentences[sentences.length - 1].token, word.token].join(' ') : sentences.push(word);
  });
  console.log(sentences);
  return sentences;
};

var splitTextIntoSentences = function splitTextIntoSentences(text) {
  return text.split('.');
};
var splitSentenceIntoWords = function splitSentenceIntoWords(sentence) {
  return sentence.split(' ');
};

var text = input.value;
var sentences = splitTextIntoSentences(text);
sentences.forEach(function (sentence) {
  var textTokens = splitSentenceIntoWords(sentence).map(function (token) {
    return {
      lang: detectLangByStr(token),
      token: token
    };
  });

  var speakEvents = joinOneLanguageWords(textTokens).map(function (sentence) {
    var utterThis = new SpeechSynthesisUtterance(sentence.token);
    utterThis.lang = sentence.lang;
    utterThis.rate = 1.6;
    return utterThis;
  });

  speakEvents.forEach(function (utter) {
    return app.synth.speak(utter);
  });
});

document.addEventListener('keydown', function (event) {});
// button.addEventListener('click', (event) => {})

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmY0OWFmOThhOTBiZTM1ZTQyYzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYnV0dG9uIiwiQUxQSEFCRVQiLCJ1bmljb2RlIiwiYXBwIiwidmVyc2lvbiIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiZ2V0VmVyc2lvbiIsImNvbnNvbGUiLCJsb2ciLCJwbGF5ZXIiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5UGF1c2UiLCJzcGVha2VyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidGV4dCIsInRhcmdldCIsInZhbHVlIiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiZmlyc3RDaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImpvaW5PbmVMYW5ndWFnZVdvcmRzIiwid29yZHMiLCJzZW50ZW5jZXMiLCJmb3JFYWNoIiwibGVuZ3RoIiwicHVzaCIsIndvcmQiLCJ0b2tlbiIsImpvaW4iLCJzcGxpdFRleHRJbnRvU2VudGVuY2VzIiwic3BsaXQiLCJzcGxpdFNlbnRlbmNlSW50b1dvcmRzIiwic2VudGVuY2UiLCJ0ZXh0VG9rZW5zIiwibWFwIiwic3BlYWtFdmVudHMiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJyYXRlIiwic3BlYWsiLCJ1dHRlciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFD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QSxzQkFBeUIsQ0FBQ3RCLElBQUQ7QUFBQSxTQUF5QkEsS0FBS3VCLEtBQUwsQ0FBVyxHQUFYLENBQXpCO0FBQUEsQ0FBL0I7QUFDQSxJQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QixDQUFDQyxRQUFEO0FBQUEsU0FBNkJBLFNBQVNGLEtBQVQsQ0FBZSxHQUFmLENBQTdCO0FBQUEsQ0FBL0I7O0FBRUEsSUFBTXZCLE9BQU90QixNQUFNd0IsS0FBbkI7QUFDQSxJQUFNYSxZQUFZTyx1QkFBdUJ0QixJQUF2QixDQUFsQjtBQUNBZSxVQUFVQyxPQUFWLENBQWtCLG9CQUFZO0FBQzVCLE1BQU1VLGFBQWFGLHVCQUF1QkMsUUFBdkIsRUFDaEJFLEdBRGdCLENBQ1osVUFBQ1AsS0FBRDtBQUFBLFdBQW9CO0FBQ3ZCUixZQUFNVCxnQkFBZ0JpQixLQUFoQixDQURpQjtBQUV2QkEsYUFBT0E7QUFGZ0IsS0FBcEI7QUFBQSxHQURZLENBQW5COztBQU1BLE1BQU1RLGNBQWNmLHFCQUFxQmEsVUFBckIsRUFBaUNDLEdBQWpDLENBQ2xCLG9CQUFZO0FBQ1YsUUFBTUUsWUFBWSxJQUFJQyx3QkFBSixDQUE2QkwsU0FBU0wsS0FBdEMsQ0FBbEI7QUFDQVMsY0FBVWpCLElBQVYsR0FBaUJhLFNBQVNiLElBQTFCO0FBQ0FpQixjQUFVRSxJQUFWLEdBQWlCLEdBQWpCO0FBQ0EsV0FBT0YsU0FBUDtBQUNELEdBTmlCLENBQXBCOztBQVNBRCxjQUFZWixPQUFaLENBQW9CO0FBQUEsV0FBU2hDLElBQUlFLEtBQUosQ0FBVThDLEtBQVYsQ0FBZ0JDLEtBQWhCLENBQVQ7QUFBQSxHQUFwQjtBQUNELENBakJEOztBQW9CQXRELFNBQVNtQixnQkFBVCxDQUEwQixTQUExQixFQUFxQyxVQUFDQyxLQUFELEVBQWtCLENBRXRELENBRkQ7QUFHQSxrRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2ZjQ5YWY5OGE5MGJlMzVlNDJjMiIsIi8vIEBmbG93XG5cbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LXRleHRhcmVhJylcbmNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24nKVxuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgJ3J1LVJVJzoge1xuICAgIHVuaWNvZGU6IFsxMDcyLCAxMTAzXVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgdmVyc2lvbjogJzAuMC4xJyxcbiAgc3ludGg6IHdpbmRvdy5zcGVlY2hTeW50aGVzaXMsXG4gIGdldFZlcnNpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmVyc2lvbilcbiAgfSxcbiAgcGxheWVyOiB7XG4gICAgaXNQbGF5aW5nOiBmYWxzZSxcbiAgICBwbGF5ICgpIHsgdGhpcy5pc1BsYXlpbmcgPSB0cnVlIH0sXG4gICAgcGF1c2UgKCkgeyB0aGlzLmlzUGxheWluZyA9IGZhbHNlIH0sXG4gICAgcGxheVBhdXNlICgpIHsgdGhpcy5pc1BsYXlpbmcgPSAhdGhpcy5pc1BsYXlpbmcgfVxuICB9LFxuICBzcGVha2VyOiB7XG4gICAgXG4gIH1cbn1cblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKGV2ZW50KVxuICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlXG5cbn0pXG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGZpcnN0Q2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgaWYgKGZpcnN0Q2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgZmlyc3RDaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgfVxuICB9XG4gIHJldHVybiAnZW4nXG59XG5cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuXG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZ1xuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8T2JqZWN0PikgPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBpc1RoZVNhbWVMYW5ndWFnZShzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIGNvbnNvbGUubG9nKHNlbnRlbmNlcylcbiAgcmV0dXJuIHNlbnRlbmNlc1xufVxuXG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXkgPT4gc2VudGVuY2Uuc3BsaXQoJyAnKVxuXG5jb25zdCB0ZXh0ID0gaW5wdXQudmFsdWVcbmNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbnNlbnRlbmNlcy5mb3JFYWNoKHNlbnRlbmNlID0+IHtcbiAgY29uc3QgdGV4dFRva2VucyA9IHNwbGl0U2VudGVuY2VJbnRvV29yZHMoc2VudGVuY2UpXG4gICAgLm1hcCgodG9rZW46IHN0cmluZykgPT4gKHtcbiAgICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgICB0b2tlbjogdG9rZW5cbiAgICB9KSlcblxuICBjb25zdCBzcGVha0V2ZW50cyA9IGpvaW5PbmVMYW5ndWFnZVdvcmRzKHRleHRUb2tlbnMpLm1hcChcbiAgICBzZW50ZW5jZSA9PiB7XG4gICAgICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICAgICAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gICAgICB1dHRlclRoaXMucmF0ZSA9IDEuNlxuICAgICAgcmV0dXJuIHV0dGVyVGhpc1xuICAgIH1cbiAgKVxuXG4gIHNwZWFrRXZlbnRzLmZvckVhY2godXR0ZXIgPT4gYXBwLnN5bnRoLnNwZWFrKHV0dGVyKSlcbn0pXG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogRXZlbnQpID0+IHtcblxufSlcbi8vIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge30pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==