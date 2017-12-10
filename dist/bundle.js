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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nosleep_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_nosleep_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_nosleep_js__);


const $input = document.querySelector('#input-textarea');
const $button = document.querySelector('#button');

const $incrementSpeedButton = document.querySelector('#increment-speed');
const $decrementSpeedButton = document.querySelector('#decrement-speed');

const $progressBar = document.querySelector('#progress-bar');
const $progressPointer = document.querySelector('#progress-pointer');

const $timeLeft = document.querySelector('#time-left');

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  },
  'number': {
    unicode: [48, 57]
  }

  // when speaking speed is 1
};const DEFAULT_WORDS_PER_MINUTE = 117.6;
const MIN_SPEED = 0.52;

// fp composition & pipe helpers
const pipe = (fn, ...fns) => (...args) => fns.reduce((result, fn) => fn(result), fn(...args));
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
    this.isChangingSpeed = false;
    this.isStopped = false;
    this.currentSpeed = 1.1;
  }

  speak(utter) {
    if (!utter && !this.currentUtterance) return false;
    this.currentUtterance = utter || this.currentUtterance;
    this.currentUtterance.rate = this.currentSpeed;
    this.play();
    this.synth.speak(this.currentUtterance);
    this.isStopped = false;
    console.log(this.synth);
  }
  stop() {
    this.currentUtterance = null;
    this.synth.cancel();
    this.isStopped = true;
    return false;
  }

  setSpeed(value) {
    // this.currentUtterance.rate = value
    // this.speak()
  }
  play() {
    this.isStopped = true;
    this.synth.resume();
  }
  pause() {
    this.isStopped = false;
    this.synth.pause();
  }
  playPause() {
    this.isStopped = !this.isStopped;
    this.isStopped ? this.synth.pause() : this.synth.resume();
  }
  _changeSpeed(delta) {
    this.synth.cancel();
    this.currentSpeed = delta > 0 ? this.currentSpeed + delta : this.currentSpeed <= MIN_SPEED ? MIN_SPEED : this.currentSpeed + delta;
    this.isChangingSpeed = true;
    this.speak();
    console.log(this.currentSpeed);
  }
  incrementSpeed() {
    this._changeSpeed(0.1);
  }
  decrementSpeed() {
    this._changeSpeed(-0.1);
  }
}

const app = {
  version: '0.0.4',
  getVersion() {
    console.log(this.version);
  },
  reader: {
    tokensCount: 0,
    currentTokenIndex: 0,
    textReadingDuration: 0,
    get currentProgress() {
      return this.currentTokenIndex / this.tokensCount;
    },
    get timeLeftReading() {
      return this.textReadingDuration - this.textReadingDuration * this.currentProgress;
    }
  },
  speaker: new Speaker(),
  noSleep: new __WEBPACK_IMPORTED_MODULE_0_nosleep_js___default.a(),
  dom: {
    updateProgressBar(progress) {
      $progressPointer.style.transform = `translate(${progress * $progressBar.clientWidth - 16}px, 0)`;
    },
    updateTimeLeft() {
      /* calculates time left reading */
      $timeLeft.innerText = `${app.reader.timeLeftReading.toFixed(1)} min`;
    },
    highlightCurrentSentence(text) {
      $input.querySelector(`#token-${app.reader.currentTokenIndex}`).classList.add('token--highlighted');
      /* Remove highlight from previous token */
      if (app.reader.currentTokenIndex > 0) {
        $input.querySelector(`#token-${app.reader.currentTokenIndex - 1}`).classList.remove('token--highlighted');
      }
    }
  }
};
window.app = app;

/*
 * Analyses the first letter in the word
 * Now it can guess between cyrilic and latin letter only
 */
const detectLangByStr = str => {
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

/*
 * If the words are in the same language, returns truw
 * If one of the words is number, returns true
 * Otherwise, returns false
 */

const isTheSameLanguage = (word1, word2) => word1.lang === word2.lang || [word1.lang, word2.lang].includes('number');

const joinOneLanguageWords = words => {
  const sentences = [];
  words.forEach(word => {
    if (sentences.length === 0) return sentences.push(word);
    const previousWord = sentences[sentences.length - 1];
    isTheSameLanguage(previousWord, word) ? sentences[sentences.length - 1].token = [sentences[sentences.length - 1].token, word.token].join(' ') : sentences.push(word);
  });
  return sentences;
};

const formatText = text => text.replace(/\–/g, '.');
const splitTextIntoSentences = text => text.split('.');
const splitSentenceIntoWords = sentence => sentence.split(' ');
const countWordsInText = text => splitSentenceIntoWords(text).length;
const convertWordsIntoTokens = words => words.map(token => ({
  lang: detectLangByStr(token),
  token: token
}));
const filterWordsArray = words => words.filter(word => word.token.length !== 0);

/*
 * A Medium-like function calculates time left reading
 */
const getTextReadingDuration = (text, speed = 1) => countWordsInText(text) / (DEFAULT_WORDS_PER_MINUTE * speed);

const createSpeakEvent = sentence => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token);
  utterThis.lang = sentence.lang;
  utterThis.rate = 1.9;
  return utterThis;
};

const createSpeakEvents = parts => parts.map(createSpeakEvent);

const concatSpeakEventsSentences = speakEventsSentences => speakEventsSentences.reduce((a, b) => a.concat(b), []);

