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
const $initialText = document.querySelector('#initial-text');
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
    // app.dom.highlightCurrentSentence(phrase.text)

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

$initialText.focus();

$incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed();
});

$decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed();
});

$input.addEventListener('click', event => {
  $initialText.remove();
  // TODO: start from the selected sentence (token)
  console.log(event);
});

$input.addEventListener('keydown', event => {
  $initialText.remove();
  console.log('dfjsoifjdsoif');
});

$input.addEventListener('paste', event => {
  $initialText.remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2Y2MmVmNjczZmY1ODBkMWZkM2UiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGluaXRpYWxUZXh0IiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJwaXBlIiwiZm4iLCJmbnMiLCJhcmdzIiwicmVkdWNlIiwicmVzdWx0IiwiY29tcG9zZSIsInJldmVyc2UiLCJjb25jYXQiLCJsaXN0IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJiaW5kIiwicHJvbWlzZUNvbmNhdCIsImYiLCJ4IiwidGhlbiIsInByb21pc2VSZWR1Y2UiLCJhY2MiLCJzZXJpYWwiLCJmdW5jcyIsIlByb21pc2UiLCJyZXNvbHZlIiwiU3BlYWtlciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwicmF0ZSIsInBsYXkiLCJjb25zb2xlIiwibG9nIiwic3RvcCIsImNhbmNlbCIsInNldFNwZWVkIiwidmFsdWUiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJjdXJyZW50UHJvZ3Jlc3MiLCJ0aW1lTGVmdFJlYWRpbmciLCJzcGVha2VyIiwibm9TbGVlcCIsImRvbSIsInVwZGF0ZVByb2dyZXNzQmFyIiwicHJvZ3Jlc3MiLCJzdHlsZSIsInRyYW5zZm9ybSIsImNsaWVudFdpZHRoIiwidXBkYXRlVGltZUxlZnQiLCJpbm5lclRleHQiLCJ0b0ZpeGVkIiwiaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlIiwidGV4dCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImRldGVjdExhbmdCeVN0ciIsInN0ciIsImN1cnJlbnRDaGFySW5kZXgiLCJtYXhDaGFySW5kZXgiLCJjaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImluY2x1ZGVzIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInByZXZpb3VzV29yZCIsInRva2VuIiwiam9pbiIsImZvcm1hdFRleHQiLCJyZXBsYWNlIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInNwbGl0Iiwic3BsaXRTZW50ZW5jZUludG9Xb3JkcyIsInNlbnRlbmNlIiwiY291bnRXb3Jkc0luVGV4dCIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwiZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbiIsInNwZWVkIiwiY3JlYXRlU3BlYWtFdmVudCIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSIsImNyZWF0ZVNwZWFrRXZlbnRzIiwicGFydHMiLCJjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyIsInNwZWFrRXZlbnRzU2VudGVuY2VzIiwiYSIsImIiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJ0ZXh0VG9rZW5zQXJyYXkiLCJ0ZXh0VG9rZW5zIiwicHJvbWlzZXMiLCJwaHJhc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlbmFibGUiLCJrZXlDb2RlIiwiZm9jdXMiLCJwcmV2ZW50RGVmYXVsdCIsInBhc3RlZFRleHQiLCJjbGlwYm9hcmREYXRhIiwib3JpZ2luYWxFdmVudCIsImdldERhdGEiLCJoaWRkZW5JbnB1dCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImluZGV4IiwiZGl2VG9rZW4iLCJpZCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNURBOztBQUVBLE1BQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWY7QUFDQSxNQUFNQyxlQUFlRixTQUFTQyxhQUFULENBQXVCLGVBQXZCLENBQXJCO0FBQ0EsTUFBTUUsVUFBVUgsU0FBU0MsYUFBVCxDQUF1QixTQUF2QixDQUFoQjs7QUFFQSxNQUFNRyx3QkFBd0JKLFNBQVNDLGFBQVQs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QVlpQyxJQUFaO0FBQ0QsQ0ExQkQsRTs7Ozs7O0FDN1RBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsSUFBSSxRQUFRLElBQUk7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuREEsaUNBQWlDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNmNjJlZjY3M2ZmNTgwZDFmZDNlIiwiLy8gQGZsb3dcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMnXG5cbmNvbnN0ICRpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCAkaW5pdGlhbFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5pdGlhbC10ZXh0JylcbmNvbnN0ICRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcblxuY29uc3QgJHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpXG5jb25zdCAkcHJvZ3Jlc3NQb2ludGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLXBvaW50ZXInKVxuXG5jb25zdCAkdGltZUxlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGltZS1sZWZ0JylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfSxcbiAgJ251bWJlcic6IHtcbiAgICB1bmljb2RlOiBbNDgsIDU3XVxuICB9XG59XG5cbi8vIHdoZW4gc3BlYWtpbmcgc3BlZWQgaXMgMVxuY29uc3QgREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFID0gMTE3LjZcbmNvbnN0IE1JTl9TUEVFRCA9IDAuNTJcblxuLy8gZnAgY29tcG9zaXRpb24gJiBwaXBlIGhlbHBlcnNcbmNvbnN0IHBpcGUgPSAoZm4sIC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IGZucy5yZWR1Y2UoKHJlc3VsdCwgZm4pID0+IGZuKHJlc3VsdCksIGZuKC4uLmFyZ3MpKVxuY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+ICguLi5hcmdzKSA9PiBwaXBlKC4uLmZucy5yZXZlcnNlKCkpKC4uLmFyZ3MpXG5cbmNvbnN0IGNvbmNhdCA9IGxpc3QgPT4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5iaW5kKGxpc3QpXG5jb25zdCBwcm9taXNlQ29uY2F0ID0gZiA9PiB4ID0+IGYoKS50aGVuKGNvbmNhdCh4KSlcbmNvbnN0IHByb21pc2VSZWR1Y2UgPSAoYWNjLCB4KSA9PiBhY2MudGhlbihwcm9taXNlQ29uY2F0KHgpKVxuLypcbiAqIHNlcmlhbCBleGVjdXRlcyBQcm9taXNlcyBzZXF1ZW50aWFsbHkuXG4gKiBAcGFyYW0ge2Z1bmNzfSBBbiBhcnJheSBvZiBmdW5jcyB0aGF0IHJldHVybiBwcm9taXNlcy5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB1cmxzID0gWycvdXJsMScsICcvdXJsMicsICcvdXJsMyddXG4gKiBzZXJpYWwodXJscy5tYXAodXJsID0+ICgpID0+ICQuYWpheCh1cmwpKSlcbiAqICAgICAudGhlbihjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKVxuICovXG5jb25zdCBzZXJpYWwgPSBmdW5jcyA9PiBmdW5jcy5yZWR1Y2UocHJvbWlzZVJlZHVjZSwgUHJvbWlzZS5yZXNvbHZlKFtdKSlcblxuY2xhc3MgU3BlYWtlciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjdXJyZW50VXR0ZXJhbmNlOiBPYmplY3RcbiAgaXNTcGVha2luZzogYm9vbGVhbiA9IGZhbHNlXG4gIGlzQ2hhbmdpbmdTcGVlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGlzU3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGN1cnJlbnRTcGVlZDogbnVtYmVyID0gMS4xXG5cbiAgc3BlYWsgKHV0dGVyKSB7XG4gICAgaWYgKCF1dHRlciAmJiAhdGhpcy5jdXJyZW50VXR0ZXJhbmNlKSByZXR1cm4gZmFsc2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgdGhpcy5wbGF5KClcbiAgICB0aGlzLnN5bnRoLnNwZWFrKHRoaXMuY3VycmVudFV0dGVyYW5jZSlcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBzdG9wICgpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSBudWxsXG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc2V0U3BlZWQgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAvLyB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHZhbHVlXG4gICAgLy8gdGhpcy5zcGVhaygpXG4gIH1cbiAgcGxheSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWVcbiAgICB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZVxuICAgIHRoaXMuc3ludGgucGF1c2UoKVxuICB9XG4gIHBsYXlQYXVzZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9ICF0aGlzLmlzU3RvcHBlZFxuICAgIHRoaXMuaXNTdG9wcGVkID8gdGhpcy5zeW50aC5wYXVzZSgpIDogdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIF9jaGFuZ2VTcGVlZChkZWx0YTogbnVtYmVyKSB7XG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuY3VycmVudFNwZWVkID0gZGVsdGEgPiAwXG4gICAgICA/IHRoaXMuY3VycmVudFNwZWVkICsgZGVsdGFcbiAgICAgIDogdGhpcy5jdXJyZW50U3BlZWQgPD0gTUlOX1NQRUVEID8gTUlOX1NQRUVEIDogdGhpcy5jdXJyZW50U3BlZWQgKyBkZWx0YVxuICAgIHRoaXMuaXNDaGFuZ2luZ1NwZWVkID0gdHJ1ZVxuICAgIHRoaXMuc3BlYWsoKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFNwZWVkKVxuICB9XG4gIGluY3JlbWVudFNwZWVkKCkgeyB0aGlzLl9jaGFuZ2VTcGVlZCgwLjEpIH1cbiAgZGVjcmVtZW50U3BlZWQoKSB7IHRoaXMuX2NoYW5nZVNwZWVkKC0wLjEpIH1cbn1cblxuY29uc3QgYXBwID0ge1xuICB2ZXJzaW9uOiAnMC4wLjQnLFxuICBnZXRWZXJzaW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnZlcnNpb24pXG4gIH0sXG4gIHJlYWRlcjoge1xuICAgIHRva2Vuc0NvdW50OiAwLFxuICAgIGN1cnJlbnRUb2tlbkluZGV4OiAwLFxuICAgIHRleHRSZWFkaW5nRHVyYXRpb246IDAsXG4gICAgZ2V0IGN1cnJlbnRQcm9ncmVzcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbkluZGV4IC8gdGhpcy50b2tlbnNDb3VudFxuICAgIH0sXG4gICAgZ2V0IHRpbWVMZWZ0UmVhZGluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRSZWFkaW5nRHVyYXRpb24gLVxuICAgICAgICAodGhpcy50ZXh0UmVhZGluZ0R1cmF0aW9uICogdGhpcy5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgfVxuICB9LFxuICBzcGVha2VyOiBuZXcgU3BlYWtlcigpLFxuICBub1NsZWVwOiBuZXcgTm9TbGVlcCgpLFxuICBkb206IHtcbiAgICB1cGRhdGVQcm9ncmVzc0Jhcihwcm9ncmVzczogbnVtYmVyKSB7XG4gICAgICAkcHJvZ3Jlc3NQb2ludGVyLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgIGB0cmFuc2xhdGUoJHtwcm9ncmVzcyAqICRwcm9ncmVzc0Jhci5jbGllbnRXaWR0aCAtIDE2fXB4LCAwKWBcbiAgICB9LFxuICAgIHVwZGF0ZVRpbWVMZWZ0KCkge1xuICAgICAgLyogY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZyAqL1xuICAgICAgJHRpbWVMZWZ0LmlubmVyVGV4dCA9IGAke2FwcC5yZWFkZXIudGltZUxlZnRSZWFkaW5nLnRvRml4ZWQoMSl9IG1pbmBcbiAgICB9LFxuICAgIGhpZ2hsaWdodEN1cnJlbnRTZW50ZW5jZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICRpbnB1dC5xdWVyeVNlbGVjdG9yKGAjdG9rZW4tJHthcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4fWApXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCd0b2tlbi0taGlnaGxpZ2h0ZWQnKVxuICAgICAgLyogUmVtb3ZlIGhpZ2hsaWdodCBmcm9tIHByZXZpb3VzIHRva2VuICovXG4gICAgICBpZiAoYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCA+IDApIHtcbiAgICAgICAgJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggLSAxfWApXG4gICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ3Rva2VuLS1oaWdobGlnaHRlZCcpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG53aW5kb3cuYXBwID0gYXBwXG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMFxuICBsZXQgbWF4Q2hhckluZGV4ID0gM1xuXG4gIHdoaWxlIChjdXJyZW50Q2hhckluZGV4IDw9IG1heENoYXJJbmRleCkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdChjdXJyZW50Q2hhckluZGV4KVxuICAgIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgICBpZiAoY2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgICBjaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgICByZXR1cm4gYWxwaGFiZXRcbiAgICAgIH1cbiAgICB9XG4gICAgY3VycmVudENoYXJJbmRleCsrXG4gIH1cblxuICByZXR1cm4gJ2VuJ1xufVxuXG4vKlxuICogSWYgdGhlIHdvcmRzIGFyZSBpbiB0aGUgc2FtZSBsYW5ndWFnZSwgcmV0dXJucyB0cnV3XG4gKiBJZiBvbmUgb2YgdGhlIHdvcmRzIGlzIG51bWJlciwgcmV0dXJucyB0cnVlXG4gKiBPdGhlcndpc2UsIHJldHVybnMgZmFsc2VcbiAqL1xudHlwZSB3b3JkVHlwZSA9IHtcbiAgbGFuZzogc3RyaW5nLFxuICB0b2tlbjogc3RyaW5nXG59XG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZyB8fFxuICBbd29yZDEubGFuZywgd29yZDIubGFuZ10uaW5jbHVkZXMoJ251bWJlcicpXG5cbmNvbnN0IGpvaW5PbmVMYW5ndWFnZVdvcmRzID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTx3b3JkVHlwZT4gPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBjb25zdCBwcmV2aW91c1dvcmQgPSBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2UocHJldmlvdXNXb3JkLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIHJldHVybiBzZW50ZW5jZXNcbn1cblxuY29uc3QgZm9ybWF0VGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHRleHQucmVwbGFjZSgvXFzigJMvZywgJy4nKVxuY29uc3Qgc3BsaXRUZXh0SW50b1NlbnRlbmNlcyA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiBzZW50ZW5jZS5zcGxpdCgnICcpXG5jb25zdCBjb3VudFdvcmRzSW5UZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gc3BsaXRTZW50ZW5jZUludG9Xb3Jkcyh0ZXh0KS5sZW5ndGhcbmNvbnN0IGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMgPSAod29yZHM6IEFycmF5PHN0cmluZz4pOiBBcnJheTx3b3JkVHlwZT4gPT5cbiAgd29yZHMubWFwKCh0b2tlbjogc3RyaW5nKSA9PiAoe1xuICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgdG9rZW46IHRva2VuXG4gIH0pKVxuY29uc3QgZmlsdGVyV29yZHNBcnJheSA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KSA9PlxuICB3b3Jkcy5maWx0ZXIod29yZCA9PiB3b3JkLnRva2VuLmxlbmd0aCAhPT0gMClcblxuLypcbiAqIEEgTWVkaXVtLWxpa2UgZnVuY3Rpb24gY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZ1xuICovXG5jb25zdCBnZXRUZXh0UmVhZGluZ0R1cmF0aW9uID0gKHRleHQ6IHN0cmluZywgc3BlZWQ6IG51bWJlciA9IDEpID0+XG4gIGNvdW50V29yZHNJblRleHQodGV4dCkgLyAoREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFICogc3BlZWQpXG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnQgPSAoc2VudGVuY2U6IHdvcmRUeXBlKTogT2JqZWN0ID0+IHtcbiAgY29uc3QgdXR0ZXJUaGlzID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZShzZW50ZW5jZS50b2tlbilcbiAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gIHV0dGVyVGhpcy5yYXRlID0gMS45XG4gIHJldHVybiB1dHRlclRoaXNcbn1cblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudHMgPSAocGFydHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PE9iamVjdD4gPT5cbiAgcGFydHMubWFwKGNyZWF0ZVNwZWFrRXZlbnQpXG5cbmNvbnN0IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzID1cbiAgKHNwZWFrRXZlbnRzU2VudGVuY2VzOiBBcnJheTxBcnJheTxPYmplY3Q+Pik6IEFycmF5PE9iamVjdD4gPT5cbiAgICBzcGVha0V2ZW50c1NlbnRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcblxuYXBwLnNwZWFrSXRMb3VkID0gKCkgPT4ge1xuICBjb25zdCB0ZXh0ID0gZm9ybWF0VGV4dCgkaW5wdXQuaW5uZXJUZXh0LnRyaW0oKSlcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuICBjb25zb2xlLmxvZyhzZW50ZW5jZXMpXG5cbiAgYXBwLnJlYWRlci50ZXh0UmVhZGluZ0R1cmF0aW9uID0gZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbih0ZXh0LCBhcHAuc3BlYWtlci5jdXJyZW50U3BlZWQpXG5cbiAgY29uc3QgdGV4dFRva2Vuc0FycmF5ID0gc2VudGVuY2VzLm1hcChzZW50ZW5jZSA9PiBjb21wb3NlKFxuICAgIGZpbHRlcldvcmRzQXJyYXksXG4gICAgY29udmVydFdvcmRzSW50b1Rva2VucyxcbiAgICBzcGxpdFNlbnRlbmNlSW50b1dvcmRzXG4gICkoc2VudGVuY2UpKVxuXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBjb25zdCBwaHJhc2VzID0gY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMoc3BlYWtFdmVudHNTZW50ZW5jZXMpXG4gIGFwcC5yZWFkZXIudG9rZW5zQ291bnQgPSBwaHJhc2VzLmxlbmd0aFxuICBwaHJhc2VzLmZvckVhY2gocGhyYXNlID0+XG4gICAgcHJvbWlzZXMucHVzaCgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcbiAgICAgIC8vIGFwcC5kb20uaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlKHBocmFzZS50ZXh0KVxuXG4gICAgICBhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ID0gYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCArIDFcbiAgICAgIGFwcC5kb20udXBkYXRlUHJvZ3Jlc3NCYXIoYXBwLnJlYWRlci5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgICBhcHAuZG9tLnVwZGF0ZVRpbWVMZWZ0KClcblxuICAgICAgcGhyYXNlLm9uZW5kID0gKCkgPT4ge1xuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkKSB7XG4gICAgICAgICAgYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc29sdmUocGhyYXNlLnRleHQpXG4gICAgICB9XG4gICAgfSkpXG4gIClcblxuICBzZXJpYWwocHJvbWlzZXMpLnRoZW4oY29uc29sZS5sb2cpXG59XG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIMKrc3BlYWvCuyBidXR0b24gaXMgcHJlc3NlZFxuICovXG4kYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGlja2VkJylcbiAgYXBwLm5vU2xlZXAuZW5hYmxlKClcbiAgYXBwLnNwZWFrSXRMb3VkKClcbn0pXG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIHVzZXIgaXMgdHJ5aW5nIHRvIHJlZnJlc2gvY2xvc2UgYXBwXG4gKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKGFwcC5zcGVha2VyLnN0b3AoKSlcbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxufSlcblxuJGlucHV0LmZvY3VzKClcblxuJGluaXRpYWxUZXh0LmZvY3VzKClcblxuXG4kaW5jcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmluY3JlbWVudFNwZWVkKClcbn0pXG5cbiRkZWNyZW1lbnRTcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgYXBwLnNwZWFrZXIuZGVjcmVtZW50U3BlZWQoKVxufSlcblxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgLy8gVE9ETzogc3RhcnQgZnJvbSB0aGUgc2VsZWN0ZWQgc2VudGVuY2UgKHRva2VuKVxuICBjb25zb2xlLmxvZyhldmVudClcbn0pXG5cbiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgY29uc29sZS5sb2coJ2RmanNvaWZqZHNvaWYnKVxufSlcblxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIGxldCBwYXN0ZWRUZXh0ID0gJydcbiAgY29uc3QgY2xpcGJvYXJkRGF0YSA9IGV2ZW50LmNsaXBib2FyZERhdGEgfHxcbiAgICB3aW5kb3cuY2xpcGJvYXJkRGF0YSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGFcblxuICBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0JylcblxuICBjb25zdCBoaWRkZW5JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGhpZGRlbklucHV0LmlubmVySFRNTCA9IHBhc3RlZFRleHRcblxuICBjb25zdCB0ZXh0ID0gaGlkZGVuSW5wdXQudGV4dENvbnRlbnRcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuICBjb25zb2xlLmxvZyhzZW50ZW5jZXMpXG4gIHNlbnRlbmNlcy5mb3JFYWNoKChzZW50ZW5jZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBkaXZUb2tlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2VG9rZW4uaW5uZXJUZXh0ID0gc2VudGVuY2UgKyAnLidcbiAgICBkaXZUb2tlbi5pZCA9IGB0b2tlbi0ke2luZGV4fWBcbiAgICBkaXZUb2tlbi5jbGFzc0xpc3QuYWRkKCd0b2tlbicpXG4gICAgZGl2VG9rZW4uc2V0QXR0cmlidXRlKCdzcGVsbGNoZWNrJywgJ2ZhbHNlJylcbiAgICAkaW5wdXQuYXBwZW5kQ2hpbGQoZGl2VG9rZW4pXG4gIH0pXG4gIC8vICRpbnB1dC5pbm5lckhUTUwgPSB0ZXh0XG4gIGNvbnNvbGUubG9nKHRleHQpXG59KVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiY29uc3QgbWVkaWFGaWxlID0gcmVxdWlyZSgnLi9tZWRpYS5qcycpXG5cbi8vIERldGVjdCBpT1MgYnJvd3NlcnMgPCB2ZXJzaW9uIDEwXG5jb25zdCBvbGRJT1MgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBwYXJzZUZsb2F0KFxuICAoJycgKyAoL0NQVS4qT1MgKFswLTlfXXszLDR9KVswLTlfXXswLDF9fChDUFUgbGlrZSkuKkFwcGxlV2ViS2l0LipNb2JpbGUvaS5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFswLCAnJ10pWzFdKVxuICAgIC5yZXBsYWNlKCd1bmRlZmluZWQnLCAnM18yJykucmVwbGFjZSgnXycsICcuJykucmVwbGFjZSgnXycsICcnKVxuKSA8IDEwICYmICF3aW5kb3cuTVNTdHJlYW1cblxuY2xhc3MgTm9TbGVlcCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0IHVwIG5vIHNsZWVwIHZpZGVvIGVsZW1lbnRcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5zZXRBdHRyaWJ1dGUoJ3BsYXlzaW5saW5lJywgJycpXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5zZXRBdHRyaWJ1dGUoJ3NyYycsIG1lZGlhRmlsZSlcblxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLm5vU2xlZXBWaWRlby5jdXJyZW50VGltZSA+IDAuNSkge1xuICAgICAgICAgIHRoaXMubm9TbGVlcFZpZGVvLmN1cnJlbnRUaW1lID0gTWF0aC5yYW5kb20oKVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgfVxuICB9XG5cbiAgZW5hYmxlICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICB0aGlzLmRpc2FibGUoKVxuICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJ1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMClcbiAgICAgIH0sIDE1MDAwKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5wbGF5KClcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICBpZiAodGhpcy5ub1NsZWVwVGltZXIpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5ub1NsZWVwVGltZXIpXG4gICAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5wYXVzZSgpXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vU2xlZXBcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gJ2RhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSUdaMGVYQnRjRFF5QUFBQ0FHbHpiMjFwYzI4eVlYWmpNVzF3TkRFQUFBQUlabkpsWlFBQUNLQnRaR0YwQUFBQzh3WUYvLy92M0VYcHZlYlpTTGVXTE5nZzJTUHU3M2d5TmpRZ0xTQmpiM0psSURFME1pQnlNalEzT1NCa1pEYzVZVFl4SUMwZ1NDNHlOalF2VFZCRlJ5MDBJRUZXUXlCamIyUmxZeUF0SUVOdmNIbHNaV1owSURJd01ETXRNakF4TkNBdElHaDBkSEE2THk5M2QzY3VkbWxrWlc5c1lXNHViM0puTDNneU5qUXVhSFJ0YkNBdElHOXdkR2x2Ym5NNklHTmhZbUZqUFRFZ2NtVm1QVEVnWkdWaWJHOWphejB4T2pBNk1DQmhibUZzZVhObFBUQjRNVG93ZURFeE1TQnRaVDFvWlhnZ2MzVmliV1U5TWlCd2MzazlNU0J3YzNsZmNtUTlNUzR3TURvd0xqQXdJRzFwZUdWa1gzSmxaajB3SUcxbFgzSmhibWRsUFRFMklHTm9jbTl0WVY5dFpUMHhJSFJ5Wld4c2FYTTlNQ0E0ZURoa1kzUTlNQ0JqY1cwOU1DQmtaV0ZrZW05dVpUMHlNU3d4TVNCbVlYTjBYM0J6YTJsd1BURWdZMmh5YjIxaFgzRndYMjltWm5ObGREMHdJSFJvY21WaFpITTlOaUJzYjI5cllXaGxZV1JmZEdoeVpXRmtjejB4SUhOc2FXTmxaRjkwYUhKbFlXUnpQVEFnYm5JOU1DQmtaV05wYldGMFpUMHhJR2x1ZEdWeWJHRmpaV1E5TUNCaWJIVnlZWGxmWTI5dGNHRjBQVEFnWTI5dWMzUnlZV2x1WldSZmFXNTBjbUU5TUNCaVpuSmhiV1Z6UFRNZ1lsOXdlWEpoYldsa1BUSWdZbDloWkdGd2REMHhJR0pmWW1saGN6MHdJR1JwY21WamREMHhJSGRsYVdkb2RHSTlNU0J2Y0dWdVgyZHZjRDB3SUhkbGFXZG9kSEE5TVNCclpYbHBiblE5TXpBd0lHdGxlV2x1ZEY5dGFXNDlNekFnYzJObGJtVmpkWFE5TkRBZ2FXNTBjbUZmY21WbWNtVnphRDB3SUhKalgyeHZiMnRoYUdWaFpEMHhNQ0J5WXoxamNtWWdiV0owY21WbFBURWdZM0ptUFRJd0xqQWdjV052YlhBOU1DNDJNQ0J4Y0cxcGJqMHdJSEZ3YldGNFBUWTVJSEZ3YzNSbGNEMDBJSFppZGw5dFlYaHlZWFJsUFRJd01EQXdJSFppZGw5aWRXWnphWHBsUFRJMU1EQXdJR055Wmw5dFlYZzlNQzR3SUc1aGJGOW9jbVE5Ym05dVpTQm1hV3hzWlhJOU1DQnBjRjl5WVhScGJ6MHhMalF3SUdGeFBURTZNUzR3TUFDQUFBQUFPV1dJaEFBMy8vcCtDN3Y4dEREU1RqZjk3dzU1aTNTYlJQTzRaWStoa2pENWhia0FrTDN6cEo2aC9MUjFDQUFCemdCMWtxcXpVb3JsaFFBQUFBeEJtaVFZaG4vK3FaWUFETGdBQUFBSlFaNUNRaFgvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZVlVUW4vd0FMS0NFQUEwQm9IQUFBQUFrQm5tTkVKLzhBQ3lraEFBTkFhQndoQUFOQWFCd0FBQUFOUVpwb05FeERQLzZwbGdBTXVTRUFBMEJvSEFBQUFBdEJub1pGRVN3ci93QUkrU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JucVZFSi84QUN5a2hBQU5BYUJ3QUFBQUpBWjZuUkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQURVR2FyRFJNUXovK3FaWUFETGdoQUFOQWFCd0FBQUFMUVo3S1JSVXNLLzhBQ1BraEFBTkFhQndBQUFBSkFaN3BSQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZTYwUW4vd0FMS0NFQUEwQm9IQUFBQUExQm12QTBURU0vL3FtV0FBeTVJUUFEUUdnY0lRQURRR2djQUFBQUMwR2ZEa1VWTEN2L0FBajVJUUFEUUdnY0FBQUFDUUdmTFVRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JueTlFSi84QUN5Z2hBQU5BYUJ3QUFBQU5RWnMwTkV4RFAvNnBsZ0FNdUNFQUEwQm9IQUFBQUF0Qm4xSkZGU3dyL3dBSStTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm4zRkVKLzhBQ3lnaEFBTkFhQndBQUFBSkFaOXpSQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBRFVHYmVEUk1Rei8rcVpZQURMa2hBQU5BYUJ3QUFBQUxRWitXUlJVc0svOEFDUGdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWisxUkNmL0FBc3BJUUFEUUdnY0FBQUFDUUdmdDBRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBMUJtN3cwVEVNLy9xbVdBQXk0SVFBRFFHZ2NBQUFBQzBHZjJrVVZMQ3YvQUFqNUlRQURRR2djQUFBQUNRR2YrVVFuL3dBTEtDRUFBMEJvSENFQUEwQm9IQUFBQUFrQm4vdEVKLzhBQ3lraEFBTkFhQndBQUFBTlFadmdORXhEUC82cGxnQU11U0VBQTBCb0hDRUFBMEJvSEFBQUFBdEJuaDVGRlN3ci93QUkrQ0VBQTBCb0hBQUFBQWtCbmoxRUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjQvUkNmL0FBc3BJUUFEUUdnY0FBQUFEVUdhSkRSTVF6LytxWllBRExnaEFBTkFhQndBQUFBTFFaNUNSUlVzSy84QUNQa2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaNWhSQ2YvQUFzb0lRQURRR2djQUFBQUNRR2VZMFFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUExQm1tZzBURU0vL3FtV0FBeTVJUUFEUUdnY0FBQUFDMEdlaGtVVkxDdi9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlcFVRbi93QUxLU0VBQTBCb0hBQUFBQWtCbnFkRUovOEFDeWdoQUFOQWFCd0FBQUFOUVpxc05FeERQLzZwbGdBTXVDRUFBMEJvSENFQUEwQm9IQUFBQUF0Qm5zcEZGU3dyL3dBSStTRUFBMEJvSEFBQUFBa0JudWxFSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaN3JSQ2YvQUFzb0lRQURRR2djQUFBQURVR2E4RFJNUXovK3FaWUFETGtoQUFOQWFCd2hBQU5BYUJ3QUFBQUxRWjhPUlJVc0svOEFDUGtoQUFOQWFCd0FBQUFKQVo4dFJDZi9BQXNwSVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdmTDBRbi93QUxLQ0VBQTBCb0hBQUFBQTFCbXpRMFRFTS8vcW1XQUF5NElRQURRR2djQUFBQUMwR2ZVa1VWTEN2L0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2ZjVVFuL3dBTEtDRUFBMEJvSEFBQUFBa0JuM05FSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBTlFadDRORXhDLy82cGxnQU11U0VBQTBCb0hBQUFBQXRCbjVaRkZTd3Ivd0FJK0NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbjdWRUovOEFDeWtoQUFOQWFCd0FBQUFKQVorM1JDZi9BQXNwSVFBRFFHZ2NBQUFBRFVHYnV6Uk1Rbi8rbmhBQVlzQWhBQU5BYUJ3aEFBTkFhQndBQUFBSlFaL2FRaFAvQUFzcElRQURRR2djQUFBQUNRR2YrVVFuL3dBTEtDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hBQUFDaUZ0YjI5MkFBQUFiRzEyYUdRQUFBQUExWUNDWDlXQWdsOEFBQVBvQUFBSC9BQUJBQUFCQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBREFBQUFHR2x2WkhNQUFBQUFFSUNBZ0FjQVQvLy8vdjcvQUFBRitYUnlZV3NBQUFCY2RHdG9aQUFBQUFQVmdJSmYxWUNDWHdBQUFBRUFBQUFBQUFBSDBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQXlnQUFBTW9BQUFBQUFDUmxaSFJ6QUFBQUhHVnNjM1FBQUFBQUFBQUFBUUFBQjlBQUFCZHdBQUVBQUFBQUJYRnRaR2xoQUFBQUlHMWthR1FBQUFBQTFZQ0NYOVdBZ2w4QUFWK1FBQUsvSUZYRUFBQUFBQUF0YUdSc2NnQUFBQUFBQUFBQWRtbGtaUUFBQUFBQUFBQUFBQUFBQUZacFpHVnZTR0Z1Wkd4bGNnQUFBQVVjYldsdVpnQUFBQlIyYldoa0FBQUFBUUFBQUFBQUFBQUFBQUFBSkdScGJtWUFBQUFjWkhKbFpnQUFBQUFBQUFBQkFBQUFESFZ5YkNBQUFBQUJBQUFFM0hOMFltd0FBQUNZYzNSelpBQUFBQUFBQUFBQkFBQUFpR0YyWXpFQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBeWdES0FFZ0FBQUJJQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVkvLzhBQUFBeVlYWmpRd0ZOUUNqLzRRQWJaMDFBS095aG8zeVNUVUJBUUZBQUFBTUFFQUFyOGdEeGd4bGdBUUFFYU8rRzhnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQThBQUFMdUFBQUFCUnpkSE56QUFBQUFBQUFBQUVBQUFBQkFBQUI4R04wZEhNQUFBQUFBQUFBUEFBQUFBRUFBQmR3QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFDN2dBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUVFYzNSemVnQUFBQUFBQUFBQUFBQUFQQUFBQXpRQUFBQVFBQUFBRFFBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFOQUFBQURRQUFBUUJ6ZEdOdkFBQUFBQUFBQUR3QUFBQXdBQUFEWkFBQUEzUUFBQU9OQUFBRG9BQUFBN2tBQUFQUUFBQUQ2d0FBQS80QUFBUVhBQUFFTGdBQUJFTUFBQVJjQUFBRWJ3QUFCSXdBQUFTaEFBQUV1Z0FBQk0wQUFBVGtBQUFFL3dBQUJSSUFBQVVyQUFBRlFnQUFCVjBBQUFWd0FBQUZpUUFBQmFBQUFBVzFBQUFGemdBQUJlRUFBQVgrQUFBR0V3QUFCaXdBQUFZL0FBQUdWZ0FBQm5FQUFBYUVBQUFHblFBQUJyUUFBQWJQQUFBRzRnQUFCdlVBQUFjU0FBQUhKd0FBQjBBQUFBZFRBQUFIY0FBQUI0VUFBQWVlQUFBSHNRQUFCOGdBQUFmakFBQUg5Z0FBQ0E4QUFBZ21BQUFJUVFBQUNGUUFBQWhuQUFBSWhBQUFDSmNBQUFNc2RISmhhd0FBQUZ4MGEyaGtBQUFBQTlXQWdsL1ZnSUpmQUFBQUFnQUFBQUFBQUFmOEFBQUFBQUFBQUFBQUFBQUJBUUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQ3NtMWthV0VBQUFBZ2JXUm9aQUFBQUFEVmdJSmYxWUNDWHdBQXJFUUFBV0FBVmNRQUFBQUFBQ2RvWkd4eUFBQUFBQUFBQUFCemIzVnVBQUFBQUFBQUFBQUFBQUFBVTNSbGNtVnZBQUFBQW1OdGFXNW1BQUFBRUhOdGFHUUFBQUFBQUFBQUFBQUFBQ1JrYVc1bUFBQUFIR1J5WldZQUFBQUFBQUFBQVFBQUFBeDFjbXdnQUFBQUFRQUFBaWR6ZEdKc0FBQUFaM04wYzJRQUFBQUFBQUFBQVFBQUFGZHRjRFJoQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFDQUJBQUFBQUFyRVFBQUFBQUFETmxjMlJ6QUFBQUFBT0FnSUFpQUFJQUJJQ0FnQlJBRlFBQUFBQUREVUFBQUFBQUJZQ0FnQUlTRUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUJZQUFBRUFBQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBR0FBQUFXQUFBQVhCemRHTnZBQUFBQUFBQUFGZ0FBQU9CQUFBRGh3QUFBNW9BQUFPdEFBQURzd0FBQThvQUFBUGZBQUFENVFBQUEvZ0FBQVFMQUFBRUVRQUFCQ2dBQUFROUFBQUVVQUFBQkZZQUFBUnBBQUFFZ0FBQUJJWUFBQVNiQUFBRXJnQUFCTFFBQUFUSEFBQUUzZ0FBQlBNQUFBVDVBQUFGREFBQUJSOEFBQVVsQUFBRlBBQUFCVkVBQUFWWEFBQUZhZ0FBQlgwQUFBV0RBQUFGbWdBQUJhOEFBQVhDQUFBRnlBQUFCZHNBQUFYeUFBQUYrQUFBQmcwQUFBWWdBQUFHSmdBQUJqa0FBQVpRQUFBR1pRQUFCbXNBQUFaK0FBQUdrUUFBQnBjQUFBYXVBQUFHd3dBQUJza0FBQWJjQUFBRzd3QUFCd1lBQUFjTUFBQUhJUUFBQnpRQUFBYzZBQUFIVFFBQUIyUUFBQWRxQUFBSGZ3QUFCNUlBQUFlWUFBQUhxd0FBQjhJQUFBZlhBQUFIM1FBQUIvQUFBQWdEQUFBSUNRQUFDQ0FBQUFnMUFBQUlPd0FBQ0U0QUFBaGhBQUFJZUFBQUNINEFBQWlSQUFBSXBBQUFDS29BQUFpd0FBQUl0Z0FBQ0x3QUFBakNBQUFBRm5Wa2RHRUFBQUFPYm1GdFpWTjBaWEpsYndBQUFIQjFaSFJoQUFBQWFHMWxkR0VBQUFBQUFBQUFJV2hrYkhJQUFBQUFBQUFBQUcxa2FYSmhjSEJzQUFBQUFBQUFBQUFBQUFBQU8ybHNjM1FBQUFBenFYUnZid0FBQUN0a1lYUmhBQUFBQVFBQUFBQklZVzVrUW5KaGEyVWdNQzR4TUM0eUlESXdNVFV3TmpFeE1EQT0nXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9tZWRpYS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9