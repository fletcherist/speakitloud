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

const incrementSpeedButton = document.querySelector('#increment-speed');
const decrementSpeedButton = document.querySelector('#decrement-speed');

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
    this.currentUtterance = utter || this.currentUtterance;
    this.currentUtterance.rate = this.currentSpeed;
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
  incrementSpeed() {
    this.currentSpeed += 0.1;
  }
  decrementSpeed() {
    this.currentSpeed -= 0.1;
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
    app.currentUtteranceIndex = app.currentUtteranceIndex + 1;
    console.log(app.currentUtteranceIndex);
    phrase.onend = () => {
      resolve(phrase.text);
    };
  })));

  serial(promises).then(console.log);
};

button.addEventListener('click', event => {
  console.log('clicked');
  app.speakItLoud();
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

incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed();
});

decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed();
});

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmJkNmRlNjI2YmRiNmQ2NzlkNjMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYnV0dG9uIiwiaW5jcmVtZW50U3BlZWRCdXR0b24iLCJkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIkFMUEhBQkVUIiwidW5pY29kZSIsInBpcGUiLCJmbiIsImZucyIsImFyZ3MiLCJyZWR1Y2UiLCJyZXN1bHQiLCJjb21wb3NlIiwicmV2ZXJzZSIsImNvbmNhdCIsImxpc3QiLCJBcnJheSIsInByb3RvdHlwZSIsImJpbmQiLCJwcm9taXNlQ29uY2F0IiwiZiIsIngiLCJ0aGVuIiwicHJvbWlzZVJlZHVjZSIsImFjYyIsInNlcmlhbCIsImZ1bmNzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJTcGVha2VyIiwic3ludGgiLCJ3aW5kb3ciLCJzcGVlY2hTeW50aGVzaXMiLCJpc1NwZWFraW5nIiwiY3VycmVudFNwZWVkIiwic3BlYWsiLCJ1dHRlciIsImN1cnJlbnRVdHRlcmFuY2UiLCJyYXRlIiwiY29uc29sZSIsImxvZyIsInN0b3AiLCJjYWxjZWwiLCJzZXRTcGVlZCIsInZhbHVlIiwicGxheSIsInJlc3VtZSIsInBhdXNlIiwicGxheVBhdXNlIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwic3BlYWtlciIsImN1cnJlbnRVdHRlcmFuY2VJbmRleCIsImRldGVjdExhbmdCeVN0ciIsInN0ciIsImN1cnJlbnRDaGFySW5kZXgiLCJtYXhDaGFySW5kZXgiLCJjaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImpvaW5PbmVMYW5ndWFnZVdvcmRzIiwid29yZHMiLCJzZW50ZW5jZXMiLCJmb3JFYWNoIiwid29yZCIsImxlbmd0aCIsInB1c2giLCJ0b2tlbiIsImpvaW4iLCJzcGxpdFRleHRJbnRvU2VudGVuY2VzIiwidGV4dCIsInNwbGl0Iiwic3BsaXRTZW50ZW5jZUludG9Xb3JkcyIsInNlbnRlbmNlIiwiY29udmVydFdvcmRzSW50b1Rva2VucyIsIm1hcCIsImZpbHRlcldvcmRzQXJyYXkiLCJmaWx0ZXIiLCJjcmVhdGVTcGVha0V2ZW50IiwidXR0ZXJUaGlzIiwiU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlIiwiY3JlYXRlU3BlYWtFdmVudHMiLCJwYXJ0cyIsInRyYW5zZm9ybVNwZWFrRXZlbnRzSW50b0NhbGxiYWNrcyIsInNwZWFrRXZlbnRzIiwic3BlYWtFdmVudCIsImNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzIiwic3BlYWtFdmVudHNTZW50ZW5jZXMiLCJhIiwiYiIsInNwZWFrSXRMb3VkIiwidHJpbSIsInRleHRUb2tlbnNBcnJheSIsInRleHRUb2tlbnMiLCJwcm9taXNlcyIsInBocmFzZSIsInJlamVjdCIsIm9uZW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDM0RBLE1BQU1BLFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsaUJB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U0FBUzJHLGdCQUFULENBQTBCLFNBQTFCLEVBQXNDQyxLQUFELElBQWtCO0FBQ3JEO0FBQ0EsTUFBSUEsTUFBTUMsT0FBTixLQUFrQixFQUF0QixFQUEwQjtBQUN4QnpELFFBQUlHLE9BQUosQ0FBWU4sU0FBWjtBQUNEO0FBQ0YsQ0FMRDs7QUFPQTlDLHFCQUFxQndHLGdCQUFyQixDQUFzQyxPQUF0QyxFQUErQ0MsU0FBUztBQUN0RHhELE1BQUlHLE9BQUosQ0FBWUwsY0FBWjtBQUNELENBRkQ7O0FBSUE5QyxxQkFBcUJ1RyxnQkFBckIsQ0FBc0MsT0FBdEMsRUFBK0NDLFNBQVM7QUFDdER4RCxNQUFJRyxPQUFKLENBQVlKLGNBQVo7QUFDRCxDQUZEOztBQUlBO0FBQ0E7QUFDQTtBQUNBLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmJkNmRlNjI2YmRiNmQ2NzlkNjMiLCIvLyBAZmxvd1xuXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgaW5jcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5jcmVtZW50LXNwZWVkJylcbmNvbnN0IGRlY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlY3JlbWVudC1zcGVlZCcpXG5cbmNvbnN0IEFMUEhBQkVUID0ge1xuICAncnUtUlUnOiB7XG4gICAgdW5pY29kZTogWzEwNzIsIDExMDNdXG4gIH1cbn1cblxuLy8gZnAgY29tcG9zaXRpb24gJiBwaXBlIGhlbHBlcnNcbmNvbnN0IHBpcGUgPSAoZm4sIC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IGZucy5yZWR1Y2UoKHJlc3VsdCwgZm4pID0+IGZuKHJlc3VsdCksIGZuKC4uLmFyZ3MpKVxuY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+ICguLi5hcmdzKSA9PiBwaXBlKC4uLmZucy5yZXZlcnNlKCkpKC4uLmFyZ3MpXG5cbmNvbnN0IGNvbmNhdCA9IGxpc3QgPT4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5iaW5kKGxpc3QpXG5jb25zdCBwcm9taXNlQ29uY2F0ID0gZiA9PiB4ID0+IGYoKS50aGVuKGNvbmNhdCh4KSlcbmNvbnN0IHByb21pc2VSZWR1Y2UgPSAoYWNjLCB4KSA9PiBhY2MudGhlbihwcm9taXNlQ29uY2F0KHgpKVxuLypcbiAqIHNlcmlhbCBleGVjdXRlcyBQcm9taXNlcyBzZXF1ZW50aWFsbHkuXG4gKiBAcGFyYW0ge2Z1bmNzfSBBbiBhcnJheSBvZiBmdW5jcyB0aGF0IHJldHVybiBwcm9taXNlcy5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB1cmxzID0gWycvdXJsMScsICcvdXJsMicsICcvdXJsMyddXG4gKiBzZXJpYWwodXJscy5tYXAodXJsID0+ICgpID0+ICQuYWpheCh1cmwpKSlcbiAqICAgICAudGhlbihjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKVxuICovXG5jb25zdCBzZXJpYWwgPSBmdW5jcyA9PiBmdW5jcy5yZWR1Y2UocHJvbWlzZVJlZHVjZSwgUHJvbWlzZS5yZXNvbHZlKFtdKSlcblxuY2xhc3MgU3BlYWtlciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjdXJyZW50VXR0ZXJhbmNlOiBPYmplY3RcbiAgaXNTcGVha2luZzogYm9vbGVhbiA9IGZhbHNlXG4gIGN1cnJlbnRTcGVlZDogZG91YmxlID0gMS4wXG5cbiAgLy8gY29uc3RydWN0b3IgKCkge1xuICAvLyAgIHN1cGVyKClcbiAgLy8gICB0aGlzLnN5bnRoLm9udm9pY2VjaGFuZ2VkID0gZXZlbnQgPT4gY29uc29sZS5sb2coZXZlbnQpXG4gIC8vICAgdGhpcy5zeW50aC5vbnZvaWNlc2NoYW5nZWQgPSBldmVudCA9PiBjb25zb2xlLmxvZyhldmVudClcbiAgLy8gfVxuICBzcGVhayAodXR0ZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgdGhpcy5zeW50aC5zcGVhayh0aGlzLmN1cnJlbnRVdHRlcmFuY2UpXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBzdG9wICgpIHsgdGhpcy5zeW50aC5jYWxjZWwoKSB9XG4gIHNldFNwZWVkICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgLy8gdGhpcy5jdXJyZW50VXR0ZXJhbmNlLnJhdGUgPSB2YWx1ZVxuICAgIC8vIHRoaXMuc3BlYWsoKVxuICB9XG4gIHBsYXkgKCkge1xuICAgIHRoaXMuaXNTcGVha2luZyA9IHRydWVcbiAgICB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgcGF1c2UgKCkge1xuICAgIHRoaXMuaXNTcGVha2luZyA9IGZhbHNlXG4gICAgdGhpcy5zeW50aC5wYXVzZSgpXG4gIH1cbiAgcGxheVBhdXNlICgpIHtcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSAhdGhpcy5pc1NwZWFraW5nXG4gICAgdGhpcy5pc1NwZWFraW5nID8gdGhpcy5zeW50aC5wYXVzZSgpIDogdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIGluY3JlbWVudFNwZWVkKCkgeyB0aGlzLmN1cnJlbnRTcGVlZCArPSAwLjEgfVxuICBkZWNyZW1lbnRTcGVlZCgpIHsgdGhpcy5jdXJyZW50U3BlZWQgLT0gMC4xIH1cbn1cblxuY29uc3QgYXBwID0ge1xuICB2ZXJzaW9uOiAnMC4wLjInLFxuICBnZXRWZXJzaW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnZlcnNpb24pXG4gIH0sXG4gIHNwZWFrZXI6IG5ldyBTcGVha2VyKCksXG4gIGN1cnJlbnRVdHRlcmFuY2VJbmRleDogMFxufVxuXG4vKlxuICogQW5hbHlzZXMgdGhlIGZpcnN0IGxldHRlciBpbiB0aGUgd29yZFxuICogTm93IGl0IGNhbiBndWVzcyBiZXR3ZWVuIGN5cmlsaWMgYW5kIGxhdGluIGxldHRlciBvbmx5XG4gKi9cbmNvbnN0IGRldGVjdExhbmdCeVN0ciA9IChzdHI6IHN0cmluZykgPT4ge1xuICBsZXQgY3VycmVudENoYXJJbmRleCA9IDBcbiAgbGV0IG1heENoYXJJbmRleCA9IDNcbiAgd2hpbGUgKGN1cnJlbnRDaGFySW5kZXggPD0gbWF4Q2hhckluZGV4KSB7XG4gICAgY29uc3QgY2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KGN1cnJlbnRDaGFySW5kZXgpXG4gICAgZm9yIChsZXQgYWxwaGFiZXQgaW4gQUxQSEFCRVQpIHtcbiAgICAgIGlmIChjaGFyQ29kZSA+PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVswXSAmJlxuICAgICAgICAgIGNoYXJDb2RlIDw9IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzFdKSB7XG4gICAgICAgIHJldHVybiBhbHBoYWJldFxuICAgICAgfVxuICAgIH1cbiAgICBjdXJyZW50Q2hhckluZGV4KytcbiAgfVxuICByZXR1cm4gJ2VuJ1xufVxuXG50eXBlIHdvcmRUeXBlID0ge1xuICBsYW5nOiBzdHJpbmcsXG4gIHRva2VuOiBzdHJpbmdcbn1cblxuY29uc3QgaXNUaGVTYW1lTGFuZ3VhZ2UgPSAoXG4gIHdvcmQxOiB3b3JkVHlwZSxcbiAgd29yZDI6IHdvcmRUeXBlXG4pID0+IHdvcmQxLmxhbmcgPT09IHdvcmQyLmxhbmdcblxuY29uc3Qgam9pbk9uZUxhbmd1YWdlV29yZHMgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PHdvcmRUeXBlPiA9PiB7XG4gIGNvbnN0IHNlbnRlbmNlcyA9IFtdXG4gIHdvcmRzLmZvckVhY2god29yZCA9PiB7XG4gICAgaWYgKHNlbnRlbmNlcy5sZW5ndGggPT09IDApIHJldHVybiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICAgIGlzVGhlU2FtZUxhbmd1YWdlKHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0sIHdvcmQpXG4gICAgICA/IHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4gPVxuICAgICAgICAgIFtzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuLCB3b3JkLnRva2VuXS5qb2luKCcgJylcbiAgICAgIDogc2VudGVuY2VzLnB1c2god29yZClcbiAgfSlcbiAgcmV0dXJuIHNlbnRlbmNlc1xufVxuXG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gdGV4dC5zcGxpdCgnLicpXG5jb25zdCBzcGxpdFNlbnRlbmNlSW50b1dvcmRzID0gKHNlbnRlbmNlOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHNlbnRlbmNlLnNwbGl0KCcgJylcbmNvbnN0IGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMgPSAod29yZHM6IEFycmF5PHN0cmluZz4pOiBBcnJheTx3b3JkVHlwZT4gPT5cbiAgd29yZHMubWFwKCh0b2tlbjogc3RyaW5nKSA9PiAoe1xuICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgdG9rZW46IHRva2VuXG4gIH0pKVxuY29uc3QgZmlsdGVyV29yZHNBcnJheSA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KSA9PlxuICB3b3Jkcy5maWx0ZXIod29yZCA9PiB3b3JkLnRva2VuLmxlbmd0aCAhPT0gMClcblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudCA9IChzZW50ZW5jZTogd29yZFR5cGUpOiBPYmplY3QgPT4ge1xuICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICB1dHRlclRoaXMubGFuZyA9IHNlbnRlbmNlLmxhbmdcbiAgdXR0ZXJUaGlzLnJhdGUgPSAxLjlcbiAgcmV0dXJuIHV0dGVyVGhpc1xufVxuXG5jb25zdCBjcmVhdGVTcGVha0V2ZW50cyA9IChwYXJ0czogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8T2JqZWN0PiA9PlxuICBwYXJ0cy5tYXAoY3JlYXRlU3BlYWtFdmVudClcblxuY29uc3QgdHJhbnNmb3JtU3BlYWtFdmVudHNJbnRvQ2FsbGJhY2tzID0gKHNwZWFrRXZlbnRzOiBBcnJheTxPYmplY3Q+KSA9PlxuICBzcGVha0V2ZW50cy5tYXAoc3BlYWtFdmVudCA9PiAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAvLyBzcGVha0V2ZW50Lm9uRW5kID0gcmVzb2x2ZSgoKSA9PiApXG4gIH0pKVxuXG5jb25zdCBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyA9XG4gIChzcGVha0V2ZW50c1NlbnRlbmNlczogQXJyYXk8QXJyYXk8T2JqZWN0Pj4pOiBBcnJheTxPYmplY3Q+ID0+XG4gICAgc3BlYWtFdmVudHNTZW50ZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pXG5cbmFwcC5zcGVha0l0TG91ZCA9ICgpID0+IHtcbiAgY29uc3QgdGV4dCA9IGlucHV0LnZhbHVlLnRyaW0oKVxuICBjb25zdCBzZW50ZW5jZXMgPSBzcGxpdFRleHRJbnRvU2VudGVuY2VzKHRleHQpXG4gIGNvbnN0IHRleHRUb2tlbnNBcnJheSA9IHNlbnRlbmNlcy5tYXAoc2VudGVuY2UgPT4gY29tcG9zZShcbiAgICBmaWx0ZXJXb3Jkc0FycmF5LFxuICAgIGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMsXG4gICAgc3BsaXRTZW50ZW5jZUludG9Xb3Jkc1xuICApKHNlbnRlbmNlKSlcblxuICAvLyBjb25zdCBsb2dBbmRDb250aW51ZSA9IChhcmdzKSA9PiB7IGNvbnNvbGUubG9nKGFyZ3MpOyByZXR1cm4gYXJncyB9XG4gIGNvbnN0IHNwZWFrRXZlbnRzU2VudGVuY2VzID0gdGV4dFRva2Vuc0FycmF5Lm1hcChcbiAgICAodGV4dFRva2VuczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8QXJyYXk8T2JqZWN0Pj4gPT4gY29tcG9zZShcbiAgICAgIC8vIHRyYW5zZm9ybVNwZWFrRXZlbnRzSW50b1Byb21pc2VzLFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyhzcGVha0V2ZW50c1NlbnRlbmNlcykuZm9yRWFjaChwaHJhc2UgPT5cbiAgICBwcm9taXNlcy5wdXNoKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcbiAgICAgIGFwcC5jdXJyZW50VXR0ZXJhbmNlSW5kZXggPSBhcHAuY3VycmVudFV0dGVyYW5jZUluZGV4ICsgMVxuICAgICAgY29uc29sZS5sb2coYXBwLmN1cnJlbnRVdHRlcmFuY2VJbmRleClcbiAgICAgIHBocmFzZS5vbmVuZCA9ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShwaHJhc2UudGV4dClcbiAgICAgIH1cbiAgICB9KSlcbiAgKVxuXG4gIHNlcmlhbChwcm9taXNlcykudGhlbihjb25zb2xlLmxvZylcbn1cblxuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGlja2VkJylcbiAgYXBwLnNwZWFrSXRMb3VkKClcbn0pXG5cbmNvbnNvbGUubG9nKGFwcC5zcGVha2VyKVxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGV2ZW50ID0+IHtcbi8vICAgY29uc29sZS5sb2coYXBwLnNwZWFrZXIucGF1c2UoKSlcbi8vIH0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxufSlcblxuaW5jcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmluY3JlbWVudFNwZWVkKClcbn0pXG5cbmRlY3JlbWVudFNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICBhcHAuc3BlYWtlci5kZWNyZW1lbnRTcGVlZCgpXG59KVxuXG4vLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChldmVudDogRXZlbnQpID0+IHtcbi8vICAgY29uc29sZS5sb2coZXZlbnQpXG4vLyAgIGNvbnN0IHRleHQgPSBldmVudC50YXJnZXQudmFsdWVcbi8vIH0pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==