app.speakItLoud = () => {
  const text = formatText($input.innerText.trim());
  const sentences = splitTextIntoSentences(text);
  console.log(sentences);

  app.reader.textReadingDuration = getTextReadingDuration(text, app.speaker.currentSpeed);

  const textTokensArray = sentences.map(sentence => compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(sentence));

  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(textTokens => compose(createSpeakEvents, joinOneLanguageWords)(textTokens));

  const promises = [];
  const phrases = concatSpeakEventsSentences(speakEventsSentences);
  app.reader.tokensCount = phrases.length;
  phrases.forEach(phrase => promises.push(() => new Promise((resolve, reject) => {

    app.speaker.speak(phrase);
    app.dom.highlightCurrentSentence(phrase.text);

    app.reader.currentTokenIndex = app.reader.currentTokenIndex + 1;
    app.dom.updateProgressBar(app.reader.currentProgress);
    app.dom.updateTimeLeft();

    phrase.onend = () => {
      if (app.speaker.isChangingSpeed) {
        app.speaker.isChangingSpeed = false;
        return;
      }
      if (app.speaker.isStopped) {
        return false;
      }
      return resolve(phrase.text);
    };
  })));

  serial(promises).then(console.log);
};

/*
 * Triggers when «speak» button is pressed
 */
$button.addEventListener('click', event => {
  console.log('clicked');
  app.noSleep.enable();
  app.speakItLoud();
});

/*
 * Triggers when user is trying to refresh/close app
 */
window.addEventListener('beforeunload', event => {
  console.log(app.speaker.stop());
});

document.addEventListener('keydown', event => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause();
  }
});

$input.focus();
$incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed();
});

$decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed();
});

$input.addEventListener('click', event => {
  // TODO: start from the selected sentence (token)
  console.log(event);
});

