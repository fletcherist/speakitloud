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
/***/ (function(module, exports) {

const input = document.querySelector('#input-textarea');
const button = document.querySelector('#button');

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  }
};

class Player {
  constructor() {
    this.isPlaying = false;
  }

  play() {
    this.isPlaying = true;
  }
  pause() {
    this.isPlaying = false;
  }
  playPause() {
    this.isPlaying = !this.isPlaying;
  }
}

class Speaker extends Player {
  constructor() {
    super();
    this.synth = window.speechSynthesis;
    this.synth.onvoicechanged = event => console.log(event);
    this.synth.onvoiceschanged = event => console.log(event);
  }
  speak(utter) {
    this.synth.speak(utter);
    console.log(this.synth);
  }
  pause() {
    this.synth.pause();
  }
  resume() {
    this.synth.resume();
  }
}

const app = {
  version: '0.0.1',
  getVersion() {
    console.log(this.version);
  },
  player: new Player(),
  speaker: new Speaker()
};

input.addEventListener('paste', event => {
  console.log(event);
  const text = event.target.value;
});

/*
 * Analyses the first letter in the word
 * Now it can guess between cyrilic and latin letter only
 */
const detectLangByStr = str => {
  const firstCharCode = str.toLowerCase().charCodeAt(0);
  for (let alphabet in ALPHABET) {
    if (firstCharCode >= ALPHABET[alphabet].unicode[0] && firstCharCode <= ALPHABET[alphabet].unicode[1]) {
      return alphabet;
    }
  }
  return 'en';
};

const isTheSameLanguage = (word1, word2) => word1.lang === word2.lang;

const joinOneLanguageWords = words => {
  const sentences = [];
  words.forEach(word => {
    if (sentences.length === 0) return sentences.push(word);
    isTheSameLanguage(sentences[sentences.length - 1], word) ? sentences[sentences.length - 1].token = [sentences[sentences.length - 1].token, word.token].join(' ') : sentences.push(word);
  });
  console.log(sentences);
  return sentences;
};

const splitTextIntoSentences = text => text.split('.');
const splitSentenceIntoWords = sentence => sentence.split(' ');

const text = input.value;
const sentences = splitTextIntoSentences(text);
sentences.forEach(sentence => {
  const textTokens = splitSentenceIntoWords(sentence).map(token => ({
    lang: detectLangByStr(token),
    token: token
  }));

  const speakEvents = joinOneLanguageWords(textTokens).map(sentence => {
    const utterThis = new SpeechSynthesisUtterance(sentence.token);
    utterThis.lang = sentence.lang;
    utterThis.rate = 1.6;
    return utterThis;
  });

  speakEvents.forEach(utter => {
    app.speaker.speak(utter);
  });
});

