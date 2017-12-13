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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sha256__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sha256___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_sha256__);



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
    originalText: null,
    textSha256: null,
    textTokens: [],
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

const splitIntoTextTokens = text => {
  const sentences = splitTextIntoSentences(text);

  const textTokensArray = sentences.map(sentence => compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(sentence));

  console.log(textTokensArray);
  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(textTokens => compose(createSpeakEvents, joinOneLanguageWords)(textTokens));

  const phrases = concatSpeakEventsSentences(speakEventsSentences);
  return phrases;
};

const proccessingTextToSpeech = text => {
  if (app.reader.textSha256 && app.reader.textSha256 === __WEBPACK_IMPORTED_MODULE_1_sha256___default()(text)) {
    console.error('text is the same, continue...');
    return;
  }
  text = formatText(text);
  app.reader.originalText = text;
  app.reader.textSha256 = __WEBPACK_IMPORTED_MODULE_1_sha256___default()(text);
  app.reader.textTokens = splitIntoTextTokens(text);
  app.reader.tokensCount = app.reader.textTokens.length;
  app.reader.textReadingDuration = getTextReadingDuration(text, app.speaker.currentSpeed);
};

const renderTransformedText = () => {
  $input.innerHTML = '';
  app.reader.textTokens.forEach((token, index) => {
    const divToken = document.createElement('span');
    divToken.innerText = token.text + '.';
    divToken.id = `token-${index}`;
    divToken.classList.add('token');
    divToken.setAttribute('spellcheck', 'false');
    $input.appendChild(divToken);
  });
};

app.speakItLoud = () => {
  const text = $input.innerText.trim();
  proccessingTextToSpeech(text);
  renderTransformedText();

  const promises = [];
  console.log(app.reader.textTokens);
  app.reader.textTokens.forEach(phrase => promises.push(() => new Promise((resolve, reject) => {

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
  event.preventDefault();
  $initialText.remove();
  $input.classList.remove('input-textarea--initial');

  const clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;

  const pastedText = clipboardData.getData('Text');

  const hiddenInput = document.createElement('div');
  hiddenInput.innerHTML = pastedText;

  const text = hiddenInput.textContent;
  proccessingTextToSpeech(text);
  renderTransformedText();
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

module.exports = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA='


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

!function(globals) {
'use strict'

var _imports = {}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  _imports.bytesToHex = __webpack_require__(4).bytesToHex
  _imports.convertString = __webpack_require__(5)
  module.exports = sha256
} else {
  _imports.bytesToHex = globals.convertHex.bytesToHex
  _imports.convertString = globals.convertString
  globals.sha256 = sha256
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

// Initialization round constants tables
var K = []

// Compute constants
!function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2
  var nPrime = 0
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3))
      nPrime++
    }

    n++
  }
}()

var bytesToWords = function (bytes) {
  var words = []
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32)
  }
  return words
}

var wordsToBytes = function (words) {
  var bytes = []
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
  }
  return bytes
}

// Reusable object
var W = []

var processBlock = function (H, M, offset) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3]
  var e = H[4], f = H[5], g = H[6], h = H[7]

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0
    } else {
      var gamma0x = W[i - 15]
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3)

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10)

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
}

function sha256(message, options) {;
  if (message.constructor === String) {
    message = _imports.convertString.UTF8.stringToBytes(message);
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? _imports.convertString.bytesToString(digestbytes) :
         _imports.bytesToHex(digestbytes)
}

sha256.x2 = function(message, options) {
  return sha256(sha256(message, { asBytes:true }), options)
}

}(this);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

!function(globals) {
'use strict'

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2)
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
}


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertHex
} else {
  globals.convertHex = convertHex
}

}(this);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

