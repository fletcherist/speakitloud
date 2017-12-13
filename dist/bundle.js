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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmZiZmU5NGEzNzQzMTk4ZjQ3NzgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGluaXRpYWxUZXh0IiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJERUZBVUxUX0xBTkdVQUdFIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiY29uY2F0IiwibGlzdCIsIkFycmF5IiwicHJvdG90eXBlIiwiYmluZCIsInByb21pc2VDb25jYXQiLCJmIiwieCIsInRoZW4iLCJwcm9taXNlUmVkdWNlIiwiYWNjIiwic2VyaWFsIiwiZnVuY3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlNwZWFrZXIiLCJjb25zdHJ1Y3RvciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwiY29uc29sZSIsImVycm9yIiwic3BlYWtpbmciLCJjYW5jZWwiLCJyYXRlIiwic3RvcCIsInBsYXkiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwibG9nIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJjdXJyZW50UHJvZ3Jlc3MiLCJ0aW1lTGVmdFJlYWRpbmciLCJzcGVha2VyIiwibm9TbGVlcCIsImRvbSIsInVwZGF0ZVByb2dyZXNzQmFyIiwicHJvZ3Jlc3MiLCJzdHlsZSIsInRyYW5zZm9ybSIsImNsaWVudFdpZHRoIiwidXBkYXRlVGltZUxlZnQiLCJpbm5lclRleHQiLCJ0b0ZpeGVkIiwiaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlIiwidGV4dCIsIiRjdXJyZW50U2VudGVuY2UiLCJjbGFzc0xpc3QiLCJhZGQiLCIkcHJldmlvdXNTZW50ZW5jZSIsInJlbW92ZSIsImRldGVjdExhbmdCeVN0ciIsInN0ciIsImN1cnJlbnRDaGFySW5kZXgiLCJtYXhDaGFySW5kZXgiLCJjaGFyQ29kZSIsInRvTG93ZXJDYXNlIiwiY2hhckNvZGVBdCIsImFscGhhYmV0IiwiaXNUaGVTYW1lTGFuZ3VhZ2UiLCJ3b3JkMSIsIndvcmQyIiwibGFuZyIsImluY2x1ZGVzIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInByZXZpb3VzV29yZCIsInRva2VuIiwiam9pbiIsImZvcm1hdFRleHQiLCJyZXBsYWNlIiwic3BsaXRUZXh0SW50b1NlbnRlbmNlcyIsInNwbGl0Iiwic3BsaXRTZW50ZW5jZUludG9Xb3JkcyIsInNlbnRlbmNlIiwiY291bnRXb3Jkc0luVGV4dCIsImNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMiLCJtYXAiLCJmaWx0ZXJXb3Jkc0FycmF5IiwiZmlsdGVyIiwiZ2V0VGV4dFJlYWRpbmdEdXJhdGlvbiIsInNwZWVkIiwiY3JlYXRlU3BlYWtFdmVudCIsInV0dGVyVGhpcyIsIlNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSIsImNyZWF0ZVNwZWFrRXZlbnRzIiwicGFydHMiLCJjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyIsInNwZWFrRXZlbnRzU2VudGVuY2VzIiwiYSIsImIiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJ0ZXh0VG9rZW5zQXJyYXkiLCJ0ZXh0VG9rZW5zIiwicHJvbWlzZXMiLCJwaHJhc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJlbmFibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXlDb2RlIiwibWV0YUtleSIsImN0cmxLZXkiLCJmb2N1cyIsInByZXZlbnREZWZhdWx0IiwicGFzdGVkVGV4dCIsImNsaXBib2FyZERhdGEiLCJvcmlnaW5hbEV2ZW50IiwiZ2V0RGF0YSIsImhpZGRlbklucHV0IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRleHRDb250ZW50IiwiaW5kZXgiLCJkaXZUb2tlbiIsImlkIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUM1REE7O0FBRUEsTUFBTUEsU0FBU0MsU0FBU0MsYUFBVCxDQUF1QixpQkFBdkIsQ0FBZjtBQUNBLE1BQU1DLGVBQWVGLFNBQVNDLGFBQVQsQ0FB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QUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuREEsaUNBQWlDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGZmYmZlOTRhMzc0MzE5OGY0Nzc4IiwiLy8gQGZsb3dcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMnXG5cbmNvbnN0ICRpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCAkaW5pdGlhbFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5pdGlhbC10ZXh0JylcbmNvbnN0ICRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcblxuY29uc3QgJHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpXG5jb25zdCAkcHJvZ3Jlc3NQb2ludGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLXBvaW50ZXInKVxuXG5jb25zdCAkdGltZUxlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGltZS1sZWZ0JylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfSxcbiAgJ251bWJlcic6IHtcbiAgICB1bmljb2RlOiBbNDgsIDU3XVxuICB9XG59XG5cbi8vIHdoZW4gc3BlYWtpbmcgc3BlZWQgaXMgMVxuY29uc3QgREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFID0gMTE3LjZcbmNvbnN0IE1JTl9TUEVFRCA9IDAuNTJcbmNvbnN0IERFRkFVTFRfTEFOR1VBR0UgPSAnZW4tVVMnXG5cbi8vIGZwIGNvbXBvc2l0aW9uICYgcGlwZSBoZWxwZXJzXG5jb25zdCBwaXBlID0gKGZuLCAuLi5mbnMpID0+ICguLi5hcmdzKSA9PiBmbnMucmVkdWNlKChyZXN1bHQsIGZuKSA9PiBmbihyZXN1bHQpLCBmbiguLi5hcmdzKSlcbmNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gcGlwZSguLi5mbnMucmV2ZXJzZSgpKSguLi5hcmdzKVxuXG5jb25zdCBjb25jYXQgPSBsaXN0ID0+IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYmluZChsaXN0KVxuY29uc3QgcHJvbWlzZUNvbmNhdCA9IGYgPT4geCA9PiBmKCkudGhlbihjb25jYXQoeCkpXG5jb25zdCBwcm9taXNlUmVkdWNlID0gKGFjYywgeCkgPT4gYWNjLnRoZW4ocHJvbWlzZUNvbmNhdCh4KSlcbi8qXG4gKiBzZXJpYWwgZXhlY3V0ZXMgUHJvbWlzZXMgc2VxdWVudGlhbGx5LlxuICogQHBhcmFtIHtmdW5jc30gQW4gYXJyYXkgb2YgZnVuY3MgdGhhdCByZXR1cm4gcHJvbWlzZXMuXG4gKiBAZXhhbXBsZVxuICogY29uc3QgdXJscyA9IFsnL3VybDEnLCAnL3VybDInLCAnL3VybDMnXVxuICogc2VyaWFsKHVybHMubWFwKHVybCA9PiAoKSA9PiAkLmFqYXgodXJsKSkpXG4gKiAgICAgLnRoZW4oY29uc29sZS5sb2cuYmluZChjb25zb2xlKSlcbiAqL1xuY29uc3Qgc2VyaWFsID0gZnVuY3MgPT4gZnVuY3MucmVkdWNlKHByb21pc2VSZWR1Y2UsIFByb21pc2UucmVzb2x2ZShbXSkpXG5cbmNsYXNzIFNwZWFrZXIge1xuICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXNcbiAgY3VycmVudFV0dGVyYW5jZTogT2JqZWN0XG4gIGlzU3BlYWtpbmc6IGJvb2xlYW4gPSBmYWxzZVxuICBpc0NoYW5naW5nU3BlZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBpc1N0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBjdXJyZW50U3BlZWQ6IG51bWJlciA9IDEuMlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIHRoaXMuc3ludGguY2FuY2VsKClcbiAgfVxuXG4gIHNwZWFrKHV0dGVyKSB7XG4gICAgaWYgKCF1dHRlciAmJiAhdGhpcy5jdXJyZW50VXR0ZXJhbmNlKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoIXV0dGVyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFbXB0eSB1dHRlciB0ZXh0JylcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50VXR0ZXJhbmNlID0gdXR0ZXIgfHwgdGhpcy5jdXJyZW50VXR0ZXJhbmNlXG4gICAgaWYgKHRoaXMuc3ludGguc3BlYWtpbmcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGNhbid0IHNwZWFrICR7dXR0ZXJ9LiBBbHJlYWR5IHNwZWFraW5nYClcbiAgICAgIHRoaXMuc3ludGguY2FuY2VsKClcbiAgICAgIHRoaXMuc3BlYWsodXR0ZXIpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50VXR0ZXJhbmNlLnJhdGUgPSB0aGlzLmN1cnJlbnRTcGVlZFxuICAgIC8vIGlmICh0aGlzLmlzU3RvcHBlZCkgdGhpcy5wbGF5KClcblxuICAgIHRoaXMuc3ludGguc3BlYWsodGhpcy5jdXJyZW50VXR0ZXJhbmNlKVxuICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2VcbiAgfVxuICBzdG9wKCkge1xuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZSA9IG51bGxcbiAgICB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcGxheSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWVcbiAgICB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZVxuICAgIHRoaXMuc3ludGgucGF1c2UoKVxuICB9XG4gIHBsYXlQYXVzZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9ICF0aGlzLmlzU3RvcHBlZFxuICAgIHRoaXMuaXNTdG9wcGVkID8gdGhpcy5zeW50aC5wYXVzZSgpIDogdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIF9jaGFuZ2VTcGVlZChkZWx0YTogbnVtYmVyKSB7XG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuY3VycmVudFNwZWVkID0gZGVsdGEgPiAwXG4gICAgICA/IHRoaXMuY3VycmVudFNwZWVkICsgZGVsdGFcbiAgICAgIDogdGhpcy5jdXJyZW50U3BlZWQgPD0gTUlOX1NQRUVEID8gTUlOX1NQRUVEIDogdGhpcy5jdXJyZW50U3BlZWQgKyBkZWx0YVxuICAgIHRoaXMuaXNDaGFuZ2luZ1NwZWVkID0gdHJ1ZVxuICAgIHRoaXMuc3BlYWsoKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFNwZWVkKVxuICB9XG4gIGluY3JlbWVudFNwZWVkKCkgeyB0aGlzLl9jaGFuZ2VTcGVlZCgwLjIpIH1cbiAgZGVjcmVtZW50U3BlZWQoKSB7IHRoaXMuX2NoYW5nZVNwZWVkKC0wLjIpIH1cbn1cblxuY29uc3QgYXBwID0ge1xuICB2ZXJzaW9uOiAnMC4wLjQnLFxuICBnZXRWZXJzaW9uKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmVyc2lvbilcbiAgfSxcbiAgcmVhZGVyOiB7XG4gICAgdG9rZW5zQ291bnQ6IDAsXG4gICAgY3VycmVudFRva2VuSW5kZXg6IDAsXG4gICAgdGV4dFJlYWRpbmdEdXJhdGlvbjogMCxcbiAgICBnZXQgY3VycmVudFByb2dyZXNzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuSW5kZXggLyB0aGlzLnRva2Vuc0NvdW50XG4gICAgfSxcbiAgICBnZXQgdGltZUxlZnRSZWFkaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dFJlYWRpbmdEdXJhdGlvbiAtXG4gICAgICAgICh0aGlzLnRleHRSZWFkaW5nRHVyYXRpb24gKiB0aGlzLmN1cnJlbnRQcm9ncmVzcylcbiAgICB9XG4gIH0sXG4gIHNwZWFrZXI6IG5ldyBTcGVha2VyKCksXG4gIG5vU2xlZXA6IG5ldyBOb1NsZWVwKCksXG4gIGRvbToge1xuICAgIHVwZGF0ZVByb2dyZXNzQmFyKHByb2dyZXNzOiBudW1iZXIpIHtcbiAgICAgICRwcm9ncmVzc1BvaW50ZXIuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgYHRyYW5zbGF0ZSgke3Byb2dyZXNzICogJHByb2dyZXNzQmFyLmNsaWVudFdpZHRoIC0gMTZ9cHgsIDApYFxuICAgIH0sXG4gICAgdXBkYXRlVGltZUxlZnQoKSB7XG4gICAgICAvKiBjYWxjdWxhdGVzIHRpbWUgbGVmdCByZWFkaW5nICovXG4gICAgICAkdGltZUxlZnQuaW5uZXJUZXh0ID0gYCR7YXBwLnJlYWRlci50aW1lTGVmdFJlYWRpbmcudG9GaXhlZCgxKX0gbWluYFxuICAgIH0sXG4gICAgaGlnaGxpZ2h0Q3VycmVudFNlbnRlbmNlKHRleHQ6IHN0cmluZykge1xuICAgICAgY29uc3QgJGN1cnJlbnRTZW50ZW5jZSA9ICRpbnB1dC5xdWVyeVNlbGVjdG9yKGAjdG9rZW4tJHthcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4fWApXG4gICAgICBpZiAoJGN1cnJlbnRTZW50ZW5jZSkge1xuICAgICAgICAkY3VycmVudFNlbnRlbmNlLmNsYXNzTGlzdC5hZGQoJ3Rva2VuLS1oaWdobGlnaHRlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCAkcHJldmlvdXNTZW50ZW5jZSA9ICRpbnB1dC5xdWVyeVNlbGVjdG9yKGAjdG9rZW4tJHthcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4IC0gMX1gKVxuXG4gICAgICAvKiBSZW1vdmUgaGlnaGxpZ2h0IGZyb20gcHJldmlvdXMgdG9rZW4gKi9cbiAgICAgIGlmIChhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ID4gMCkge1xuICAgICAgICBpZiAoJHByZXZpb3VzU2VudGVuY2UpIHtcbiAgICAgICAgICAkcHJldmlvdXNTZW50ZW5jZS5jbGFzc0xpc3QucmVtb3ZlKCd0b2tlbi0taGlnaGxpZ2h0ZWQnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG53aW5kb3cuYXBwID0gYXBwXG5cbi8qXG4gKiBBbmFseXNlcyB0aGUgZmlyc3QgbGV0dGVyIGluIHRoZSB3b3JkXG4gKiBOb3cgaXQgY2FuIGd1ZXNzIGJldHdlZW4gY3lyaWxpYyBhbmQgbGF0aW4gbGV0dGVyIG9ubHlcbiAqL1xuY29uc3QgZGV0ZWN0TGFuZ0J5U3RyID0gKHN0cjogc3RyaW5nKSA9PiB7XG4gIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMFxuICBsZXQgbWF4Q2hhckluZGV4ID0gM1xuXG4gIHdoaWxlIChjdXJyZW50Q2hhckluZGV4IDw9IG1heENoYXJJbmRleCkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdChjdXJyZW50Q2hhckluZGV4KVxuICAgIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgICBpZiAoY2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgICBjaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgICByZXR1cm4gYWxwaGFiZXRcbiAgICAgIH1cbiAgICB9XG4gICAgY3VycmVudENoYXJJbmRleCsrXG4gIH1cblxuICByZXR1cm4gREVGQVVMVF9MQU5HVUFHRVxufVxuXG4vKlxuICogSWYgdGhlIHdvcmRzIGFyZSBpbiB0aGUgc2FtZSBsYW5ndWFnZSwgcmV0dXJucyB0cnV3XG4gKiBJZiBvbmUgb2YgdGhlIHdvcmRzIGlzIG51bWJlciwgcmV0dXJucyB0cnVlXG4gKiBPdGhlcndpc2UsIHJldHVybnMgZmFsc2VcbiAqL1xudHlwZSB3b3JkVHlwZSA9IHtcbiAgbGFuZzogc3RyaW5nLFxuICB0b2tlbjogc3RyaW5nXG59XG5jb25zdCBpc1RoZVNhbWVMYW5ndWFnZSA9IChcbiAgd29yZDE6IHdvcmRUeXBlLFxuICB3b3JkMjogd29yZFR5cGVcbikgPT4gd29yZDEubGFuZyA9PT0gd29yZDIubGFuZyB8fFxuICBbd29yZDEubGFuZywgd29yZDIubGFuZ10uaW5jbHVkZXMoJ251bWJlcicpXG5cbmNvbnN0IGpvaW5PbmVMYW5ndWFnZVdvcmRzID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTx3b3JkVHlwZT4gPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBjb25zdCBwcmV2aW91c1dvcmQgPSBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdXG4gICAgaXNUaGVTYW1lTGFuZ3VhZ2UocHJldmlvdXNXb3JkLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIHJldHVybiBzZW50ZW5jZXNcbn1cblxuY29uc3QgZm9ybWF0VGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHRleHQucmVwbGFjZSgvXFzigJMvZywgJy4nKS5yZXBsYWNlKC/igJQvZywgJzsnKVxuY29uc3Qgc3BsaXRUZXh0SW50b1NlbnRlbmNlcyA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiBzZW50ZW5jZS5zcGxpdCgnICcpXG5jb25zdCBjb3VudFdvcmRzSW5UZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gc3BsaXRTZW50ZW5jZUludG9Xb3Jkcyh0ZXh0KS5sZW5ndGhcbmNvbnN0IGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMgPSAod29yZHM6IEFycmF5PHN0cmluZz4pOiBBcnJheTx3b3JkVHlwZT4gPT5cbiAgd29yZHMubWFwKCh0b2tlbjogc3RyaW5nKSA9PiAoe1xuICAgIGxhbmc6IGRldGVjdExhbmdCeVN0cih0b2tlbiksXG4gICAgdG9rZW46IHRva2VuXG4gIH0pKVxuY29uc3QgZmlsdGVyV29yZHNBcnJheSA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KSA9PlxuICB3b3Jkcy5maWx0ZXIod29yZCA9PiB3b3JkLnRva2VuLmxlbmd0aCAhPT0gMClcblxuLypcbiAqIEEgTWVkaXVtLWxpa2UgZnVuY3Rpb24gY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZ1xuICovXG5jb25zdCBnZXRUZXh0UmVhZGluZ0R1cmF0aW9uID0gKHRleHQ6IHN0cmluZywgc3BlZWQ6IG51bWJlciA9IDEpID0+XG4gIGNvdW50V29yZHNJblRleHQodGV4dCkgLyAoREVGQVVMVF9XT1JEU19QRVJfTUlOVVRFICogc3BlZWQpXG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnQgPSAoc2VudGVuY2U6IHdvcmRUeXBlKTogT2JqZWN0ID0+IHtcbiAgY29uc3QgdXR0ZXJUaGlzID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZShzZW50ZW5jZS50b2tlbilcbiAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nIHx8IERFRkFVTFRfTEFOR1VBR0VcbiAgdXR0ZXJUaGlzLnJhdGUgPSAxLjlcbiAgcmV0dXJuIHV0dGVyVGhpc1xufVxuXG5jb25zdCBjcmVhdGVTcGVha0V2ZW50cyA9IChwYXJ0czogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8T2JqZWN0PiA9PlxuICBwYXJ0cy5tYXAoY3JlYXRlU3BlYWtFdmVudClcblxuY29uc3QgY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMgPVxuICAoc3BlYWtFdmVudHNTZW50ZW5jZXM6IEFycmF5PEFycmF5PE9iamVjdD4+KTogQXJyYXk8T2JqZWN0PiA9PlxuICAgIHNwZWFrRXZlbnRzU2VudGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKVxuXG5hcHAuc3BlYWtJdExvdWQgPSAoKSA9PiB7XG4gIGNvbnN0IHRleHQgPSBmb3JtYXRUZXh0KCRpbnB1dC5pbm5lclRleHQudHJpbSgpKVxuICBjb25zdCBzZW50ZW5jZXMgPSBzcGxpdFRleHRJbnRvU2VudGVuY2VzKHRleHQpXG4gIGNvbnNvbGUubG9nKHNlbnRlbmNlcylcblxuICBhcHAucmVhZGVyLnRleHRSZWFkaW5nRHVyYXRpb24gPSBnZXRUZXh0UmVhZGluZ0R1cmF0aW9uKHRleHQsIGFwcC5zcGVha2VyLmN1cnJlbnRTcGVlZClcblxuICBjb25zdCB0ZXh0VG9rZW5zQXJyYXkgPSBzZW50ZW5jZXMubWFwKHNlbnRlbmNlID0+IGNvbXBvc2UoXG4gICAgZmlsdGVyV29yZHNBcnJheSxcbiAgICBjb252ZXJ0V29yZHNJbnRvVG9rZW5zLFxuICAgIHNwbGl0U2VudGVuY2VJbnRvV29yZHNcbiAgKShzZW50ZW5jZSkpXG5cbiAgY29uc29sZS5sb2codGV4dFRva2Vuc0FycmF5KVxuICAvLyBjb25zdCBsb2dBbmRDb250aW51ZSA9IChhcmdzKSA9PiB7IGNvbnNvbGUubG9nKGFyZ3MpOyByZXR1cm4gYXJncyB9XG4gIGNvbnN0IHNwZWFrRXZlbnRzU2VudGVuY2VzID0gdGV4dFRva2Vuc0FycmF5Lm1hcChcbiAgICAodGV4dFRva2VuczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8QXJyYXk8T2JqZWN0Pj4gPT4gY29tcG9zZShcbiAgICAgIGNyZWF0ZVNwZWFrRXZlbnRzLFxuICAgICAgam9pbk9uZUxhbmd1YWdlV29yZHNcbiAgICApKHRleHRUb2tlbnMpKVxuXG4gIGNvbnN0IHByb21pc2VzID0gW11cbiAgY29uc3QgcGhyYXNlcyA9IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzKHNwZWFrRXZlbnRzU2VudGVuY2VzKVxuICBjb25zb2xlLmxvZyhwaHJhc2VzKVxuICBhcHAucmVhZGVyLnRva2Vuc0NvdW50ID0gcGhyYXNlcy5sZW5ndGhcbiAgcGhyYXNlcy5mb3JFYWNoKHBocmFzZSA9PlxuICAgIHByb21pc2VzLnB1c2goKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBhcHAuc3BlYWtlci5zcGVhayhwaHJhc2UpXG5cbiAgICAgIGNvbnNvbGUubG9nKGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXgpXG4gICAgICBhcHAuZG9tLmhpZ2hsaWdodEN1cnJlbnRTZW50ZW5jZShwaHJhc2UudGV4dClcbiAgICAgIGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggPSBhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ICsgMVxuXG4gICAgICBhcHAuZG9tLnVwZGF0ZVByb2dyZXNzQmFyKGFwcC5yZWFkZXIuY3VycmVudFByb2dyZXNzKVxuICAgICAgYXBwLmRvbS51cGRhdGVUaW1lTGVmdCgpXG5cbiAgICAgIHBocmFzZS5vbmVuZCA9ICgpID0+IHtcbiAgICAgICAgaWYgKGFwcC5zcGVha2VyLmlzQ2hhbmdpbmdTcGVlZCkge1xuICAgICAgICAgIGFwcC5zcGVha2VyLmlzQ2hhbmdpbmdTcGVlZCA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFwcC5zcGVha2VyLmlzU3RvcHBlZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHBocmFzZS50ZXh0KVxuICAgICAgfVxuICAgIH0pKVxuICApXG5cbiAgc2VyaWFsKHByb21pc2VzKS50aGVuKGNvbnNvbGUubG9nKVxufVxuXG4vKlxuICogVHJpZ2dlcnMgd2hlbiDCq3NwZWFrwrsgYnV0dG9uIGlzIHByZXNzZWRcbiAqL1xuXG5hcHAubm9TbGVlcC5lbmFibGUoKVxuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICBjb25zb2xlLmxvZygnY2xpY2tlZCcpXG4gIGFwcC5zcGVha0l0TG91ZCgpXG59KVxuXG4vKlxuICogVHJpZ2dlcnMgd2hlbiB1c2VyIGlzIHRyeWluZyB0byByZWZyZXNoL2Nsb3NlIGFwcFxuICovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgZXZlbnQgPT4ge1xuICBjb25zb2xlLmxvZyhhcHAuc3BlYWtlci5zdG9wKCkpXG59KVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAvLyBJZiBzcGFjZSBpcyBwcmVzc2VkXG4gIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgIGFwcC5zcGVha2VyLnBsYXlQYXVzZSgpXG4gIH1cblxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMgJiYgKGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSkpIHtcbiAgICBhcHAuc3BlYWtJdExvdWQoKVxuICB9XG59KVxuXG4kaW5wdXQuZm9jdXMoKVxuXG4kaW5pdGlhbFRleHQuZm9jdXMoKVxuXG5cbiRpbmNyZW1lbnRTcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgYXBwLnNwZWFrZXIuaW5jcmVtZW50U3BlZWQoKVxufSlcblxuJGRlY3JlbWVudFNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICBhcHAuc3BlYWtlci5kZWNyZW1lbnRTcGVlZCgpXG59KVxuXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICRpbml0aWFsVGV4dC5yZW1vdmUoKVxuICAvLyBUT0RPOiBzdGFydCBmcm9tIHRoZSBzZWxlY3RlZCBzZW50ZW5jZSAodG9rZW4pXG4gIGNvbnNvbGUubG9nKGV2ZW50KVxufSlcblxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICRpbml0aWFsVGV4dC5yZW1vdmUoKVxufSlcblxuJGlucHV0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LXRleHRhcmVhLS1pbml0aWFsJylcbiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChldmVudDogRXZlbnQpID0+IHtcbiAgJGluaXRpYWxUZXh0LnJlbW92ZSgpXG4gICRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dC10ZXh0YXJlYS0taW5pdGlhbCcpXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBsZXQgcGFzdGVkVGV4dCA9ICcnXG4gIGNvbnN0IGNsaXBib2FyZERhdGEgPSBldmVudC5jbGlwYm9hcmREYXRhIHx8XG4gICAgd2luZG93LmNsaXBib2FyZERhdGEgfHwgZXZlbnQub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhXG5cbiAgcGFzdGVkVGV4dCA9IGNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpXG5cbiAgY29uc3QgaGlkZGVuSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBoaWRkZW5JbnB1dC5pbm5lckhUTUwgPSBwYXN0ZWRUZXh0XG5cbiAgY29uc3QgdGV4dCA9IGhpZGRlbklucHV0LnRleHRDb250ZW50XG4gIGNvbnN0IHNlbnRlbmNlcyA9IHNwbGl0VGV4dEludG9TZW50ZW5jZXModGV4dClcbiAgY29uc29sZS5sb2coc2VudGVuY2VzKVxuICBzZW50ZW5jZXMuZm9yRWFjaCgoc2VudGVuY2UsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZGl2VG9rZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBkaXZUb2tlbi5pbm5lclRleHQgPSBzZW50ZW5jZSArICcuJ1xuICAgIGRpdlRva2VuLmlkID0gYHRva2VuLSR7aW5kZXh9YFxuICAgIGRpdlRva2VuLmNsYXNzTGlzdC5hZGQoJ3Rva2VuJylcbiAgICBkaXZUb2tlbi5zZXRBdHRyaWJ1dGUoJ3NwZWxsY2hlY2snLCAnZmFsc2UnKVxuICAgICRpbnB1dC5hcHBlbmRDaGlsZChkaXZUb2tlbilcbiAgfSlcbiAgLy8gJGlucHV0LmlubmVySFRNTCA9IHRleHRcbiAgY29uc29sZS5sb2codGV4dClcbn0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJjb25zdCBtZWRpYUZpbGUgPSByZXF1aXJlKCcuL21lZGlhLmpzJylcblxuLy8gRGV0ZWN0IGlPUyBicm93c2VycyA8IHZlcnNpb24gMTBcbmNvbnN0IG9sZElPUyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHBhcnNlRmxvYXQoXG4gICgnJyArICgvQ1BVLipPUyAoWzAtOV9dezMsNH0pWzAtOV9dezAsMX18KENQVSBsaWtlKS4qQXBwbGVXZWJLaXQuKk1vYmlsZS9pLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWzAsICcnXSlbMV0pXG4gICAgLnJlcGxhY2UoJ3VuZGVmaW5lZCcsICczXzInKS5yZXBsYWNlKCdfJywgJy4nKS5yZXBsYWNlKCdfJywgJycpXG4pIDwgMTAgJiYgIXdpbmRvdy5NU1N0cmVhbVxuXG5jbGFzcyBOb1NsZWVwIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXQgdXAgbm8gc2xlZXAgdmlkZW8gZWxlbWVudFxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG5cbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAnJylcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlKVxuXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMubm9TbGVlcFZpZGVvLmN1cnJlbnRUaW1lID4gMC41KSB7XG4gICAgICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uY3VycmVudFRpbWUgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICB9XG4gIH1cblxuICBlbmFibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKVxuICAgICAgfSwgMTUwMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBsYXkoKVxuICAgIH1cbiAgfVxuXG4gIGRpc2FibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIGlmICh0aGlzLm5vU2xlZXBUaW1lcikge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLm5vU2xlZXBUaW1lcilcbiAgICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBhdXNlKClcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9TbGVlcFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAnZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFJR1owZVhCdGNEUXlBQUFDQUdsemIyMXBjMjh5WVhaak1XMXdOREVBQUFBSVpuSmxaUUFBQ0tCdFpHRjBBQUFDOHdZRi8vL3YzRVhwdmViWlNMZVdMTmdnMlNQdTczZ3lOalFnTFNCamIzSmxJREUwTWlCeU1qUTNPU0JrWkRjNVlUWXhJQzBnU0M0eU5qUXZUVkJGUnkwMElFRldReUJqYjJSbFl5QXRJRU52Y0hsc1pXWjBJREl3TURNdE1qQXhOQ0F0SUdoMGRIQTZMeTkzZDNjdWRtbGtaVzlzWVc0dWIzSm5MM2d5TmpRdWFIUnRiQ0F0SUc5d2RHbHZibk02SUdOaFltRmpQVEVnY21WbVBURWdaR1ZpYkc5amF6MHhPakE2TUNCaGJtRnNlWE5sUFRCNE1Ub3dlREV4TVNCdFpUMW9aWGdnYzNWaWJXVTlNaUJ3YzNrOU1TQndjM2xmY21ROU1TNHdNRG93TGpBd0lHMXBlR1ZrWDNKbFpqMHdJRzFsWDNKaGJtZGxQVEUySUdOb2NtOXRZVjl0WlQweElIUnlaV3hzYVhNOU1DQTRlRGhrWTNROU1DQmpjVzA5TUNCa1pXRmtlbTl1WlQweU1Td3hNU0JtWVhOMFgzQnphMmx3UFRFZ1kyaHliMjFoWDNGd1gyOW1abk5sZEQwd0lIUm9jbVZoWkhNOU5pQnNiMjlyWVdobFlXUmZkR2h5WldGa2N6MHhJSE5zYVdObFpGOTBhSEpsWVdSelBUQWdibkk5TUNCa1pXTnBiV0YwWlQweElHbHVkR1Z5YkdGalpXUTlNQ0JpYkhWeVlYbGZZMjl0Y0dGMFBUQWdZMjl1YzNSeVlXbHVaV1JmYVc1MGNtRTlNQ0JpWm5KaGJXVnpQVE1nWWw5d2VYSmhiV2xrUFRJZ1lsOWhaR0Z3ZEQweElHSmZZbWxoY3owd0lHUnBjbVZqZEQweElIZGxhV2RvZEdJOU1TQnZjR1Z1WDJkdmNEMHdJSGRsYVdkb2RIQTlNU0JyWlhscGJuUTlNekF3SUd0bGVXbHVkRjl0YVc0OU16QWdjMk5sYm1WamRYUTlOREFnYVc1MGNtRmZjbVZtY21WemFEMHdJSEpqWDJ4dmIydGhhR1ZoWkQweE1DQnlZejFqY21ZZ2JXSjBjbVZsUFRFZ1kzSm1QVEl3TGpBZ2NXTnZiWEE5TUM0Mk1DQnhjRzFwYmowd0lIRndiV0Y0UFRZNUlIRndjM1JsY0QwMElIWmlkbDl0WVhoeVlYUmxQVEl3TURBd0lIWmlkbDlpZFdaemFYcGxQVEkxTURBd0lHTnlabDl0WVhnOU1DNHdJRzVoYkY5b2NtUTlibTl1WlNCbWFXeHNaWEk5TUNCcGNGOXlZWFJwYnoweExqUXdJR0Z4UFRFNk1TNHdNQUNBQUFBQU9XV0loQUEzLy9wK0M3djh0RERTVGpmOTd3NTVpM1NiUlBPNFpZK2hrakQ1aGJrQWtMM3pwSjZoL0xSMUNBQUJ6Z0Ixa3FxelVvcmxoUUFBQUF4Qm1pUVlobi8rcVpZQURMZ0FBQUFKUVo1Q1FoWC9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlWVVRbi93QUxLQ0VBQTBCb0hBQUFBQWtCbm1ORUovOEFDeWtoQUFOQWFCd2hBQU5BYUJ3QUFBQU5RWnBvTkV4RFAvNnBsZ0FNdVNFQUEwQm9IQUFBQUF0Qm5vWkZFU3dyL3dBSStTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm5xVkVKLzhBQ3lraEFBTkFhQndBQUFBSkFaNm5SQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBRFVHYXJEUk1Rei8rcVpZQURMZ2hBQU5BYUJ3QUFBQUxRWjdLUlJVc0svOEFDUGtoQUFOQWFCd0FBQUFKQVo3cFJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlNjBRbi93QUxLQ0VBQTBCb0hBQUFBQTFCbXZBMFRFTS8vcW1XQUF5NUlRQURRR2djSVFBRFFHZ2NBQUFBQzBHZkRrVVZMQ3YvQUFqNUlRQURRR2djQUFBQUNRR2ZMVVFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm55OUVKLzhBQ3lnaEFBTkFhQndBQUFBTlFaczBORXhEUC82cGxnQU11Q0VBQTBCb0hBQUFBQXRCbjFKRkZTd3Ivd0FJK1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbjNGRUovOEFDeWdoQUFOQWFCd0FBQUFKQVo5elJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFEVUdiZURSTVF6LytxWllBRExraEFBTkFhQndBQUFBTFFaK1dSUlVzSy84QUNQZ2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaKzFSQ2YvQUFzcElRQURRR2djQUFBQUNRR2Z0MFFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUExQm03dzBURU0vL3FtV0FBeTRJUUFEUUdnY0FBQUFDMEdmMmtVVkxDdi9BQWo1SVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbi90RUovOEFDeWtoQUFOQWFCd0FBQUFOUVp2Z05FeERQLzZwbGdBTXVTRUFBMEJvSENFQUEwQm9IQUFBQUF0Qm5oNUZGU3dyL3dBSStDRUFBMEJvSEFBQUFBa0JuajFFSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaNC9SQ2YvQUFzcElRQURRR2djQUFBQURVR2FKRFJNUXovK3FaWUFETGdoQUFOQWFCd0FBQUFMUVo1Q1JSVXNLLzhBQ1BraEFBTkFhQndoQUFOQWFCd0FBQUFKQVo1aFJDZi9BQXNvSVFBRFFHZ2NBQUFBQ1FHZVkwUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQTFCbW1nMFRFTS8vcW1XQUF5NUlRQURRR2djQUFBQUMwR2Voa1VWTEN2L0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2VwVVFuL3dBTEtTRUFBMEJvSEFBQUFBa0JucWRFSi84QUN5Z2hBQU5BYUJ3QUFBQU5RWnFzTkV4RFAvNnBsZ0FNdUNFQUEwQm9IQ0VBQTBCb0hBQUFBQXRCbnNwRkZTd3Ivd0FJK1NFQUEwQm9IQUFBQUFrQm51bEVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVo3clJDZi9BQXNvSVFBRFFHZ2NBQUFBRFVHYThEUk1Rei8rcVpZQURMa2hBQU5BYUJ3aEFBTkFhQndBQUFBTFFaOE9SUlVzSy84QUNQa2hBQU5BYUJ3QUFBQUpBWjh0UkNmL0FBc3BJUUFEUUdnY0lRQURRR2djQUFBQUNRR2ZMMFFuL3dBTEtDRUFBMEJvSEFBQUFBMUJtelEwVEVNLy9xbVdBQXk0SVFBRFFHZ2NBQUFBQzBHZlVrVVZMQ3YvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZmNVUW4vd0FMS0NFQUEwQm9IQUFBQUFrQm4zTkVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFOUVp0NE5FeEMvLzZwbGdBTXVTRUFBMEJvSEFBQUFBdEJuNVpGRlN3ci93QUkrQ0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuN1ZFSi84QUN5a2hBQU5BYUJ3QUFBQUpBWiszUkNmL0FBc3BJUUFEUUdnY0FBQUFEVUdidXpSTVFuLytuaEFBWXNBaEFBTkFhQndoQUFOQWFCd0FBQUFKUVovYVFoUC9BQXNwSVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSEFBQUNpRnRiMjkyQUFBQWJHMTJhR1FBQUFBQTFZQ0NYOVdBZ2w4QUFBUG9BQUFIL0FBQkFBQUJBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEQUFBQUdHbHZaSE1BQUFBQUVJQ0FnQWNBVC8vLy92Ny9BQUFGK1hSeVlXc0FBQUJjZEd0b1pBQUFBQVBWZ0lKZjFZQ0NYd0FBQUFFQUFBQUFBQUFIMEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBeWdBQUFNb0FBQUFBQUNSbFpIUnpBQUFBSEdWc2MzUUFBQUFBQUFBQUFRQUFCOUFBQUJkd0FBRUFBQUFBQlhGdFpHbGhBQUFBSUcxa2FHUUFBQUFBMVlDQ1g5V0FnbDhBQVYrUUFBSy9JRlhFQUFBQUFBQXRhR1JzY2dBQUFBQUFBQUFBZG1sa1pRQUFBQUFBQUFBQUFBQUFBRlpwWkdWdlNHRnVaR3hsY2dBQUFBVWNiV2x1WmdBQUFCUjJiV2hrQUFBQUFRQUFBQUFBQUFBQUFBQUFKR1JwYm1ZQUFBQWNaSEpsWmdBQUFBQUFBQUFCQUFBQURIVnliQ0FBQUFBQkFBQUUzSE4wWW13QUFBQ1ljM1J6WkFBQUFBQUFBQUFCQUFBQWlHRjJZekVBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF5Z0RLQUVnQUFBQklBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBWS8vOEFBQUF5WVhaalF3Rk5RQ2ovNFFBYlowMUFLT3lobzN5U1RVQkFRRkFBQUFNQUVBQXI4Z0R4Z3hsZ0FRQUVhTytHOGdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFBOEFBQUx1QUFBQUJSemRITnpBQUFBQUFBQUFBRUFBQUFCQUFBQjhHTjBkSE1BQUFBQUFBQUFQQUFBQUFFQUFCZHdBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQUM3Z0FBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBRUVjM1J6ZWdBQUFBQUFBQUFBQUFBQVBBQUFBelFBQUFBUUFBQUFEUUFBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQU5BQUFBRFFBQUFRQnpkR052QUFBQUFBQUFBRHdBQUFBd0FBQURaQUFBQTNRQUFBT05BQUFEb0FBQUE3a0FBQVBRQUFBRDZ3QUFBLzRBQUFRWEFBQUVMZ0FBQkVNQUFBUmNBQUFFYndBQUJJd0FBQVNoQUFBRXVnQUFCTTBBQUFUa0FBQUUvd0FBQlJJQUFBVXJBQUFGUWdBQUJWMEFBQVZ3QUFBRmlRQUFCYUFBQUFXMUFBQUZ6Z0FBQmVFQUFBWCtBQUFHRXdBQUJpd0FBQVkvQUFBR1ZnQUFCbkVBQUFhRUFBQUduUUFBQnJRQUFBYlBBQUFHNGdBQUJ2VUFBQWNTQUFBSEp3QUFCMEFBQUFkVEFBQUhjQUFBQjRVQUFBZWVBQUFIc1FBQUI4Z0FBQWZqQUFBSDlnQUFDQThBQUFnbUFBQUlRUUFBQ0ZRQUFBaG5BQUFJaEFBQUNKY0FBQU1zZEhKaGF3QUFBRngwYTJoa0FBQUFBOVdBZ2wvVmdJSmZBQUFBQWdBQUFBQUFBQWY4QUFBQUFBQUFBQUFBQUFBQkFRQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFDc20xa2FXRUFBQUFnYldSb1pBQUFBQURWZ0lKZjFZQ0NYd0FBckVRQUFXQUFWY1FBQUFBQUFDZG9aR3h5QUFBQUFBQUFBQUJ6YjNWdUFBQUFBQUFBQUFBQUFBQUFVM1JsY21WdkFBQUFBbU50YVc1bUFBQUFFSE50YUdRQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFpZHpkR0pzQUFBQVozTjBjMlFBQUFBQUFBQUFBUUFBQUZkdGNEUmhBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUNBQkFBQUFBQXJFUUFBQUFBQURObGMyUnpBQUFBQUFPQWdJQWlBQUlBQklDQWdCUkFGUUFBQUFBRERVQUFBQUFBQllDQWdBSVNFQWFBZ0lBQkFnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQllBQUFFQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBQVVjM1J6ZWdBQUFBQUFBQUFHQUFBQVdBQUFBWEJ6ZEdOdkFBQUFBQUFBQUZnQUFBT0JBQUFEaHdBQUE1b0FBQU90QUFBRHN3QUFBOG9BQUFQZkFBQUQ1UUFBQS9nQUFBUUxBQUFFRVFBQUJDZ0FBQVE5QUFBRVVBQUFCRllBQUFScEFBQUVnQUFBQklZQUFBU2JBQUFFcmdBQUJMUUFBQVRIQUFBRTNnQUFCUE1BQUFUNUFBQUZEQUFBQlI4QUFBVWxBQUFGUEFBQUJWRUFBQVZYQUFBRmFnQUFCWDBBQUFXREFBQUZtZ0FBQmE4QUFBWENBQUFGeUFBQUJkc0FBQVh5QUFBRitBQUFCZzBBQUFZZ0FBQUdKZ0FBQmprQUFBWlFBQUFHWlFBQUJtc0FBQVorQUFBR2tRQUFCcGNBQUFhdUFBQUd3d0FBQnNrQUFBYmNBQUFHN3dBQUJ3WUFBQWNNQUFBSElRQUFCelFBQUFjNkFBQUhUUUFBQjJRQUFBZHFBQUFIZndBQUI1SUFBQWVZQUFBSHF3QUFCOElBQUFmWEFBQUgzUUFBQi9BQUFBZ0RBQUFJQ1FBQUNDQUFBQWcxQUFBSU93QUFDRTRBQUFoaEFBQUllQUFBQ0g0QUFBaVJBQUFJcEFBQUNLb0FBQWl3QUFBSXRnQUFDTHdBQUFqQ0FBQUFGblZrZEdFQUFBQU9ibUZ0WlZOMFpYSmxid0FBQUhCMVpIUmhBQUFBYUcxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBTzJsc2MzUUFBQUF6cVhSdmJ3QUFBQ3RrWVhSaEFBQUFBUUFBQUFCSVlXNWtRbkpoYTJVZ01DNHhNQzR5SURJd01UVXdOakV4TURBPSdcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL21lZGlhLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=