$input.addEventListener('paste', event => {
  event.preventDefault();

  let pastedText = '';
  const clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;

  pastedText = clipboardData.getData('Text');

  const hiddenInput = document.createElement('div');
  hiddenInput.innerHTML = pastedText;

  const text = hiddenInput.textContent;
  const sentences = splitTextIntoSentences(text);
  console.log(sentences);
  sentences.forEach((sentence, index) => {
    const divToken = document.createElement('div');
    divToken.innerText = sentence + '.';
    divToken.id = `token-${index}`;
    divToken.classList.add('token');
    divToken.setAttribute('spellcheck', 'false');
    $input.appendChild(divToken);
  });
  // $input.innerHTML = text
  console.log(text);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const mediaFile = __webpack_require__(2)

// Detect iOS browsers < version 10
const oldIOS = typeof navigator !== 'undefined' && parseFloat(
  ('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
    .replace('undefined', '3_2').replace('_', '.').replace('_', '')
) < 10 && !window.MSStream

class NoSleep {
  constructor () {
    if (oldIOS) {
      this.noSleepTimer = null
    } else {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement('video')

      this.noSleepVideo.setAttribute('playsinline', '')
      this.noSleepVideo.setAttribute('src', mediaFile)

      this.noSleepVideo.addEventListener('timeupdate', function (e) {
        if (this.noSleepVideo.currentTime > 0.5) {
          this.noSleepVideo.currentTime = Math.random()
        }
      }.bind(this))
    }
  }

  enable () {
    if (oldIOS) {
      this.disable()
      this.noSleepTimer = window.setInterval(function () {
        window.location.href = '/'
        window.setTimeout(window.stop, 0)
      }, 15000)
    } else {
      this.noSleepVideo.play()
    }
  }

  disable () {
    if (oldIOS) {
      if (this.noSleepTimer) {
        window.clearInterval(this.noSleepTimer)
        this.noSleepTimer = null
      }
    } else {
      this.noSleepVideo.pause()
    }
  }
};

module.exports = NoSleep


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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'


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDE1M2ViMDU5OTI5ZDAwYjRiZGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJwaXBlIiwiZm4iLCJmbnMiLCJhcmdzIiwicmVkdWNlIiwicmVzdWx0IiwiY29tcG9zZSIsInJldmVyc2UiLCJjb25jYXQiLCJsaXN0IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJiaW5kIiwicHJvbWlzZUNvbmNhdCIsImYiLCJ4IiwidGhlbiIsInByb21pc2VSZWR1Y2UiLCJhY2MiLCJzZXJpYWwiLCJmdW5jcyIsIlByb21pc2UiLCJyZXNvbHZlIiwiU3BlYWtlciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwicmF0ZSIsInBsYXkiLCJjb25zb2xlIiwibG9nIiwic3RvcCIsImNhbmNlbCIsInNldFNwZWVkIiwidmFsdWUiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJjdXJyZW50UHJvZ3Jlc3MiLCJ0aW1lTGVmdFJlYWRpbmciLCJzcGVha2VyIiwibm9TbGVlcCIsImRvbSIsInVwZGF0ZVByb2dyZXNzQmFyIiwicHJvZ3Jlc3MiLCJzdHlsZSIsInRyYW5zZm9ybSIsImNsaWVudFdpZHRoIiwidXBkYXRlVGltZUxlZnQiLCJpbm5lclRleHQiLCJ0b0ZpeGVkIiwiaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlIiwidGV4dCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImRldGVjdExhbmdCeVN0ciIsInN0ciIsImN1cnJlbnRDaGFySW5kZXgiLCJtYXhDaGFySW5kZXgiLCJjaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImluY2x1ZGVzIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInByZXZpb3VzV29yZCIsInRva2VuIiwiam9pbiIsImZvcm1hdFRleHQiLCJyZXBsYWNlIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInNwbGl0Iiwic3BsaXRTZW50ZW5jZUludG9Xb3JkcyIsInNlbnRlbmNlIiwiY291bnRXb3Jkc0luVGV4dCIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwiZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbiIsInNwZWVkIiwiY3JlYXRlU3BlYWtFdmVudCIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSIsImNyZWF0ZVNwZWFrRXZlbnRzIiwicGFydHMiLCJjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyIsInNwZWFrRXZlbnRzU2VudGVuY2VzIiwiYSIsImIiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJ0ZXh0VG9rZW5zQXJyYXkiLCJ0ZXh0VG9rZW5zIiwicHJvbWlzZXMiLCJwaHJhc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlbmFibGUiLCJrZXlDb2RlIiwiZm9jdXMiLCJwcmV2ZW50RGVmYXVsdCIsInBhc3RlZFRleHQiLCJjbGlwYm9hcmREYXRhIiwib3JpZ2luYWxFdmVudCIsImdldERhdGEiLCJoaWRkZW5JbnB1dCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImluZGV4IiwiZGl2VG9rZW4iLCJpZCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNURBOztBQUVBLE1BQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWY7QUFDQSxNQUFNQyxVQUFVRixTQUFTQyxhQUFULENBQXVCLFNBQXZCLENBQWhCOztBQUVBLE1BQU1FLHdCQUF3QkgsU0FBU0MsYUFBVCxDQUF1QixrQkFBdkIsQ0FBOUI7QUFDQSxNQUFNRyx3QkFBd0JKLFNBQVNDLGFBQVQsQ0FBdUIsa0JBQXZC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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ25EQSxpQ0FBaUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDE1M2ViMDU5OTI5ZDAwYjRiZGQiLCIvLyBAZmxvd1xuaW1wb3J0IE5vU2xlZXAgZnJvbSAnbm9zbGVlcC5qcydcblxuY29uc3QgJGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LXRleHRhcmVhJylcbmNvbnN0ICRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcblxuY29uc3QgJHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpXG5jb25zdCAkcHJvZ3Jlc3NQb2ludGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLXBvaW50ZXInKVxuXG5jb25zdCAkdGltZUxlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGltZS1sZWZ0JylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfSxcbiAgJ251bWJlcic6IHtcbiAgICB1bmljb2RlOiBbNDgsIDU3XVxuICB9XG59XG5cbi8vIHdoZW4gc3BlYWtpbmcgc3BlZWQgaXMgMVxuY29uc3QgREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFID0gMTE3LjZcbmNvbnN0IE1JTl9TUEVFRCA9IDAuNTJcblxuLy8gZnAgY29tcG9zaXRpb24gJiBwaXBlIGhlbHBlcnNcbmNvbnN0IHBpcGUgPSAoZm4sIC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IGZucy5yZWR1Y2UoKHJlc3VsdCwgZm4pID0+IGZuKHJlc3VsdCksIGZuKC4uLmFyZ3MpKVxuY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+ICguLi5hcmdzKSA9PiBwaXBlKC4uLmZucy5yZXZlcnNlKCkpKC4uLmFyZ3MpXG5cbmNvbnN0IGNvbmNhdCA9IGxpc3QgPT4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5iaW5kKGxpc3QpXG5jb25zdCBwcm9taXNlQ29uY2F0ID0gZiA9PiB4ID0+IGYoKS50aGVuKGNvbmNhdCh4KSlcbmNvbnN0IHByb21pc2VSZWR1Y2UgPSAoYWNjLCB4KSA9PiBhY2MudGhlbihwcm9taXNlQ29uY2F0KHgpKVxuLypcbiAqIHNlcmlhbCBleGVjdXRlcyBQcm9taXNlcyBzZXF1ZW50aWFsbHkuXG4gKiBAcGFyYW0ge2Z1bmNzfSBBbiBhcnJheSBvZiBmdW5jcyB0aGF0IHJldHVybiBwcm9taXNlcy5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB1cmxzID0gWycvdXJsMScsICcvdXJsMicsICcvdXJsMyddXG4gKiBzZXJpYWwodXJscy5tYXAodXJsID0+ICgpID0+ICQuYWpheCh1cmwpKSlcbiAqICAgICAudGhlbihjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKVxuICovXG5jb25zdCBzZXJpYWwgPSBmdW5jcyA9PiBmdW5jcy5yZWR1Y2UocHJvbWlzZVJlZHVjZSwgUHJvbWlzZS5yZXNvbHZlKFtdKSlcblxuY2xhc3MgU3BlYWtlciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjdXJyZW50VXR0ZXJhbmNlOiBPYmplY3RcbiAgaXNTcGVha2luZzogYm9vbGVhbiA9IGZhbHNlXG4gIGlzQ2hhbmdpbmdTcGVlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGlzU3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGN1cnJlbnRTcGVlZDogbnVtYmVyID0gMS4xXG5cbiAgc3BlYWsgKHV0dGVyKSB7XG4gICAgaWYgKCF1dHRlciAmJiAhdGhpcy5jdXJyZW50VXR0ZXJhbmNlKSByZXR1cm4gZmFsc2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgdGhpcy5wbGF5KClcbiAgICB0aGlzLnN5bnRoLnNwZWFrKHRoaXMuY3VycmVudFV0dGVyYW5jZSlcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBzdG9wICgpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSBudWxsXG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc2V0U3BlZWQgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAvLyB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHZhbHVlXG4gICAgLy8gdGhpcy5zcGVhaygpXG4gIH1cbiAgcGxheSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWVcbiAgICB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZVxuICAgIHRoaXMuc3ludGgucGF1c2UoKVxuICB9XG4gIHBsYXlQYXVzZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9ICF0aGlzLmlzU3RvcHBlZFxuICAgIHRoaXMuaXNTdG9wcGVkID8gdGhpcy5zeW50aC5wYXVzZSgpIDogdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIF9jaGFuZ2VTcGVlZChkZWx0YTogbnVtYmVyKSB7XG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuY3VycmVudFNwZWVkID0gZGVsdGEgPiAwXG4gICAgICA/IHRoaXMuY3VycmVudFNwZWVkICsgZGVsdGFcbiAgICAgIDogdGhpcy5jdXJyZW50U3BlZWQgPD0gTUlOX1NQRUVEID8gTUlOX1NQRUVEIDogdGhpcy5jdXJyZW50U3BlZWQgKyBkZWx0YVxuICAgIHRoaXMuaXNDaGFuZ2luZ1NwZWVkID0gdHJ1ZVxuICAgIHRoaXMuc3BlYWsoKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFNwZWVkKVxuICB9XG4gIGluY3JlbWVudFNwZWVkKCkgeyB0aGlzLl9jaGFuZ2VTcGVlZCgwLjEpIH1cbiAgZGVjcmVtZW50U3BlZWQoKSB7IHRoaXMuX2NoYW5nZVNwZWVkKC0wLjEpIH1cbn1cblxuY29uc3QgYXBwID0ge1xuICB2ZXJzaW9uOiAnMC4wLjQnLFxuICBnZXRWZXJzaW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnZlcnNpb24pXG4gIH0sXG4gIHJlYWRlcjoge1xuICAgIHRva2Vuc0NvdW50OiAwLFxuICAgIGN1cnJlbnRUb2tlbkluZGV4OiAwLFxuICAgIHRleHRSZWFkaW5nRHVyYXRpb246IDAsXG4gICAgZ2V0IGN1cnJlbnRQcm9ncmVzcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbkluZGV4IC8gdGhpcy50b2tlbnNDb3VudFxuICAgIH0sXG4gICAgZ2V0IHRpbWVMZWZ0UmVhZGluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRSZWFkaW5nRHVyYXRpb24gLVxuICAgICAgICAodGhpcy50ZXh0UmVhZGluZ0R1cmF0aW9uICogdGhpcy5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgfVxuICB9LFxuICBzcGVha2VyOiBuZXcgU3BlYWtlcigpLFxuICBub1NsZWVwOiBuZXcgTm9TbGVlcCgpLFxuICBkb206IHtcbiAgICB1cGRhdGVQcm9ncmVzc0Jhcihwcm9ncmVzczogbnVtYmVyKSB7XG4gICAgICAkcHJvZ3Jlc3NQb2ludGVyLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgIGB0cmFuc2xhdGUoJHtwcm9ncmVzcyAqICRwcm9ncmVzc0Jhci5jbGllbnRXaWR0aCAtIDE2fXB4LCAwKWBcbiAgICB9LFxuICAgIHVwZGF0ZVRpbWVMZWZ0KCkge1xuICAgICAgLyogY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZyAqL1xuICAgICAgJHRpbWVMZWZ0LmlubmVyVGV4dCA9IGAke2FwcC5yZWFkZXIudGltZUxlZnRSZWFkaW5nLnRvRml4ZWQoMSl9IG1pbmBcbiAgICB9LFxuICAgIGhpZ2hsaWdodEN1cnJlbnRTZW50ZW5jZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICRpbnB1dC5xdWVyeVNlbGVjdG9yKGAjdG9rZW4tJHthcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4fWApXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCd0b2tlbi0taGlnaGxpZ2h0ZWQnKVxuICAgICAgLyogUmVtb3ZlIGhpZ2hsaWdodCBmcm9tIHByZXZpb3VzIHRva2VuICovXG4gICAgICBpZiAoYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCA+IDApIHtcbiAgICAgICAgJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggLSAxfWApXG4gICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ3Rva2VuLS1oaWdobGlnaHRlZCcpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG53aW5kb3cuYXBwID0gYXBwXG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMFxuICBsZXQgbWF4Q2hhckluZGV4ID0gM1xuXG4gIHdoaWxlIChjdXJyZW50Q2hhckluZGV4IDw9IG1heENoYXJJbmRleCkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdChjdXJyZW50Q2hhckluZGV4KVxuICAgIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgICBpZiAoY2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgICBjaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgICByZXR1cm4gYWxwaGFiZXRcbiAgICAgIH1cbiAgICB9XG4gICAgY3VycmVudENoYXJJbmRleCsrXG4gIH1cblxuICByZXR1cm4gJ2VuJ1xufVxuXG4vKlxuICogSWYgdGhlIHdvcmRzIGFyZSBpbiB0aGUgc2FtZSBsYW5ndWFnZSwgcmV0dXJucyB0cnV3XG4gKiBJZiBvbmUgb2YgdGhlIHdvcmRzIGlzIG51bWJlciwgcmV0dXJucyB0cnVlXG4gKiBPdGhlcndpc2UsIHJldHVybnMgZmFsc2VcbiAqL1xudHlwZSB3b3JkVHlwZSA9IHtcbiAgbGFuZzogc3RyaW5nLFxuICB0b2tlbjogc3RyaW5nXG59XG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZyB8fFxuICBbd29yZDEubGFuZywgd29yZDIubGFuZ10uaW5jbHVkZXMoJ251bWJlcicpXG5cbmNvbnN0IGpvaW5PbmVMYW5ndWFnZVdvcmRzID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTx3b3JkVHlwZT4gPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBjb25zdCBwcmV2aW91c1dvcmQgPSBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2UocHJldmlvdXNXb3JkLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIHJldHVybiBzZW50ZW5jZXNcbn1cblxuY29uc3QgZm9ybWF0VGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHRleHQucmVwbGFjZSgvXFzigJMvZywgJy4nKVxuY29uc3Qgc3BsaXRUZXh0SW50b1NlbnRlbmNlcyA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiBzZW50ZW5jZS5zcGxpdCgnICcpXG5jb25zdCBjb3VudFdvcmRzSW5UZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gc3BsaXRTZW50ZW5jZUludG9Xb3Jkcyh0ZXh0KS5sZW5ndGhcbmNvbnN0IGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMgPSAod29yZHM6IEFycmF5PHN0cmluZz4pOiBBcnJheTx3b3JkVHlwZT4gPT5cbiAgd29yZHMubWFwKCh0b2tlbjogc3RyaW5nKSA9PiAoe1xuICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgdG9rZW46IHRva2VuXG4gIH0pKVxuY29uc3QgZmlsdGVyV29yZHNBcnJheSA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KSA9PlxuICB3b3Jkcy5maWx0ZXIod29yZCA9PiB3b3JkLnRva2VuLmxlbmd0aCAhPT0gMClcblxuLypcbiAqIEEgTWVkaXVtLWxpa2UgZnVuY3Rpb24gY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZ1xuICovXG5jb25zdCBnZXRUZXh0UmVhZGluZ0R1cmF0aW9uID0gKHRleHQ6IHN0cmluZywgc3BlZWQ6IG51bWJlciA9IDEpID0+XG4gIGNvdW50V29yZHNJblRleHQodGV4dCkgLyAoREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFICogc3BlZWQpXG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnQgPSAoc2VudGVuY2U6IHdvcmRUeXBlKTogT2JqZWN0ID0+IHtcbiAgY29uc3QgdXR0ZXJUaGlzID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZShzZW50ZW5jZS50b2tlbilcbiAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gIHV0dGVyVGhpcy5yYXRlID0gMS45XG4gIHJldHVybiB1dHRlclRoaXNcbn1cblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudHMgPSAocGFydHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PE9iamVjdD4gPT5cbiAgcGFydHMubWFwKGNyZWF0ZVNwZWFrRXZlbnQpXG5cbmNvbnN0IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzID1cbiAgKHNwZWFrRXZlbnRzU2VudGVuY2VzOiBBcnJheTxBcnJheTxPYmplY3Q+Pik6IEFycmF5PE9iamVjdD4gPT5cbiAgICBzcGVha0V2ZW50c1NlbnRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcblxuYXBwLnNwZWFrSXRMb3VkID0gKCkgPT4ge1xuICBjb25zdCB0ZXh0ID0gZm9ybWF0VGV4dCgkaW5wdXQuaW5uZXJUZXh0LnRyaW0oKSlcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuICBjb25zb2xlLmxvZyhzZW50ZW5jZXMpXG5cbiAgYXBwLnJlYWRlci50ZXh0UmVhZGluZ0R1cmF0aW9uID0gZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbih0ZXh0LCBhcHAuc3BlYWtlci5jdXJyZW50U3BlZWQpXG5cbiAgY29uc3QgdGV4dFRva2Vuc0FycmF5ID0gc2VudGVuY2VzLm1hcChzZW50ZW5jZSA9PiBjb21wb3NlKFxuICAgIGZpbHRlcldvcmRzQXJyYXksXG4gICAgY29udmVydFdvcmRzSW50b1Rva2VucyxcbiAgICBzcGxpdFNlbnRlbmNlSW50b1dvcmRzXG4gICkoc2VudGVuY2UpKVxuXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBjb25zdCBwaHJhc2VzID0gY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMoc3BlYWtFdmVudHNTZW50ZW5jZXMpXG4gIGFwcC5yZWFkZXIudG9rZW5zQ291bnQgPSBwaHJhc2VzLmxlbmd0aFxuICBwaHJhc2VzLmZvckVhY2gocGhyYXNlID0+XG4gICAgcHJvbWlzZXMucHVzaCgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcbiAgICAgIGFwcC5kb20uaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlKHBocmFzZS50ZXh0KVxuXG4gICAgICBhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ID0gYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCArIDFcbiAgICAgIGFwcC5kb20udXBkYXRlUHJvZ3Jlc3NCYXIoYXBwLnJlYWRlci5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgICBhcHAuZG9tLnVwZGF0ZVRpbWVMZWZ0KClcblxuICAgICAgcGhyYXNlLm9uZW5kID0gKCkgPT4ge1xuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkKSB7XG4gICAgICAgICAgYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc29sdmUocGhyYXNlLnRleHQpXG4gICAgICB9XG4gICAgfSkpXG4gIClcblxuICBzZXJpYWwocHJvbWlzZXMpLnRoZW4oY29uc29sZS5sb2cpXG59XG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIMKrc3BlYWvCuyBidXR0b24gaXMgcHJlc3NlZFxuICovXG4kYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGlja2VkJylcbiAgYXBwLm5vU2xlZXAuZW5hYmxlKClcbiAgYXBwLnNwZWFrSXRMb3VkKClcbn0pXG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIHVzZXIgaXMgdHJ5aW5nIHRvIHJlZnJlc2gvY2xvc2UgYXBwXG4gKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKGFwcC5zcGVha2VyLnN0b3AoKSlcbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxufSlcblxuJGlucHV0LmZvY3VzKClcbiRpbmNyZW1lbnRTcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgYXBwLnNwZWFrZXIuaW5jcmVtZW50U3BlZWQoKVxufSlcblxuJGRlY3JlbWVudFNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICBhcHAuc3BlYWtlci5kZWNyZW1lbnRTcGVlZCgpXG59KVxuXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIFRPRE86IHN0YXJ0IGZyb20gdGhlIHNlbGVjdGVkIHNlbnRlbmNlICh0b2tlbilcbiAgY29uc29sZS5sb2coZXZlbnQpXG59KVxuXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBsZXQgcGFzdGVkVGV4dCA9ICcnXG4gIGNvbnN0IGNsaXBib2FyZERhdGEgPSBldmVudC5jbGlwYm9hcmREYXRhIHx8XG4gICAgd2luZG93LmNsaXBib2FyZERhdGEgfHwgZXZlbnQub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhXG5cbiAgcGFzdGVkVGV4dCA9IGNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpXG5cbiAgY29uc3QgaGlkZGVuSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBoaWRkZW5JbnB1dC5pbm5lckhUTUwgPSBwYXN0ZWRUZXh0XG5cbiAgY29uc3QgdGV4dCA9IGhpZGRlbklucHV0LnRleHRDb250ZW50XG4gIGNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbiAgY29uc29sZS5sb2coc2VudGVuY2VzKVxuICBzZW50ZW5jZXMuZm9yRWFjaCgoc2VudGVuY2UsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZGl2VG9rZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGRpdlRva2VuLmlubmVyVGV4dCA9IHNlbnRlbmNlICsgJy4nXG4gICAgZGl2VG9rZW4uaWQgPSBgdG9rZW4tJHtpbmRleH1gXG4gICAgZGl2VG9rZW4uY2xhc3NMaXN0LmFkZCgndG9rZW4nKVxuICAgIGRpdlRva2VuLnNldEF0dHJpYnV0ZSgnc3BlbGxjaGVjaycsICdmYWxzZScpXG4gICAgJGlucHV0LmFwcGVuZENoaWxkKGRpdlRva2VuKVxuICB9KVxuICAvLyAkaW5wdXQuaW5uZXJIVE1MID0gdGV4dFxuICBjb25zb2xlLmxvZyh0ZXh0KVxufSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImNvbnN0IG1lZGlhRmlsZSA9IHJlcXVpcmUoJy4vbWVkaWEuanMnKVxuXG4vLyBEZXRlY3QgaU9TIGJyb3dzZXJzIDwgdmVyc2lvbiAxMFxuY29uc3Qgb2xkSU9TID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyc2VGbG9hdChcbiAgKCcnICsgKC9DUFUuKk9TIChbMC05X117Myw0fSlbMC05X117MCwxfXwoQ1BVIGxpa2UpLipBcHBsZVdlYktpdC4qTW9iaWxlL2kuZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbMCwgJyddKVsxXSlcbiAgICAucmVwbGFjZSgndW5kZWZpbmVkJywgJzNfMicpLnJlcGxhY2UoJ18nLCAnLicpLnJlcGxhY2UoJ18nLCAnJylcbikgPCAxMCAmJiAhd2luZG93Lk1TU3RyZWFtXG5cbmNsYXNzIE5vU2xlZXAge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldCB1cCBubyBzbGVlcCB2aWRlbyBlbGVtZW50XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcblxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKVxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGUpXG5cbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5ub1NsZWVwVmlkZW8uY3VycmVudFRpbWUgPiAwLjUpIHtcbiAgICAgICAgICB0aGlzLm5vU2xlZXBWaWRlby5jdXJyZW50VGltZSA9IE1hdGgucmFuZG9tKClcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIGVuYWJsZSAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgdGhpcy5kaXNhYmxlKClcbiAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLydcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQod2luZG93LnN0b3AsIDApXG4gICAgICB9LCAxNTAwMClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8ucGxheSgpXG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZSAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgaWYgKHRoaXMubm9TbGVlcFRpbWVyKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMubm9TbGVlcFRpbWVyKVxuICAgICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8ucGF1c2UoKVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb1NsZWVwXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9ICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUlHWjBlWEJ0Y0RReUFBQUNBR2x6YjIxcGMyOHlZWFpqTVcxd05ERUFBQUFJWm5KbFpRQUFDS0J0WkdGMEFBQUM4d1lGLy8vdjNFWHB2ZWJaU0xlV0xOZ2cyU1B1NzNneU5qUWdMU0JqYjNKbElERTBNaUJ5TWpRM09TQmtaRGM1WVRZeElDMGdTQzR5TmpRdlRWQkZSeTAwSUVGV1F5QmpiMlJsWXlBdElFTnZjSGxzWldaMElESXdNRE10TWpBeE5DQXRJR2gwZEhBNkx5OTNkM2N1ZG1sa1pXOXNZVzR1YjNKbkwzZ3lOalF1YUhSdGJDQXRJRzl3ZEdsdmJuTTZJR05oWW1GalBURWdjbVZtUFRFZ1pHVmliRzlqYXoweE9qQTZNQ0JoYm1Gc2VYTmxQVEI0TVRvd2VERXhNU0J0WlQxb1pYZ2djM1ZpYldVOU1pQndjM2s5TVNCd2MzbGZjbVE5TVM0d01Eb3dMakF3SUcxcGVHVmtYM0psWmowd0lHMWxYM0poYm1kbFBURTJJR05vY205dFlWOXRaVDB4SUhSeVpXeHNhWE05TUNBNGVEaGtZM1E5TUNCamNXMDlNQ0JrWldGa2VtOXVaVDB5TVN3eE1TQm1ZWE4wWDNCemEybHdQVEVnWTJoeWIyMWhYM0Z3WDI5bVpuTmxkRDB3SUhSb2NtVmhaSE05TmlCc2IyOXJZV2hsWVdSZmRHaHlaV0ZrY3oweElITnNhV05sWkY5MGFISmxZV1J6UFRBZ2JuSTlNQ0JrWldOcGJXRjBaVDB4SUdsdWRHVnliR0ZqWldROU1DQmliSFZ5WVhsZlkyOXRjR0YwUFRBZ1kyOXVjM1J5WVdsdVpXUmZhVzUwY21FOU1DQmlabkpoYldWelBUTWdZbDl3ZVhKaGJXbGtQVElnWWw5aFpHRndkRDB4SUdKZlltbGhjejB3SUdScGNtVmpkRDB4SUhkbGFXZG9kR0k5TVNCdmNHVnVYMmR2Y0Qwd0lIZGxhV2RvZEhBOU1TQnJaWGxwYm5ROU16QXdJR3RsZVdsdWRGOXRhVzQ5TXpBZ2MyTmxibVZqZFhROU5EQWdhVzUwY21GZmNtVm1jbVZ6YUQwd0lISmpYMnh2YjJ0aGFHVmhaRDB4TUNCeVl6MWpjbVlnYldKMGNtVmxQVEVnWTNKbVBUSXdMakFnY1dOdmJYQTlNQzQyTUNCeGNHMXBiajB3SUhGd2JXRjRQVFk1SUhGd2MzUmxjRDAwSUhaaWRsOXRZWGh5WVhSbFBUSXdNREF3SUhaaWRsOWlkV1p6YVhwbFBUSTFNREF3SUdOeVpsOXRZWGc5TUM0d0lHNWhiRjlvY21ROWJtOXVaU0JtYVd4c1pYSTlNQ0JwY0Y5eVlYUnBiejB4TGpRd0lHRnhQVEU2TVM0d01BQ0FBQUFBT1dXSWhBQTMvL3ArQzd2OHRERFNUamY5N3c1NWkzU2JSUE80WlkraGtqRDVoYmtBa0wzenBKNmgvTFIxQ0FBQnpnQjFrcXF6VW9ybGhRQUFBQXhCbWlRWWhuLytxWllBRExnQUFBQUpRWjVDUWhYL0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2VZVVFuL3dBTEtDRUFBMEJvSEFBQUFBa0JubU5FSi84QUN5a2hBQU5BYUJ3aEFBTkFhQndBQUFBTlFacG9ORXhEUC82cGxnQU11U0VBQTBCb0hBQUFBQXRCbm9aRkVTd3Ivd0FJK1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbnFWRUovOEFDeWtoQUFOQWFCd0FBQUFKQVo2blJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFEVUdhckRSTVF6LytxWllBRExnaEFBTkFhQndBQUFBTFFaN0tSUlVzSy84QUNQa2hBQU5BYUJ3QUFBQUpBWjdwUkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQUNRR2U2MFFuL3dBTEtDRUFBMEJvSEFBQUFBMUJtdkEwVEVNLy9xbVdBQXk1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDMEdmRGtVVkxDdi9BQWo1SVFBRFFHZ2NBQUFBQ1FHZkxVUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbnk5RUovOEFDeWdoQUFOQWFCd0FBQUFOUVpzME5FeERQLzZwbGdBTXVDRUFBMEJvSEFBQUFBdEJuMUpGRlN3ci93QUkrU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuM0ZFSi84QUN5Z2hBQU5BYUJ3QUFBQUpBWjl6UkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQURVR2JlRFJNUXovK3FaWUFETGtoQUFOQWFCd0FBQUFMUVorV1JSVXNLLzhBQ1BnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVorMVJDZi9BQXNwSVFBRFFHZ2NBQUFBQ1FHZnQwUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQTFCbTd3MFRFTS8vcW1XQUF5NElRQURRR2djQUFBQUMwR2Yya1VWTEN2L0FBajVJUUFEUUdnY0FBQUFDUUdmK1VRbi93QUxLQ0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuL3RFSi84QUN5a2hBQU5BYUJ3QUFBQU5RWnZnTkV4RFAvNnBsZ0FNdVNFQUEwQm9IQ0VBQTBCb0hBQUFBQXRCbmg1RkZTd3Ivd0FJK0NFQUEwQm9IQUFBQUFrQm5qMUVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVo0L1JDZi9BQXNwSVFBRFFHZ2NBQUFBRFVHYUpEUk1Rei8rcVpZQURMZ2hBQU5BYUJ3QUFBQUxRWjVDUlJVc0svOEFDUGtoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjVoUkNmL0FBc29JUUFEUUdnY0FBQUFDUUdlWTBRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBMUJtbWcwVEVNLy9xbVdBQXk1SVFBRFFHZ2NBQUFBQzBHZWhrVVZMQ3YvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZXBVUW4vd0FMS1NFQUEwQm9IQUFBQUFrQm5xZEVKLzhBQ3lnaEFBTkFhQndBQUFBTlFacXNORXhEUC82cGxnQU11Q0VBQTBCb0hDRUFBMEJvSEFBQUFBdEJuc3BGRlN3ci93QUkrU0VBQTBCb0hBQUFBQWtCbnVsRUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjdyUkNmL0FBc29JUUFEUUdnY0FBQUFEVUdhOERSTVF6LytxWllBRExraEFBTkFhQndoQUFOQWFCd0FBQUFMUVo4T1JSVXNLLzhBQ1BraEFBTkFhQndBQUFBSkFaOHRSQ2YvQUFzcElRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZkwwUW4vd0FMS0NFQUEwQm9IQUFBQUExQm16UTBURU0vL3FtV0FBeTRJUUFEUUdnY0FBQUFDMEdmVWtVVkxDdi9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdmY1VRbi93QUxLQ0VBQTBCb0hBQUFBQWtCbjNORUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQU5RWnQ0TkV4Qy8vNnBsZ0FNdVNFQUEwQm9IQUFBQUF0Qm41WkZGU3dyL3dBSStDRUFBMEJvSENFQUEwQm9IQUFBQUFrQm43VkVKLzhBQ3lraEFBTkFhQndBQUFBSkFaKzNSQ2YvQUFzcElRQURRR2djQUFBQURVR2J1elJNUW4vK25oQUFZc0FoQUFOQWFCd2hBQU5BYUJ3QUFBQUpRWi9hUWhQL0FBc3BJUUFEUUdnY0FBQUFDUUdmK1VRbi93QUxLQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQUFBQ2lGdGIyOTJBQUFBYkcxMmFHUUFBQUFBMVlDQ1g5V0FnbDhBQUFQb0FBQUgvQUFCQUFBQkFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQURBQUFBR0dsdlpITUFBQUFBRUlDQWdBY0FULy8vL3Y3L0FBQUYrWFJ5WVdzQUFBQmNkR3RvWkFBQUFBUFZnSUpmMVlDQ1h3QUFBQUVBQUFBQUFBQUgwQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUF5Z0FBQU1vQUFBQUFBQ1JsWkhSekFBQUFIR1ZzYzNRQUFBQUFBQUFBQVFBQUI5QUFBQmR3QUFFQUFBQUFCWEZ0WkdsaEFBQUFJRzFrYUdRQUFBQUExWUNDWDlXQWdsOEFBVitRQUFLL0lGWEVBQUFBQUFBdGFHUnNjZ0FBQUFBQUFBQUFkbWxrWlFBQUFBQUFBQUFBQUFBQUFGWnBaR1Z2U0dGdVpHeGxjZ0FBQUFVY2JXbHVaZ0FBQUJSMmJXaGtBQUFBQVFBQUFBQUFBQUFBQUFBQUpHUnBibVlBQUFBY1pISmxaZ0FBQUFBQUFBQUJBQUFBREhWeWJDQUFBQUFCQUFBRTNITjBZbXdBQUFDWWMzUnpaQUFBQUFBQUFBQUJBQUFBaUdGMll6RUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXlnREtBRWdBQUFCSUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFZLy84QUFBQXlZWFpqUXdGTlFDai80UUFiWjAxQUtPeWhvM3lTVFVCQVFGQUFBQU1BRUFBcjhnRHhneGxnQVFBRWFPK0c4Z0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUE4QUFBTHVBQUFBQlJ6ZEhOekFBQUFBQUFBQUFFQUFBQUJBQUFCOEdOMGRITUFBQUFBQUFBQVBBQUFBQUVBQUJkd0FBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBQzdnQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFFRWMzUnplZ0FBQUFBQUFBQUFBQUFBUEFBQUF6UUFBQUFRQUFBQURRQUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBTkFBQUFEUUFBQVFCemRHTnZBQUFBQUFBQUFEd0FBQUF3QUFBRFpBQUFBM1FBQUFPTkFBQURvQUFBQTdrQUFBUFFBQUFENndBQUEvNEFBQVFYQUFBRUxnQUFCRU1BQUFSY0FBQUVid0FBQkl3QUFBU2hBQUFFdWdBQUJNMEFBQVRrQUFBRS93QUFCUklBQUFVckFBQUZRZ0FBQlYwQUFBVndBQUFGaVFBQUJhQUFBQVcxQUFBRnpnQUFCZUVBQUFYK0FBQUdFd0FBQml3QUFBWS9BQUFHVmdBQUJuRUFBQWFFQUFBR25RQUFCclFBQUFiUEFBQUc0Z0FBQnZVQUFBY1NBQUFISndBQUIwQUFBQWRUQUFBSGNBQUFCNFVBQUFlZUFBQUhzUUFBQjhnQUFBZmpBQUFIOWdBQUNBOEFBQWdtQUFBSVFRQUFDRlFBQUFobkFBQUloQUFBQ0pjQUFBTXNkSEpoYXdBQUFGeDBhMmhrQUFBQUE5V0FnbC9WZ0lKZkFBQUFBZ0FBQUFBQUFBZjhBQUFBQUFBQUFBQUFBQUFCQVFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUNzbTFrYVdFQUFBQWdiV1JvWkFBQUFBRFZnSUpmMVlDQ1h3QUFyRVFBQVdBQVZjUUFBQUFBQUNkb1pHeHlBQUFBQUFBQUFBQnpiM1Z1QUFBQUFBQUFBQUFBQUFBQVUzUmxjbVZ2QUFBQUFtTnRhVzVtQUFBQUVITnRhR1FBQUFBQUFBQUFBQUFBQUNSa2FXNW1BQUFBSEdSeVpXWUFBQUFBQUFBQUFRQUFBQXgxY213Z0FBQUFBUUFBQWlkemRHSnNBQUFBWjNOMGMyUUFBQUFBQUFBQUFRQUFBRmR0Y0RSaEFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQ0FCQUFBQUFBckVRQUFBQUFBRE5sYzJSekFBQUFBQU9BZ0lBaUFBSUFCSUNBZ0JSQUZRQUFBQUFERFVBQUFBQUFCWUNBZ0FJU0VBYUFnSUFCQWdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFCWUFBQUVBQUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFBVWMzUnplZ0FBQUFBQUFBQUdBQUFBV0FBQUFYQnpkR052QUFBQUFBQUFBRmdBQUFPQkFBQURod0FBQTVvQUFBT3RBQUFEc3dBQUE4b0FBQVBmQUFBRDVRQUFBL2dBQUFRTEFBQUVFUUFBQkNnQUFBUTlBQUFFVUFBQUJGWUFBQVJwQUFBRWdBQUFCSVlBQUFTYkFBQUVyZ0FBQkxRQUFBVEhBQUFFM2dBQUJQTUFBQVQ1QUFBRkRBQUFCUjhBQUFVbEFBQUZQQUFBQlZFQUFBVlhBQUFGYWdBQUJYMEFBQVdEQUFBRm1nQUFCYThBQUFYQ0FBQUZ5QUFBQmRzQUFBWHlBQUFGK0FBQUJnMEFBQVlnQUFBR0pnQUFCamtBQUFaUUFBQUdaUUFBQm1zQUFBWitBQUFHa1FBQUJwY0FBQWF1QUFBR3d3QUFCc2tBQUFiY0FBQUc3d0FBQndZQUFBY01BQUFISVFBQUJ6UUFBQWM2QUFBSFRRQUFCMlFBQUFkcUFBQUhmd0FBQjVJQUFBZVlBQUFIcXdBQUI4SUFBQWZYQUFBSDNRQUFCL0FBQUFnREFBQUlDUUFBQ0NBQUFBZzFBQUFJT3dBQUNFNEFBQWhoQUFBSWVBQUFDSDRBQUFpUkFBQUlwQUFBQ0tvQUFBaXdBQUFJdGdBQUNMd0FBQWpDQUFBQUZuVmtkR0VBQUFBT2JtRnRaVk4wWlhKbGJ3QUFBSEIxWkhSaEFBQUFhRzFsZEdFQUFBQUFBQUFBSVdoa2JISUFBQUFBQUFBQUFHMWthWEpoY0hCc0FBQUFBQUFBQUFBQUFBQUFPMmxzYzNRQUFBQXpxWFJ2YndBQUFDdGtZWFJoQUFBQUFRQUFBQUJJWVc1a1FuSmhhMlVnTUM0eE1DNHlJREl3TVRVd05qRXhNREE9J1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==