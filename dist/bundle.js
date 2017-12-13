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

const formatText = text => text;
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
    divToken.innerText = token.text + '. ';
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

module.exports = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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'


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGEwZTZlY2YwZjg2MjAxOTgzMDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub3NsZWVwLmpzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvbWVkaWEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NoYTI1Ni9saWIvc2hhMjU2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb252ZXJ0LWhleC9jb252ZXJ0LWhleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29udmVydC1zdHJpbmcvY29udmVydC1zdHJpbmcuanMiXSwibmFtZXMiOlsiJGlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGluaXRpYWxUZXh0IiwiJGJ1dHRvbiIsIiRpbmNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRkZWNyZW1lbnRTcGVlZEJ1dHRvbiIsIiRwcm9ncmVzc0JhciIsIiRwcm9ncmVzc1BvaW50ZXIiLCIkdGltZUxlZnQiLCJBTFBIQUJFVCIsInVuaWNvZGUiLCJERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUiLCJNSU5fU1BFRUQiLCJERUZBVUxUX0xBTkdVQUdFIiwicGlwZSIsImZuIiwiZm5zIiwiYXJncyIsInJlZHVjZSIsInJlc3VsdCIsImNvbXBvc2UiLCJyZXZlcnNlIiwiY29uY2F0IiwibGlzdCIsIkFycmF5IiwicHJvdG90eXBlIiwiYmluZCIsInByb21pc2VDb25jYXQiLCJmIiwieCIsInRoZW4iLCJwcm9taXNlUmVkdWNlIiwiYWNjIiwic2VyaWFsIiwiZnVuY3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlNwZWFrZXIiLCJjb25zdHJ1Y3RvciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwiaXNTcGVha2luZyIsImlzQ2hhbmdpbmdTcGVlZCIsImlzU3RvcHBlZCIsImN1cnJlbnRTcGVlZCIsInNwZWFrIiwidXR0ZXIiLCJjdXJyZW50VXR0ZXJhbmNlIiwiY29uc29sZSIsImVycm9yIiwic3BlYWtpbmciLCJjYW5jZWwiLCJyYXRlIiwic3RvcCIsInBsYXkiLCJyZXN1bWUiLCJwYXVzZSIsInBsYXlQYXVzZSIsIl9jaGFuZ2VTcGVlZCIsImRlbHRhIiwibG9nIiwiaW5jcmVtZW50U3BlZWQiLCJkZWNyZW1lbnRTcGVlZCIsImFwcCIsInZlcnNpb24iLCJnZXRWZXJzaW9uIiwicmVhZGVyIiwidG9rZW5zQ291bnQiLCJjdXJyZW50VG9rZW5JbmRleCIsInRleHRSZWFkaW5nRHVyYXRpb24iLCJvcmlnaW5hbFRleHQiLCJ0ZXh0U2hhMjU2IiwidGV4dFRva2VucyIsImN1cnJlbnRQcm9ncmVzcyIsInRpbWVMZWZ0UmVhZGluZyIsInNwZWFrZXIiLCJub1NsZWVwIiwiZG9tIiwidXBkYXRlUHJvZ3Jlc3NCYXIiLCJwcm9ncmVzcyIsInN0eWxlIiwidHJhbnNmb3JtIiwiY2xpZW50V2lkdGgiLCJ1cGRhdGVUaW1lTGVmdCIsImlubmVyVGV4dCIsInRvRml4ZWQiLCJoaWdobGlnaHRDdXJyZW50U2VudGVuY2UiLCJ0ZXh0IiwiJGN1cnJlbnRTZW50ZW5jZSIsImNsYXNzTGlzdCIsImFkZCIsIiRwcmV2aW91c1NlbnRlbmNlIiwicmVtb3ZlIiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiY3VycmVudENoYXJJbmRleCIsIm1heENoYXJJbmRleCIsImNoYXJDb2RlIiwidG9Mb3dlckNhc2UiLCJjaGFyQ29kZUF0IiwiYWxwaGFiZXQiLCJpc1RoZVNhbWVMYW5ndWFnZSIsIndvcmQxIiwid29yZDIiLCJsYW5nIiwiaW5jbHVkZXMiLCJqb2luT25lTGFuZ3VhZ2VXb3JkcyIsIndvcmRzIiwic2VudGVuY2VzIiwiZm9yRWFjaCIsIndvcmQiLCJsZW5ndGgiLCJwdXNoIiwicHJldmlvdXNXb3JkIiwidG9rZW4iLCJqb2luIiwiZm9ybWF0VGV4dCIsInNwbGl0VGV4dEludG9TZW50ZW5jZXMiLCJzcGxpdCIsInNwbGl0U2VudGVuY2VJbnRvV29yZHMiLCJzZW50ZW5jZSIsImNvdW50V29yZHNJblRleHQiLCJjb252ZXJ0V29yZHNJbnRvVG9rZW5zIiwibWFwIiwiZmlsdGVyV29yZHNBcnJheSIsImZpbHRlciIsImdldFRleHRSZWFkaW5nRHVyYXRpb24iLCJzcGVlZCIsImNyZWF0ZVNwZWFrRXZlbnQiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJjcmVhdGVTcGVha0V2ZW50cyIsInBhcnRzIiwiY29uY2F0U3BlYWtFdmVudHNTZW50ZW5jZXMiLCJzcGVha0V2ZW50c1NlbnRlbmNlcyIsImEiLCJiIiwic3BsaXRJbnRvVGV4dFRva2VucyIsInRleHRUb2tlbnNBcnJheSIsInBocmFzZXMiLCJwcm9jY2Vzc2luZ1RleHRUb1NwZWVjaCIsInNoYTI1NiIsInJlbmRlclRyYW5zZm9ybWVkVGV4dCIsImlubmVySFRNTCIsImluZGV4IiwiZGl2VG9rZW4iLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInNwZWFrSXRMb3VkIiwidHJpbSIsInByb21pc2VzIiwicGhyYXNlIiwicmVqZWN0Iiwib25lbmQiLCJlbmFibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXlDb2RlIiwibWV0YUtleSIsImN0cmxLZXkiLCJmb2N1cyIsInByZXZlbnREZWZhdWx0IiwiY2xpcGJvYXJkRGF0YSIsIm9yaWdpbmFsRXZlbnQiLCJwYXN0ZWRUZXh0IiwiZ2V0RGF0YSIsImhpZGRlbklucHV0IiwidGV4dENvbnRlbnQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FB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QUFDQSxnQ0FBZ0MsbUNBQW1DO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxzREFBc0Q7QUFDdEQ7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQSxDQUFDLE87Ozs7OztBQzlDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0NBQWdDO0FBQ2pFLEdBQUc7QUFDSDtBQUNBLDBDQUEwQyx5QkFBeUI7QUFDbkU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzREFBc0Q7QUFDdEQ7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQSxDQUFDLE8iLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZGEwZTZlY2YwZjg2MjAxOTgzMDEiLCIvLyBAZmxvd1xuaW1wb3J0IE5vU2xlZXAgZnJvbSAnbm9zbGVlcC5qcydcbmltcG9ydCBzaGEyNTYgZnJvbSAnc2hhMjU2J1xuXG5jb25zdCAkaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEnKVxuY29uc3QgJGluaXRpYWxUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luaXRpYWwtdGV4dCcpXG5jb25zdCAkYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbicpXG5jb25zdCAkaW5jcmVtZW50U3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5jcmVtZW50LXNwZWVkJylcbmNvbnN0ICRkZWNyZW1lbnRTcGVlZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWNyZW1lbnQtc3BlZWQnKVxuY29uc3QgJHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicpXG5jb25zdCAkcHJvZ3Jlc3NQb2ludGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLXBvaW50ZXInKVxuY29uc3QgJHRpbWVMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RpbWUtbGVmdCcpXG5cbmNvbnN0IEFMUEhBQkVUID0ge1xuICAncnUtUlUnOiB7XG4gICAgdW5pY29kZTogWzEwNzIsIDExMDNdXG4gIH0sXG4gICdudW1iZXInOiB7XG4gICAgdW5pY29kZTogWzQ4LCA1N11cbiAgfVxufVxuXG4vLyB3aGVuIHNwZWFraW5nIHNwZWVkIGlzIDFcbmNvbnN0IERFRkFVTFRfV09SRFNfUEVSX01JTlVURSA9IDExNy42XG5jb25zdCBNSU5fU1BFRUQgPSAwLjUyXG5jb25zdCBERUZBVUxUX0xBTkdVQUdFID0gJ2VuLVVTJ1xuXG4vLyBmcCBjb21wb3NpdGlvbiAmIHBpcGUgaGVscGVyc1xuY29uc3QgcGlwZSA9IChmbiwgLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gZm5zLnJlZHVjZSgocmVzdWx0LCBmbikgPT4gZm4ocmVzdWx0KSwgZm4oLi4uYXJncykpXG5jb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IHBpcGUoLi4uZm5zLnJldmVyc2UoKSkoLi4uYXJncylcblxuY29uc3QgY29uY2F0ID0gbGlzdCA9PiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmJpbmQobGlzdClcbmNvbnN0IHByb21pc2VDb25jYXQgPSBmID0+IHggPT4gZigpLnRoZW4oY29uY2F0KHgpKVxuY29uc3QgcHJvbWlzZVJlZHVjZSA9IChhY2MsIHgpID0+IGFjYy50aGVuKHByb21pc2VDb25jYXQoeCkpXG4vKlxuICogc2VyaWFsIGV4ZWN1dGVzIFByb21pc2VzIHNlcXVlbnRpYWxseS5cbiAqIEBwYXJhbSB7ZnVuY3N9IEFuIGFycmF5IG9mIGZ1bmNzIHRoYXQgcmV0dXJuIHByb21pc2VzLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHVybHMgPSBbJy91cmwxJywgJy91cmwyJywgJy91cmwzJ11cbiAqIHNlcmlhbCh1cmxzLm1hcCh1cmwgPT4gKCkgPT4gJC5hamF4KHVybCkpKVxuICogICAgIC50aGVuKGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSkpXG4gKi9cbmNvbnN0IHNlcmlhbCA9IGZ1bmNzID0+IGZ1bmNzLnJlZHVjZShwcm9taXNlUmVkdWNlLCBQcm9taXNlLnJlc29sdmUoW10pKVxuXG5jbGFzcyBTcGVha2VyIHtcbiAgc3ludGggPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzXG4gIGN1cnJlbnRVdHRlcmFuY2U6IE9iamVjdFxuICBpc1NwZWFraW5nOiBib29sZWFuID0gZmFsc2VcbiAgaXNDaGFuZ2luZ1NwZWVkOiBib29sZWFuID0gZmFsc2VcbiAgaXNTdG9wcGVkOiBib29sZWFuID0gZmFsc2VcbiAgY3VycmVudFNwZWVkOiBudW1iZXIgPSAxLjJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gIH1cblxuICBzcGVhayh1dHRlcikge1xuICAgIGlmICghdXR0ZXIgJiYgIXRoaXMuY3VycmVudFV0dGVyYW5jZSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKCF1dHRlcikge1xuICAgICAgY29uc29sZS5lcnJvcignRW1wdHkgdXR0ZXIgdGV4dCcpXG4gICAgfVxuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZSA9IHV0dGVyIHx8IHRoaXMuY3VycmVudFV0dGVyYW5jZVxuICAgIGlmICh0aGlzLnN5bnRoLnNwZWFraW5nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBjYW4ndCBzcGVhayAke3V0dGVyfS4gQWxyZWFkeSBzcGVha2luZ2ApXG4gICAgICB0aGlzLnN5bnRoLmNhbmNlbCgpXG4gICAgICB0aGlzLnNwZWFrKHV0dGVyKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlID0gdGhpcy5jdXJyZW50U3BlZWRcbiAgICAvLyBpZiAodGhpcy5pc1N0b3BwZWQpIHRoaXMucGxheSgpXG5cbiAgICB0aGlzLnN5bnRoLnNwZWFrKHRoaXMuY3VycmVudFV0dGVyYW5jZSlcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlXG4gIH1cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSBudWxsXG4gICAgdGhpcy5zeW50aC5jYW5jZWwoKVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHBsYXkoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlXG4gICAgdGhpcy5zeW50aC5yZXN1bWUoKVxuICB9XG4gIHBhdXNlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2VcbiAgICB0aGlzLnN5bnRoLnBhdXNlKClcbiAgfVxuICBwbGF5UGF1c2UoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSAhdGhpcy5pc1N0b3BwZWRcbiAgICB0aGlzLmlzU3RvcHBlZCA/IHRoaXMuc3ludGgucGF1c2UoKSA6IHRoaXMuc3ludGgucmVzdW1lKClcbiAgfVxuICBfY2hhbmdlU3BlZWQoZGVsdGE6IG51bWJlcikge1xuICAgIHRoaXMuc3ludGguY2FuY2VsKClcbiAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IGRlbHRhID4gMFxuICAgICAgPyB0aGlzLmN1cnJlbnRTcGVlZCArIGRlbHRhXG4gICAgICA6IHRoaXMuY3VycmVudFNwZWVkIDw9IE1JTl9TUEVFRCA/IE1JTl9TUEVFRCA6IHRoaXMuY3VycmVudFNwZWVkICsgZGVsdGFcbiAgICB0aGlzLmlzQ2hhbmdpbmdTcGVlZCA9IHRydWVcbiAgICB0aGlzLnNwZWFrKClcbiAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRTcGVlZClcbiAgfVxuICBpbmNyZW1lbnRTcGVlZCgpIHsgdGhpcy5fY2hhbmdlU3BlZWQoMC4yKSB9XG4gIGRlY3JlbWVudFNwZWVkKCkgeyB0aGlzLl9jaGFuZ2VTcGVlZCgtMC4yKSB9XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgdmVyc2lvbjogJzAuMC40JyxcbiAgZ2V0VmVyc2lvbigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnZlcnNpb24pXG4gIH0sXG4gIHJlYWRlcjoge1xuICAgIHRva2Vuc0NvdW50OiAwLFxuICAgIGN1cnJlbnRUb2tlbkluZGV4OiAwLFxuICAgIHRleHRSZWFkaW5nRHVyYXRpb246IDAsXG4gICAgb3JpZ2luYWxUZXh0OiBudWxsLFxuICAgIHRleHRTaGEyNTY6IG51bGwsXG4gICAgdGV4dFRva2VuczogW10sXG4gICAgZ2V0IGN1cnJlbnRQcm9ncmVzcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbkluZGV4IC8gdGhpcy50b2tlbnNDb3VudFxuICAgIH0sXG4gICAgZ2V0IHRpbWVMZWZ0UmVhZGluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRSZWFkaW5nRHVyYXRpb24gLVxuICAgICAgICAodGhpcy50ZXh0UmVhZGluZ0R1cmF0aW9uICogdGhpcy5jdXJyZW50UHJvZ3Jlc3MpXG4gICAgfVxuICB9LFxuICBzcGVha2VyOiBuZXcgU3BlYWtlcigpLFxuICBub1NsZWVwOiBuZXcgTm9TbGVlcCgpLFxuICBkb206IHtcbiAgICB1cGRhdGVQcm9ncmVzc0Jhcihwcm9ncmVzczogbnVtYmVyKSB7XG4gICAgICAkcHJvZ3Jlc3NQb2ludGVyLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgIGB0cmFuc2xhdGUoJHtwcm9ncmVzcyAqICRwcm9ncmVzc0Jhci5jbGllbnRXaWR0aCAtIDE2fXB4LCAwKWBcbiAgICB9LFxuICAgIHVwZGF0ZVRpbWVMZWZ0KCkge1xuICAgICAgLyogY2FsY3VsYXRlcyB0aW1lIGxlZnQgcmVhZGluZyAqL1xuICAgICAgJHRpbWVMZWZ0LmlubmVyVGV4dCA9IGAke2FwcC5yZWFkZXIudGltZUxlZnRSZWFkaW5nLnRvRml4ZWQoMSl9IG1pbmBcbiAgICB9LFxuICAgIGhpZ2hsaWdodEN1cnJlbnRTZW50ZW5jZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0ICRjdXJyZW50U2VudGVuY2UgPSAkaW5wdXQucXVlcnlTZWxlY3RvcihgI3Rva2VuLSR7YXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleH1gKVxuICAgICAgaWYgKCRjdXJyZW50U2VudGVuY2UpIHtcbiAgICAgICAgJGN1cnJlbnRTZW50ZW5jZS5jbGFzc0xpc3QuYWRkKCd0b2tlbi0taGlnaGxpZ2h0ZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgJHByZXZpb3VzU2VudGVuY2UgPSAkaW5wdXQucXVlcnlTZWxlY3RvcihgI3Rva2VuLSR7YXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCAtIDF9YClcblxuICAgICAgLyogUmVtb3ZlIGhpZ2hsaWdodCBmcm9tIHByZXZpb3VzIHRva2VuICovXG4gICAgICBpZiAoYXBwLnJlYWRlci5jdXJyZW50VG9rZW5JbmRleCA+IDApIHtcbiAgICAgICAgaWYgKCRwcmV2aW91c1NlbnRlbmNlKSB7XG4gICAgICAgICAgJHByZXZpb3VzU2VudGVuY2UuY2xhc3NMaXN0LnJlbW92ZSgndG9rZW4tLWhpZ2hsaWdodGVkJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKlxuICogQW5hbHlzZXMgdGhlIGZpcnN0IGxldHRlciBpbiB0aGUgd29yZFxuICogTm93IGl0IGNhbiBndWVzcyBiZXR3ZWVuIGN5cmlsaWMgYW5kIGxhdGluIGxldHRlciBvbmx5XG4gKi9cbmNvbnN0IGRldGVjdExhbmdCeVN0ciA9IChzdHI6IHN0cmluZykgPT4ge1xuICBsZXQgY3VycmVudENoYXJJbmRleCA9IDBcbiAgbGV0IG1heENoYXJJbmRleCA9IDNcblxuICB3aGlsZSAoY3VycmVudENoYXJJbmRleCA8PSBtYXhDaGFySW5kZXgpIHtcbiAgICBjb25zdCBjaGFyQ29kZSA9IHN0ci50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoY3VycmVudENoYXJJbmRleClcbiAgICBmb3IgKGxldCBhbHBoYWJldCBpbiBBTFBIQUJFVCkge1xuICAgICAgaWYgKGNoYXJDb2RlID49IEFMUEhBQkVUW2FscGhhYmV0XS51bmljb2RlWzBdICYmXG4gICAgICAgICAgY2hhckNvZGUgPD0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMV0pIHtcbiAgICAgICAgcmV0dXJuIGFscGhhYmV0XG4gICAgICB9XG4gICAgfVxuICAgIGN1cnJlbnRDaGFySW5kZXgrK1xuICB9XG5cbiAgcmV0dXJuIERFRkFVTFRfTEFOR1VBR0Vcbn1cblxuLypcbiAqIElmIHRoZSB3b3JkcyBhcmUgaW4gdGhlIHNhbWUgbGFuZ3VhZ2UsIHJldHVybnMgdHJ1d1xuICogSWYgb25lIG9mIHRoZSB3b3JkcyBpcyBudW1iZXIsIHJldHVybnMgdHJ1ZVxuICogT3RoZXJ3aXNlLCByZXR1cm5zIGZhbHNlXG4gKi9cbnR5cGUgd29yZFR5cGUgPSB7XG4gIGxhbmc6IHN0cmluZyxcbiAgdG9rZW46IHN0cmluZ1xufVxuY29uc3QgaXNUaGVTYW1lTGFuZ3VhZ2UgPSAoXG4gIHdvcmQxOiB3b3JkVHlwZSxcbiAgd29yZDI6IHdvcmRUeXBlXG4pID0+IHdvcmQxLmxhbmcgPT09IHdvcmQyLmxhbmcgfHxcbiAgW3dvcmQxLmxhbmcsIHdvcmQyLmxhbmddLmluY2x1ZGVzKCdudW1iZXInKVxuXG5jb25zdCBqb2luT25lTGFuZ3VhZ2VXb3JkcyA9ICh3b3JkczogQXJyYXk8d29yZFR5cGU+KTogQXJyYXk8d29yZFR5cGU+ID0+IHtcbiAgY29uc3Qgc2VudGVuY2VzID0gW11cbiAgd29yZHMuZm9yRWFjaCh3b3JkID0+IHtcbiAgICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gICAgY29uc3QgcHJldmlvdXNXb3JkID0gc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXVxuICAgIGlzVGhlU2FtZUxhbmd1YWdlKHByZXZpb3VzV29yZCwgd29yZClcbiAgICAgID8gc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiA9XG4gICAgICAgICAgW3NlbnRlbmNlc1tzZW50ZW5jZXMubGVuZ3RoIC0gMV0udG9rZW4sIHdvcmQudG9rZW5dLmpvaW4oJyAnKVxuICAgICAgOiBzZW50ZW5jZXMucHVzaCh3b3JkKVxuICB9KVxuICByZXR1cm4gc2VudGVuY2VzXG59XG5cbmNvbnN0IGZvcm1hdFRleHQgPSAodGV4dDogc3RyaW5nKSA9PiB0ZXh0XG5jb25zdCBzcGxpdFRleHRJbnRvU2VudGVuY2VzID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHN0cmluZz4gPT4gdGV4dC5zcGxpdCgnLicpXG5jb25zdCBzcGxpdFNlbnRlbmNlSW50b1dvcmRzID0gKHNlbnRlbmNlOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHNlbnRlbmNlLnNwbGl0KCcgJylcbmNvbnN0IGNvdW50V29yZHNJblRleHQgPSAodGV4dDogc3RyaW5nKSA9PiBzcGxpdFNlbnRlbmNlSW50b1dvcmRzKHRleHQpLmxlbmd0aFxuY29uc3QgY29udmVydFdvcmRzSW50b1Rva2VucyA9ICh3b3JkczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHdvcmRUeXBlPiA9PlxuICB3b3Jkcy5tYXAoKHRva2VuOiBzdHJpbmcpID0+ICh7XG4gICAgbGFuZzogZGV0ZWN0TGFuZ0J5U3RyKHRva2VuKSxcbiAgICB0b2tlbjogdG9rZW5cbiAgfSkpXG5jb25zdCBmaWx0ZXJXb3Jkc0FycmF5ID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pID0+XG4gIHdvcmRzLmZpbHRlcih3b3JkID0+IHdvcmQudG9rZW4ubGVuZ3RoICE9PSAwKVxuXG4vKlxuICogQSBNZWRpdW0tbGlrZSBmdW5jdGlvbiBjYWxjdWxhdGVzIHRpbWUgbGVmdCByZWFkaW5nXG4gKi9cbmNvbnN0IGdldFRleHRSZWFkaW5nRHVyYXRpb24gPSAodGV4dDogc3RyaW5nLCBzcGVlZDogbnVtYmVyID0gMSkgPT5cbiAgY291bnRXb3Jkc0luVGV4dCh0ZXh0KSAvIChERUZBVUxUX1dPUkRTX1BFUl9NSU5VVEUgKiBzcGVlZClcblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudCA9IChzZW50ZW5jZTogd29yZFR5cGUpOiBPYmplY3QgPT4ge1xuICBjb25zdCB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHNlbnRlbmNlLnRva2VuKVxuICB1dHRlclRoaXMubGFuZyA9IHNlbnRlbmNlLmxhbmcgfHwgREVGQVVMVF9MQU5HVUFHRVxuICB1dHRlclRoaXMucmF0ZSA9IDEuOVxuICByZXR1cm4gdXR0ZXJUaGlzXG59XG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnRzID0gKHBhcnRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxPYmplY3Q+ID0+XG4gIHBhcnRzLm1hcChjcmVhdGVTcGVha0V2ZW50KVxuXG5jb25zdCBjb25jYXRTcGVha0V2ZW50c1NlbnRlbmNlcyA9XG4gIChzcGVha0V2ZW50c1NlbnRlbmNlczogQXJyYXk8QXJyYXk8T2JqZWN0Pj4pOiBBcnJheTxPYmplY3Q+ID0+XG4gICAgc3BlYWtFdmVudHNTZW50ZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pXG5cbmNvbnN0IHNwbGl0SW50b1RleHRUb2tlbnMgPSB0ZXh0ID0+IHtcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuXG4gIGNvbnN0IHRleHRUb2tlbnNBcnJheSA9IHNlbnRlbmNlcy5tYXAoc2VudGVuY2UgPT4gY29tcG9zZShcbiAgICBmaWx0ZXJXb3Jkc0FycmF5LFxuICAgIGNvbnZlcnRXb3Jkc0ludG9Ub2tlbnMsXG4gICAgc3BsaXRTZW50ZW5jZUludG9Xb3Jkc1xuICApKHNlbnRlbmNlKSlcblxuICBjb25zb2xlLmxvZyh0ZXh0VG9rZW5zQXJyYXkpXG4gIC8vIGNvbnN0IGxvZ0FuZENvbnRpbnVlID0gKGFyZ3MpID0+IHsgY29uc29sZS5sb2coYXJncyk7IHJldHVybiBhcmdzIH1cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgY3JlYXRlU3BlYWtFdmVudHMsXG4gICAgICBqb2luT25lTGFuZ3VhZ2VXb3Jkc1xuICAgICkodGV4dFRva2VucykpXG5cbiAgY29uc3QgcGhyYXNlcyA9IGNvbmNhdFNwZWFrRXZlbnRzU2VudGVuY2VzKHNwZWFrRXZlbnRzU2VudGVuY2VzKVxuICByZXR1cm4gcGhyYXNlc1xufVxuXG5jb25zdCBwcm9jY2Vzc2luZ1RleHRUb1NwZWVjaCA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgaWYgKGFwcC5yZWFkZXIudGV4dFNoYTI1NiAmJiBhcHAucmVhZGVyLnRleHRTaGEyNTYgPT09IHNoYTI1Nih0ZXh0KSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3RleHQgaXMgdGhlIHNhbWUsIGNvbnRpbnVlLi4uJylcbiAgICByZXR1cm5cbiAgfVxuICB0ZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KVxuICBhcHAucmVhZGVyLm9yaWdpbmFsVGV4dCAgPSB0ZXh0XG4gIGFwcC5yZWFkZXIudGV4dFNoYTI1NiA9IHNoYTI1Nih0ZXh0KVxuICBhcHAucmVhZGVyLnRleHRUb2tlbnMgPSBzcGxpdEludG9UZXh0VG9rZW5zKHRleHQpXG4gIGFwcC5yZWFkZXIudG9rZW5zQ291bnQgPSBhcHAucmVhZGVyLnRleHRUb2tlbnMubGVuZ3RoXG4gIGFwcC5yZWFkZXIudGV4dFJlYWRpbmdEdXJhdGlvbiA9IGdldFRleHRSZWFkaW5nRHVyYXRpb24odGV4dCwgYXBwLnNwZWFrZXIuY3VycmVudFNwZWVkKVxufVxuXG5jb25zdCByZW5kZXJUcmFuc2Zvcm1lZFRleHQgPSAoKSA9PiB7XG4gICRpbnB1dC5pbm5lckhUTUwgPSAnJ1xuICBhcHAucmVhZGVyLnRleHRUb2tlbnMuZm9yRWFjaCgodG9rZW4sIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZGl2VG9rZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBkaXZUb2tlbi5pbm5lclRleHQgPSB0b2tlbi50ZXh0ICsgJy4gJ1xuICAgIGRpdlRva2VuLmlkID0gYHRva2VuLSR7aW5kZXh9YFxuICAgIGRpdlRva2VuLmNsYXNzTGlzdC5hZGQoJ3Rva2VuJylcbiAgICBkaXZUb2tlbi5zZXRBdHRyaWJ1dGUoJ3NwZWxsY2hlY2snLCAnZmFsc2UnKVxuICAgICRpbnB1dC5hcHBlbmRDaGlsZChkaXZUb2tlbilcbiAgfSlcbn1cblxuYXBwLnNwZWFrSXRMb3VkID0gKCkgPT4ge1xuICBjb25zdCB0ZXh0ID0gJGlucHV0LmlubmVyVGV4dC50cmltKClcbiAgcHJvY2Nlc3NpbmdUZXh0VG9TcGVlY2godGV4dClcbiAgcmVuZGVyVHJhbnNmb3JtZWRUZXh0KClcblxuICBjb25zdCBwcm9taXNlcyA9IFtdXG4gIGFwcC5yZWFkZXIudGV4dFRva2Vucy5mb3JFYWNoKHBocmFzZSA9PlxuICAgIHByb21pc2VzLnB1c2goKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBhcHAuc3BlYWtlci5zcGVhayhwaHJhc2UpXG5cbiAgICAgIGNvbnNvbGUubG9nKGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXgpXG4gICAgICBhcHAuZG9tLmhpZ2hsaWdodEN1cnJlbnRTZW50ZW5jZShwaHJhc2UudGV4dClcbiAgICAgIGFwcC5yZWFkZXIuY3VycmVudFRva2VuSW5kZXggPSBhcHAucmVhZGVyLmN1cnJlbnRUb2tlbkluZGV4ICsgMVxuXG4gICAgICBhcHAuZG9tLnVwZGF0ZVByb2dyZXNzQmFyKGFwcC5yZWFkZXIuY3VycmVudFByb2dyZXNzKVxuICAgICAgYXBwLmRvbS51cGRhdGVUaW1lTGVmdCgpXG5cbiAgICAgIHBocmFzZS5vbmVuZCA9ICgpID0+IHtcbiAgICAgICAgaWYgKGFwcC5zcGVha2VyLmlzQ2hhbmdpbmdTcGVlZCkge1xuICAgICAgICAgIGFwcC5zcGVha2VyLmlzQ2hhbmdpbmdTcGVlZCA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFwcC5zcGVha2VyLmlzU3RvcHBlZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHBocmFzZS50ZXh0KVxuICAgICAgfVxuICAgIH0pKVxuICApXG5cbiAgc2VyaWFsKHByb21pc2VzKS50aGVuKGNvbnNvbGUubG9nKVxufVxuXG4vKlxuICogVHJpZ2dlcnMgd2hlbiDCq3NwZWFrwrsgYnV0dG9uIGlzIHByZXNzZWRcbiAqL1xuYXBwLm5vU2xlZXAuZW5hYmxlKClcbiRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgYXBwLnNwZWFrSXRMb3VkKClcbn0pXG5cbi8qXG4gKiBUcmlnZ2VycyB3aGVuIHVzZXIgaXMgdHJ5aW5nIHRvIHJlZnJlc2gvY2xvc2UgYXBwXG4gKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKGFwcC5zcGVha2VyLnN0b3AoKSlcbn0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgYXBwLnNwZWFrZXIucGxheVBhdXNlKClcbiAgfVxuXG4gIGlmIChldmVudC5rZXlDb2RlID09PSAxMyAmJiAoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5KSkge1xuICAgIGFwcC5zcGVha0l0TG91ZCgpXG4gIH1cbn0pXG5cbiRpbnB1dC5mb2N1cygpXG4kaW5pdGlhbFRleHQuZm9jdXMoKVxuXG4kaW5jcmVtZW50U3BlZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gIGFwcC5zcGVha2VyLmluY3JlbWVudFNwZWVkKClcbn0pXG5cbiRkZWNyZW1lbnRTcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgYXBwLnNwZWFrZXIuZGVjcmVtZW50U3BlZWQoKVxufSlcblxuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbiAgLy8gVE9ETzogc3RhcnQgZnJvbSB0aGUgc2VsZWN0ZWQgc2VudGVuY2UgKHRva2VuKVxuICBjb25zb2xlLmxvZyhldmVudClcbn0pXG5cbiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAkaW5pdGlhbFRleHQucmVtb3ZlKClcbn0pXG5cbiRpbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC10ZXh0YXJlYS0taW5pdGlhbCcpXG4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgJGluaXRpYWxUZXh0LnJlbW92ZSgpXG4gICRpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dC10ZXh0YXJlYS0taW5pdGlhbCcpXG5cbiAgY29uc3QgY2xpcGJvYXJkRGF0YSA9IGV2ZW50LmNsaXBib2FyZERhdGEgfHxcbiAgICB3aW5kb3cuY2xpcGJvYXJkRGF0YSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGFcblxuICBjb25zdCBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0JylcblxuICBjb25zdCBoaWRkZW5JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGhpZGRlbklucHV0LmlubmVySFRNTCA9IHBhc3RlZFRleHRcblxuICBjb25zdCB0ZXh0ID0gaGlkZGVuSW5wdXQudGV4dENvbnRlbnRcbiAgcHJvY2Nlc3NpbmdUZXh0VG9TcGVlY2godGV4dClcbiAgcmVuZGVyVHJhbnNmb3JtZWRUZXh0KClcbiAgLy8gJGlucHV0LmlubmVySFRNTCA9IHRleHRcbiAgY29uc29sZS5sb2codGV4dClcbn0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJjb25zdCBtZWRpYUZpbGUgPSByZXF1aXJlKCcuL21lZGlhLmpzJylcblxuLy8gRGV0ZWN0IGlPUyBicm93c2VycyA8IHZlcnNpb24gMTBcbmNvbnN0IG9sZElPUyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHBhcnNlRmxvYXQoXG4gICgnJyArICgvQ1BVLipPUyAoWzAtOV9dezMsNH0pWzAtOV9dezAsMX18KENQVSBsaWtlKS4qQXBwbGVXZWJLaXQuKk1vYmlsZS9pLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWzAsICcnXSlbMV0pXG4gICAgLnJlcGxhY2UoJ3VuZGVmaW5lZCcsICczXzInKS5yZXBsYWNlKCdfJywgJy4nKS5yZXBsYWNlKCdfJywgJycpXG4pIDwgMTAgJiYgIXdpbmRvdy5NU1N0cmVhbVxuXG5jbGFzcyBOb1NsZWVwIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXQgdXAgbm8gc2xlZXAgdmlkZW8gZWxlbWVudFxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG5cbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAnJylcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlKVxuXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMubm9TbGVlcFZpZGVvLmN1cnJlbnRUaW1lID4gMC41KSB7XG4gICAgICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uY3VycmVudFRpbWUgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICB9XG4gIH1cblxuICBlbmFibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKVxuICAgICAgfSwgMTUwMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBsYXkoKVxuICAgIH1cbiAgfVxuXG4gIGRpc2FibGUgKCkge1xuICAgIGlmIChvbGRJT1MpIHtcbiAgICAgIGlmICh0aGlzLm5vU2xlZXBUaW1lcikge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLm5vU2xlZXBUaW1lcilcbiAgICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvLnBhdXNlKClcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9TbGVlcFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9zbGVlcC5qcy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAnZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFJR1owZVhCdGNEUXlBQUFDQUdsemIyMXBjMjh5WVhaak1XMXdOREVBQUFBSVpuSmxaUUFBQ0tCdFpHRjBBQUFDOHdZRi8vL3YzRVhwdmViWlNMZVdMTmdnMlNQdTczZ3lOalFnTFNCamIzSmxJREUwTWlCeU1qUTNPU0JrWkRjNVlUWXhJQzBnU0M0eU5qUXZUVkJGUnkwMElFRldReUJqYjJSbFl5QXRJRU52Y0hsc1pXWjBJREl3TURNdE1qQXhOQ0F0SUdoMGRIQTZMeTkzZDNjdWRtbGtaVzlzWVc0dWIzSm5MM2d5TmpRdWFIUnRiQ0F0SUc5d2RHbHZibk02SUdOaFltRmpQVEVnY21WbVBURWdaR1ZpYkc5amF6MHhPakE2TUNCaGJtRnNlWE5sUFRCNE1Ub3dlREV4TVNCdFpUMW9aWGdnYzNWaWJXVTlNaUJ3YzNrOU1TQndjM2xmY21ROU1TNHdNRG93TGpBd0lHMXBlR1ZrWDNKbFpqMHdJRzFsWDNKaGJtZGxQVEUySUdOb2NtOXRZVjl0WlQweElIUnlaV3hzYVhNOU1DQTRlRGhrWTNROU1DQmpjVzA5TUNCa1pXRmtlbTl1WlQweU1Td3hNU0JtWVhOMFgzQnphMmx3UFRFZ1kyaHliMjFoWDNGd1gyOW1abk5sZEQwd0lIUm9jbVZoWkhNOU5pQnNiMjlyWVdobFlXUmZkR2h5WldGa2N6MHhJSE5zYVdObFpGOTBhSEpsWVdSelBUQWdibkk5TUNCa1pXTnBiV0YwWlQweElHbHVkR1Z5YkdGalpXUTlNQ0JpYkhWeVlYbGZZMjl0Y0dGMFBUQWdZMjl1YzNSeVlXbHVaV1JmYVc1MGNtRTlNQ0JpWm5KaGJXVnpQVE1nWWw5d2VYSmhiV2xrUFRJZ1lsOWhaR0Z3ZEQweElHSmZZbWxoY3owd0lHUnBjbVZqZEQweElIZGxhV2RvZEdJOU1TQnZjR1Z1WDJkdmNEMHdJSGRsYVdkb2RIQTlNU0JyWlhscGJuUTlNekF3SUd0bGVXbHVkRjl0YVc0OU16QWdjMk5sYm1WamRYUTlOREFnYVc1MGNtRmZjbVZtY21WemFEMHdJSEpqWDJ4dmIydGhhR1ZoWkQweE1DQnlZejFqY21ZZ2JXSjBjbVZsUFRFZ1kzSm1QVEl3TGpBZ2NXTnZiWEE5TUM0Mk1DQnhjRzFwYmowd0lIRndiV0Y0UFRZNUlIRndjM1JsY0QwMElIWmlkbDl0WVhoeVlYUmxQVEl3TURBd0lIWmlkbDlpZFdaemFYcGxQVEkxTURBd0lHTnlabDl0WVhnOU1DNHdJRzVoYkY5b2NtUTlibTl1WlNCbWFXeHNaWEk5TUNCcGNGOXlZWFJwYnoweExqUXdJR0Z4UFRFNk1TNHdNQUNBQUFBQU9XV0loQUEzLy9wK0M3djh0RERTVGpmOTd3NTVpM1NiUlBPNFpZK2hrakQ1aGJrQWtMM3pwSjZoL0xSMUNBQUJ6Z0Ixa3FxelVvcmxoUUFBQUF4Qm1pUVlobi8rcVpZQURMZ0FBQUFKUVo1Q1FoWC9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlWVVRbi93QUxLQ0VBQTBCb0hBQUFBQWtCbm1ORUovOEFDeWtoQUFOQWFCd2hBQU5BYUJ3QUFBQU5RWnBvTkV4RFAvNnBsZ0FNdVNFQUEwQm9IQUFBQUF0Qm5vWkZFU3dyL3dBSStTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm5xVkVKLzhBQ3lraEFBTkFhQndBQUFBSkFaNm5SQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBRFVHYXJEUk1Rei8rcVpZQURMZ2hBQU5BYUJ3QUFBQUxRWjdLUlJVc0svOEFDUGtoQUFOQWFCd0FBQUFKQVo3cFJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlNjBRbi93QUxLQ0VBQTBCb0hBQUFBQTFCbXZBMFRFTS8vcW1XQUF5NUlRQURRR2djSVFBRFFHZ2NBQUFBQzBHZkRrVVZMQ3YvQUFqNUlRQURRR2djQUFBQUNRR2ZMVVFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm55OUVKLzhBQ3lnaEFBTkFhQndBQUFBTlFaczBORXhEUC82cGxnQU11Q0VBQTBCb0hBQUFBQXRCbjFKRkZTd3Ivd0FJK1NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbjNGRUovOEFDeWdoQUFOQWFCd0FBQUFKQVo5elJDZi9BQXNvSVFBRFFHZ2NJUUFEUUdnY0FBQUFEVUdiZURSTVF6LytxWllBRExraEFBTkFhQndBQUFBTFFaK1dSUlVzSy84QUNQZ2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaKzFSQ2YvQUFzcElRQURRR2djQUFBQUNRR2Z0MFFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUExQm03dzBURU0vL3FtV0FBeTRJUUFEUUdnY0FBQUFDMEdmMmtVVkxDdi9BQWo1SVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbi90RUovOEFDeWtoQUFOQWFCd0FBQUFOUVp2Z05FeERQLzZwbGdBTXVTRUFBMEJvSENFQUEwQm9IQUFBQUF0Qm5oNUZGU3dyL3dBSStDRUFBMEJvSEFBQUFBa0JuajFFSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaNC9SQ2YvQUFzcElRQURRR2djQUFBQURVR2FKRFJNUXovK3FaWUFETGdoQUFOQWFCd0FBQUFMUVo1Q1JSVXNLLzhBQ1BraEFBTkFhQndoQUFOQWFCd0FBQUFKQVo1aFJDZi9BQXNvSVFBRFFHZ2NBQUFBQ1FHZVkwUW4vd0FMS1NFQUEwQm9IQ0VBQTBCb0hBQUFBQTFCbW1nMFRFTS8vcW1XQUF5NUlRQURRR2djQUFBQUMwR2Voa1VWTEN2L0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2VwVVFuL3dBTEtTRUFBMEJvSEFBQUFBa0JucWRFSi84QUN5Z2hBQU5BYUJ3QUFBQU5RWnFzTkV4RFAvNnBsZ0FNdUNFQUEwQm9IQ0VBQTBCb0hBQUFBQXRCbnNwRkZTd3Ivd0FJK1NFQUEwQm9IQUFBQUFrQm51bEVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFKQVo3clJDZi9BQXNvSVFBRFFHZ2NBQUFBRFVHYThEUk1Rei8rcVpZQURMa2hBQU5BYUJ3aEFBTkFhQndBQUFBTFFaOE9SUlVzSy84QUNQa2hBQU5BYUJ3QUFBQUpBWjh0UkNmL0FBc3BJUUFEUUdnY0lRQURRR2djQUFBQUNRR2ZMMFFuL3dBTEtDRUFBMEJvSEFBQUFBMUJtelEwVEVNLy9xbVdBQXk0SVFBRFFHZ2NBQUFBQzBHZlVrVVZMQ3YvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZmNVUW4vd0FMS0NFQUEwQm9IQUFBQUFrQm4zTkVKLzhBQ3lnaEFBTkFhQndoQUFOQWFCd0FBQUFOUVp0NE5FeEMvLzZwbGdBTXVTRUFBMEJvSEFBQUFBdEJuNVpGRlN3ci93QUkrQ0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JuN1ZFSi84QUN5a2hBQU5BYUJ3QUFBQUpBWiszUkNmL0FBc3BJUUFEUUdnY0FBQUFEVUdidXpSTVFuLytuaEFBWXNBaEFBTkFhQndoQUFOQWFCd0FBQUFKUVovYVFoUC9BQXNwSVFBRFFHZ2NBQUFBQ1FHZitVUW4vd0FMS0NFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSEFBQUNpRnRiMjkyQUFBQWJHMTJhR1FBQUFBQTFZQ0NYOVdBZ2w4QUFBUG9BQUFIL0FBQkFBQUJBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEQUFBQUdHbHZaSE1BQUFBQUVJQ0FnQWNBVC8vLy92Ny9BQUFGK1hSeVlXc0FBQUJjZEd0b1pBQUFBQVBWZ0lKZjFZQ0NYd0FBQUFFQUFBQUFBQUFIMEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBeWdBQUFNb0FBQUFBQUNSbFpIUnpBQUFBSEdWc2MzUUFBQUFBQUFBQUFRQUFCOUFBQUJkd0FBRUFBQUFBQlhGdFpHbGhBQUFBSUcxa2FHUUFBQUFBMVlDQ1g5V0FnbDhBQVYrUUFBSy9JRlhFQUFBQUFBQXRhR1JzY2dBQUFBQUFBQUFBZG1sa1pRQUFBQUFBQUFBQUFBQUFBRlpwWkdWdlNHRnVaR3hsY2dBQUFBVWNiV2x1WmdBQUFCUjJiV2hrQUFBQUFRQUFBQUFBQUFBQUFBQUFKR1JwYm1ZQUFBQWNaSEpsWmdBQUFBQUFBQUFCQUFBQURIVnliQ0FBQUFBQkFBQUUzSE4wWW13QUFBQ1ljM1J6WkFBQUFBQUFBQUFCQUFBQWlHRjJZekVBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF5Z0RLQUVnQUFBQklBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBWS8vOEFBQUF5WVhaalF3Rk5RQ2ovNFFBYlowMUFLT3lobzN5U1RVQkFRRkFBQUFNQUVBQXI4Z0R4Z3hsZ0FRQUVhTytHOGdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFBOEFBQUx1QUFBQUJSemRITnpBQUFBQUFBQUFBRUFBQUFCQUFBQjhHTjBkSE1BQUFBQUFBQUFQQUFBQUFFQUFCZHdBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQUM3Z0FBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBRUVjM1J6ZWdBQUFBQUFBQUFBQUFBQVBBQUFBelFBQUFBUUFBQUFEUUFBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQU5BQUFBRFFBQUFRQnpkR052QUFBQUFBQUFBRHdBQUFBd0FBQURaQUFBQTNRQUFBT05BQUFEb0FBQUE3a0FBQVBRQUFBRDZ3QUFBLzRBQUFRWEFBQUVMZ0FBQkVNQUFBUmNBQUFFYndBQUJJd0FBQVNoQUFBRXVnQUFCTTBBQUFUa0FBQUUvd0FBQlJJQUFBVXJBQUFGUWdBQUJWMEFBQVZ3QUFBRmlRQUFCYUFBQUFXMUFBQUZ6Z0FBQmVFQUFBWCtBQUFHRXdBQUJpd0FBQVkvQUFBR1ZnQUFCbkVBQUFhRUFBQUduUUFBQnJRQUFBYlBBQUFHNGdBQUJ2VUFBQWNTQUFBSEp3QUFCMEFBQUFkVEFBQUhjQUFBQjRVQUFBZWVBQUFIc1FBQUI4Z0FBQWZqQUFBSDlnQUFDQThBQUFnbUFBQUlRUUFBQ0ZRQUFBaG5BQUFJaEFBQUNKY0FBQU1zZEhKaGF3QUFBRngwYTJoa0FBQUFBOVdBZ2wvVmdJSmZBQUFBQWdBQUFBQUFBQWY4QUFBQUFBQUFBQUFBQUFBQkFRQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFDc20xa2FXRUFBQUFnYldSb1pBQUFBQURWZ0lKZjFZQ0NYd0FBckVRQUFXQUFWY1FBQUFBQUFDZG9aR3h5QUFBQUFBQUFBQUJ6YjNWdUFBQUFBQUFBQUFBQUFBQUFVM1JsY21WdkFBQUFBbU50YVc1bUFBQUFFSE50YUdRQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFpZHpkR0pzQUFBQVozTjBjMlFBQUFBQUFBQUFBUUFBQUZkdGNEUmhBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUNBQkFBQUFBQXJFUUFBQUFBQURObGMyUnpBQUFBQUFPQWdJQWlBQUlBQklDQWdCUkFGUUFBQUFBRERVQUFBQUFBQllDQWdBSVNFQWFBZ0lBQkFnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQllBQUFFQUFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBQVVjM1J6ZWdBQUFBQUFBQUFHQUFBQVdBQUFBWEJ6ZEdOdkFBQUFBQUFBQUZnQUFBT0JBQUFEaHdBQUE1b0FBQU90QUFBRHN3QUFBOG9BQUFQZkFBQUQ1UUFBQS9nQUFBUUxBQUFFRVFBQUJDZ0FBQVE5QUFBRVVBQUFCRllBQUFScEFBQUVnQUFBQklZQUFBU2JBQUFFcmdBQUJMUUFBQVRIQUFBRTNnQUFCUE1BQUFUNUFBQUZEQUFBQlI4QUFBVWxBQUFGUEFBQUJWRUFBQVZYQUFBRmFnQUFCWDBBQUFXREFBQUZtZ0FBQmE4QUFBWENBQUFGeUFBQUJkc0FBQVh5QUFBRitBQUFCZzBBQUFZZ0FBQUdKZ0FBQmprQUFBWlFBQUFHWlFBQUJtc0FBQVorQUFBR2tRQUFCcGNBQUFhdUFBQUd3d0FBQnNrQUFBYmNBQUFHN3dBQUJ3WUFBQWNNQUFBSElRQUFCelFBQUFjNkFBQUhUUUFBQjJRQUFBZHFBQUFIZndBQUI1SUFBQWVZQUFBSHF3QUFCOElBQUFmWEFBQUgzUUFBQi9BQUFBZ0RBQUFJQ1FBQUNDQUFBQWcxQUFBSU93QUFDRTRBQUFoaEFBQUllQUFBQ0g0QUFBaVJBQUFJcEFBQUNLb0FBQWl3QUFBSXRnQUFDTHdBQUFqQ0FBQUFGblZrZEdFQUFBQU9ibUZ0WlZOMFpYSmxid0FBQUhCMVpIUmhBQUFBYUcxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBTzJsc2MzUUFBQUF6cVhSdmJ3QUFBQ3RrWVhSaEFBQUFBUUFBQUFCSVlXNWtRbkpoYTJVZ01DNHhNQzR5SURJd01UVXdOakV4TURBPSdcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL21lZGlhLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbihnbG9iYWxzKSB7XG4ndXNlIHN0cmljdCdcblxudmFyIF9pbXBvcnRzID0ge31cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7IC8vQ29tbW9uSlNcbiAgX2ltcG9ydHMuYnl0ZXNUb0hleCA9IHJlcXVpcmUoJ2NvbnZlcnQtaGV4JykuYnl0ZXNUb0hleFxuICBfaW1wb3J0cy5jb252ZXJ0U3RyaW5nID0gcmVxdWlyZSgnY29udmVydC1zdHJpbmcnKVxuICBtb2R1bGUuZXhwb3J0cyA9IHNoYTI1NlxufSBlbHNlIHtcbiAgX2ltcG9ydHMuYnl0ZXNUb0hleCA9IGdsb2JhbHMuY29udmVydEhleC5ieXRlc1RvSGV4XG4gIF9pbXBvcnRzLmNvbnZlcnRTdHJpbmcgPSBnbG9iYWxzLmNvbnZlcnRTdHJpbmdcbiAgZ2xvYmFscy5zaGEyNTYgPSBzaGEyNTZcbn1cblxuLypcbkNyeXB0b0pTIHYzLjEuMlxuY29kZS5nb29nbGUuY29tL3AvY3J5cHRvLWpzXG4oYykgMjAwOS0yMDEzIGJ5IEplZmYgTW90dC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbmNvZGUuZ29vZ2xlLmNvbS9wL2NyeXB0by1qcy93aWtpL0xpY2Vuc2VcbiovXG5cbi8vIEluaXRpYWxpemF0aW9uIHJvdW5kIGNvbnN0YW50cyB0YWJsZXNcbnZhciBLID0gW11cblxuLy8gQ29tcHV0ZSBjb25zdGFudHNcbiFmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGlzUHJpbWUobikge1xuICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcbiAgICBmb3IgKHZhciBmYWN0b3IgPSAyOyBmYWN0b3IgPD0gc3FydE47IGZhY3RvcisrKSB7XG4gICAgICBpZiAoIShuICUgZmFjdG9yKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZyYWN0aW9uYWxCaXRzKG4pIHtcbiAgICByZXR1cm4gKChuIC0gKG4gfCAwKSkgKiAweDEwMDAwMDAwMCkgfCAwXG4gIH1cblxuICB2YXIgbiA9IDJcbiAgdmFyIG5QcmltZSA9IDBcbiAgd2hpbGUgKG5QcmltZSA8IDY0KSB7XG4gICAgaWYgKGlzUHJpbWUobikpIHtcbiAgICAgIEtbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAzKSlcbiAgICAgIG5QcmltZSsrXG4gICAgfVxuXG4gICAgbisrXG4gIH1cbn0oKVxuXG52YXIgYnl0ZXNUb1dvcmRzID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gIHZhciB3b3JkcyA9IFtdXG4gIGZvciAodmFyIGkgPSAwLCBiID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrLCBiICs9IDgpIHtcbiAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpXG4gIH1cbiAgcmV0dXJuIHdvcmRzXG59XG5cbnZhciB3b3Jkc1RvQnl0ZXMgPSBmdW5jdGlvbiAod29yZHMpIHtcbiAgdmFyIGJ5dGVzID0gW11cbiAgZm9yICh2YXIgYiA9IDA7IGIgPCB3b3Jkcy5sZW5ndGggKiAzMjsgYiArPSA4KSB7XG4gICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZXNcbn1cblxuLy8gUmV1c2FibGUgb2JqZWN0XG52YXIgVyA9IFtdXG5cbnZhciBwcm9jZXNzQmxvY2sgPSBmdW5jdGlvbiAoSCwgTSwgb2Zmc2V0KSB7XG4gIC8vIFdvcmtpbmcgdmFyaWFibGVzXG4gIHZhciBhID0gSFswXSwgYiA9IEhbMV0sIGMgPSBIWzJdLCBkID0gSFszXVxuICB2YXIgZSA9IEhbNF0sIGYgPSBIWzVdLCBnID0gSFs2XSwgaCA9IEhbN11cblxuICAgIC8vIENvbXB1dGF0aW9uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgIGlmIChpIDwgMTYpIHtcbiAgICAgIFdbaV0gPSBNW29mZnNldCArIGldIHwgMFxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2FtbWEweCA9IFdbaSAtIDE1XVxuICAgICAgdmFyIGdhbW1hMCAgPSAoKGdhbW1hMHggPDwgMjUpIHwgKGdhbW1hMHggPj4+IDcpKSAgXlxuICAgICAgICAgICAgICAgICAgICAoKGdhbW1hMHggPDwgMTQpIHwgKGdhbW1hMHggPj4+IDE4KSkgXlxuICAgICAgICAgICAgICAgICAgICAoZ2FtbWEweCA+Pj4gMylcblxuICAgICAgdmFyIGdhbW1hMXggPSBXW2kgLSAyXTtcbiAgICAgIHZhciBnYW1tYTEgID0gKChnYW1tYTF4IDw8IDE1KSB8IChnYW1tYTF4ID4+PiAxNykpIF5cbiAgICAgICAgICAgICAgICAgICAgKChnYW1tYTF4IDw8IDEzKSB8IChnYW1tYTF4ID4+PiAxOSkpIF5cbiAgICAgICAgICAgICAgICAgICAgKGdhbW1hMXggPj4+IDEwKVxuXG4gICAgICBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl07XG4gICAgfVxuXG4gICAgdmFyIGNoICA9IChlICYgZikgXiAofmUgJiBnKTtcbiAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG4gICAgdmFyIHNpZ21hMCA9ICgoYSA8PCAzMCkgfCAoYSA+Pj4gMikpIF4gKChhIDw8IDE5KSB8IChhID4+PiAxMykpIF4gKChhIDw8IDEwKSB8IChhID4+PiAyMikpO1xuICAgIHZhciBzaWdtYTEgPSAoKGUgPDwgMjYpIHwgKGUgPj4+IDYpKSBeICgoZSA8PCAyMSkgfCAoZSA+Pj4gMTEpKSBeICgoZSA8PCA3KSAgfCAoZSA+Pj4gMjUpKTtcblxuICAgIHZhciB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbaV0gKyBXW2ldO1xuICAgIHZhciB0MiA9IHNpZ21hMCArIG1hajtcblxuICAgIGggPSBnO1xuICAgIGcgPSBmO1xuICAgIGYgPSBlO1xuICAgIGUgPSAoZCArIHQxKSB8IDA7XG4gICAgZCA9IGM7XG4gICAgYyA9IGI7XG4gICAgYiA9IGE7XG4gICAgYSA9ICh0MSArIHQyKSB8IDA7XG4gIH1cblxuICAvLyBJbnRlcm1lZGlhdGUgaGFzaCB2YWx1ZVxuICBIWzBdID0gKEhbMF0gKyBhKSB8IDA7XG4gIEhbMV0gPSAoSFsxXSArIGIpIHwgMDtcbiAgSFsyXSA9IChIWzJdICsgYykgfCAwO1xuICBIWzNdID0gKEhbM10gKyBkKSB8IDA7XG4gIEhbNF0gPSAoSFs0XSArIGUpIHwgMDtcbiAgSFs1XSA9IChIWzVdICsgZikgfCAwO1xuICBIWzZdID0gKEhbNl0gKyBnKSB8IDA7XG4gIEhbN10gPSAoSFs3XSArIGgpIHwgMDtcbn1cblxuZnVuY3Rpb24gc2hhMjU2KG1lc3NhZ2UsIG9wdGlvbnMpIHs7XG4gIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcbiAgICBtZXNzYWdlID0gX2ltcG9ydHMuY29udmVydFN0cmluZy5VVEY4LnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XG4gIH1cblxuICB2YXIgSCA9WyAweDZBMDlFNjY3LCAweEJCNjdBRTg1LCAweDNDNkVGMzcyLCAweEE1NEZGNTNBLFxuICAgICAgICAgICAweDUxMEU1MjdGLCAweDlCMDU2ODhDLCAweDFGODNEOUFCLCAweDVCRTBDRDE5IF07XG5cbiAgdmFyIG0gPSBieXRlc1RvV29yZHMobWVzc2FnZSk7XG4gIHZhciBsID0gbWVzc2FnZS5sZW5ndGggKiA4O1xuXG4gIG1bbCA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGwgJSAzMik7XG4gIG1bKChsICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsO1xuXG4gIGZvciAodmFyIGk9MCA7IGk8bS5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICBwcm9jZXNzQmxvY2soSCwgbSwgaSk7XG4gIH1cblxuICB2YXIgZGlnZXN0Ynl0ZXMgPSB3b3Jkc1RvQnl0ZXMoSCk7XG4gIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuYXNCeXRlcyA/IGRpZ2VzdGJ5dGVzIDpcbiAgICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IF9pbXBvcnRzLmNvbnZlcnRTdHJpbmcuYnl0ZXNUb1N0cmluZyhkaWdlc3RieXRlcykgOlxuICAgICAgICAgX2ltcG9ydHMuYnl0ZXNUb0hleChkaWdlc3RieXRlcylcbn1cblxuc2hhMjU2LngyID0gZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucykge1xuICByZXR1cm4gc2hhMjU2KHNoYTI1NihtZXNzYWdlLCB7IGFzQnl0ZXM6dHJ1ZSB9KSwgb3B0aW9ucylcbn1cblxufSh0aGlzKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NoYTI1Ni9saWIvc2hhMjU2LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbihnbG9iYWxzKSB7XG4ndXNlIHN0cmljdCdcblxudmFyIGNvbnZlcnRIZXggPSB7XG4gIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgLyppZiAodHlwZW9mIGJ5dGVzLmJ5dGVMZW5ndGggIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBuZXdCeXRlcyA9IFtdXG5cbiAgICAgIGlmICh0eXBlb2YgYnl0ZXMuYnVmZmVyICE9ICd1bmRlZmluZWQnKVxuICAgICAgICBieXRlcyA9IG5ldyBEYXRhVmlldyhieXRlcy5idWZmZXIpXG4gICAgICBlbHNlXG4gICAgICAgIGJ5dGVzID0gbmV3IERhdGFWaWV3KGJ5dGVzKVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmJ5dGVMZW5ndGg7ICsraSkge1xuICAgICAgICBuZXdCeXRlcy5wdXNoKGJ5dGVzLmdldFVpbnQ4KGkpKVxuICAgICAgfVxuICAgICAgYnl0ZXMgPSBuZXdCeXRlc1xuICAgIH0qL1xuICAgIHJldHVybiBhcnJCeXRlc1RvSGV4KGJ5dGVzKVxuICB9LFxuICBoZXhUb0J5dGVzOiBmdW5jdGlvbihoZXgpIHtcbiAgICBpZiAoaGV4Lmxlbmd0aCAlIDIgPT09IDEpIHRocm93IG5ldyBFcnJvcihcImhleFRvQnl0ZXMgY2FuJ3QgaGF2ZSBhIHN0cmluZyB3aXRoIGFuIG9kZCBudW1iZXIgb2YgY2hhcmFjdGVycy5cIilcbiAgICBpZiAoaGV4LmluZGV4T2YoJzB4JykgPT09IDApIGhleCA9IGhleC5zbGljZSgyKVxuICAgIHJldHVybiBoZXgubWF0Y2goLy4uL2cpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4LDE2KSB9KVxuICB9XG59XG5cblxuLy8gUFJJVkFURVxuXG5mdW5jdGlvbiBhcnJCeXRlc1RvSGV4KGJ5dGVzKSB7XG4gIHJldHVybiBieXRlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFkTGVmdCh4LnRvU3RyaW5nKDE2KSwyKSB9KS5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBwYWRMZWZ0KG9yaWcsIGxlbikge1xuICBpZiAob3JpZy5sZW5ndGggPiBsZW4pIHJldHVybiBvcmlnXG4gIHJldHVybiBBcnJheShsZW4gLSBvcmlnLmxlbmd0aCArIDEpLmpvaW4oJzAnKSArIG9yaWdcbn1cblxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHsgLy9Db21tb25KU1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnRIZXhcbn0gZWxzZSB7XG4gIGdsb2JhbHMuY29udmVydEhleCA9IGNvbnZlcnRIZXhcbn1cblxufSh0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb252ZXJ0LWhleC9jb252ZXJ0LWhleC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIhZnVuY3Rpb24oZ2xvYmFscykge1xuJ3VzZSBzdHJpY3QnXG5cbnZhciBjb252ZXJ0U3RyaW5nID0ge1xuICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgIHJldHVybiBieXRlcy5tYXAoZnVuY3Rpb24oeCl7IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHgpIH0pLmpvaW4oJycpXG4gIH0sXG4gIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoJycpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4LmNoYXJDb2RlQXQoMCkgfSlcbiAgfVxufVxuXG4vL2h0dHA6Ly9ob3NzYS5pbi8yMDEyLzA3LzIwL3V0Zi04LWluLWphdmFzY3JpcHQuaHRtbFxuY29udmVydFN0cmluZy5VVEY4ID0ge1xuICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShjb252ZXJ0U3RyaW5nLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSlcbiAgfSxcbiAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICByZXR1cm4gY29udmVydFN0cmluZy5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSlcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHsgLy9Db21tb25KU1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnRTdHJpbmdcbn0gZWxzZSB7XG4gIGdsb2JhbHMuY29udmVydFN0cmluZyA9IGNvbnZlcnRTdHJpbmdcbn1cblxufSh0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb252ZXJ0LXN0cmluZy9jb252ZXJ0LXN0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9