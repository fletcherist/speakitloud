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
const DEFAULT_LANGUAGE = 'en-US';

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
    // this.synth.cancel()

    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.isChangingSpeed = false;
    this.isStopped = false;
    this.currentSpeed = 1.2;
  }

  speak(utter) {
    if (!utter && !this.currentUtterance) return false;
    if (!utter) {
      console.error('Empty utter text');
      return false;
    }
    this.currentUtterance = utter || this.currentUtterance;
    if (this.synth.speaking) {
      console.error(`can't speak ${utter}. Already speaking`);
      this.synth.cancel();
      this.speak(utter);
      return false;
    }
    this.currentUtterance.rate = this.currentSpeed;
    // if (this.isStopped) this.play()

    this.synth.speak(this.currentUtterance);
    this.isStopped = false;
  }
  stop() {
    this.currentUtterance = null;
    this.synth.cancel();
    this.isStopped = true;
    return false;
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
    this._changeSpeed(0.2);
  }
  decrementSpeed() {
    this._changeSpeed(-0.2);
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
      const $currentSentence = $input.querySelector(`#token-${app.reader.currentTokenIndex}`);
      if ($currentSentence) {
        $currentSentence.classList.add('token--highlighted');
      }
      const $previousSentence = $input.querySelector(`#token-${app.reader.currentTokenIndex - 1}`);

      /* Remove highlight from previous token */
      if (app.reader.currentTokenIndex > 0) {
        if ($previousSentence) {
          $previousSentence.classList.remove('token--highlighted');
        }
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

  return DEFAULT_LANGUAGE;
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

const formatText = text => text.replace(/\–/g, '.').replace(/—/g, ';');
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
  utterThis.lang = sentence.lang || DEFAULT_LANGUAGE;
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

  console.log(textTokensArray);
  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(textTokens => compose(createSpeakEvents, joinOneLanguageWords)(textTokens));

  const promises = [];
  const phrases = concatSpeakEventsSentences(speakEventsSentences);
  console.log(phrases);
  app.reader.tokensCount = phrases.length;
  phrases.forEach(phrase => promises.push(() => new Promise((resolve, reject) => {

    app.speaker.speak(phrase);

    console.log(app.reader.currentTokenIndex);
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

app.noSleep.enable();
$button.addEventListener('click', event => {
  console.log('clicked');
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

  if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
    app.speakItLoud();
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
});

$input.classList.add('input-textarea--initial');
$input.addEventListener('paste', event => {
  $initialText.remove();
  $input.classList.remove('input-textarea--initial');
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
    const divToken = document.createElement('span');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODQxNzBkYWEwNjZjYzEzMmI4NzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGluaXRpYWxUZXh0IiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJERUZBVUxUX0xBTkdVQUdFIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiY29uY2F0IiwibGlzdCIsIkFycmF5IiwicHJvdG90eXBlIiwiYmluZCIsInByb21pc2VDb25jYXQiLCJmIiwieCIsInRoZW4iLCJwcm9taXNlUmVkdWNlIiwiYWNjIiwic2VyaWFsIiwiZnVuY3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlNwZWFrZXIiLCJjb25zdHJ1Y3RvciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwiY29uc29sZSIsImVycm9yIiwic3BlYWtpbmciLCJjYW5jZWwiLCJyYXRlIiwic3RvcCIsInBsYXkiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwibG9nIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJjdXJyZW50UHJvZ3Jlc3MiLCJ0aW1lTGVmdFJlYWRpbmciLCJzcGVha2VyIiwibm9TbGVlcCIsImRvbSIsInVwZGF0ZVByb2dyZXNzQmFyIiwicHJvZ3Jlc3MiLCJzdHlsZSIsInRyYW5zZm9ybSIsImNsaWVudFdpZHRoIiwidXBkYXRlVGltZUxlZnQiLCJpbm5lclRleHQiLCJ0b0ZpeGVkIiwiaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlIiwidGV4dCIsIiRjdXJyZW50U2VudGVuY2UiLCJjbGFzc0xpc3QiLCJhZGQiLCIkcHJldmlvdXNTZW50ZW5jZSIsInJlbW92ZSIsImRldGVjdExhbmdCeVN0ciIsInN0ciIsImN1cnJlbnRDaGFySW5kZXgiLCJtYXhDaGFySW5kZXgiLCJjaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImluY2x1ZGVzIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInByZXZpb3VzV29yZCIsInRva2VuIiwiam9pbiIsImZvcm1hdFRleHQiLCJyZXBsYWNlIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInNwbGl0Iiwic3BsaXRTZW50ZW5jZUludG9Xb3JkcyIsInNlbnRlbmNlIiwiY291bnRXb3Jkc0luVGV4dCIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwiZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbiIsInNwZWVkIiwiY3JlYXRlU3BlYWtFdmVudCIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSIsImNyZWF0ZVNwZWFrRXZlbnRzIiwicGFydHMiLCJjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyIsInNwZWFrRXZlbnRzU2VudGVuY2VzIiwiYSIsImIiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJ0ZXh0VG9rZW5zQXJyYXkiLCJ0ZXh0VG9rZW5zIiwicHJvbWlzZXMiLCJwaHJhc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJlbmFibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXlDb2RlIiwibWV0YUtleSIsImN0cmxLZXkiLCJmb2N1cyIsInByZXZlbnREZWZhdWx0IiwicGFzdGVkVGV4dCIsImNsaXBib2FyZERhdGEiLCJvcmlnaW5hbEV2ZW50IiwiZ2V0RGF0YSIsImhpZGRlbklucHV0IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRleHRDb250ZW50IiwiaW5kZXgiLCJkaXZUb2tlbiIsImlkIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUM1REE7O0FBRUEsTUFBTUEsU0FBU0MsU0FBU0MsYUFBVCxDQUF1QixpQkFBdkIsQ0FBZjtBQUNBLE1BQU1DLGVBQWVGLFNBQVNDLGFBQVQsQ0FB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Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuREEsaUNBQWlDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg0MTcwZGFhMDY2Y2MxMzJiODc5IiwiLy8gQGZsb3dcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMnXG5cbmNvbnN0ICRpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCAkaW5pdGlhbFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5pdGlhbC10ZXh0JylcbmNvbnN0ICRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcblxuY29uc3QgJHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpXG5jb25zdCAkcHJvZ3Jlc3NQb2ludGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLXBvaW50ZXInKVxuXG5jb25zdCAkdGltZUxlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGltZS1sZWZ0JylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfSxcbiAgJ251bWJlcic6IHtcbiAgICB1bmljb2RlOiBbNDgsIDU3XVxuICB9XG59XG5cbi8vIHdoZW4gc3BlYWtpbmcgc3BlZWQgaXMgMVxuY29uc3QgREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFID0gMTE3LjZcbmNvbnN0IE1JTl9TUEVFRCA9IDAuNTJcbmNvbnN0IERFRkFVTFRfTEFOR1VBR0UgPSAnZW4tVVMnXG5cbi8vIGZwIGNvbXBvc2l0aW9uICYgcGlwZSBoZWxwZXJzXG5jb25zdCBwaXBlID0gKGZuLCAuLi5mbnMpID0+ICguLi5hcmdzKSA9PiBmbnMucmVkdWNlKChyZXN1bHQsIGZuKSA9PiBmbihyZXN1bHQpLCBmbiguLi5hcmdzKSlcbmNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gcGlwZSguLi5mbnMucmV2ZXJzZSgpKSguLi5hcmdzKVxuXG5jb25zdCBjb25jYXQgPSBsaXN0ID0+IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYmluZChsaXN0KVxuY29uc3QgcHJvbWlzZUNvbmNhdCA9IGYgPT4geCA9PiBmKCkudGhlbihjb25jYXQoeCkpXG5jb25zdCBwcm9taXNlUmVkdWNlID0gKGFjYywgeCkgPT4gYWNjLnRoZW4ocHJvbWlzZUNvbmNhdCh4KSlcbi8qXG4gKiBzZXJpYWwgZXhlY3V0ZXMgUHJvbWlzZXMgc2VxdWVudGlhbGx5LlxuICogQHBhcmFtIHtmdW5jc30gQW4gYXJyYXkgb2YgZnVuY3MgdGhhdCByZXR1cm4gcHJvbWlzZXMuXG4gKiBAZXhhbXBsZVxuICogY29uc3QgdXJscyA9IFsnL3VybDEnLCAnL3VybDInLCAnL3VybDMnXVxuICogc2VyaWFsKHVybHMubWFwKHVybCA9PiAoKSA9PiAkLmFqYXgodXJsKSkpXG4gKiAgICAgLnRoZW4oY29uc29sZS5sb2cuYmluZChjb25zb2xlKSlcbiAqL1xuY29uc3Qgc2VyaWFsID0gZnVuY3MgPT4gZnVuY3MucmVkdWNlKHByb21pc2VSZWR1Y2UsIFByb21pc2UucmVzb2x2ZShbXSkpXG5cbmNsYXNzIFNwZWFrZXIge1xuICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXNcbiAgY3VycmVudFV0dGVyYW5jZTogT2JqZWN0XG4gIGlzU3BlYWtpbmc6IGJvb2xlYW4gPSBmYWxzZVxuICBpc0NoYW5naW5nU3BlZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBpc1N0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBjdXJyZW50U3BlZWQ6IG51bWJlciA9IDEuMlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIHRoaXMuc3ludGguY2FuY2VsKClcbiAgfVxuXG4gIHNwZWFrKHV0dGVyKSB7XG4gICAgaWYgKCF1dHRlciAmJiAhdGhpcy5jdXJyZW50VXR0ZXJhbmNlKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoIXV0dGVyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFbXB0eSB1dHRlciB0ZXh0JylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICBpZiAodGhpcy5zeW50aC5zcGVha2luZykge1xuICAgICAgY29uc29sZS5lcnJvcihgY2FuJ3Qgc3BlYWsgJHt1dHRlcn0uIEFscmVhZHkgc3BlYWtpbmdgKVxuICAgICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgICAgdGhpcy5zcGVhayh1dHRlcilcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgLy8gaWYgKHRoaXMuaXNTdG9wcGVkKSB0aGlzLnBsYXkoKVxuXG4gICAgdGhpcy5zeW50aC5zcGVhayh0aGlzLmN1cnJlbnRVdHRlcmFuY2UpXG4gICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZVxuICB9XG4gIHN0b3AoKSB7XG4gICAgdGhpcy5jdXJyZW50VXR0ZXJhbmNlID0gbnVsbFxuICAgIHRoaXMuc3ludGguY2FuY2VsKClcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBwbGF5KCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZVxuICAgIHRoaXMuc3ludGgucmVzdW1lKClcbiAgfVxuICBwYXVzZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlXG4gICAgdGhpcy5zeW50aC5wYXVzZSgpXG4gIH1cbiAgcGxheVBhdXNlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gIXRoaXMuaXNTdG9wcGVkXG4gICAgdGhpcy5pc1N0b3BwZWQgPyB0aGlzLnN5bnRoLnBhdXNlKCkgOiB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgX2NoYW5nZVNwZWVkKGRlbHRhOiBudW1iZXIpIHtcbiAgICB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gICAgdGhpcy5jdXJyZW50U3BlZWQgPSBkZWx0YSA+IDBcbiAgICAgID8gdGhpcy5jdXJyZW50U3BlZWQgKyBkZWx0YVxuICAgICAgOiB0aGlzLmN1cnJlbnRTcGVlZCA8PSBNSU5fU1BFRUQgPyBNSU5fU1BFRUQgOiB0aGlzLmN1cnJlbnRTcGVlZCArIGRlbHRhXG4gICAgdGhpcy5pc0NoYW5naW5nU3BlZWQgPSB0cnVlXG4gICAgdGhpcy5zcGVhaygpXG4gICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50U3BlZWQpXG4gIH1cbiAgaW5jcmVtZW50U3BlZWQoKSB7IHRoaXMuX2NoYW5nZVNwZWVkKDAuMikgfVxuICBkZWNyZW1lbnRTcGVlZCgpIHsgdGhpcy5fY2hhbmdlU3BlZWQoLTAuMikgfVxufVxuXG5jb25zdCBhcHAgPSB7XG4gIHZlcnNpb246ICcwLjAuNCcsXG4gIGdldFZlcnNpb24oKSB7XG4gICAgY29uc29sZS5sb2codGhpcy52ZXJzaW9uKVxuICB9LFxuICByZWFkZXI6IHtcbiAgICB0b2tlbnNDb3VudDogMCxcbiAgICBjdXJyZW50VG9rZW5JbmRleDogMCxcbiAgICB0ZXh0UmVhZGluZ0R1cmF0aW9uOiAwLFxuICAgIGdldCBjdXJyZW50UHJvZ3Jlc3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW5JbmRleCAvIHRoaXMudG9rZW5zQ291bnRcbiAgICB9LFxuICAgIGdldCB0aW1lTGVmdFJlYWRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0UmVhZGluZ0R1cmF0aW9uIC1cbiAgICAgICAgKHRoaXMudGV4dFJlYWRpbmdEdXJhdGlvbiAqIHRoaXMuY3VycmVudFByb2dyZXNzKVxuICAgIH1cbiAgfSxcbiAgc3BlYWtlcjogbmV3IFNwZWFrZXIoKSxcbiAgbm9TbGVlcDogbmV3IE5vU2xlZXAoKSxcbiAgZG9tOiB7XG4gICAgdXBkYXRlUHJvZ3Jlc3NCYXIocHJvZ3Jlc3M6IG51bWJlcikge1xuICAgICAgJHByb2dyZXNzUG9pbnRlci5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICBgdHJhbnNsYXRlKCR7cHJvZ3Jlc3MgKiAkcHJvZ3Jlc3NCYXIuY2xpZW50V2lkdGggLSAxNn1weCwgMClgXG4gICAgfSxcbiAgICB1cGRhdGVUaW1lTGVmdCgpIHtcbiAgICAgIC8qIGNhbGN1bGF0ZXMgdGltZSBsZWZ0IHJlYWRpbmcgKi9cbiAgICAgICR0aW1lTGVmdC5pbm5lclRleHQgPSBgJHthcHAucmVhZGVyLnRpbWVMZWZ0UmVhZGluZy50b0ZpeGVkKDEpfSBtaW5gXG4gICAgfSxcbiAgICBoaWdobGlnaHRDdXJyZW50U2VudGVuY2UodGV4dDogc3RyaW5nKSB7XG4gICAgICBjb25zdCAkY3VycmVudFNlbnRlbmNlID0gJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXh9YClcbiAgICAgIGlmICgkY3VycmVudFNlbnRlbmNlKSB7XG4gICAgICAgICRjdXJyZW50U2VudGVuY2UuY2xhc3NMaXN0LmFkZCgndG9rZW4tLWhpZ2hsaWdodGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0ICRwcmV2aW91c1NlbnRlbmNlID0gJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggLSAxfWApXG5cbiAgICAgIC8qIFJlbW92ZSBoaWdobGlnaHQgZnJvbSBwcmV2aW91cyB0b2tlbiAqL1xuICAgICAgaWYgKGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggPiAwKSB7XG4gICAgICAgIGlmICgkcHJldmlvdXNTZW50ZW5jZSkge1xuICAgICAgICAgICRwcmV2aW91c1NlbnRlbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3Rva2VuLS1oaWdobGlnaHRlZCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbndpbmRvdy5hcHAgPSBhcHBcblxuLypcbiAqIEFuYWx5c2VzIHRoZSBmaXJzdCBsZXR0ZXIgaW4gdGhlIHdvcmRcbiAqIE5vdyBpdCBjYW4gZ3Vlc3MgYmV0d2VlbiBjeXJpbGljIGFuZCBsYXRpbiBsZXR0ZXIgb25seVxuICovXG5jb25zdCBkZXRlY3RMYW5nQnlTdHIgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgbGV0IGN1cnJlbnRDaGFySW5kZXggPSAwXG4gIGxldCBtYXhDaGFySW5kZXggPSAzXG5cbiAgd2hpbGUgKGN1cnJlbnRDaGFySW5kZXggPD0gbWF4Q2hhckluZGV4KSB7XG4gICAgY29uc3QgY2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KGN1cnJlbnRDaGFySW5kZXgpXG4gICAgZm9yIChsZXQgYWxwaGFiZXQgaW4gQUxQSEFCRVQpIHtcbiAgICAgIGlmIChjaGFyQ29kZSA+PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVswXSAmJlxuICAgICAgICAgIGNoYXJDb2RlIDw9IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzFdKSB7XG4gICAgICAgIHJldHVybiBhbHBoYWJldFxuICAgICAgfVxuICAgIH1cbiAgICBjdXJyZW50Q2hhckluZGV4KytcbiAgfVxuXG4gIHJldHVybiBERUZBVUxUX0xBTkdVQUdFXG59XG5cbi8qXG4gKiBJZiB0aGUgd29yZHMgYXJlIGluIHRoZSBzYW1lIGxhbmd1YWdlLCByZXR1cm5zIHRydXdcbiAqIElmIG9uZSBvZiB0aGUgd29yZHMgaXMgbnVtYmVyLCByZXR1cm5zIHRydWVcbiAqIE90aGVyd2lzZSwgcmV0dXJucyBmYWxzZVxuICovXG50eXBlIHdvcmRUeXBlID0ge1xuICBsYW5nOiBzdHJpbmcsXG4gIHRva2VuOiBzdHJpbmdcbn1cbmNvbnN0IGlzVGhlU2FtZUxhbmd1YWdlID0gKFxuICB3b3JkMTogd29yZFR5cGUsXG4gIHdvcmQyOiB3b3JkVHlwZVxuKSA9PiB3b3JkMS5sYW5nID09PSB3b3JkMi5sYW5nIHx8XG4gIFt3b3JkMS5sYW5nLCB3b3JkMi5sYW5nXS5pbmNsdWRlcygnbnVtYmVyJylcblxuY29uc3Qgam9pbk9uZUxhbmd1YWdlV29yZHMgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PHdvcmRUeXBlPiA9PiB7XG4gIGNvbnN0IHNlbnRlbmNlcyA9IFtdXG4gIHdvcmRzLmZvckVhY2god29yZCA9PiB7XG4gICAgaWYgKHNlbnRlbmNlcy5sZW5ndGggPT09IDApIHJldHVybiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICAgIGNvbnN0IHByZXZpb3VzV29yZCA9IHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV1cbiAgICBpc1RoZVNhbWVMYW5ndWFnZShwcmV2aW91c1dvcmQsIHdvcmQpXG4gICAgICA/IHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4gPVxuICAgICAgICAgIFtzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuLCB3b3JkLnRva2VuXS5qb2luKCcgJylcbiAgICAgIDogc2VudGVuY2VzLnB1c2god29yZClcbiAgfSlcbiAgcmV0dXJuIHNlbnRlbmNlc1xufVxuXG5jb25zdCBmb3JtYXRUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gdGV4dC5yZXBsYWNlKC9cXOKAky9nLCAnLicpLnJlcGxhY2UoL+KAlC9nLCAnOycpXG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gdGV4dC5zcGxpdCgnLicpXG5jb25zdCBzcGxpdFNlbnRlbmNlSW50b1dvcmRzID0gKHNlbnRlbmNlOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHNlbnRlbmNlLnNwbGl0KCcgJylcbmNvbnN0IGNvdW50V29yZHNJblRleHQgPSAodGV4dDogc3RyaW5nKSA9PiBzcGxpdFNlbnRlbmNlSW50b1dvcmRzKHRleHQpLmxlbmd0aFxuY29uc3QgY29udmVydFdvcmRzSW50b1Rva2VucyA9ICh3b3JkczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHdvcmRUeXBlPiA9PlxuICB3b3Jkcy5tYXAoKHRva2VuOiBzdHJpbmcpID0+ICh7XG4gICAgbGFuZzogZGV0ZWN0TGFuZ0J5U3RyKHRva2VuKSxcbiAgICB0b2tlbjogdG9rZW5cbiAgfSkpXG5jb25zdCBmaWx0ZXJXb3Jkc0FycmF5ID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pID0+XG4gIHdvcmRzLmZpbHRlcih3b3JkID0+IHdvcmQudG9rZW4ubGVuZ3RoICE9PSAwKVxuXG4vKlxuICogQSBNZWRpdW0tbGlrZSBmdW5jdGlvbiBjYWxjdWxhdGVzIHRpbWUgbGVmdCByZWFkaW5nXG4gKi9cbmNvbnN0IGdldFRleHRSZWFkaW5nRHVyYXRpb24gPSAodGV4dDogc3RyaW5nLCBzcGVlZDogbnVtYmVyID0gMSkgPT5cbiAgY291bnRXb3Jkc0luVGV4dCh0ZXh0KSAvIChERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUgKiBzcGVlZClcblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudCA9IChzZW50ZW5jZTogd29yZFR5cGUpOiBPYmplY3QgPT4ge1xuICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICB1dHRlclRoaXMubGFuZyA9IHNlbnRlbmNlLmxhbmcgfHwgREVGQVVMVF9MQU5HVUFHRVxuICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICByZXR1cm4gdXR0ZXJUaGlzXG59XG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnRzID0gKHBhcnRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxPYmplY3Q+ID0+XG4gIHBhcnRzLm1hcChjcmVhdGVTcGVha0V2ZW50KVxuXG5jb25zdCBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyA9XG4gIChzcGVha0V2ZW50c1NlbnRlbmNlczogQXJyYXk8QXJyYXk8T2JqZWN0Pj4pOiBBcnJheTxPYmplY3Q+ID0+XG4gICAgc3BlYWtFdmVudHNTZW50ZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pXG5cbmFwcC5zcGVha0l0TG91ZCA9ICgpID0+IHtcbiAgY29uc3QgdGV4dCA9IGZvcm1hdFRleHQoJGlucHV0LmlubmVyVGV4dC50cmltKCkpXG4gIGNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbiAgY29uc29sZS5sb2coc2VudGVuY2VzKVxuXG4gIGFwcC5yZWFkZXIudGV4dFJlYWRpbmdEdXJhdGlvbiA9IGdldFRleHRSZWFkaW5nRHVyYXRpb24odGV4dCwgYXBwLnNwZWFrZXIuY3VycmVudFNwZWVkKVxuXG4gIGNvbnN0IHRleHRUb2tlbnNBcnJheSA9IHNlbnRlbmNlcy5tYXAoc2VudGVuY2UgPT4gY29tcG9zZShcbiAgICBmaWx0ZXJXb3Jkc0FycmF5LFxuICAgIGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMsXG4gICAgc3BsaXRTZW50ZW5jZUludG9Xb3Jkc1xuICApKHNlbnRlbmNlKSlcblxuICBjb25zb2xlLmxvZyh0ZXh0VG9rZW5zQXJyYXkpXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBjb25zdCBwaHJhc2VzID0gY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMoc3BlYWtFdmVudHNTZW50ZW5jZXMpXG4gIGNvbnNvbGUubG9nKHBocmFzZXMpXG4gIGFwcC5yZWFkZXIudG9rZW5zQ291bnQgPSBwaHJhc2VzLmxlbmd0aFxuICBwaHJhc2VzLmZvckVhY2gocGhyYXNlID0+XG4gICAgcHJvbWlzZXMucHVzaCgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcblxuICAgICAgY29uc29sZS5sb2coYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleClcbiAgICAgIGFwcC5kb20uaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlKHBocmFzZS50ZXh0KVxuICAgICAgYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCA9IGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggKyAxXG5cbiAgICAgIGFwcC5kb20udXBkYXRlUHJvZ3Jlc3NCYXIoYXBwLnJlYWRlci5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgICBhcHAuZG9tLnVwZGF0ZVRpbWVMZWZ0KClcblxuICAgICAgcGhyYXNlLm9uZW5kID0gKCkgPT4ge1xuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkKSB7XG4gICAgICAgICAgYXBwLnNwZWFrZXIuaXNDaGFuZ2luZ1NwZWVkID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoYXBwLnNwZWFrZXIuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc29sdmUocGhyYXNlLnRleHQpXG4gICAgICB9XG4gICAgfSkpXG4gIClcblxuICBzZXJpYWwocHJvbWlzZXMpLnRoZW4oY29uc29sZS5sb2cpXG59XG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIMKrc3BlYWvCuyBidXR0b24gaXMgcHJlc3NlZFxuICovXG5cbmFwcC5ub1NsZWVwLmVuYWJsZSgpXG4kYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGlja2VkJylcbiAgYXBwLnNwZWFrSXRMb3VkKClcbn0pXG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIHVzZXIgaXMgdHJ5aW5nIHRvIHJlZnJlc2gvY2xvc2UgYXBwXG4gKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKGFwcC5zcGVha2VyLnN0b3AoKSlcbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxuXG4gIGlmIChldmVudC5rZXlDb2RlID09PSAxMyAmJiAoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5KSkge1xuICAgIGFwcC5zcGVha0l0TG91ZCgpXG4gIH1cbn0pXG5cbiRpbnB1dC5mb2N1cygpXG5cbiRpbml0aWFsVGV4dC5mb2N1cygpXG5cblxuJGluY3JlbWVudFNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICBhcHAuc3BlYWtlci5pbmNyZW1lbnRTcGVlZCgpXG59KVxuXG4kZGVjcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmRlY3JlbWVudFNwZWVkKClcbn0pXG5cbiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudDogRXZlbnQpID0+IHtcbiAgJGluaXRpYWxUZXh0LnJlbW92ZSgpXG4gIC8vIFRPRE86IHN0YXJ0IGZyb20gdGhlIHNlbGVjdGVkIHNlbnRlbmNlICh0b2tlbilcbiAgY29uc29sZS5sb2coZXZlbnQpXG59KVxuXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogRXZlbnQpID0+IHtcbiAgJGluaXRpYWxUZXh0LnJlbW92ZSgpXG59KVxuXG4kaW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtdGV4dGFyZWEtLWluaXRpYWwnKVxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgJGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0LXRleHRhcmVhLS1pbml0aWFsJylcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIGxldCBwYXN0ZWRUZXh0ID0gJydcbiAgY29uc3QgY2xpcGJvYXJkRGF0YSA9IGV2ZW50LmNsaXBib2FyZERhdGEgfHxcbiAgICB3aW5kb3cuY2xpcGJvYXJkRGF0YSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGFcblxuICBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0JylcblxuICBjb25zdCBoaWRkZW5JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGhpZGRlbklucHV0LmlubmVySFRNTCA9IHBhc3RlZFRleHRcblxuICBjb25zdCB0ZXh0ID0gaGlkZGVuSW5wdXQudGV4dENvbnRlbnRcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuICBjb25zb2xlLmxvZyhzZW50ZW5jZXMpXG4gIHNlbnRlbmNlcy5mb3JFYWNoKChzZW50ZW5jZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBkaXZUb2tlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGRpdlRva2VuLmlubmVyVGV4dCA9IHNlbnRlbmNlICsgJy4nXG4gICAgZGl2VG9rZW4uaWQgPSBgdG9rZW4tJHtpbmRleH1gXG4gICAgZGl2VG9rZW4uY2xhc3NMaXN0LmFkZCgndG9rZW4nKVxuICAgIGRpdlRva2VuLnNldEF0dHJpYnV0ZSgnc3BlbGxjaGVjaycsICdmYWxzZScpXG4gICAgJGlucHV0LmFwcGVuZENoaWxkKGRpdlRva2VuKVxuICB9KVxuICAvLyAkaW5wdXQuaW5uZXJIVE1MID0gdGV4dFxuICBjb25zb2xlLmxvZyh0ZXh0KVxufSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImNvbnN0IG1lZGlhRmlsZSA9IHJlcXVpcmUoJy4vbWVkaWEuanMnKVxuXG4vLyBEZXRlY3QgaU9TIGJyb3dzZXJzIDwgdmVyc2lvbiAxMFxuY29uc3Qgb2xkSU9TID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyc2VGbG9hdChcbiAgKCcnICsgKC9DUFUuKk9TIChbMC05X117Myw0fSlbMC05X117MCwxfXwoQ1BVIGxpa2UpLipBcHBsZVdlYktpdC4qTW9iaWxlL2kuZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbMCwgJyddKVsxXSlcbiAgICAucmVwbGFjZSgndW5kZWZpbmVkJywgJzNfMicpLnJlcGxhY2UoJ18nLCAnLicpLnJlcGxhY2UoJ18nLCAnJylcbikgPCAxMCAmJiAhd2luZG93Lk1TU3RyZWFtXG5cbmNsYXNzIE5vU2xlZXAge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldCB1cCBubyBzbGVlcCB2aWRlbyBlbGVtZW50XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcblxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKVxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGUpXG5cbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5ub1NsZWVwVmlkZW8uY3VycmVudFRpbWUgPiAwLjUpIHtcbiAgICAgICAgICB0aGlzLm5vU2xlZXBWaWRlby5jdXJyZW50VGltZSA9IE1hdGgucmFuZG9tKClcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIGVuYWJsZSAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgdGhpcy5kaXNhYmxlKClcbiAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLydcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQod2luZG93LnN0b3AsIDApXG4gICAgICB9LCAxNTAwMClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8ucGxheSgpXG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZSAoKSB7XG4gICAgaWYgKG9sZElPUykge1xuICAgICAgaWYgKHRoaXMubm9TbGVlcFRpbWVyKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMubm9TbGVlcFRpbWVyKVxuICAgICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8ucGF1c2UoKVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb1NsZWVwXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9ICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUlHWjBlWEJ0Y0RReUFBQUNBR2x6YjIxcGMyOHlZWFpqTVcxd05ERUFBQUFJWm5KbFpRQUFDS0J0WkdGMEFBQUM4d1lGLy8vdjNFWHB2ZWJaU0xlV0xOZ2cyU1B1NzNneU5qUWdMU0JqYjNKbElERTBNaUJ5TWpRM09TQmtaRGM1WVRZeElDMGdTQzR5TmpRdlRWQkZSeTAwSUVGV1F5QmpiMlJsWXlBdElFTnZjSGxzWldaMElESXdNRE10TWpBeE5DQXRJR2gwZEhBNkx5OTNkM2N1ZG1sa1pXOXNZVzR1YjNKbkwzZ3lOalF1YUhSdGJDQXRJRzl3ZEdsdmJuTTZJR05oWW1GalBURWdjbVZtUFRFZ1pHVmliRzlqYXoweE9qQTZNQ0JoYm1Gc2VYTmxQVEI0TVRvd2VERXhNU0J0WlQxb1pYZ2djM1ZpYldVOU1pQndjM2s5TVNCd2MzbGZjbVE5TVM0d01Eb3dMakF3SUcxcGVHVmtYM0psWmowd0lHMWxYM0poYm1kbFBURTJJR05vY205dFlWOXRaVDB4SUhSeVpXeHNhWE05TUNBNGVEaGtZM1E5TUNCamNXMDlNQ0JrWldGa2VtOXVaVDB5TVN3eE1TQm1ZWE4wWDNCemEybHdQVEVnWTJoeWIyMWhYM0Z3WDI5bVpuTmxkRDB3SUhSb2NtVmhaSE05TmlCc2IyOXJZV2hsWVdSZmRHaHlaV0ZrY3oweElITnNhV05sWkY5MGFISmxZV1J6UFRBZ2JuSTlNQ0JrWldOcGJXRjBaVDB4SUdsdWRHVnliR0ZqWldROU1DQmliSFZ5WVhsZlkyOXRjR0YwUFRBZ1kyOXVjM1J5WVdsdVpXUmZhVzUwY21FOU1DQmlabkpoYldWelBUTWdZbDl3ZVhKaGJXbGtQVElnWWw5aFpHRndkRDB4SUdKZlltbGhjejB3SUdScGNtVmpkRDB4SUhkbGFXZG9kR0k5TVNCdmNHVnVYMmR2Y0Qwd0lIZGxhV2RvZEhBOU1TQnJaWGxwYm5ROU16QXdJR3RsZVdsdWRGOXRhVzQ5TXpBZ2MyTmxibVZqZFhROU5EQWdhVzUwY21GZmNtVm1jbVZ6YUQwd0lISmpYMnh2YjJ0aGFHVmhaRDB4TUNCeVl6MWpjbVlnYldKMGNtVmxQVEVnWTNKbVBUSXdMakFnY1dOdmJYQTlNQzQyTUNCeGNHMXBiajB3SUhGd2JXRjRQVFk1SUhGd2MzUmxjRDAwSUhaaWRsOXRZWGh5WVhSbFBUSXdNREF3SUhaaWRsOWlkV1p6YVhwbFBUSTFNREF3SUdOeVpsOXRZWGc5TUM0d0lHNWhiRjlvY21ROWJtOXVaU0JtYVd4c1pYSTlNQ0JwY0Y5eVlYUnBiejB4TGpRd0lHRnhQVEU2TVM0d01BQ0FBQUFBT1dXSWhBQTMvL3ArQzd2OHRERFNUamY5N3c1NWkzU2JSUE80WlkraGtqRDVoYmtBa0wzenBKNmgvTFIxQ0FBQnpnQjFrcXF6VW9ybGhRQUFBQXhCbWlRWWhuLytxWllBRExnQUFBQUpRWjVDUWhYL0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2VZVVFuL3dBTEtDRUFBMEJvSEFBQUFBa0JubU5FSi84QUN5a2hBQU5BYUJ3aEFBTkFhQndBQUFBTlFacG9ORXhEUC82cGxnQU11U0VBQTBCb0hBQUFBQXRCbm9aRkVTd3Ivd0FJK1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbnFWRUovOEFDeWtoQUFOQWFCd0FBQUFKQVo2blJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFEVUdhckRSTVF6LytxWllBRExnaEFBTkFhQndBQUFBTFFaN0tSUlVzSy84QUNQa2hBQU5BYUJ3QUFBQUpBWjdwUkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQUNRR2U2MFFuL3dBTEtDRUFBMEJvSEFBQUFBMUJtdkEwVEVNLy9xbVdBQXk1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDMEdmRGtVVkxDdi9BQWo1SVFBRFFHZ2NBQUFBQ1FHZkxVUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbnk5RUovOEFDeWdoQUFOQWFCd0FBQUFOUVpzME5FeERQLzZwbGdBTXVDRUFBMEJvSEFBQUFBdEJuMUpGRlN3ci93QUkrU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuM0ZFSi84QUN5Z2hBQU5BYUJ3QUFBQUpBWjl6UkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQURVR2JlRFJNUXovK3FaWUFETGtoQUFOQWFCd0FBQUFMUVorV1JSVXNLLzhBQ1BnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVorMVJDZi9BQXNwSVFBRFFHZ2NBQUFBQ1FHZnQwUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQTFCbTd3MFRFTS8vcW1XQUF5NElRQURRR2djQUFBQUMwR2Yya1VWTEN2L0FBajVJUUFEUUdnY0FBQUFDUUdmK1VRbi93QUxLQ0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuL3RFSi84QUN5a2hBQU5BYUJ3QUFBQU5RWnZnTkV4RFAvNnBsZ0FNdVNFQUEwQm9IQ0VBQTBCb0hBQUFBQXRCbmg1RkZTd3Ivd0FJK0NFQUEwQm9IQUFBQUFrQm5qMUVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVo0L1JDZi9BQXNwSVFBRFFHZ2NBQUFBRFVHYUpEUk1Rei8rcVpZQURMZ2hBQU5BYUJ3QUFBQUxRWjVDUlJVc0svOEFDUGtoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjVoUkNmL0FBc29JUUFEUUdnY0FBQUFDUUdlWTBRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBMUJtbWcwVEVNLy9xbVdBQXk1SVFBRFFHZ2NBQUFBQzBHZWhrVVZMQ3YvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZXBVUW4vd0FMS1NFQUEwQm9IQUFBQUFrQm5xZEVKLzhBQ3lnaEFBTkFhQndBQUFBTlFacXNORXhEUC82cGxnQU11Q0VBQTBCb0hDRUFBMEJvSEFBQUFBdEJuc3BGRlN3ci93QUkrU0VBQTBCb0hBQUFBQWtCbnVsRUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjdyUkNmL0FBc29JUUFEUUdnY0FBQUFEVUdhOERSTVF6LytxWllBRExraEFBTkFhQndoQUFOQWFCd0FBQUFMUVo4T1JSVXNLLzhBQ1BraEFBTkFhQndBQUFBSkFaOHRSQ2YvQUFzcElRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZkwwUW4vd0FMS0NFQUEwQm9IQUFBQUExQm16UTBURU0vL3FtV0FBeTRJUUFEUUdnY0FBQUFDMEdmVWtVVkxDdi9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdmY1VRbi93QUxLQ0VBQTBCb0hBQUFBQWtCbjNORUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQU5RWnQ0TkV4Qy8vNnBsZ0FNdVNFQUEwQm9IQUFBQUF0Qm41WkZGU3dyL3dBSStDRUFBMEJvSENFQUEwQm9IQUFBQUFrQm43VkVKLzhBQ3lraEFBTkFhQndBQUFBSkFaKzNSQ2YvQUFzcElRQURRR2djQUFBQURVR2J1elJNUW4vK25oQUFZc0FoQUFOQWFCd2hBQU5BYUJ3QUFBQUpRWi9hUWhQL0FBc3BJUUFEUUdnY0FBQUFDUUdmK1VRbi93QUxLQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQUFBQ2lGdGIyOTJBQUFBYkcxMmFHUUFBQUFBMVlDQ1g5V0FnbDhBQUFQb0FBQUgvQUFCQUFBQkFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQURBQUFBR0dsdlpITUFBQUFBRUlDQWdBY0FULy8vL3Y3L0FBQUYrWFJ5WVdzQUFBQmNkR3RvWkFBQUFBUFZnSUpmMVlDQ1h3QUFBQUVBQUFBQUFBQUgwQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUF5Z0FBQU1vQUFBQUFBQ1JsWkhSekFBQUFIR1ZzYzNRQUFBQUFBQUFBQVFBQUI5QUFBQmR3QUFFQUFBQUFCWEZ0WkdsaEFBQUFJRzFrYUdRQUFBQUExWUNDWDlXQWdsOEFBVitRQUFLL0lGWEVBQUFBQUFBdGFHUnNjZ0FBQUFBQUFBQUFkbWxrWlFBQUFBQUFBQUFBQUFBQUFGWnBaR1Z2U0dGdVpHeGxjZ0FBQUFVY2JXbHVaZ0FBQUJSMmJXaGtBQUFBQVFBQUFBQUFBQUFBQUFBQUpHUnBibVlBQUFBY1pISmxaZ0FBQUFBQUFBQUJBQUFBREhWeWJDQUFBQUFCQUFBRTNITjBZbXdBQUFDWWMzUnpaQUFBQUFBQUFBQUJBQUFBaUdGMll6RUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXlnREtBRWdBQUFCSUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFZLy84QUFBQXlZWFpqUXdGTlFDai80UUFiWjAxQUtPeWhvM3lTVFVCQVFGQUFBQU1BRUFBcjhnRHhneGxnQVFBRWFPK0c4Z0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUE4QUFBTHVBQUFBQlJ6ZEhOekFBQUFBQUFBQUFFQUFBQUJBQUFCOEdOMGRITUFBQUFBQUFBQVBBQUFBQUVBQUJkd0FBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBQzdnQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFFRWMzUnplZ0FBQUFBQUFBQUFBQUFBUEFBQUF6UUFBQUFRQUFBQURRQUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBTkFBQUFEUUFBQVFCemRHTnZBQUFBQUFBQUFEd0FBQUF3QUFBRFpBQUFBM1FBQUFPTkFBQURvQUFBQTdrQUFBUFFBQUFENndBQUEvNEFBQVFYQUFBRUxnQUFCRU1BQUFSY0FBQUVid0FBQkl3QUFBU2hBQUFFdWdBQUJNMEFBQVRrQUFBRS93QUFCUklBQUFVckFBQUZRZ0FBQlYwQUFBVndBQUFGaVFBQUJhQUFBQVcxQUFBRnpnQUFCZUVBQUFYK0FBQUdFd0FBQml3QUFBWS9BQUFHVmdBQUJuRUFBQWFFQUFBR25RQUFCclFBQUFiUEFBQUc0Z0FBQnZVQUFBY1NBQUFISndBQUIwQUFBQWRUQUFBSGNBQUFCNFVBQUFlZUFBQUhzUUFBQjhnQUFBZmpBQUFIOWdBQUNBOEFBQWdtQUFBSVFRQUFDRlFBQUFobkFBQUloQUFBQ0pjQUFBTXNkSEpoYXdBQUFGeDBhMmhrQUFBQUE5V0FnbC9WZ0lKZkFBQUFBZ0FBQUFBQUFBZjhBQUFBQUFBQUFBQUFBQUFCQVFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUNzbTFrYVdFQUFBQWdiV1JvWkFBQUFBRFZnSUpmMVlDQ1h3QUFyRVFBQVdBQVZjUUFBQUFBQUNkb1pHeHlBQUFBQUFBQUFBQnpiM1Z1QUFBQUFBQUFBQUFBQUFBQVUzUmxjbVZ2QUFBQUFtTnRhVzVtQUFBQUVITnRhR1FBQUFBQUFBQUFBQUFBQUNSa2FXNW1BQUFBSEdSeVpXWUFBQUFBQUFBQUFRQUFBQXgxY213Z0FBQUFBUUFBQWlkemRHSnNBQUFBWjNOMGMyUUFBQUFBQUFBQUFRQUFBRmR0Y0RSaEFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQ0FCQUFBQUFBckVRQUFBQUFBRE5sYzJSekFBQUFBQU9BZ0lBaUFBSUFCSUNBZ0JSQUZRQUFBQUFERFVBQUFBQUFCWUNBZ0FJU0VBYUFnSUFCQWdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFCWUFBQUVBQUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFBVWMzUnplZ0FBQUFBQUFBQUdBQUFBV0FBQUFYQnpkR052QUFBQUFBQUFBRmdBQUFPQkFBQURod0FBQTVvQUFBT3RBQUFEc3dBQUE4b0FBQVBmQUFBRDVRQUFBL2dBQUFRTEFBQUVFUUFBQkNnQUFBUTlBQUFFVUFBQUJGWUFBQVJwQUFBRWdBQUFCSVlBQUFTYkFBQUVyZ0FBQkxRQUFBVEhBQUFFM2dBQUJQTUFBQVQ1QUFBRkRBQUFCUjhBQUFVbEFBQUZQQUFBQlZFQUFBVlhBQUFGYWdBQUJYMEFBQVdEQUFBRm1nQUFCYThBQUFYQ0FBQUZ5QUFBQmRzQUFBWHlBQUFGK0FBQUJnMEFBQVlnQUFBR0pnQUFCamtBQUFaUUFBQUdaUUFBQm1zQUFBWitBQUFHa1FBQUJwY0FBQWF1QUFBR3d3QUFCc2tBQUFiY0FBQUc3d0FBQndZQUFBY01BQUFISVFBQUJ6UUFBQWM2QUFBSFRRQUFCMlFBQUFkcUFBQUhmd0FBQjVJQUFBZVlBQUFIcXdBQUI4SUFBQWZYQUFBSDNRQUFCL0FBQUFnREFBQUlDUUFBQ0NBQUFBZzFBQUFJT3dBQUNFNEFBQWhoQUFBSWVBQUFDSDRBQUFpUkFBQUlwQUFBQ0tvQUFBaXdBQUFJdGdBQUNMd0FBQWpDQUFBQUZuVmtkR0VBQUFBT2JtRnRaVk4wWlhKbGJ3QUFBSEIxWkhSaEFBQUFhRzFsZEdFQUFBQUFBQUFBSVdoa2JISUFBQUFBQUFBQUFHMWthWEpoY0hCc0FBQUFBQUFBQUFBQUFBQUFPMmxzYzNRQUFBQXpxWFJ2YndBQUFDdGtZWFJoQUFBQUFRQUFBQUJJWVc1a1FuSmhhMlVnTUM0eE1DNHlJREl3TVRVd05qRXhNREE9J1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==