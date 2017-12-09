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

  // fp composition & pipe helpers
};const pipe = (fn, ...fns) => (...args) => fns.reduce((result, fn) => fn(result), fn(...args));
const compose = (...fns) => (...args) => pipe(...fns.reverse())(...args);

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
    this.currentUtterance = utter || this.currentUtterance;
    this.currentUtterance.rate = this.currentUtterance.rate + 0.1;
    this.synth.speak(this.currentUtterance);
    console.log(this.synth);
  }
  pause() {
    this.synth.pause();
  }
  resume() {
    this.synth.resume();
  }
  setSpeed(value) {
    // this.currentUtterance.rate = value
    // this.speak()
  }
}

const app = {
  version: '0.0.2',
  getVersion() {
    console.log(this.version);
  },
  player: new Player(),
  speaker: new Speaker()

  /*
   * Analyses the first letter in the word
   * Now it can guess between cyrilic and latin letter only
   */
};const detectLangByStr = str => {
  let currentCharIndex = 0;
  let maxCharIndex = 3;
  while (currentCharIndex <= maxCharIndex) {
    const charCode = str.toLowerCase().charCodeAt(currentCharIndex);
    for (let alphabet in ALPHABET) {
      if (charCode >= ALPHABET[alphabet].unicode[0] && charCode <= ALPHABET[alphabet].unicode[1]) {
        return alphabet;
      }
    }
    currentCharIndex++;
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
  return sentences;
};

const splitTextIntoSentences = text => text.split('.');
const splitSentenceIntoWords = sentence => sentence.split(' ');
const convertWordsIntoTokens = words => words.map(token => ({
  lang: detectLangByStr(token),
  token: token
}));
const filterWordsArray = words => words.filter(word => word.token.length !== 0);

const text = input.value.trim();
const sentences = splitTextIntoSentences(text);
sentences.forEach(sentence => {
  let textTokens = compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(text);
  console.log(textTokens);

  const speakEvents = joinOneLanguageWords(textTokens).map(sentence => {
    const utterThis = new SpeechSynthesisUtterance(sentence.token);
    utterThis.lang = sentence.lang;
    utterThis.rate = 1.9;
    return utterThis;
  });

  speakEvents.forEach(utter => {
    app.speaker.speak(utter);
  });
});

// let current = 1
// setInterval(() => {
//   app.speaker.setSpeed(current)
//   current += .2
// }, 1000)

// document.addEventListener('keydown', (event: Event) => {
//   // If space is pressed
//   if (event.keyCode === 32) {
//     app.player.playPause()
//   }
//   console.log(event.keyCode)
// })
// button.addEventListener('click', (event) => {})

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWJjZWVhNDFiNDE1MDU5ZDQ1YTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYnV0dG9uIiwiQUxQSEFCRVQiLCJ1bmljb2RlIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiUGxheWVyIiwiaXNQbGF5aW5nIiwicGxheSIsInBhdXNlIiwicGxheVBhdXNlIiwiU3BlYWtlciIsImNvbnN0cnVjdG9yIiwic3ludGgiLCJ3aW5kb3ciLCJzcGVlY2hTeW50aGVzaXMiLCJvbnZvaWNlY2hhbmdlZCIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsIm9udm9pY2VzY2hhbmdlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwicmF0ZSIsInJlc3VtZSIsInNldFNwZWVkIiwidmFsdWUiLCJhcHAiLCJ2ZXJzaW9uIiwiZ2V0VmVyc2lvbiIsInBsYXllciIsInNwZWFrZXIiLCJkZXRlY3RMYW5nQnlTdHIiLCJzdHIiLCJjdXJyZW50Q2hhckluZGV4IiwibWF4Q2hhckluZGV4IiwiY2hhckNvZGUiLCJ0b0xvd2VyQ2FzZSIsImNoYXJDb2RlQXQiLCJhbHBoYWJldCIsImlzVGhlU2FtZUxhbmd1YWdlIiwid29yZDEiLCJ3b3JkMiIsImxhbmciLCJqb2luT25lTGFuZ3VhZ2VXb3JkcyIsIndvcmRzIiwic2VudGVuY2VzIiwiZm9yRWFjaCIsIndvcmQiLCJsZW5ndGgiLCJwdXNoIiwidG9rZW4iLCJqb2luIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInRleHQiLCJzcGxpdCIsInNwbGl0U2VudGVuY2VJbnRvV29yZHMiLCJzZW50ZW5jZSIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwidHJpbSIsInRleHRUb2tlbnMiLCJzcGVha0V2ZW50cyIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDM0RBLE1BQU1BLFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWQ7QUFDQSxNQUFNQyxTQUFTRixTQUFTQyxhQUFULENBQXVCLFNBQXZCLENBQWY7O0FBRUEsTUFBTUUsV0FBVztBQUNmLFdBQVM7QUFDUEMsYUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQO0FBREY7O0FBS1g7QUFOaUIsQ0FBakIsQ0FPQSxNQUFNQyxPQUFPLENBQUNDLEVBQUQsRUFBSyxHQUFHQyxHQUFSLEtBQWdCLENBQUMsR0FBR0MsSUFBSixLQUFhRCxJQUFJRSxNQUFKLENBQVcsQ0FBQ0MsTUFBRCxFQUFTSixFQUFULEtBQWdCQSxHQUFHSSxNQUFILENBQTNCLEVBQXVDSixHQUFHLEdBQUdFLElBQU4sQ0FBdkMsQ0FBMUM7QUFDQSxNQUFNRyxVQUFVLENBQUMsR0FBR0osR0FBSixLQUFZLENBQUMsR0FBR0MsSUFBSixLQUFhSCxLQUFLLEdBQUdFLElBQUlLLE9BQUosRUFBUixFQUF1QixHQUFHSixJQUExQixDQUF6Qzs7QUFFQSxNQUFNSyxNQUFOLENBQWE7QUFBQTtBQUFBLFNBQ1hDLFNBRFcs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LENBcEJEOztBQXNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1YmNlZWE0MWI0MTUwNTlkNDVhMSIsIi8vIEBmbG93XG5cbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LXRleHRhcmVhJylcbmNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24nKVxuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgJ3J1LVJVJzoge1xuICAgIHVuaWNvZGU6IFsxMDcyLCAxMTAzXVxuICB9XG59XG5cbi8vIGZwIGNvbXBvc2l0aW9uICYgcGlwZSBoZWxwZXJzXG5jb25zdCBwaXBlID0gKGZuLCAuLi5mbnMpID0+ICguLi5hcmdzKSA9PiBmbnMucmVkdWNlKChyZXN1bHQsIGZuKSA9PiBmbihyZXN1bHQpLCBmbiguLi5hcmdzKSlcbmNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gcGlwZSguLi5mbnMucmV2ZXJzZSgpKSguLi5hcmdzKVxuXG5jbGFzcyBQbGF5ZXIge1xuICBpc1BsYXlpbmc6IGJvb2xlYW4gPSBmYWxzZVxuICBwbGF5ICgpIHsgdGhpcy5pc1BsYXlpbmcgPSB0cnVlIH1cbiAgcGF1c2UgKCkgeyB0aGlzLmlzUGxheWluZyA9IGZhbHNlIH1cbiAgcGxheVBhdXNlICgpIHsgdGhpcy5pc1BsYXlpbmcgPSAhdGhpcy5pc1BsYXlpbmcgfVxufVxuXG5jbGFzcyBTcGVha2VyIGV4dGVuZHMgUGxheWVyIHtcbiAgc3ludGggPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzXG4gIGN1cnJlbnRVdHRlcmFuY2U6IE9iamVjdFxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc3ludGgub252b2ljZWNoYW5nZWQgPSBldmVudCA9PiBjb25zb2xlLmxvZyhldmVudClcbiAgICB0aGlzLnN5bnRoLm9udm9pY2VzY2hhbmdlZCA9IGV2ZW50ID0+IGNvbnNvbGUubG9nKGV2ZW50KVxuICB9XG4gIHNwZWFrICh1dHRlcikge1xuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZSA9IHV0dGVyIHx8IHRoaXMuY3VycmVudFV0dGVyYW5jZVxuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlID0gdGhpcy5jdXJyZW50VXR0ZXJhbmNlLnJhdGUgKyAwLjFcbiAgICB0aGlzLnN5bnRoLnNwZWFrKHRoaXMuY3VycmVudFV0dGVyYW5jZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN5bnRoKVxuICB9XG4gIHBhdXNlICgpIHsgdGhpcy5zeW50aC5wYXVzZSgpIH1cbiAgcmVzdW1lICgpIHsgdGhpcy5zeW50aC5yZXN1bWUoKSB9XG4gIHNldFNwZWVkICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gdGhpcy5jdXJyZW50VXR0ZXJhbmNlLnJhdGUgPSB2YWx1ZVxuICAgIC8vIHRoaXMuc3BlYWsoKVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgdmVyc2lvbjogJzAuMC4yJyxcbiAgZ2V0VmVyc2lvbiAoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy52ZXJzaW9uKVxuICB9LFxuICBwbGF5ZXI6IG5ldyBQbGF5ZXIoKSxcbiAgc3BlYWtlcjogbmV3IFNwZWFrZXIoKVxufVxuXG4vKlxuICogQW5hbHlzZXMgdGhlIGZpcnN0IGxldHRlciBpbiB0aGUgd29yZFxuICogTm93IGl0IGNhbiBndWVzcyBiZXR3ZWVuIGN5cmlsaWMgYW5kIGxhdGluIGxldHRlciBvbmx5XG4gKi9cbmNvbnN0IGRldGVjdExhbmdCeVN0ciA9IChzdHI6IHN0cmluZykgPT4ge1xuICBsZXQgY3VycmVudENoYXJJbmRleCA9IDBcbiAgbGV0IG1heENoYXJJbmRleCA9IDNcbiAgd2hpbGUgKGN1cnJlbnRDaGFySW5kZXggPD0gbWF4Q2hhckluZGV4KSB7XG4gICAgY29uc3QgY2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KGN1cnJlbnRDaGFySW5kZXgpXG4gICAgZm9yIChsZXQgYWxwaGFiZXQgaW4gQUxQSEFCRVQpIHtcbiAgICAgIGlmIChjaGFyQ29kZSA+PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVswXSAmJlxuICAgICAgICAgIGNoYXJDb2RlIDw9IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzFdKSB7XG4gICAgICAgIHJldHVybiBhbHBoYWJldFxuICAgICAgfVxuICAgIH1cbiAgICBjdXJyZW50Q2hhckluZGV4KytcbiAgfVxuICByZXR1cm4gJ2VuJ1xufVxuXG50eXBlIHdvcmRUeXBlID0ge1xuICBsYW5nOiBzdHJpbmcsXG4gIHRva2VuOiBzdHJpbmdcbn1cblxuY29uc3QgaXNUaGVTYW1lTGFuZ3VhZ2UgPSAoXG4gIHdvcmQxOiB3b3JkVHlwZSxcbiAgd29yZDI6IHdvcmRUeXBlXG4pID0+IHdvcmQxLmxhbmcgPT09IHdvcmQyLmxhbmdcblxuY29uc3Qgam9pbk9uZUxhbmd1YWdlV29yZHMgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPikgPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBpc1RoZVNhbWVMYW5ndWFnZShzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIHJldHVybiBzZW50ZW5jZXNcbn1cblxuY29uc3Qgc3BsaXRUZXh0SW50b1NlbnRlbmNlcyA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiBzZW50ZW5jZS5zcGxpdCgnICcpXG5jb25zdCBjb252ZXJ0V29yZHNJbnRvVG9rZW5zID0gKHdvcmRzOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8d29yZFR5cGU+ID0+XG4gIHdvcmRzLm1hcCgodG9rZW46IHN0cmluZykgPT4gKHtcbiAgICBsYW5nOiBkZXRlY3RMYW5nQnlTdHIodG9rZW4pLFxuICAgIHRva2VuOiB0b2tlblxuICB9KSlcbmNvbnN0IGZpbHRlcldvcmRzQXJyYXkgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPikgPT5cbiAgd29yZHMuZmlsdGVyKHdvcmQgPT4gd29yZC50b2tlbi5sZW5ndGggIT09IDApXG5cbmNvbnN0IHRleHQgPSBpbnB1dC52YWx1ZS50cmltKClcbmNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbnNlbnRlbmNlcy5mb3JFYWNoKHNlbnRlbmNlID0+IHtcbiAgbGV0IHRleHRUb2tlbnMgPSBjb21wb3NlKFxuICAgIGZpbHRlcldvcmRzQXJyYXksXG4gICAgY29udmVydFdvcmRzSW50b1Rva2VucyxcbiAgICBzcGxpdFNlbnRlbmNlSW50b1dvcmRzXG4gICkodGV4dClcbiAgY29uc29sZS5sb2codGV4dFRva2VucylcblxuICBjb25zdCBzcGVha0V2ZW50cyA9IGpvaW5PbmVMYW5ndWFnZVdvcmRzKHRleHRUb2tlbnMpLm1hcChcbiAgICBzZW50ZW5jZSA9PiB7XG4gICAgICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICAgICAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gICAgICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICAgICAgcmV0dXJuIHV0dGVyVGhpc1xuICAgIH1cbiAgKVxuXG4gIHNwZWFrRXZlbnRzLmZvckVhY2godXR0ZXIgPT4ge1xuICAgIGFwcC5zcGVha2VyLnNwZWFrKHV0dGVyKVxuICB9KVxufSlcblxuLy8gbGV0IGN1cnJlbnQgPSAxXG4vLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgIGFwcC5zcGVha2VyLnNldFNwZWVkKGN1cnJlbnQpXG4vLyAgIGN1cnJlbnQgKz0gLjJcbi8vIH0sIDEwMDApXG5cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4vLyAgIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbi8vICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4vLyAgICAgYXBwLnBsYXllci5wbGF5UGF1c2UoKVxuLy8gICB9XG4vLyAgIGNvbnNvbGUubG9nKGV2ZW50LmtleUNvZGUpXG4vLyB9KVxuLy8gYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7fSlcblxuLy8gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKGV2ZW50KVxuLy8gICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlXG4vLyB9KVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=