!function(globals) {
'use strict'

var convertString = {
  bytesToString: function(bytes) {
    return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
  },
  stringToBytes: function(str) {
    return str.split('').map(function(x) { return x.charCodeAt(0) })
  }
}

//http://hossa.in/2012/07/20/utf-8-in-javascript.html
convertString.UTF8 = {
   bytesToString: function(bytes) {
    return decodeURIComponent(escape(convertString.bytesToString(bytes)))
  },
  stringToBytes: function(str) {
   return convertString.stringToBytes(unescape(encodeURIComponent(str)))
  }
}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertString
} else {
  globals.convertString = convertString
}

}(this);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzUxNmQ1ZTJiMGU2YTA1OTdhMDUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NoYTI1Ni9saWIvc2hhMjU2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb252ZXJ0LWhleC9jb252ZXJ0LWhleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29udmVydC1zdHJpbmcvY29udmVydC1zdHJpbmcuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGluaXRpYWxUZXh0IiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJERUZBVUxUX0xBTkdVQUdFIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiY29uY2F0IiwibGlzdCIsIkFycmF5IiwicHJvdG90eXBlIiwiYmluZCIsInByb21pc2VDb25jYXQiLCJmIiwieCIsInRoZW4iLCJwcm9taXNlUmVkdWNlIiwiYWNjIiwic2VyaWFsIiwiZnVuY3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlNwZWFrZXIiLCJjb25zdHJ1Y3RvciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwiY29uc29sZSIsImVycm9yIiwic3BlYWtpbmciLCJjYW5jZWwiLCJyYXRlIiwic3RvcCIsInBsYXkiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwibG9nIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJvcmlnaW5hbFRleHQiLCJ0ZXh0U2hhMjU2IiwidGV4dFRva2VucyIsImN1cnJlbnRQcm9ncmVzcyIsInRpbWVMZWZ0UmVhZGluZyIsInNwZWFrZXIiLCJub1NsZWVwIiwiZG9tIiwidXBkYXRlUHJvZ3Jlc3NCYXIiLCJwcm9ncmVzcyIsInN0eWxlIiwidHJhbnNmb3JtIiwiY2xpZW50V2lkdGgiLCJ1cGRhdGVUaW1lTGVmdCIsImlubmVyVGV4dCIsInRvRml4ZWQiLCJoaWdobGlnaHRDdXJyZW50U2VudGVuY2UiLCJ0ZXh0IiwiJGN1cnJlbnRTZW50ZW5jZSIsImNsYXNzTGlzdCIsImFkZCIsIiRwcmV2aW91c1NlbnRlbmNlIiwicmVtb3ZlIiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiY3VycmVudENoYXJJbmRleCIsIm1heENoYXJJbmRleCIsImNoYXJDb2RlIiwidG9Mb3dlckNhc2UiLCJjaGFyQ29kZUF0IiwiYWxwaGFiZXQiLCJpc1RoZVNhbWVMYW5ndWFnZSIsIndvcmQxIiwid29yZDIiLCJsYW5nIiwiaW5jbHVkZXMiLCJqb2luT25lTGFuZ3VhZ2VXb3JkcyIsIndvcmRzIiwic2VudGVuY2VzIiwiZm9yRWFjaCIsIndvcmQiLCJsZW5ndGgiLCJwdXNoIiwicHJldmlvdXNXb3JkIiwidG9rZW4iLCJqb2luIiwiZm9ybWF0VGV4dCIsInJlcGxhY2UiLCJzcGxpdFRleHRJbnRvU2VudGVuY2VzIiwic3BsaXQiLCJzcGxpdFNlbnRlbmNlSW50b1dvcmRzIiwic2VudGVuY2UiLCJjb3VudFdvcmRzSW5UZXh0IiwiY29udmVydFdvcmRzSW50b1Rva2VucyIsIm1hcCIsImZpbHRlcldvcmRzQXJyYXkiLCJmaWx0ZXIiLCJnZXRUZXh0UmVhZGluZ0R1cmF0aW9uIiwic3BlZWQiLCJjcmVhdGVTcGVha0V2ZW50IiwidXR0ZXJUaGlzIiwiU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlIiwiY3JlYXRlU3BlYWtFdmVudHMiLCJwYXJ0cyIsImNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzIiwic3BlYWtFdmVudHNTZW50ZW5jZXMiLCJhIiwiYiIsInNwbGl0SW50b1RleHRUb2tlbnMiLCJ0ZXh0VG9rZW5zQXJyYXkiLCJwaHJhc2VzIiwicHJvY2Nlc3NpbmdUZXh0VG9TcGVlY2giLCJzaGEyNTYiLCJyZW5kZXJUcmFuc2Zvcm1lZFRleHQiLCJpbm5lckhUTUwiLCJpbmRleCIsImRpdlRva2VuIiwiY3JlYXRlRWxlbWVudCIsImlkIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJzcGVha0l0TG91ZCIsInRyaW0iLCJwcm9taXNlcyIsInBocmFzZSIsInJlamVjdCIsIm9uZW5kIiwiZW5hYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwia2V5Q29kZSIsIm1ldGFLZXkiLCJjdHJsS2V5IiwiZm9jdXMiLCJwcmV2ZW50RGVmYXVsdCIsImNsaXBib2FyZERhdGEiLCJvcmlnaW5hbEV2ZW50IiwicGFzdGVkVGV4dCIsImdldERhdGEiLCJoaWRkZW5JbnB1dCIsInRleHRDb250ZW50Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFD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QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsd0JBQXdCO0FBQ3JFO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0EsZ0NBQWdDLG1DQUFtQztBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0Esc0RBQXNEO0FBQ3REO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUEsQ0FBQyxPOzs7Ozs7QUM5Q0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDLGdDQUFnQztBQUNqRSxHQUFHO0FBQ0g7QUFDQSwwQ0FBMEMseUJBQXlCO0FBQ25FO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNEO0FBQ3REO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUEsQ0FBQyxPIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGM1MTZkNWUyYjBlNmEwNTk3YTA1IiwiLy8gQGZsb3dcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMnXG5pbXBvcnQgc2hhMjU2IGZyb20gJ3NoYTI1NidcblxuY29uc3QgJGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LXRleHRhcmVhJylcbmNvbnN0ICRpbml0aWFsVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbml0aWFsLXRleHQnKVxuY29uc3QgJGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24nKVxuY29uc3QgJGluY3JlbWVudFNwZWVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luY3JlbWVudC1zcGVlZCcpXG5jb25zdCAkZGVjcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVjcmVtZW50LXNwZWVkJylcbmNvbnN0ICRwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcy1iYXInKVxuY29uc3QgJHByb2dyZXNzUG9pbnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcy1wb2ludGVyJylcbmNvbnN0ICR0aW1lTGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aW1lLWxlZnQnKVxuXG5jb25zdCBBTFBIQUJFVCA9IHtcbiAgJ3J1LVJVJzoge1xuICAgIHVuaWNvZGU6IFsxMDcyLCAxMTAzXVxuICB9LFxuICAnbnVtYmVyJzoge1xuICAgIHVuaWNvZGU6IFs0OCwgNTddXG4gIH1cbn1cblxuLy8gd2hlbiBzcGVha2luZyBzcGVlZCBpcyAxXG5jb25zdCBERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUgPSAxMTcuNlxuY29uc3QgTUlOX1NQRUVEID0gMC41MlxuY29uc3QgREVGQVVMVF9MQU5HVUFHRSA9ICdlbi1VUydcblxuLy8gZnAgY29tcG9zaXRpb24gJiBwaXBlIGhlbHBlcnNcbmNvbnN0IHBpcGUgPSAoZm4sIC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IGZucy5yZWR1Y2UoKHJlc3VsdCwgZm4pID0+IGZuKHJlc3VsdCksIGZuKC4uLmFyZ3MpKVxuY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+ICguLi5hcmdzKSA9PiBwaXBlKC4uLmZucy5yZXZlcnNlKCkpKC4uLmFyZ3MpXG5cbmNvbnN0IGNvbmNhdCA9IGxpc3QgPT4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5iaW5kKGxpc3QpXG5jb25zdCBwcm9taXNlQ29uY2F0ID0gZiA9PiB4ID0+IGYoKS50aGVuKGNvbmNhdCh4KSlcbmNvbnN0IHByb21pc2VSZWR1Y2UgPSAoYWNjLCB4KSA9PiBhY2MudGhlbihwcm9taXNlQ29uY2F0KHgpKVxuLypcbiAqIHNlcmlhbCBleGVjdXRlcyBQcm9taXNlcyBzZXF1ZW50aWFsbHkuXG4gKiBAcGFyYW0ge2Z1bmNzfSBBbiBhcnJheSBvZiBmdW5jcyB0aGF0IHJldHVybiBwcm9taXNlcy5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB1cmxzID0gWycvdXJsMScsICcvdXJsMicsICcvdXJsMyddXG4gKiBzZXJpYWwodXJscy5tYXAodXJsID0+ICgpID0+ICQuYWpheCh1cmwpKSlcbiAqICAgICAudGhlbihjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKVxuICovXG5jb25zdCBzZXJpYWwgPSBmdW5jcyA9PiBmdW5jcy5yZWR1Y2UocHJvbWlzZVJlZHVjZSwgUHJvbWlzZS5yZXNvbHZlKFtdKSlcblxuY2xhc3MgU3BlYWtlciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjdXJyZW50VXR0ZXJhbmNlOiBPYmplY3RcbiAgaXNTcGVha2luZzogYm9vbGVhbiA9IGZhbHNlXG4gIGlzQ2hhbmdpbmdTcGVlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGlzU3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlXG4gIGN1cnJlbnRTcGVlZDogbnVtYmVyID0gMS4yXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gdGhpcy5zeW50aC5jYW5jZWwoKVxuICB9XG5cbiAgc3BlYWsodXR0ZXIpIHtcbiAgICBpZiAoIXV0dGVyICYmICF0aGlzLmN1cnJlbnRVdHRlcmFuY2UpIHJldHVybiBmYWxzZVxuICAgIGlmICghdXR0ZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0VtcHR5IHV0dGVyIHRleHQnKVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICBpZiAodGhpcy5zeW50aC5zcGVha2luZykge1xuICAgICAgY29uc29sZS5lcnJvcihgY2FuJ3Qgc3BlYWsgJHt1dHRlcn0uIEFscmVhZHkgc3BlYWtpbmdgKVxuICAgICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgICAgdGhpcy5zcGVhayh1dHRlcilcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFNwZWVkXG4gICAgLy8gaWYgKHRoaXMuaXNTdG9wcGVkKSB0aGlzLnBsYXkoKVxuXG4gICAgdGhpcy5zeW50aC5zcGVhayh0aGlzLmN1cnJlbnRVdHRlcmFuY2UpXG4gICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZVxuICB9XG4gIHN0b3AoKSB7XG4gICAgdGhpcy5jdXJyZW50VXR0ZXJhbmNlID0gbnVsbFxuICAgIHRoaXMuc3ludGguY2FuY2VsKClcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBwbGF5KCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZVxuICAgIHRoaXMuc3ludGgucmVzdW1lKClcbiAgfVxuICBwYXVzZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlXG4gICAgdGhpcy5zeW50aC5wYXVzZSgpXG4gIH1cbiAgcGxheVBhdXNlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gIXRoaXMuaXNTdG9wcGVkXG4gICAgdGhpcy5pc1N0b3BwZWQgPyB0aGlzLnN5bnRoLnBhdXNlKCkgOiB0aGlzLnN5bnRoLnJlc3VtZSgpXG4gIH1cbiAgX2NoYW5nZVNwZWVkKGRlbHRhOiBudW1iZXIpIHtcbiAgICB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gICAgdGhpcy5jdXJyZW50U3BlZWQgPSBkZWx0YSA+IDBcbiAgICAgID8gdGhpcy5jdXJyZW50U3BlZWQgKyBkZWx0YVxuICAgICAgOiB0aGlzLmN1cnJlbnRTcGVlZCA8PSBNSU5fU1BFRUQgPyBNSU5fU1BFRUQgOiB0aGlzLmN1cnJlbnRTcGVlZCArIGRlbHRhXG4gICAgdGhpcy5pc0NoYW5naW5nU3BlZWQgPSB0cnVlXG4gICAgdGhpcy5zcGVhaygpXG4gICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50U3BlZWQpXG4gIH1cbiAgaW5jcmVtZW50U3BlZWQoKSB7IHRoaXMuX2NoYW5nZVNwZWVkKDAuMikgfVxuICBkZWNyZW1lbnRTcGVlZCgpIHsgdGhpcy5fY2hhbmdlU3BlZWQoLTAuMikgfVxufVxuXG5jb25zdCBhcHAgPSB7XG4gIHZlcnNpb246ICcwLjAuNCcsXG4gIGdldFZlcnNpb24oKSB7XG4gICAgY29uc29sZS5sb2codGhpcy52ZXJzaW9uKVxuICB9LFxuICByZWFkZXI6IHtcbiAgICB0b2tlbnNDb3VudDogMCxcbiAgICBjdXJyZW50VG9rZW5JbmRleDogMCxcbiAgICB0ZXh0UmVhZGluZ0R1cmF0aW9uOiAwLFxuICAgIG9yaWdpbmFsVGV4dDogbnVsbCxcbiAgICB0ZXh0U2hhMjU2OiBudWxsLFxuICAgIHRleHRUb2tlbnM6IFtdLFxuICAgIGdldCBjdXJyZW50UHJvZ3Jlc3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW5JbmRleCAvIHRoaXMudG9rZW5zQ291bnRcbiAgICB9LFxuICAgIGdldCB0aW1lTGVmdFJlYWRpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0UmVhZGluZ0R1cmF0aW9uIC1cbiAgICAgICAgKHRoaXMudGV4dFJlYWRpbmdEdXJhdGlvbiAqIHRoaXMuY3VycmVudFByb2dyZXNzKVxuICAgIH1cbiAgfSxcbiAgc3BlYWtlcjogbmV3IFNwZWFrZXIoKSxcbiAgbm9TbGVlcDogbmV3IE5vU2xlZXAoKSxcbiAgZG9tOiB7XG4gICAgdXBkYXRlUHJvZ3Jlc3NCYXIocHJvZ3Jlc3M6IG51bWJlcikge1xuICAgICAgJHByb2dyZXNzUG9pbnRlci5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICBgdHJhbnNsYXRlKCR7cHJvZ3Jlc3MgKiAkcHJvZ3Jlc3NCYXIuY2xpZW50V2lkdGggLSAxNn1weCwgMClgXG4gICAgfSxcbiAgICB1cGRhdGVUaW1lTGVmdCgpIHtcbiAgICAgIC8qIGNhbGN1bGF0ZXMgdGltZSBsZWZ0IHJlYWRpbmcgKi9cbiAgICAgICR0aW1lTGVmdC5pbm5lclRleHQgPSBgJHthcHAucmVhZGVyLnRpbWVMZWZ0UmVhZGluZy50b0ZpeGVkKDEpfSBtaW5gXG4gICAgfSxcbiAgICBoaWdobGlnaHRDdXJyZW50U2VudGVuY2UodGV4dDogc3RyaW5nKSB7XG4gICAgICBjb25zdCAkY3VycmVudFNlbnRlbmNlID0gJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXh9YClcbiAgICAgIGlmICgkY3VycmVudFNlbnRlbmNlKSB7XG4gICAgICAgICRjdXJyZW50U2VudGVuY2UuY2xhc3NMaXN0LmFkZCgndG9rZW4tLWhpZ2hsaWdodGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0ICRwcmV2aW91c1NlbnRlbmNlID0gJGlucHV0LnF1ZXJ5U2VsZWN0b3IoYCN0b2tlbi0ke2FwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggLSAxfWApXG5cbiAgICAgIC8qIFJlbW92ZSBoaWdobGlnaHQgZnJvbSBwcmV2aW91cyB0b2tlbiAqL1xuICAgICAgaWYgKGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggPiAwKSB7XG4gICAgICAgIGlmICgkcHJldmlvdXNTZW50ZW5jZSkge1xuICAgICAgICAgICRwcmV2aW91c1NlbnRlbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3Rva2VuLS1oaWdobGlnaHRlZCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLypcbiAqIEFuYWx5c2VzIHRoZSBmaXJzdCBsZXR0ZXIgaW4gdGhlIHdvcmRcbiAqIE5vdyBpdCBjYW4gZ3Vlc3MgYmV0d2VlbiBjeXJpbGljIGFuZCBsYXRpbiBsZXR0ZXIgb25seVxuICovXG5jb25zdCBkZXRlY3RMYW5nQnlTdHIgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgbGV0IGN1cnJlbnRDaGFySW5kZXggPSAwXG4gIGxldCBtYXhDaGFySW5kZXggPSAzXG5cbiAgd2hpbGUgKGN1cnJlbnRDaGFySW5kZXggPD0gbWF4Q2hhckluZGV4KSB7XG4gICAgY29uc3QgY2hhckNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KGN1cnJlbnRDaGFySW5kZXgpXG4gICAgZm9yIChsZXQgYWxwaGFiZXQgaW4gQUxQSEFCRVQpIHtcbiAgICAgIGlmIChjaGFyQ29kZSA+PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVswXSAmJlxuICAgICAgICAgIGNoYXJDb2RlIDw9IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzFdKSB7XG4gICAgICAgIHJldHVybiBhbHBoYWJldFxuICAgICAgfVxuICAgIH1cbiAgICBjdXJyZW50Q2hhckluZGV4KytcbiAgfVxuXG4gIHJldHVybiBERUZBVUxUX0xBTkdVQUdFXG59XG5cbi8qXG4gKiBJZiB0aGUgd29yZHMgYXJlIGluIHRoZSBzYW1lIGxhbmd1YWdlLCByZXR1cm5zIHRydXdcbiAqIElmIG9uZSBvZiB0aGUgd29yZHMgaXMgbnVtYmVyLCByZXR1cm5zIHRydWVcbiAqIE90aGVyd2lzZSwgcmV0dXJucyBmYWxzZVxuICovXG50eXBlIHdvcmRUeXBlID0ge1xuICBsYW5nOiBzdHJpbmcsXG4gIHRva2VuOiBzdHJpbmdcbn1cbmNvbnN0IGlzVGhlU2FtZUxhbmd1YWdlID0gKFxuICB3b3JkMTogd29yZFR5cGUsXG4gIHdvcmQyOiB3b3JkVHlwZVxuKSA9PiB3b3JkMS5sYW5nID09PSB3b3JkMi5sYW5nIHx8XG4gIFt3b3JkMS5sYW5nLCB3b3JkMi5sYW5nXS5pbmNsdWRlcygnbnVtYmVyJylcblxuY29uc3Qgam9pbk9uZUxhbmd1YWdlV29yZHMgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PHdvcmRUeXBlPiA9PiB7XG4gIGNvbnN0IHNlbnRlbmNlcyA9IFtdXG4gIHdvcmRzLmZvckVhY2god29yZCA9PiB7XG4gICAgaWYgKHNlbnRlbmNlcy5sZW5ndGggPT09IDApIHJldHVybiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICAgIGNvbnN0IHByZXZpb3VzV29yZCA9IHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV1cbiAgICBpc1RoZVNhbWVMYW5ndWFnZShwcmV2aW91c1dvcmQsIHdvcmQpXG4gICAgICA/IHNlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4gPVxuICAgICAgICAgIFtzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuLCB3b3JkLnRva2VuXS5qb2luKCcgJylcbiAgICAgIDogc2VudGVuY2VzLnB1c2god29yZClcbiAgfSlcbiAgcmV0dXJuIHNlbnRlbmNlc1xufVxuXG5jb25zdCBmb3JtYXRUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gdGV4dC5yZXBsYWNlKC9cXOKAky9nLCAnLicpLnJlcGxhY2UoL+KAlC9nLCAnOycpXG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gdGV4dC5zcGxpdCgnLicpXG5jb25zdCBzcGxpdFNlbnRlbmNlSW50b1dvcmRzID0gKHNlbnRlbmNlOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHNlbnRlbmNlLnNwbGl0KCcgJylcbmNvbnN0IGNvdW50V29yZHNJblRleHQgPSAodGV4dDogc3RyaW5nKSA9PiBzcGxpdFNlbnRlbmNlSW50b1dvcmRzKHRleHQpLmxlbmd0aFxuY29uc3QgY29udmVydFdvcmRzSW50b1Rva2VucyA9ICh3b3JkczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHdvcmRUeXBlPiA9PlxuICB3b3Jkcy5tYXAoKHRva2VuOiBzdHJpbmcpID0+ICh7XG4gICAgbGFuZzogZGV0ZWN0TGFuZ0J5U3RyKHRva2VuKSxcbiAgICB0b2tlbjogdG9rZW5cbiAgfSkpXG5jb25zdCBmaWx0ZXJXb3Jkc0FycmF5ID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pID0+XG4gIHdvcmRzLmZpbHRlcih3b3JkID0+IHdvcmQudG9rZW4ubGVuZ3RoICE9PSAwKVxuXG4vKlxuICogQSBNZWRpdW0tbGlrZSBmdW5jdGlvbiBjYWxjdWxhdGVzIHRpbWUgbGVmdCByZWFkaW5nXG4gKi9cbmNvbnN0IGdldFRleHRSZWFkaW5nRHVyYXRpb24gPSAodGV4dDogc3RyaW5nLCBzcGVlZDogbnVtYmVyID0gMSkgPT5cbiAgY291bnRXb3Jkc0luVGV4dCh0ZXh0KSAvIChERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUgKiBzcGVlZClcblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudCA9IChzZW50ZW5jZTogd29yZFR5cGUpOiBPYmplY3QgPT4ge1xuICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICB1dHRlclRoaXMubGFuZyA9IHNlbnRlbmNlLmxhbmcgfHwgREVGQVVMVF9MQU5HVUFHRVxuICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICByZXR1cm4gdXR0ZXJUaGlzXG59XG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnRzID0gKHBhcnRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxPYmplY3Q+ID0+XG4gIHBhcnRzLm1hcChjcmVhdGVTcGVha0V2ZW50KVxuXG5jb25zdCBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyA9XG4gIChzcGVha0V2ZW50c1NlbnRlbmNlczogQXJyYXk8QXJyYXk8T2JqZWN0Pj4pOiBBcnJheTxPYmplY3Q+ID0+XG4gICAgc3BlYWtFdmVudHNTZW50ZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pXG5cbmNvbnN0IHNwbGl0SW50b1RleHRUb2tlbnMgPSB0ZXh0ID0+IHtcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuXG4gIGNvbnN0IHRleHRUb2tlbnNBcnJheSA9IHNlbnRlbmNlcy5tYXAoc2VudGVuY2UgPT4gY29tcG9zZShcbiAgICBmaWx0ZXJXb3Jkc0FycmF5LFxuICAgIGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMsXG4gICAgc3BsaXRTZW50ZW5jZUludG9Xb3Jkc1xuICApKHNlbnRlbmNlKSlcblxuICBjb25zb2xlLmxvZyh0ZXh0VG9rZW5zQXJyYXkpXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcGhyYXNlcyA9IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzKHNwZWFrRXZlbnRzU2VudGVuY2VzKVxuICByZXR1cm4gcGhyYXNlc1xufVxuXG5jb25zdCBwcm9jY2Vzc2luZ1RleHRUb1NwZWVjaCA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgaWYgKGFwcC5yZWFkZXIudGV4dFNoYTI1NiAmJiBhcHAucmVhZGVyLnRleHRTaGEyNTYgPT09IHNoYTI1Nih0ZXh0KSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3RleHQgaXMgdGhlIHNhbWUsIGNvbnRpbnVlLi4uJylcbiAgICByZXR1cm5cbiAgfVxuICB0ZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KVxuICBhcHAucmVhZGVyLm9yaWdpbmFsVGV4dCAgPSB0ZXh0XG4gIGFwcC5yZWFkZXIudGV4dFNoYTI1NiA9IHNoYTI1Nih0ZXh0KVxuICBhcHAucmVhZGVyLnRleHRUb2tlbnMgPSBzcGxpdEludG9UZXh0VG9rZW5zKHRleHQpXG4gIGFwcC5yZWFkZXIudG9rZW5zQ291bnQgPSBhcHAucmVhZGVyLnRleHRUb2tlbnMubGVuZ3RoXG4gIGFwcC5yZWFkZXIudGV4dFJlYWRpbmdEdXJhdGlvbiA9IGdldFRleHRSZWFkaW5nRHVyYXRpb24odGV4dCwgYXBwLnNwZWFrZXIuY3VycmVudFNwZWVkKVxufVxuXG5jb25zdCByZW5kZXJUcmFuc2Zvcm1lZFRleHQgPSAoKSA9PiB7XG4gICRpbnB1dC5pbm5lckhUTUwgPSAnJ1xuICBhcHAucmVhZGVyLnRleHRUb2tlbnMuZm9yRWFjaCgodG9rZW4sIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZGl2VG9rZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBkaXZUb2tlbi5pbm5lclRleHQgPSB0b2tlbi50ZXh0ICsgJy4nXG4gICAgZGl2VG9rZW4uaWQgPSBgdG9rZW4tJHtpbmRleH1gXG4gICAgZGl2VG9rZW4uY2xhc3NMaXN0LmFkZCgndG9rZW4nKVxuICAgIGRpdlRva2VuLnNldEF0dHJpYnV0ZSgnc3BlbGxjaGVjaycsICdmYWxzZScpXG4gICAgJGlucHV0LmFwcGVuZENoaWxkKGRpdlRva2VuKVxuICB9KVxufVxuXG5hcHAuc3BlYWtJdExvdWQgPSAoKSA9PiB7XG4gIGNvbnN0IHRleHQgPSAkaW5wdXQuaW5uZXJUZXh0LnRyaW0oKVxuICBwcm9jY2Vzc2luZ1RleHRUb1NwZWVjaCh0ZXh0KVxuICByZW5kZXJUcmFuc2Zvcm1lZFRleHQoKVxuXG4gIGNvbnN0IHByb21pc2VzID0gW11cbiAgY29uc29sZS5sb2coYXBwLnJlYWRlci50ZXh0VG9rZW5zKVxuICBhcHAucmVhZGVyLnRleHRUb2tlbnMuZm9yRWFjaChwaHJhc2UgPT5cbiAgICBwcm9taXNlcy5wdXNoKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgYXBwLnNwZWFrZXIuc3BlYWsocGhyYXNlKVxuXG4gICAgICBjb25zb2xlLmxvZyhhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4KVxuICAgICAgYXBwLmRvbS5oaWdobGlnaHRDdXJyZW50U2VudGVuY2UocGhyYXNlLnRleHQpXG4gICAgICBhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ID0gYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCArIDFcblxuICAgICAgYXBwLmRvbS51cGRhdGVQcm9ncmVzc0JhcihhcHAucmVhZGVyLmN1cnJlbnRQcm9ncmVzcylcbiAgICAgIGFwcC5kb20udXBkYXRlVGltZUxlZnQoKVxuXG4gICAgICBwaHJhc2Uub25lbmQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChhcHAuc3BlYWtlci5pc0NoYW5naW5nU3BlZWQpIHtcbiAgICAgICAgICBhcHAuc3BlYWtlci5pc0NoYW5naW5nU3BlZWQgPSBmYWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChhcHAuc3BlYWtlci5pc1N0b3BwZWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzb2x2ZShwaHJhc2UudGV4dClcbiAgICAgIH1cbiAgICB9KSlcbiAgKVxuXG4gIHNlcmlhbChwcm9taXNlcykudGhlbihjb25zb2xlLmxvZylcbn1cblxuLypcbiAqIFRyaWdnZXJzIHdoZW4gwqtzcGVha8K7IGJ1dHRvbiBpcyBwcmVzc2VkXG4gKi9cblxuYXBwLm5vU2xlZXAuZW5hYmxlKClcbiRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgY29uc29sZS5sb2coJ2NsaWNrZWQnKVxuICBhcHAuc3BlYWtJdExvdWQoKVxufSlcblxuLypcbiAqIFRyaWdnZXJzIHdoZW4gdXNlciBpcyB0cnlpbmcgdG8gcmVmcmVzaC9jbG9zZSBhcHBcbiAqL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGV2ZW50ID0+IHtcbiAgY29uc29sZS5sb2coYXBwLnNwZWFrZXIuc3RvcCgpKVxufSlcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogRXZlbnQpID0+IHtcbiAgLy8gSWYgc3BhY2UgaXMgcHJlc3NlZFxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICBhcHAuc3BlYWtlci5wbGF5UGF1c2UoKVxuICB9XG5cbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzICYmIChldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkpKSB7XG4gICAgYXBwLnNwZWFrSXRMb3VkKClcbiAgfVxufSlcblxuJGlucHV0LmZvY3VzKClcblxuJGluaXRpYWxUZXh0LmZvY3VzKClcblxuXG4kaW5jcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmluY3JlbWVudFNwZWVkKClcbn0pXG5cbiRkZWNyZW1lbnRTcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgYXBwLnNwZWFrZXIuZGVjcmVtZW50U3BlZWQoKVxufSlcblxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgLy8gVE9ETzogc3RhcnQgZnJvbSB0aGUgc2VsZWN0ZWQgc2VudGVuY2UgKHRva2VuKVxuICBjb25zb2xlLmxvZyhldmVudClcbn0pXG5cbiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbn0pXG5cbiRpbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC10ZXh0YXJlYS0taW5pdGlhbCcpXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgJGluaXRpYWxUZXh0LnJlbW92ZSgpXG4gICRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dC10ZXh0YXJlYS0taW5pdGlhbCcpXG5cbiAgY29uc3QgY2xpcGJvYXJkRGF0YSA9IGV2ZW50LmNsaXBib2FyZERhdGEgfHxcbiAgICB3aW5kb3cuY2xpcGJvYXJkRGF0YSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGFcblxuICBjb25zdCBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0JylcblxuICBjb25zdCBoaWRkZW5JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGhpZGRlbklucHV0LmlubmVySFRNTCA9IHBhc3RlZFRleHRcblxuICBjb25zdCB0ZXh0ID0gaGlkZGVuSW5wdXQudGV4dENvbnRlbnRcbiAgcHJvY2Nlc3NpbmdUZXh0VG9TcGVlY2godGV4dClcbiAgcmVuZGVyVHJhbnNmb3JtZWRUZXh0KClcbiAgLy8gJGlucHV0LmlubmVySFRNTCA9IHRleHRcbiAgY29uc29sZS5sb2codGV4dClcbn0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJjb25zdCBtZWRpYUZpbGUgPSByZXF1aXJlKCcuL21lZGlhLmpzJylcblxuLy8gRGV0ZWN0IGlPUyBicm93c2VycyA8IHZlcnNpb24gMTBcbmNvbnN0IG9sZElPUyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHBhcnNlRmxvYXQoXG4gICgnJyArICgvQ1BVLipPUyAoWzAtOV9dezMsNH0pWzAtOV9dezAsMX18KENQVSBsaWtlKS4qQXBwbGVXZWJLaXQuKk1vYmlsZS9pLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWzAsICcnXSlbMV0pXG4gICAgLnJlcGxhY2UoJ3VuZGVmaW5lZCcsICczXzInKS5yZXBsYWNlKCdfJywgJy4nKS5yZXBsYWNlKCdfJywgJycpXG4pIDwgMTAgJiYgIXdpbmRvdy5NU1N0cmVhbVxuXG5jbGFzcyBOb1NsZWVwIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXQgdXAgbm8gc2xlZXAgdmlkZW8gZWxlbWVudFxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG5cbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAnJylcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlKVxuXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMubm9TbGVlcFZpZGVvLmN1cnJlbnRUaW1lID4gMC41KSB7XG4gICAgICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uY3VycmVudFRpbWUgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICB9XG4gIH1cblxuICBlbmFibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKVxuICAgICAgfSwgMTUwMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBsYXkoKVxuICAgIH1cbiAgfVxuXG4gIGRpc2FibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIGlmICh0aGlzLm5vU2xlZXBUaW1lcikge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLm5vU2xlZXBUaW1lcilcbiAgICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBhdXNlKClcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9TbGVlcFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAnZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFJR1owZVhCdGNEUXlBQUFDQUdsemIyMXBjMjh5WVhaak1XMXdOREVBQUFBSVpuSmxaUUFBQ0tCdFpHRjBBQUFDOHdZRi8vL3YzRVhwdmViWlNMZVdMTmdnMlNQdTczZ3lOalFnTFNCamIzSmxJREUwTWlCeU1qUTNPU0JrWkRjNVlUWXhJQzBnU0M0eU5qUXZUVkJGUnkwMElFRldReUJqYjJSbFl5QXRJRU52Y0hsc1pXWjBJREl3TURNdE1qQXhOQ0F0SUdoMGRIQTZMeTkzZDNjdWRtbGtaVzlzWVc0dWIzSm5MM2d5TmpRdWFIUnRiQ0F0SUc5d2RHbHZibk02SUdOaFltRmpQVEVnY21WbVBURWdaR1ZpYkc5amF6MHhPakE2TUNCaGJtRnNlWE5sUFRCNE1Ub3dlREV4TVNCdFpUMW9aWGdnYzNWaWJXVTlNaUJ3YzNrOU1TQndjM2xmY21ROU1TNHdNRG93TGpBd0lHMXBlR1ZrWDNKbFpqMHdJRzFsWDNKaGJtZGxQVEUySUdOb2NtOXRZVjl0WlQweElIUnlaV3hzYVhNOU1DQTRlRGhrWTNROU1DQmpjVzA5TUNCa1pXRmtlbTl1WlQweU1Td3hNU0JtWVhOMFgzQnphMmx3UFRFZ1kyaHliMjFoWDNGd1gyOW1abk5sZEQwd0lIUm9jbVZoWkhNOU5pQnNiMjlyWVdobFlXUmZkR2h5WldGa2N6MHhJSE5zYVdObFpGOTBhSEpsWVdSelBUQWdibkk5TUNCa1pXTnBiV0YwWlQweElHbHVkR1Z5YkdGalpXUTlNQ0JpYkhWeVlYbGZZMjl0Y0dGMFBUQWdZMjl1YzNSeVlXbHVaV1JmYVc1MGNtRTlNQ0JpWm5KaGJXVnpQVE1nWWw5d2VYSmhiV2xrUFRJZ1lsOWhaR0Z3ZEQweElHSmZZbWxoY3owd0lHUnBjbVZqZEQweElIZGxhV2RvZEdJOU1TQnZjR1Z1WDJkdmNEMHdJSGRsYVdkb2RIQTlNU0JyWlhscGJuUTlNekF3SUd0bGVXbHVkRjl0YVc0OU16QWdjMk5sYm1WamRYUTlOREFnYVc1MGNtRmZjbVZtY21WemFEMHdJSEpqWDJ4dmIydGhhR1ZoWkQweE1DQnlZejFqY21ZZ2JXSjBjbVZsUFRFZ1kzSm1QVEl3TGpBZ2NXTnZiWEE5TUM0Mk1DQnhjRzFwYmowd0lIRndiV0Y0UFRZNUlIRndjM1JsY0QwMElIWmlkbDl0WVhoeVlYUmxQVEl3TURBd0lIWmlkbDlpZFdaemFYcGxQVEkxTURBd0lHTnlabDl0WVhnOU1DNHdJRzVoYkY5b2NtUTlibTl1WlNCbWFXeHNaWEk5TUNCcGNGOXlZWFJwYnoweExqUXdJR0Z4UFRFNk1TNHdNQUNBQUFBQU9XV0loQUEzLy9wK0M3djh0RERTVGpmOTd3NTVpM1NiUlBPNFpZK2hrakQ1aGJrQWtMM3pwSjZoL0xSMUNBQUJ6Z0Ixa3FxelVvcmxoUUFBQUF4Qm1pUVlobi8rcVpZQURMZ0FBQUFKUVo1Q1FoWC9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlWVVRbi93QUxLQ0VBQTBCb0hBQUFBQWtCbm1ORUovOEFDeWtoQUFOQWFCd2hBQU5BYUJ3QUFBQU5RWnBvTkV4RFAvNnBsZ0FNdVNFQUEwQm9IQUFBQUF0Qm5vWkZFU3dyL3dBSStTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm5xVkVKLzhBQ3lraEFBTkFhQndBQUFBSkFaNm5SQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBRFVHYXJEUk1Rei8rcVpZQURMZ2hBQU5BYUJ3QUFBQUxRWjdLUlJVc0svOEFDUGtoQUFOQWFCd0FBQUFKQVo3cFJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlNjBRbi93QUxLQ0VBQTBCb0hBQUFBQTFCbXZBMFRFTS8vcW1XQUF5NUlRQURRR2djSVFBRFFHZ2NBQUFBQzBHZkRrVVZMQ3YvQUFqNUlRQURRR2djQUFBQUNRR2ZMVVFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm55OUVKLzhBQ3lnaEFBTkFhQndBQUFBTlFaczBORXhEUC82cGxnQU11Q0VBQTBCb0hBQUFBQXRCbjFKRkZTd3Ivd0FJK1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbjNGRUovOEFDeWdoQUFOQWFCd0FBQUFKQVo5elJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFEVUdiZURSTVF6LytxWllBRExraEFBTkFhQndBQUFBTFFaK1dSUlVzSy84QUNQZ2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaKzFSQ2YvQUFzcElRQURRR2djQUFBQUNRR2Z0MFFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUExQm03dzBURU0vL3FtV0FBeTRJUUFEUUdnY0FBQUFDMEdmMmtVVkxDdi9BQWo1SVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbi90RUovOEFDeWtoQUFOQWFCd0FBQUFOUVp2Z05FeERQLzZwbGdBTXVTRUFBMEJvSENFQUEwQm9IQUFBQUF0Qm5oNUZGU3dyL3dBSStDRUFBMEJvSEFBQUFBa0JuajFFSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaNC9SQ2YvQUFzcElRQURRR2djQUFBQURVR2FKRFJNUXovK3FaWUFETGdoQUFOQWFCd0FBQUFMUVo1Q1JSVXNLLzhBQ1BraEFBTkFhQndoQUFOQWFCd0FBQUFKQVo1aFJDZi9BQXNvSVFBRFFHZ2NBQUFBQ1FHZVkwUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQTFCbW1nMFRFTS8vcW1XQUF5NUlRQURRR2djQUFBQUMwR2Voa1VWTEN2L0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2VwVVFuL3dBTEtTRUFBMEJvSEFBQUFBa0JucWRFSi84QUN5Z2hBQU5BYUJ3QUFBQU5RWnFzTkV4RFAvNnBsZ0FNdUNFQUEwQm9IQ0VBQTBCb0hBQUFBQXRCbnNwRkZTd3Ivd0FJK1NFQUEwQm9IQUFBQUFrQm51bEVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVo3clJDZi9BQXNvSVFBRFFHZ2NBQUFBRFVHYThEUk1Rei8rcVpZQURMa2hBQU5BYUJ3aEFBTkFhQndBQUFBTFFaOE9SUlVzSy84QUNQa2hBQU5BYUJ3QUFBQUpBWjh0UkNmL0FBc3BJUUFEUUdnY0lRQURRR2djQUFBQUNRR2ZMMFFuL3dBTEtDRUFBMEJvSEFBQUFBMUJtelEwVEVNLy9xbVdBQXk0SVFBRFFHZ2NBQUFBQzBHZlVrVVZMQ3YvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZmNVUW4vd0FMS0NFQUEwQm9IQUFBQUFrQm4zTkVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFOUVp0NE5FeEMvLzZwbGdBTXVTRUFBMEJvSEFBQUFBdEJuNVpGRlN3ci93QUkrQ0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuN1ZFSi84QUN5a2hBQU5BYUJ3QUFBQUpBWiszUkNmL0FBc3BJUUFEUUdnY0FBQUFEVUdidXpSTVFuLytuaEFBWXNBaEFBTkFhQndoQUFOQWFCd0FBQUFKUVovYVFoUC9BQXNwSVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSEFBQUNpRnRiMjkyQUFBQWJHMTJhR1FBQUFBQTFZQ0NYOVdBZ2w4QUFBUG9BQUFIL0FBQkFBQUJBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEQUFBQUdHbHZaSE1BQUFBQUVJQ0FnQWNBVC8vLy92Ny9BQUFGK1hSeVlXc0FBQUJjZEd0b1pBQUFBQVBWZ0lKZjFZQ0NYd0FBQUFFQUFBQUFBQUFIMEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBeWdBQUFNb0FBQUFBQUNSbFpIUnpBQUFBSEdWc2MzUUFBQUFBQUFBQUFRQUFCOUFBQUJkd0FBRUFBQUFBQlhGdFpHbGhBQUFBSUcxa2FHUUFBQUFBMVlDQ1g5V0FnbDhBQVYrUUFBSy9JRlhFQUFBQUFBQXRhR1JzY2dBQUFBQUFBQUFBZG1sa1pRQUFBQUFBQUFBQUFBQUFBRlpwWkdWdlNHRnVaR3hsY2dBQUFBVWNiV2x1WmdBQUFCUjJiV2hrQUFBQUFRQUFBQUFBQUFBQUFBQUFKR1JwYm1ZQUFBQWNaSEpsWmdBQUFBQUFBQUFCQUFBQURIVnliQ0FBQUFBQkFBQUUzSE4wWW13QUFBQ1ljM1J6WkFBQUFBQUFBQUFCQUFBQWlHRjJZekVBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF5Z0RLQUVnQUFBQklBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBWS8vOEFBQUF5WVhaalF3Rk5RQ2ovNFFBYlowMUFLT3lobzN5U1RVQkFRRkFBQUFNQUVBQXI4Z0R4Z3hsZ0FRQUVhTytHOGdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFBOEFBQUx1QUFBQUJSemRITnpBQUFBQUFBQUFBRUFBQUFCQUFBQjhHTjBkSE1BQUFBQUFBQUFQQUFBQUFFQUFCZHdBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQUM3Z0FBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBRUVjM1J6ZWdBQUFBQUFBQUFBQUFBQVBBQUFBelFBQUFBUUFBQUFEUUFBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQU5BQUFBRFFBQUFRQnpkR052QUFBQUFBQUFBRHdBQUFBd0FBQURaQUFBQTNRQUFBT05BQUFEb0FBQUE3a0FBQVBRQUFBRDZ3QUFBLzRBQUFRWEFBQUVMZ0FBQkVNQUFBUmNBQUFFYndBQUJJd0FBQVNoQUFBRXVnQUFCTTBBQUFUa0FBQUUvd0FBQlJJQUFBVXJBQUFGUWdBQUJWMEFBQVZ3QUFBRmlRQUFCYUFBQUFXMUFBQUZ6Z0FBQmVFQUFBWCtBQUFHRXdBQUJpd0FBQVkvQUFBR1ZnQUFCbkVBQUFhRUFBQUduUUFBQnJRQUFBYlBBQUFHNGdBQUJ2VUFBQWNTQUFBSEp3QUFCMEFBQUFkVEFBQUhjQUFBQjRVQUFBZWVBQUFIc1FBQUI4Z0FBQWZqQUFBSDlnQUFDQThBQUFnbUFBQUlRUUFBQ0ZRQUFBaG5BQUFJaEFBQUNKY0FBQU1zZEhKaGF3QUFBRngwYTJoa0FBQUFBOVdBZ2wvVmdJSmZBQUFBQWdBQUFBQUFBQWY4QUFBQUFBQUFBQUFBQUFBQkFRQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFDc20xa2FXRUFBQUFnYldSb1pBQUFBQURWZ0lKZjFZQ0NYd0FBckVRQUFXQUFWY1FBQUFBQUFDZG9aR3h5QUFBQUFBQUFBQUJ6YjNWdUFBQUFBQUFBQUFBQUFBQUFVM1JsY21WdkFBQUFBbU50YVc1bUFBQUFFSE50YUdRQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFpZHpkR0pzQUFBQVozTjBjMlFBQUFBQUFBQUFBUUFBQUZkdGNEUmhBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUNBQkFBQUFBQXJFUUFBQUFBQURObGMyUnpBQUFBQUFPQWdJQWlBQUlBQklDQWdCUkFGUUFBQUFBRERVQUFBQUFBQllDQWdBSVNFQWFBZ0lBQkFnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQllBQUFFQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBQVVjM1J6ZWdBQUFBQUFBQUFHQUFBQVdBQUFBWEJ6ZEdOdkFBQUFBQUFBQUZnQUFBT0JBQUFEaHdBQUE1b0FBQU90QUFBRHN3QUFBOG9BQUFQZkFBQUQ1UUFBQS9nQUFBUUxBQUFFRVFBQUJDZ0FBQVE5QUFBRVVBQUFCRllBQUFScEFBQUVnQUFBQklZQUFBU2JBQUFFcmdBQUJMUUFBQVRIQUFBRTNnQUFCUE1BQUFUNUFBQUZEQUFBQlI4QUFBVWxBQUFGUEFBQUJWRUFBQVZYQUFBRmFnQUFCWDBBQUFXREFBQUZtZ0FBQmE4QUFBWENBQUFGeUFBQUJkc0FBQVh5QUFBRitBQUFCZzBBQUFZZ0FBQUdKZ0FBQmprQUFBWlFBQUFHWlFBQUJtc0FBQVorQUFBR2tRQUFCcGNBQUFhdUFBQUd3d0FBQnNrQUFBYmNBQUFHN3dBQUJ3WUFBQWNNQUFBSElRQUFCelFBQUFjNkFBQUhUUUFBQjJRQUFBZHFBQUFIZndBQUI1SUFBQWVZQUFBSHF3QUFCOElBQUFmWEFBQUgzUUFBQi9BQUFBZ0RBQUFJQ1FBQUNDQUFBQWcxQUFBSU93QUFDRTRBQUFoaEFBQUllQUFBQ0g0QUFBaVJBQUFJcEFBQUNLb0FBQWl3QUFBSXRnQUFDTHdBQUFqQ0FBQUFGblZrZEdFQUFBQU9ibUZ0WlZOMFpYSmxid0FBQUhCMVpIUmhBQUFBYUcxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBTzJsc2MzUUFBQUF6cVhSdmJ3QUFBQ3RrWVhSaEFBQUFBUUFBQUFCSVlXNWtRbkpoYTJVZ01DNHhNQzR5SURJd01UVXdOakV4TURBPSdcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL21lZGlhLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbihnbG9iYWxzKSB7XG4ndXNlIHN0cmljdCdcblxudmFyIF9pbXBvcnRzID0ge31cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7IC8vQ29tbW9uSlNcbiAgX2ltcG9ydHMuYnl0ZXNUb0hleCA9IHJlcXVpcmUoJ2NvbnZlcnQtaGV4JykuYnl0ZXNUb0hleFxuICBfaW1wb3J0cy5jb252ZXJ0U3RyaW5nID0gcmVxdWlyZSgnY29udmVydC1zdHJpbmcnKVxuICBtb2R1bGUuZXhwb3J0cyA9IHNoYTI1NlxufSBlbHNlIHtcbiAgX2ltcG9ydHMuYnl0ZXNUb0hleCA9IGdsb2JhbHMuY29udmVydEhleC5ieXRlc1RvSGV4XG4gIF9pbXBvcnRzLmNvbnZlcnRTdHJpbmcgPSBnbG9iYWxzLmNvbnZlcnRTdHJpbmdcbiAgZ2xvYmFscy5zaGEyNTYgPSBzaGEyNTZcbn1cblxuLypcbkNyeXB0b0pTIHYzLjEuMlxuY29kZS5nb29nbGUuY29tL3AvY3J5cHRvLWpzXG4oYykgMjAwOS0yMDEzIGJ5IEplZmYgTW90dC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbmNvZGUuZ29vZ2xlLmNvbS9wL2NyeXB0by1qcy93aWtpL0xpY2Vuc2VcbiovXG5cbi8vIEluaXRpYWxpemF0aW9uIHJvdW5kIGNvbnN0YW50cyB0YWJsZXNcbnZhciBLID0gW11cblxuLy8gQ29tcHV0ZSBjb25zdGFudHNcbiFmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGlzUHJpbWUobikge1xuICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcbiAgICBmb3IgKHZhciBmYWN0b3IgPSAyOyBmYWN0b3IgPD0gc3FydE47IGZhY3RvcisrKSB7XG4gICAgICBpZiAoIShuICUgZmFjdG9yKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZyYWN0aW9uYWxCaXRzKG4pIHtcbiAgICByZXR1cm4gKChuIC0gKG4gfCAwKSkgKiAweDEwMDAwMDAwMCkgfCAwXG4gIH1cblxuICB2YXIgbiA9IDJcbiAgdmFyIG5QcmltZSA9IDBcbiAgd2hpbGUgKG5QcmltZSA8IDY0KSB7XG4gICAgaWYgKGlzUHJpbWUobikpIHtcbiAgICAgIEtbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAzKSlcbiAgICAgIG5QcmltZSsrXG4gICAgfVxuXG4gICAgbisrXG4gIH1cbn0oKVxuXG52YXIgYnl0ZXNUb1dvcmRzID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gIHZhciB3b3JkcyA9IFtdXG4gIGZvciAodmFyIGkgPSAwLCBiID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrLCBiICs9IDgpIHtcbiAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpXG4gIH1cbiAgcmV0dXJuIHdvcmRzXG59XG5cbnZhciB3b3Jkc1RvQnl0ZXMgPSBmdW5jdGlvbiAod29yZHMpIHtcbiAgdmFyIGJ5dGVzID0gW11cbiAgZm9yICh2YXIgYiA9IDA7IGIgPCB3b3Jkcy5sZW5ndGggKiAzMjsgYiArPSA4KSB7XG4gICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZXNcbn1cblxuLy8gUmV1c2FibGUgb2JqZWN0XG52YXIgVyA9IFtdXG5cbnZhciBwcm9jZXNzQmxvY2sgPSBmdW5jdGlvbiAoSCwgTSwgb2Zmc2V0KSB7XG4gIC8vIFdvcmtpbmcgdmFyaWFibGVzXG4gIHZhciBhID0gSFswXSwgYiA9IEhbMV0sIGMgPSBIWzJdLCBkID0gSFszXVxuICB2YXIgZSA9IEhbNF0sIGYgPSBIWzVdLCBnID0gSFs2XSwgaCA9IEhbN11cblxuICAgIC8vIENvbXB1dGF0aW9uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgIGlmIChpIDwgMTYpIHtcbiAgICAgIFdbaV0gPSBNW29mZnNldCArIGldIHwgMFxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2FtbWEweCA9IFdbaSAtIDE1XVxuICAgICAgdmFyIGdhbW1hMCAgPSAoKGdhbW1hMHggPDwgMjUpIHwgKGdhbW1hMHggPj4+IDcpKSAgXlxuICAgICAgICAgICAgICAgICAgICAoKGdhbW1hMHggPDwgMTQpIHwgKGdhbW1hMHggPj4+IDE4KSkgXlxuICAgICAgICAgICAgICAgICAgICAoZ2FtbWEweCA+Pj4gMylcblxuICAgICAgdmFyIGdhbW1hMXggPSBXW2kgLSAyXTtcbiAgICAgIHZhciBnYW1tYTEgID0gKChnYW1tYTF4IDw8IDE1KSB8IChnYW1tYTF4ID4+PiAxNykpIF5cbiAgICAgICAgICAgICAgICAgICAgKChnYW1tYTF4IDw8IDEzKSB8IChnYW1tYTF4ID4+PiAxOSkpIF5cbiAgICAgICAgICAgICAgICAgICAgKGdhbW1hMXggPj4+IDEwKVxuXG4gICAgICBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl07XG4gICAgfVxuXG4gICAgdmFyIGNoICA9IChlICYgZikgXiAofmUgJiBnKTtcbiAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG4gICAgdmFyIHNpZ21hMCA9ICgoYSA8PCAzMCkgfCAoYSA+Pj4gMikpIF4gKChhIDw8IDE5KSB8IChhID4+PiAxMykpIF4gKChhIDw8IDEwKSB8IChhID4+PiAyMikpO1xuICAgIHZhciBzaWdtYTEgPSAoKGUgPDwgMjYpIHwgKGUgPj4+IDYpKSBeICgoZSA8PCAyMSkgfCAoZSA+Pj4gMTEpKSBeICgoZSA8PCA3KSAgfCAoZSA+Pj4gMjUpKTtcblxuICAgIHZhciB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbaV0gKyBXW2ldO1xuICAgIHZhciB0MiA9IHNpZ21hMCArIG1hajtcblxuICAgIGggPSBnO1xuICAgIGcgPSBmO1xuICAgIGYgPSBlO1xuICAgIGUgPSAoZCArIHQxKSB8IDA7XG4gICAgZCA9IGM7XG4gICAgYyA9IGI7XG4gICAgYiA9IGE7XG4gICAgYSA9ICh0MSArIHQyKSB8IDA7XG4gIH1cblxuICAvLyBJbnRlcm1lZGlhdGUgaGFzaCB2YWx1ZVxuICBIWzBdID0gKEhbMF0gKyBhKSB8IDA7XG4gIEhbMV0gPSAoSFsxXSArIGIpIHwgMDtcbiAgSFsyXSA9IChIWzJdICsgYykgfCAwO1xuICBIWzNdID0gKEhbM10gKyBkKSB8IDA7XG4gIEhbNF0gPSAoSFs0XSArIGUpIHwgMDtcbiAgSFs1XSA9IChIWzVdICsgZikgfCAwO1xuICBIWzZdID0gKEhbNl0gKyBnKSB8IDA7XG4gIEhbN10gPSAoSFs3XSArIGgpIHwgMDtcbn1cblxuZnVuY3Rpb24gc2hhMjU2KG1lc3NhZ2UsIG9wdGlvbnMpIHs7XG4gIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcbiAgICBtZXNzYWdlID0gX2ltcG9ydHMuY29udmVydFN0cmluZy5VVEY4LnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XG4gIH1cblxuICB2YXIgSCA9WyAweDZBMDlFNjY3LCAweEJCNjdBRTg1LCAweDNDNkVGMzcyLCAweEE1NEZGNTNBLFxuICAgICAgICAgICAweDUxMEU1MjdGLCAweDlCMDU2ODhDLCAweDFGODNEOUFCLCAweDVCRTBDRDE5IF07XG5cbiAgdmFyIG0gPSBieXRlc1RvV29yZHMobWVzc2FnZSk7XG4gIHZhciBsID0gbWVzc2FnZS5sZW5ndGggKiA4O1xuXG4gIG1bbCA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGwgJSAzMik7XG4gIG1bKChsICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsO1xuXG4gIGZvciAodmFyIGk9MCA7IGk8bS5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICBwcm9jZXNzQmxvY2soSCwgbSwgaSk7XG4gIH1cblxuICB2YXIgZGlnZXN0Ynl0ZXMgPSB3b3Jkc1RvQnl0ZXMoSCk7XG4gIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuYXNCeXRlcyA/IGRpZ2VzdGJ5dGVzIDpcbiAgICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IF9pbXBvcnRzLmNvbnZlcnRTdHJpbmcuYnl0ZXNUb1N0cmluZyhkaWdlc3RieXRlcykgOlxuICAgICAgICAgX2ltcG9ydHMuYnl0ZXNUb0hleChkaWdlc3RieXRlcylcbn1cblxuc2hhMjU2LngyID0gZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucykge1xuICByZXR1cm4gc2hhMjU2KHNoYTI1NihtZXNzYWdlLCB7IGFzQnl0ZXM6dHJ1ZSB9KSwgb3B0aW9ucylcbn1cblxufSh0aGlzKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NoYTI1Ni9saWIvc2hhMjU2LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbihnbG9iYWxzKSB7XG4ndXNlIHN0cmljdCdcblxudmFyIGNvbnZlcnRIZXggPSB7XG4gIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgLyppZiAodHlwZW9mIGJ5dGVzLmJ5dGVMZW5ndGggIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBuZXdCeXRlcyA9IFtdXG5cbiAgICAgIGlmICh0eXBlb2YgYnl0ZXMuYnVmZmVyICE9ICd1bmRlZmluZWQnKVxuICAgICAgICBieXRlcyA9IG5ldyBEYXRhVmlldyhieXRlcy5idWZmZXIpXG4gICAgICBlbHNlXG4gICAgICAgIGJ5dGVzID0gbmV3IERhdGFWaWV3KGJ5dGVzKVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmJ5dGVMZW5ndGg7ICsraSkge1xuICAgICAgICBuZXdCeXRlcy5wdXNoKGJ5dGVzLmdldFVpbnQ4KGkpKVxuICAgICAgfVxuICAgICAgYnl0ZXMgPSBuZXdCeXRlc1xuICAgIH0qL1xuICAgIHJldHVybiBhcnJCeXRlc1RvSGV4KGJ5dGVzKVxuICB9LFxuICBoZXhUb0J5dGVzOiBmdW5jdGlvbihoZXgpIHtcbiAgICBpZiAoaGV4Lmxlbmd0aCAlIDIgPT09IDEpIHRocm93IG5ldyBFcnJvcihcImhleFRvQnl0ZXMgY2FuJ3QgaGF2ZSBhIHN0cmluZyB3aXRoIGFuIG9kZCBudW1iZXIgb2YgY2hhcmFjdGVycy5cIilcbiAgICBpZiAoaGV4LmluZGV4T2YoJzB4JykgPT09IDApIGhleCA9IGhleC5zbGljZSgyKVxuICAgIHJldHVybiBoZXgubWF0Y2goLy4uL2cpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4LDE2KSB9KVxuICB9XG59XG5cblxuLy8gUFJJVkFURVxuXG5mdW5jdGlvbiBhcnJCeXRlc1RvSGV4KGJ5dGVzKSB7XG4gIHJldHVybiBieXRlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFkTGVmdCh4LnRvU3RyaW5nKDE2KSwyKSB9KS5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBwYWRMZWZ0KG9yaWcsIGxlbikge1xuICBpZiAob3JpZy5sZW5ndGggPiBsZW4pIHJldHVybiBvcmlnXG4gIHJldHVybiBBcnJheShsZW4gLSBvcmlnLmxlbmd0aCArIDEpLmpvaW4oJzAnKSArIG9yaWdcbn1cblxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHsgLy9Db21tb25KU1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnRIZXhcbn0gZWxzZSB7XG4gIGdsb2JhbHMuY29udmVydEhleCA9IGNvbnZlcnRIZXhcbn1cblxufSh0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb252ZXJ0LWhleC9jb252ZXJ0LWhleC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIhZnVuY3Rpb24oZ2xvYmFscykge1xuJ3VzZSBzdHJpY3QnXG5cbnZhciBjb252ZXJ0U3RyaW5nID0ge1xuICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgIHJldHVybiBieXRlcy5tYXAoZnVuY3Rpb24oeCl7IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHgpIH0pLmpvaW4oJycpXG4gIH0sXG4gIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoJycpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4LmNoYXJDb2RlQXQoMCkgfSlcbiAgfVxufVxuXG4vL2h0dHA6Ly9ob3NzYS5pbi8yMDEyLzA3LzIwL3V0Zi04LWluLWphdmFzY3JpcHQuaHRtbFxuY29udmVydFN0cmluZy5VVEY4ID0ge1xuICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShjb252ZXJ0U3RyaW5nLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSlcbiAgfSxcbiAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICByZXR1cm4gY29udmVydFN0cmluZy5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSlcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHsgLy9Db21tb25KU1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnRTdHJpbmdcbn0gZWxzZSB7XG4gIGdsb2JhbHMuY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmdcbn1cblxufSh0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb252ZXJ0LXN0cmluZy9jb252ZXJ0LXN0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9