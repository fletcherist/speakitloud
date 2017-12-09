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

const concat = list => Array.prototype.concat.bind(list);
const promiseConcat = f => x => f().then(concat(x));
const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
/*
 * serial executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));

class Speaker {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
  }

  // constructor () {
  //   super()
  //   this.synth.onvoicechanged = event => console.log(event)
  //   this.synth.onvoiceschanged = event => console.log(event)
  // }
  speak(utter) {
    this.currentUtterance = utter || this.currentUtterance;
    this.currentUtterance.rate = this.currentUtterance.rate + 0.1;
    this.synth.speak(this.currentUtterance);
    console.log(this.synth);
  }
  stop() {
    this.synth.calcel();
  }
  setSpeed(value) {
    // this.currentUtterance.rate = value
    // this.speak()
  }
  play() {
    this.isSpeaking = true;
    this.synth.resume();
  }
  pause() {
    this.isSpeaking = false;
    this.synth.pause();
  }
  playPause() {
    this.isSpeaking = !this.isSpeaking;
    this.isSpeaking ? this.synth.pause() : this.synth.resume();
  }
}

const app = {
  version: '0.0.2',
  getVersion() {
    console.log(this.version);
  },
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

const createSpeakEvent = sentence => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token);
  utterThis.lang = sentence.lang;
  utterThis.rate = 1.9;
  return utterThis;
};

const createSpeakEvents = parts => parts.map(createSpeakEvent);

const transformSpeakEventsIntoCallbacks = speakEvents => speakEvents.map(speakEvent => () => new Promise(resolve => {
  // speakEvent.onEnd = resolve(() => )
}));

const concatSpeakEventsSentences = speakEventsSentences => speakEventsSentences.reduce((a, b) => a.concat(b), []);

function speakItLoud() {
  const text = input.value.trim();
  const sentences = splitTextIntoSentences(text);
  const textTokensArray = sentences.map(sentence => compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(sentence));

  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(textTokens => compose(
  // transformSpeakEventsIntoPromises,
  createSpeakEvents, joinOneLanguageWords)(textTokens));

  const promises = [];
  concatSpeakEventsSentences(speakEventsSentences).forEach(phrase => promises.push(() => new Promise((resolve, reject) => {
    app.speaker.speak(phrase);
    console.log(phrase);
    phrase.onend = () => {
      console.log(phrase.text);
      resolve(phrase.text);
    };
  })));

  serial(promises).then(console.log);
}

button.addEventListener('click', event => {
  console.log('clicked');
  speakItLoud();
});

console.log(app.speaker);
// window.addEventListener('beforeunload', event => {
//   console.log(app.speaker.pause())
// })

document.addEventListener('keydown', event => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause();
  }
});

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmYyMzE3YTEwYjYxNmQxY2RkMWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYnV0dG9uIiwiQUxQSEFCRVQiLCJ1bmljb2RlIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiY29uY2F0IiwibGlzdCIsIkFycmF5IiwicHJvdG90eXBlIiwiYmluZCIsInByb21pc2VDb25jYXQiLCJmIiwieCIsInRoZW4iLCJwcm9taXNlUmVkdWNlIiwiYWNjIiwic2VyaWFsIiwiZnVuY3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlNwZWFrZXIiLCJzeW50aCIsIndpbmRvdyIsInNwZWVjaFN5bnRoZXNpcyIsImlzU3BlYWtpbmciLCJzcGVhayIsInV0dGVyIiwiY3VycmVudFV0dGVyYW5jZSIsInJhdGUiLCJjb25zb2xlIiwibG9nIiwic3RvcCIsImNhbGNlbCIsInNldFNwZWVkIiwidmFsdWUiLCJwbGF5IiwicmVzdW1lIiwicGF1c2UiLCJwbGF5UGF1c2UiLCJhcHAiLCJ2ZXJzaW9uIiwiZ2V0VmVyc2lvbiIsInNwZWFrZXIiLCJkZXRlY3RMYW5nQnlTdHIiLCJzdHIiLCJjdXJyZW50Q2hhckluZGV4IiwibWF4Q2hhckluZGV4IiwiY2hhckNvZGUiLCJ0b0xvd2VyQ2FzZSIsImNoYXJDb2RlQXQiLCJhbHBoYWJldCIsImlzVGhlU2FtZUxhbmd1YWdlIiwid29yZDEiLCJ3b3JkMiIsImxhbmciLCJqb2luT25lTGFuZ3VhZ2VXb3JkcyIsIndvcmRzIiwic2VudGVuY2VzIiwiZm9yRWFjaCIsIndvcmQiLCJsZW5ndGgiLCJwdXNoIiwidG9rZW4iLCJqb2luIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInRleHQiLCJzcGxpdCIsInNwbGl0U2VudGVuY2VJbnRvV29yZHMiLCJzZW50ZW5jZSIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwiY3JlYXRlU3BlYWtFdmVudCIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSIsImNyZWF0ZVNwZWFrRXZlbnRzIiwicGFydHMiLCJ0cmFuc2Zvcm1TcGVha0V2ZW50c0ludG9DYWxsYmFja3MiLCJzcGVha0V2ZW50cyIsInNwZWFrRXZlbnQiLCJjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyIsInNwZWFrRXZlbnRzU2VudGVuY2VzIiwiYSIsImIiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJ0ZXh0VG9rZW5zQXJyYXkiLCJ0ZXh0VG9rZW5zIiwicHJvbWlzZXMiLCJwaHJhc2UiLCJyZWplY3QiLCJvbmVuZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzNEQSxNQUFNQSxRQUFRQyxTQUFTQyxhQUFULENBQXVCLGlCQUF2QixDQUFkO0FBQ0EsTUFBTUMsU0FBU0YsU0FBU0MsYUFBVCxDQUF1QixTQUF2QixDQUFmOztBQUVBLE1BQU1FLFdBQVc7QUFDZixXQUFTO0FBQ1BDLGFBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUDtBQURGOztB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QTNCLEVBQWlEeEIsT0FBakQsQ0FBeURnQyxVQUN2REQsU0FBUzVCLElBQVQsQ0FBYyxNQUFNLElBQUkzQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVd0UsTUFBVixLQUFxQjtBQUNuRHBELFFBQUlHLE9BQUosQ0FBWWpCLEtBQVosQ0FBa0JpRSxNQUFsQjtBQUNBN0QsWUFBUUMsR0FBUixDQUFZNEQsTUFBWjtBQUNBQSxXQUFPRSxLQUFQLEdBQWUsTUFBTTtBQUNuQi9ELGNBQVFDLEdBQVIsQ0FBWTRELE9BQU96QixJQUFuQjtBQUNBOUMsY0FBUXVFLE9BQU96QixJQUFmO0FBQ0QsS0FIRDtBQUlELEdBUG1CLENBQXBCLENBREY7O0FBV0FqRCxTQUFPeUUsUUFBUCxFQUFpQjVFLElBQWpCLENBQXNCZ0IsUUFBUUMsR0FBOUI7QUFDRDs7QUFFRHBDLE9BQU9tRyxnQkFBUCxDQUF3QixPQUF4QixFQUFrQ0MsS0FBRCxJQUFXO0FBQzFDakUsVUFBUUMsR0FBUixDQUFZLFNBQVo7QUFDQXVEO0FBQ0QsQ0FIRDs7QUFLQXhELFFBQVFDLEdBQVIsQ0FBWVMsSUFBSUcsT0FBaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUFsRCxTQUFTcUcsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBc0NDLEtBQUQsSUFBa0I7QUFDckQ7QUFDQSxNQUFJQSxNQUFNQyxPQUFOLEtBQWtCLEVBQXRCLEVBQTBCO0FBQ3hCeEQsUUFBSUcsT0FBSixDQUFZSixTQUFaO0FBQ0Q7QUFDRixDQUxEOztBQU9BO0FBQ0E7QUFDQTtBQUNBLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYmYyMzE3YTEwYjYxNmQxY2RkMWYiLCIvLyBAZmxvd1xuXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfVxufVxuXG4vLyBmcCBjb21wb3NpdGlvbiAmIHBpcGUgaGVscGVyc1xuY29uc3QgcGlwZSA9IChmbiwgLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gZm5zLnJlZHVjZSgocmVzdWx0LCBmbikgPT4gZm4ocmVzdWx0KSwgZm4oLi4uYXJncykpXG5jb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IHBpcGUoLi4uZm5zLnJldmVyc2UoKSkoLi4uYXJncylcblxuY29uc3QgY29uY2F0ID0gbGlzdCA9PiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmJpbmQobGlzdClcbmNvbnN0IHByb21pc2VDb25jYXQgPSBmID0+IHggPT4gZigpLnRoZW4oY29uY2F0KHgpKVxuY29uc3QgcHJvbWlzZVJlZHVjZSA9IChhY2MsIHgpID0+IGFjYy50aGVuKHByb21pc2VDb25jYXQoeCkpXG4vKlxuICogc2VyaWFsIGV4ZWN1dGVzIFByb21pc2VzIHNlcXVlbnRpYWxseS5cbiAqIEBwYXJhbSB7ZnVuY3N9IEFuIGFycmF5IG9mIGZ1bmNzIHRoYXQgcmV0dXJuIHByb21pc2VzLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHVybHMgPSBbJy91cmwxJywgJy91cmwyJywgJy91cmwzJ11cbiAqIHNlcmlhbCh1cmxzLm1hcCh1cmwgPT4gKCkgPT4gJC5hamF4KHVybCkpKVxuICogICAgIC50aGVuKGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSkpXG4gKi9cbmNvbnN0IHNlcmlhbCA9IGZ1bmNzID0+IGZ1bmNzLnJlZHVjZShwcm9taXNlUmVkdWNlLCBQcm9taXNlLnJlc29sdmUoW10pKVxuXG5jbGFzcyBTcGVha2VyIHtcbiAgc3ludGggPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzXG4gIGN1cnJlbnRVdHRlcmFuY2U6IE9iamVjdFxuICBpc1NwZWFraW5nOiBib29sZWFuID0gZmFsc2VcbiAgLy8gY29uc3RydWN0b3IgKCkge1xuICAvLyAgIHN1cGVyKClcbiAgLy8gICB0aGlzLnN5bnRoLm9udm9pY2VjaGFuZ2VkID0gZXZlbnQgPT4gY29uc29sZS5sb2coZXZlbnQpXG4gIC8vICAgdGhpcy5zeW50aC5vbnZvaWNlc2NoYW5nZWQgPSBldmVudCA9PiBjb25zb2xlLmxvZyhldmVudClcbiAgLy8gfVxuICBzcGVhayAodXR0ZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlICsgMC4xXG4gICAgdGhpcy5zeW50aC5zcGVhayh0aGlzLmN1cnJlbnRVdHRlcmFuY2UpXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBzdG9wICgpIHsgdGhpcy5zeW50aC5jYWxjZWwoKSB9XG4gIHNldFNwZWVkICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gdGhpcy5jdXJyZW50VXR0ZXJhbmNlLnJhdGUgPSB2YWx1ZVxuICAgIC8vIHRoaXMuc3BlYWsoKVxuICB9XG4gIHBsYXkgKCkge1xuICAgIHRoaXMuaXNTcGVha2luZyA9IHRydWVcbiAgICB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgcGF1c2UgKCkge1xuICAgIHRoaXMuaXNTcGVha2luZyA9IGZhbHNlXG4gICAgdGhpcy5zeW50aC5wYXVzZSgpXG4gIH1cbiAgcGxheVBhdXNlICgpIHtcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSAhdGhpcy5pc1NwZWFraW5nXG4gICAgdGhpcy5pc1NwZWFraW5nID8gdGhpcy5zeW50aC5wYXVzZSgpIDogdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgdmVyc2lvbjogJzAuMC4yJyxcbiAgZ2V0VmVyc2lvbiAoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy52ZXJzaW9uKVxuICB9LFxuICBzcGVha2VyOiBuZXcgU3BlYWtlcigpXG59XG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMFxuICBsZXQgbWF4Q2hhckluZGV4ID0gM1xuICB3aGlsZSAoY3VycmVudENoYXJJbmRleCA8PSBtYXhDaGFySW5kZXgpIHtcbiAgICBjb25zdCBjaGFyQ29kZSA9IHN0ci50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoY3VycmVudENoYXJJbmRleClcbiAgICBmb3IgKGxldCBhbHBoYWJldCBpbiBBTFBIQUJFVCkge1xuICAgICAgaWYgKGNoYXJDb2RlID49IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzBdICYmXG4gICAgICAgICAgY2hhckNvZGUgPD0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMV0pIHtcbiAgICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgICB9XG4gICAgfVxuICAgIGN1cnJlbnRDaGFySW5kZXgrK1xuICB9XG4gIHJldHVybiAnZW4nXG59XG5cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuXG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZ1xuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8d29yZFR5cGU+ID0+IHtcbiAgY29uc3Qgc2VudGVuY2VzID0gW11cbiAgd29yZHMuZm9yRWFjaCh3b3JkID0+IHtcbiAgICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2Uoc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXSwgd29yZClcbiAgICAgID8gc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiA9XG4gICAgICAgICAgW3NlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4sIHdvcmQudG9rZW5dLmpvaW4oJyAnKVxuICAgICAgOiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICB9KVxuICByZXR1cm4gc2VudGVuY2VzXG59XG5cbmNvbnN0IHNwbGl0VGV4dEludG9TZW50ZW5jZXMgPSAodGV4dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB0ZXh0LnNwbGl0KCcuJylcbmNvbnN0IHNwbGl0U2VudGVuY2VJbnRvV29yZHMgPSAoc2VudGVuY2U6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gc2VudGVuY2Uuc3BsaXQoJyAnKVxuY29uc3QgY29udmVydFdvcmRzSW50b1Rva2VucyA9ICh3b3JkczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHdvcmRUeXBlPiA9PlxuICB3b3Jkcy5tYXAoKHRva2VuOiBzdHJpbmcpID0+ICh7XG4gICAgbGFuZzogZGV0ZWN0TGFuZ0J5U3RyKHRva2VuKSxcbiAgICB0b2tlbjogdG9rZW5cbiAgfSkpXG5jb25zdCBmaWx0ZXJXb3Jkc0FycmF5ID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pID0+XG4gIHdvcmRzLmZpbHRlcih3b3JkID0+IHdvcmQudG9rZW4ubGVuZ3RoICE9PSAwKVxuXG5jb25zdCBjcmVhdGVTcGVha0V2ZW50ID0gKHNlbnRlbmNlOiB3b3JkVHlwZSk6IE9iamVjdCA9PiB7XG4gIGNvbnN0IHV0dGVyVGhpcyA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2Uoc2VudGVuY2UudG9rZW4pXG4gIHV0dGVyVGhpcy5sYW5nID0gc2VudGVuY2UubGFuZ1xuICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICByZXR1cm4gdXR0ZXJUaGlzXG59XG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnRzID0gKHBhcnRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxPYmplY3Q+ID0+XG4gIHBhcnRzLm1hcChjcmVhdGVTcGVha0V2ZW50KVxuXG5jb25zdCB0cmFuc2Zvcm1TcGVha0V2ZW50c0ludG9DYWxsYmFja3MgPSAoc3BlYWtFdmVudHM6IEFycmF5PE9iamVjdD4pID0+XG4gIHNwZWFrRXZlbnRzLm1hcChzcGVha0V2ZW50ID0+ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIC8vIHNwZWFrRXZlbnQub25FbmQgPSByZXNvbHZlKCgpID0+IClcbiAgfSkpXG5cbmNvbnN0IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzID1cbiAgKHNwZWFrRXZlbnRzU2VudGVuY2VzOiBBcnJheTxBcnJheTxPYmplY3Q+Pik6IEFycmF5PE9iamVjdD4gPT5cbiAgICBzcGVha0V2ZW50c1NlbnRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcblxuZnVuY3Rpb24gc3BlYWtJdExvdWQgKCkge1xuICBjb25zdCB0ZXh0ID0gaW5wdXQudmFsdWUudHJpbSgpXG4gIGNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbiAgY29uc3QgdGV4dFRva2Vuc0FycmF5ID0gc2VudGVuY2VzLm1hcChzZW50ZW5jZSA9PiBjb21wb3NlKFxuICAgIGZpbHRlcldvcmRzQXJyYXksXG4gICAgY29udmVydFdvcmRzSW50b1Rva2VucyxcbiAgICBzcGxpdFNlbnRlbmNlSW50b1dvcmRzXG4gICkoc2VudGVuY2UpKVxuXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgLy8gdHJhbnNmb3JtU3BlYWtFdmVudHNJbnRvUHJvbWlzZXMsXG4gICAgICBjcmVhdGVTcGVha0V2ZW50cyxcbiAgICAgIGpvaW5PbmVMYW5ndWFnZVdvcmRzXG4gICAgKSh0ZXh0VG9rZW5zKSlcblxuICBjb25zdCBwcm9taXNlcyA9IFtdXG4gIGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzKHNwZWFrRXZlbnRzU2VudGVuY2VzKS5mb3JFYWNoKHBocmFzZSA9PlxuICAgIHByb21pc2VzLnB1c2goKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXBwLnNwZWFrZXIuc3BlYWsocGhyYXNlKVxuICAgICAgY29uc29sZS5sb2cocGhyYXNlKVxuICAgICAgcGhyYXNlLm9uZW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhwaHJhc2UudGV4dClcbiAgICAgICAgcmVzb2x2ZShwaHJhc2UudGV4dClcbiAgICAgIH1cbiAgICB9KSlcbiAgKVxuXG4gIHNlcmlhbChwcm9taXNlcykudGhlbihjb25zb2xlLmxvZylcbn1cblxuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGlja2VkJylcbiAgc3BlYWtJdExvdWQoKVxufSlcblxuY29uc29sZS5sb2coYXBwLnNwZWFrZXIpXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgZXZlbnQgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhhcHAuc3BlYWtlci5wYXVzZSgpKVxuLy8gfSlcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogRXZlbnQpID0+IHtcbiAgLy8gSWYgc3BhY2UgaXMgcHJlc3NlZFxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICBhcHAuc3BlYWtlci5wbGF5UGF1c2UoKVxuICB9XG59KVxuXG4vLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChldmVudDogRXZlbnQpID0+IHtcbi8vICAgY29uc29sZS5sb2coZXZlbnQpXG4vLyAgIGNvbnN0IHRleHQgPSBldmVudC50YXJnZXQudmFsdWVcbi8vIH0pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==