// document.addEventListener('keydown', (event: Event) => {
//   // If space is pressed
//   if (event.keyCode === 32) {
//     app.player.playPause()
//   }
//   console.log(event.keyCode)
// })
// button.addEventListener('click', (event) => {})

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGUyYTAzZDdiZDcxZDU0YjBkMDgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYnV0dG9uIiwiQUxQSEFCRVQiLCJ1bmljb2RlIiwiUGxheWVyIiwiaXNQbGF5aW5nIiwicGxheSIsInBhdXNlIiwicGxheVBhdXNlIiwiU3BlYWtlciIsImNvbnN0cnVjdG9yIiwic3ludGgiLCJ3aW5kb3ciLCJzcGVlY2hTeW50aGVzaXMiLCJvbnZvaWNlY2hhbmdlZCIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsIm9udm9pY2VzY2hhbmdlZCIsInNwZWFrIiwidXR0ZXIiLCJyZXN1bWUiLCJhcHAiLCJ2ZXJzaW9uIiwiZ2V0VmVyc2lvbiIsInBsYXllciIsInNwZWFrZXIiLCJhZGRFdmVudExpc3RlbmVyIiwidGV4dCIsInRhcmdldCIsInZhbHVlIiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiZmlyc3RDaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImpvaW5PbmVMYW5ndWFnZVdvcmRzIiwid29yZHMiLCJzZW50ZW5jZXMiLCJmb3JFYWNoIiwid29yZCIsImxlbmd0aCIsInB1c2giLCJ0b2tlbiIsImpvaW4iLCJzcGxpdFRleHRJbnRvU2VudGVuY2VzIiwic3BsaXQiLCJzcGxpdFNlbnRlbmNlSW50b1dvcmRzIiwic2VudGVuY2UiLCJ0ZXh0VG9rZW5zIiwibWFwIiwic3BlYWtFdmVudHMiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJyYXRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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U2IsSUFBMUI7QUFDQWlCLGNBQVVFLElBQVYsR0FBaUIsR0FBakI7QUFDQSxXQUFPRixTQUFQO0FBQ0QsR0FOaUIsQ0FBcEI7O0FBU0FELGNBQVlaLE9BQVosQ0FBb0J4QixTQUFTO0FBQzNCRSxRQUFJSSxPQUFKLENBQVlQLEtBQVosQ0FBa0JDLEtBQWxCO0FBQ0QsR0FGRDtBQUdELENBbkJEOztBQXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhlMmEwM2Q3YmQ3MWQ1NGIwZDA4IiwiLy8gQGZsb3dcblxuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEnKVxuY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbicpXG5cbmNvbnN0IEFMUEhBQkVUID0ge1xuICAncnUtUlUnOiB7XG4gICAgdW5pY29kZTogWzEwNzIsIDExMDNdXG4gIH1cbn1cblxuY2xhc3MgUGxheWVyIHtcbiAgaXNQbGF5aW5nOiBib29sZWFuID0gZmFsc2VcbiAgcGxheSAoKSB7IHRoaXMuaXNQbGF5aW5nID0gdHJ1ZSB9XG4gIHBhdXNlICgpIHsgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZSB9XG4gIHBsYXlQYXVzZSAoKSB7IHRoaXMuaXNQbGF5aW5nID0gIXRoaXMuaXNQbGF5aW5nIH1cbn1cblxuY2xhc3MgU3BlYWtlciBleHRlbmRzIFBsYXllciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc3ludGgub252b2ljZWNoYW5nZWQgPSBldmVudCA9PiBjb25zb2xlLmxvZyhldmVudClcbiAgICB0aGlzLnN5bnRoLm9udm9pY2VzY2hhbmdlZCA9IGV2ZW50ID0+IGNvbnNvbGUubG9nKGV2ZW50KVxuICB9XG4gIHNwZWFrICh1dHRlcikge1xuICAgIHRoaXMuc3ludGguc3BlYWsodXR0ZXIpXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBwYXVzZSAoKSB7IHRoaXMuc3ludGgucGF1c2UoKSB9XG4gIHJlc3VtZSAoKSB7IHRoaXMuc3ludGgucmVzdW1lKCkgfVxufVxuXG5jb25zdCBhcHAgPSB7XG4gIHZlcnNpb246ICcwLjAuMScsXG4gIGdldFZlcnNpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmVyc2lvbilcbiAgfSxcbiAgcGxheWVyOiBuZXcgUGxheWVyKCksXG4gIHNwZWFrZXI6IG5ldyBTcGVha2VyKClcbn1cblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKGV2ZW50KVxuICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlXG5cbn0pXG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGZpcnN0Q2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgaWYgKGZpcnN0Q2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgZmlyc3RDaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgfVxuICB9XG4gIHJldHVybiAnZW4nXG59XG5cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuXG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZ1xuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8T2JqZWN0PikgPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBpc1RoZVNhbWVMYW5ndWFnZShzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIGNvbnNvbGUubG9nKHNlbnRlbmNlcylcbiAgcmV0dXJuIHNlbnRlbmNlc1xufVxuXG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXkgPT4gc2VudGVuY2Uuc3BsaXQoJyAnKVxuXG5jb25zdCB0ZXh0ID0gaW5wdXQudmFsdWVcbmNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbnNlbnRlbmNlcy5mb3JFYWNoKHNlbnRlbmNlID0+IHtcbiAgY29uc3QgdGV4dFRva2VucyA9IHNwbGl0U2VudGVuY2VJbnRvV29yZHMoc2VudGVuY2UpXG4gICAgLm1hcCgodG9rZW46IHN0cmluZykgPT4gKHtcbiAgICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgICB0b2tlbjogdG9rZW5cbiAgICB9KSlcblxuICBjb25zdCBzcGVha0V2ZW50cyA9IGpvaW5PbmVMYW5ndWFnZVdvcmRzKHRleHRUb2tlbnMpLm1hcChcbiAgICBzZW50ZW5jZSA9PiB7XG4gICAgICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICAgICAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gICAgICB1dHRlclRoaXMucmF0ZSA9IDEuNlxuICAgICAgcmV0dXJuIHV0dGVyVGhpc1xuICAgIH1cbiAgKVxuXG4gIHNwZWFrRXZlbnRzLmZvckVhY2godXR0ZXIgPT4ge1xuICAgIGFwcC5zcGVha2VyLnNwZWFrKHV0dGVyKVxuICB9KVxufSlcblxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogRXZlbnQpID0+IHtcbi8vICAgLy8gSWYgc3BhY2UgaXMgcHJlc3NlZFxuLy8gICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbi8vICAgICBhcHAucGxheWVyLnBsYXlQYXVzZSgpXG4vLyAgIH1cbi8vICAgY29uc29sZS5sb2coZXZlbnQua2V5Q29kZSlcbi8vIH0pXG4vLyBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHt9KVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=