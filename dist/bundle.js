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

const $input = document.querySelector('#input-textarea');
const $button = document.querySelector('#button');

const $incrementSpeedButton = document.querySelector('#increment-speed');
const $decrementSpeedButton = document.querySelector('#decrement-speed');
const $currentSpeedElement = document.querySelector('#current-speed');

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
    this.currentSpeed = 1.0;
  }

  // constructor () {
  //   super()
  //   this.synth.onvoicechanged = event => console.log(event)
  //   this.synth.onvoiceschanged = event => console.log(event)
  // }
  speak(utter) {
    if (!utter && !this.currentUtterance) return false;
    this.currentUtterance = utter || this.currentUtterance;
    this.currentUtterance.rate = this.currentSpeed;
    this.play();
    this.synth.speak(this.currentUtterance);
    console.log(this.synth);
  }
  stop() {
    this.currentUtterance = null;
    this.synth.cancel();
    this.synth.pause();
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
  incrementSpeed() {
    this.stop();
    this.currentSpeed += 0.1;
    $currentSpeedElement.innerHTML = `speed ${this.currentSpeed.toPrecision(2)}`;
    this.speak();
  }
  decrementSpeed() {
    this.stop();
    this.currentSpeed -= 0.1;
    this.speak();
    $currentSpeedElement.innerHTML = `speed ${this.currentSpeed.toPrecision(2)}`;
  }
}

const app = {
  version: '0.0.2',
  getVersion() {
    console.log(this.version);
  },
  speaker: new Speaker(),
  currentUtteranceIndex: 0

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

app.speakItLoud = () => {
  const text = $input.value.trim();
  const sentences = splitTextIntoSentences(text);
  const textTokensArray = sentences.map(sentence => compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(sentence));

  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(textTokens => compose(
  // transformSpeakEventsIntoPromises,
  createSpeakEvents, joinOneLanguageWords)(textTokens));

  const promises = [];
  concatSpeakEventsSentences(speakEventsSentences).forEach(phrase => promises.push(() => new Promise((resolve, reject) => {
    app.speaker.speak(phrase);
    app.currentUtteranceIndex = app.currentUtteranceIndex + 1;
    console.log(app.currentUtteranceIndex);
    phrase.onend = () => {
      resolve(phrase.text);
    };
  })));

  serial(promises).then(console.log);
};

$button.addEventListener('click', event => {
  console.log('clicked');
  app.speakItLoud();
});

console.log(app.speaker);
window.addEventListener('beforeunload', event => {
  console.log(app.speaker.stop());
});

document.addEventListener('keydown', event => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause();
  }
});

$incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed();
});

$decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed();
});

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWUxZTlmN2U2OWE4NGY5NzdlNTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIiRpbnB1dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIiRidXR0b24iLCIkaW5jcmVtZW50U3BlZWRCdXR0b24iLCIkZGVjcmVtZW50U3BlZWRCdXR0b24iLCIkY3VycmVudFNwZWVkRWxlbWVudCIsIkFMUEhBQkVUIiwidW5pY29kZSIsInBpcGUiLCJmbiIsImZucyIsImFyZ3MiLCJyZWR1Y2UiLCJyZXN1bHQiLCJjb21wb3NlIiwicmV2ZXJzZSIsImNvbmNhdCIsImxpc3QiLCJBcnJheSIsInByb3RvdHlwZSIsImJpbmQiLCJwcm9taXNlQ29uY2F0IiwiZiIsIngiLCJ0aGVuIiwicHJvbWlzZVJlZHVjZSIsImFjYyIsInNlcmlhbCIsImZ1bmNzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJTcGVha2VyIiwic3ludGgiLCJ3aW5kb3ciLCJzcGVlY2hTeW50aGVzaXMiLCJpc1NwZWFraW5nIiwiY3VycmVudFNwZWVkIiwic3BlYWsiLCJ1dHRlciIsImN1cnJlbnRVdHRlcmFuY2UiLCJyYXRlIiwicGxheSIsImNvbnNvbGUiLCJsb2ciLCJzdG9wIiwiY2FuY2VsIiwicGF1c2UiLCJzZXRTcGVlZCIsInZhbHVlIiwicmVzdW1lIiwicGxheVBhdXNlIiwiaW5jcmVtZW50U3BlZWQiLCJpbm5lckhUTUwiLCJ0b1ByZWNpc2lvbiIsImRlY3JlbWVudFNwZWVkIiwiYXBwIiwidmVyc2lvbiIsImdldFZlcnNpb24iLCJzcGVha2VyIiwiY3VycmVudFV0dGVyYW5jZUluZGV4IiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiY3VycmVudENoYXJJbmRleCIsIm1heENoYXJJbmRleCIsImNoYXJDb2RlIiwidG9Mb3dlckNhc2UiLCJjaGFyQ29kZUF0IiwiYWxwaGFiZXQiLCJpc1RoZVNhbWVMYW5ndWFnZSIsIndvcmQxIiwid29yZDIiLCJsYW5nIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInRva2VuIiwiam9pbiIsInNwbGl0VGV4dEludG9TZW50ZW5jZXMiLCJ0ZXh0Iiwic3BsaXQiLCJzcGxpdFNlbnRlbmNlSW50b1dvcmRzIiwic2VudGVuY2UiLCJjb252ZXJ0V29yZHNJbnRvVG9rZW5zIiwibWFwIiwiZmlsdGVyV29yZHNBcnJheSIsImZpbHRlciIsImNyZWF0ZVNwZWFrRXZlbnQiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJjcmVhdGVTcGVha0V2ZW50cyIsInBhcnRzIiwidHJhbnNmb3JtU3BlYWtFdmVudHNJbnRvQ2FsbGJhY2tzIiwic3BlYWtFdmVudHMiLCJzcGVha0V2ZW50IiwiY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMiLCJzcGVha0V2ZW50c1NlbnRlbmNlcyIsImEiLCJiIiwic3BlYWtJdExvdWQiLCJ0cmltIiwidGV4dFRva2Vuc0FycmF5IiwidGV4dFRva2VucyIsInByb21pc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXlDb2RlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztB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cyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFlMWU5ZjdlNjlhODRmOTc3ZTU5IiwiLy8gQGZsb3dcblxuY29uc3QgJGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LXRleHRhcmVhJylcbmNvbnN0ICRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcbmNvbnN0ICRjdXJyZW50U3BlZWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2N1cnJlbnQtc3BlZWQnKVxuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgJ3J1LVJVJzoge1xuICAgIHVuaWNvZGU6IFsxMDcyLCAxMTAzXVxuICB9XG59XG5cbi8vIGZwIGNvbXBvc2l0aW9uICYgcGlwZSBoZWxwZXJzXG5jb25zdCBwaXBlID0gKGZuLCAuLi5mbnMpID0+ICguLi5hcmdzKSA9PiBmbnMucmVkdWNlKChyZXN1bHQsIGZuKSA9PiBmbihyZXN1bHQpLCBmbiguLi5hcmdzKSlcbmNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gcGlwZSguLi5mbnMucmV2ZXJzZSgpKSguLi5hcmdzKVxuXG5jb25zdCBjb25jYXQgPSBsaXN0ID0+IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYmluZChsaXN0KVxuY29uc3QgcHJvbWlzZUNvbmNhdCA9IGYgPT4geCA9PiBmKCkudGhlbihjb25jYXQoeCkpXG5jb25zdCBwcm9taXNlUmVkdWNlID0gKGFjYywgeCkgPT4gYWNjLnRoZW4ocHJvbWlzZUNvbmNhdCh4KSlcbi8qXG4gKiBzZXJpYWwgZXhlY3V0ZXMgUHJvbWlzZXMgc2VxdWVudGlhbGx5LlxuICogQHBhcmFtIHtmdW5jc30gQW4gYXJyYXkgb2YgZnVuY3MgdGhhdCByZXR1cm4gcHJvbWlzZXMuXG4gKiBAZXhhbXBsZVxuICogY29uc3QgdXJscyA9IFsnL3VybDEnLCAnL3VybDInLCAnL3VybDMnXVxuICogc2VyaWFsKHVybHMubWFwKHVybCA9PiAoKSA9PiAkLmFqYXgodXJsKSkpXG4gKiAgICAgLnRoZW4oY29uc29sZS5sb2cuYmluZChjb25zb2xlKSlcbiAqL1xuY29uc3Qgc2VyaWFsID0gZnVuY3MgPT4gZnVuY3MucmVkdWNlKHByb21pc2VSZWR1Y2UsIFByb21pc2UucmVzb2x2ZShbXSkpXG5cbmNsYXNzIFNwZWFrZXIge1xuICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXNcbiAgY3VycmVudFV0dGVyYW5jZTogT2JqZWN0XG4gIGlzU3BlYWtpbmc6IGJvb2xlYW4gPSBmYWxzZVxuICBjdXJyZW50U3BlZWQ6IG51bWJlciA9IDEuMFxuXG4gIC8vIGNvbnN0cnVjdG9yICgpIHtcbiAgLy8gICBzdXBlcigpXG4gIC8vICAgdGhpcy5zeW50aC5vbnZvaWNlY2hhbmdlZCA9IGV2ZW50ID0+IGNvbnNvbGUubG9nKGV2ZW50KVxuICAvLyAgIHRoaXMuc3ludGgub252b2ljZXNjaGFuZ2VkID0gZXZlbnQgPT4gY29uc29sZS5sb2coZXZlbnQpXG4gIC8vIH1cbiAgc3BlYWsgKHV0dGVyKSB7XG4gICAgaWYgKCF1dHRlciAmJiAhdGhpcy5jdXJyZW50VXR0ZXJhbmNlKSByZXR1cm4gZmFsc2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgdGhpcy5wbGF5KClcbiAgICB0aGlzLnN5bnRoLnNwZWFrKHRoaXMuY3VycmVudFV0dGVyYW5jZSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN5bnRoKVxuICB9XG4gIHN0b3AgKCkge1xuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZSA9IG51bGxcbiAgICB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gICAgdGhpcy5zeW50aC5wYXVzZSgpXG4gIH1cblxuICBzZXRTcGVlZCAodmFsdWU6IG51bWJlcikge1xuICAgIC8vIHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlID0gdmFsdWVcbiAgICAvLyB0aGlzLnNwZWFrKClcbiAgfVxuICBwbGF5ICgpIHtcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSB0cnVlXG4gICAgdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIHBhdXNlICgpIHtcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZVxuICAgIHRoaXMuc3ludGgucGF1c2UoKVxuICB9XG4gIHBsYXlQYXVzZSAoKSB7XG4gICAgdGhpcy5pc1NwZWFraW5nID0gIXRoaXMuaXNTcGVha2luZ1xuICAgIHRoaXMuaXNTcGVha2luZyA/IHRoaXMuc3ludGgucGF1c2UoKSA6IHRoaXMuc3ludGgucmVzdW1lKClcbiAgfVxuICBpbmNyZW1lbnRTcGVlZCAoKSB7XG4gICAgdGhpcy5zdG9wKClcbiAgICB0aGlzLmN1cnJlbnRTcGVlZCArPSAwLjFcbiAgICAkY3VycmVudFNwZWVkRWxlbWVudC5pbm5lckhUTUwgPSBgc3BlZWQgJHt0aGlzLmN1cnJlbnRTcGVlZC50b1ByZWNpc2lvbigyKX1gXG4gICAgdGhpcy5zcGVhaygpXG4gIH1cbiAgZGVjcmVtZW50U3BlZWQgKCkge1xuICAgIHRoaXMuc3RvcCgpXG4gICAgdGhpcy5jdXJyZW50U3BlZWQgLT0gMC4xXG4gICAgdGhpcy5zcGVhaygpXG4gICAgJGN1cnJlbnRTcGVlZEVsZW1lbnQuaW5uZXJIVE1MID0gYHNwZWVkICR7dGhpcy5jdXJyZW50U3BlZWQudG9QcmVjaXNpb24oMil9YFxuICB9XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgdmVyc2lvbjogJzAuMC4yJyxcbiAgZ2V0VmVyc2lvbiAoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy52ZXJzaW9uKVxuICB9LFxuICBzcGVha2VyOiBuZXcgU3BlYWtlcigpLFxuICBjdXJyZW50VXR0ZXJhbmNlSW5kZXg6IDAsXG59XG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMFxuICBsZXQgbWF4Q2hhckluZGV4ID0gM1xuICB3aGlsZSAoY3VycmVudENoYXJJbmRleCA8PSBtYXhDaGFySW5kZXgpIHtcbiAgICBjb25zdCBjaGFyQ29kZSA9IHN0ci50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoY3VycmVudENoYXJJbmRleClcbiAgICBmb3IgKGxldCBhbHBoYWJldCBpbiBBTFBIQUJFVCkge1xuICAgICAgaWYgKGNoYXJDb2RlID49IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzBdICYmXG4gICAgICAgICAgY2hhckNvZGUgPD0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMV0pIHtcbiAgICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgICB9XG4gICAgfVxuICAgIGN1cnJlbnRDaGFySW5kZXgrK1xuICB9XG4gIHJldHVybiAnZW4nXG59XG5cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuXG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZ1xuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8d29yZFR5cGU+ID0+IHtcbiAgY29uc3Qgc2VudGVuY2VzID0gW11cbiAgd29yZHMuZm9yRWFjaCh3b3JkID0+IHtcbiAgICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2Uoc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXSwgd29yZClcbiAgICAgID8gc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiA9XG4gICAgICAgICAgW3NlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4sIHdvcmQudG9rZW5dLmpvaW4oJyAnKVxuICAgICAgOiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICB9KVxuICByZXR1cm4gc2VudGVuY2VzXG59XG5cbmNvbnN0IHNwbGl0VGV4dEludG9TZW50ZW5jZXMgPSAodGV4dDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiB0ZXh0LnNwbGl0KCcuJylcbmNvbnN0IHNwbGl0U2VudGVuY2VJbnRvV29yZHMgPSAoc2VudGVuY2U6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gc2VudGVuY2Uuc3BsaXQoJyAnKVxuY29uc3QgY29udmVydFdvcmRzSW50b1Rva2VucyA9ICh3b3JkczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHdvcmRUeXBlPiA9PlxuICB3b3Jkcy5tYXAoKHRva2VuOiBzdHJpbmcpID0+ICh7XG4gICAgbGFuZzogZGV0ZWN0TGFuZ0J5U3RyKHRva2VuKSxcbiAgICB0b2tlbjogdG9rZW5cbiAgfSkpXG5jb25zdCBmaWx0ZXJXb3Jkc0FycmF5ID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pID0+XG4gIHdvcmRzLmZpbHRlcih3b3JkID0+IHdvcmQudG9rZW4ubGVuZ3RoICE9PSAwKVxuXG5jb25zdCBjcmVhdGVTcGVha0V2ZW50ID0gKHNlbnRlbmNlOiB3b3JkVHlwZSk6IE9iamVjdCA9PiB7XG4gIGNvbnN0IHV0dGVyVGhpcyA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2Uoc2VudGVuY2UudG9rZW4pXG4gIHV0dGVyVGhpcy5sYW5nID0gc2VudGVuY2UubGFuZ1xuICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICByZXR1cm4gdXR0ZXJUaGlzXG59XG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnRzID0gKHBhcnRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxPYmplY3Q+ID0+XG4gIHBhcnRzLm1hcChjcmVhdGVTcGVha0V2ZW50KVxuXG5jb25zdCB0cmFuc2Zvcm1TcGVha0V2ZW50c0ludG9DYWxsYmFja3MgPSAoc3BlYWtFdmVudHM6IEFycmF5PE9iamVjdD4pID0+XG4gIHNwZWFrRXZlbnRzLm1hcChzcGVha0V2ZW50ID0+ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIC8vIHNwZWFrRXZlbnQub25FbmQgPSByZXNvbHZlKCgpID0+IClcbiAgfSkpXG5cbmNvbnN0IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzID1cbiAgKHNwZWFrRXZlbnRzU2VudGVuY2VzOiBBcnJheTxBcnJheTxPYmplY3Q+Pik6IEFycmF5PE9iamVjdD4gPT5cbiAgICBzcGVha0V2ZW50c1NlbnRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcblxuYXBwLnNwZWFrSXRMb3VkID0gKCkgPT4ge1xuICBjb25zdCB0ZXh0ID0gJGlucHV0LnZhbHVlLnRyaW0oKVxuICBjb25zdCBzZW50ZW5jZXMgPSBzcGxpdFRleHRJbnRvU2VudGVuY2VzKHRleHQpXG4gIGNvbnN0IHRleHRUb2tlbnNBcnJheSA9IHNlbnRlbmNlcy5tYXAoc2VudGVuY2UgPT4gY29tcG9zZShcbiAgICBmaWx0ZXJXb3Jkc0FycmF5LFxuICAgIGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMsXG4gICAgc3BsaXRTZW50ZW5jZUludG9Xb3Jkc1xuICApKHNlbnRlbmNlKSlcblxuICAvLyBjb25zdCBsb2dBbmRDb250aW51ZSA9IChhcmdzKSA9PiB7IGNvbnNvbGUubG9nKGFyZ3MpOyByZXR1cm4gYXJncyB9XG4gIGNvbnN0IHNwZWFrRXZlbnRzU2VudGVuY2VzID0gdGV4dFRva2Vuc0FycmF5Lm1hcChcbiAgICAodGV4dFRva2VuczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8QXJyYXk8T2JqZWN0Pj4gPT4gY29tcG9zZShcbiAgICAgIC8vIHRyYW5zZm9ybVNwZWFrRXZlbnRzSW50b1Byb21pc2VzLFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyhzcGVha0V2ZW50c1NlbnRlbmNlcykuZm9yRWFjaChwaHJhc2UgPT5cbiAgICBwcm9taXNlcy5wdXNoKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcbiAgICAgIGFwcC5jdXJyZW50VXR0ZXJhbmNlSW5kZXggPSBhcHAuY3VycmVudFV0dGVyYW5jZUluZGV4ICsgMVxuICAgICAgY29uc29sZS5sb2coYXBwLmN1cnJlbnRVdHRlcmFuY2VJbmRleClcbiAgICAgIHBocmFzZS5vbmVuZCA9ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShwaHJhc2UudGV4dClcbiAgICAgIH1cbiAgICB9KSlcbiAgKVxuXG4gIHNlcmlhbChwcm9taXNlcykudGhlbihjb25zb2xlLmxvZylcbn1cblxuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICBjb25zb2xlLmxvZygnY2xpY2tlZCcpXG4gIGFwcC5zcGVha0l0TG91ZCgpXG59KVxuXG5jb25zb2xlLmxvZyhhcHAuc3BlYWtlcilcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKGFwcC5zcGVha2VyLnN0b3AoKSlcbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxufSlcblxuJGluY3JlbWVudFNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICBhcHAuc3BlYWtlci5pbmNyZW1lbnRTcGVlZCgpXG59KVxuXG4kZGVjcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmRlY3JlbWVudFNwZWVkKClcbn0pXG5cbi8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhldmVudClcbi8vICAgY29uc3QgdGV4dCA9IGV2ZW50LnRhcmdldC52YWx1ZVxuLy8gfSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9