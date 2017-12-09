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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_queue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_queue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_queue__);


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

const createSpeakEvent = sentence => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token);
  utterThis.lang = sentence.lang;
  utterThis.rate = 1.9;
  return utterThis;
};

const createSpeakEvents = parts => parts.map(createSpeakEvent);

const transformSpeakEventsIntoPromises = speakEvents => speakEvents.map(speakEvent => () => new Promise(resolve => {
  // speakEvent.onEnd = resolve(() => )
}));

function speakItLoud() {
  const text = input.value.trim();
  const sentences = splitTextIntoSentences(text);
  const textTokensArray = sentences.map(sentence => compose(filterWordsArray, convertWordsIntoTokens, splitSentenceIntoWords)(sentence));

  console.log(textTokensArray);
  const logAndContinue = args => {
    console.log(args);return args;
  };

  const speakEventsSentences = textTokensArray.map(textTokens => compose(
  // transformSpeakEventsIntoPromises,
  createSpeakEvents, joinOneLanguageWords)(textTokens));

  const queue = new __WEBPACK_IMPORTED_MODULE_0_queue___default.a();
  speakEventsSentences.forEach(sentence => {
    sentence.forEach(phrase => {
      app.speaker.speak(phrase);
    });
  });
}

button.addEventListener('click', event => {
  console.log('clicked');
  speakItLoud();
});

// const speakEvents = compose(
//   // transformSpeakEventsIntoPromises,
//   (parts: Array<wordType>): Array<Object> => parts.map(createSpeakEvent),
//   logAndContinue,
//   joinOneLanguageWords,
//   // logAndContinue
// )(textTokensArray[0])

// console.log(speakEvents)
// app.speaker.speak(speakEvents[0])
// console.log(queue)

// queue.push(() => new Promise(resolve => {

// }))

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


// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(2)
var EventEmitter = __webpack_require__(3).EventEmitter

module.exports = Queue

function Queue (options) {
  if (!(this instanceof Queue)) {
    return new Queue(options)
  }

  EventEmitter.call(this)
  options = options || {}
  this.concurrency = options.concurrency || Infinity
  this.timeout = options.timeout || 0
  this.autostart = options.autostart || false
  this.results = options.results || null
  this.pending = 0
  this.session = 0
  this.running = false
  this.jobs = []
  this.timers = {}
}
inherits(Queue, EventEmitter)

var arrayMethods = [
  'pop',
  'shift',
  'indexOf',
  'lastIndexOf'
]

arrayMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    return Array.prototype[method].apply(this.jobs, arguments)
  }
})

Queue.prototype.slice = function (begin, end) {
  this.jobs = this.jobs.slice(begin, end)
  return this
}

Queue.prototype.reverse = function () {
  this.jobs.reverse()
  return this
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
]

arrayAddMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments)
    if (this.autostart) {
      this.start()
    }
    return methodResult
  }
})

Object.defineProperty(Queue.prototype, 'length', {
  get: function () {
    return this.pending + this.jobs.length
  }
})

Queue.prototype.start = function (cb) {
  if (cb) {
    callOnErrorOrEnd.call(this, cb)
  }

  this.running = true

  if (this.pending >= this.concurrency) {
    return
  }

  if (this.jobs.length === 0) {
    if (this.pending === 0) {
      done.call(this)
    }
    return
  }

  var self = this
  var job = this.jobs.shift()
  var once = true
  var session = this.session
  var timeoutId = null
  var didTimeout = false
  var resultIndex = null

  function next (err, result) {
    if (once && self.session === session) {
      once = false
      self.pending--
      if (timeoutId !== null) {
        delete self.timers[timeoutId]
        clearTimeout(timeoutId)
      }

      if (err) {
        self.emit('error', err, job)
      } else if (didTimeout === false) {
        if (resultIndex !== null) {
          self.results[resultIndex] = Array.prototype.slice.call(arguments, 1)
        }
        self.emit('success', result, job)
      }

      if (self.session === session) {
        if (self.pending === 0 && self.jobs.length === 0) {
          done.call(self)
        } else if (self.running) {
          self.start()
        }
      }
    }
  }

  if (this.timeout) {
    timeoutId = setTimeout(function () {
      didTimeout = true
      if (self.listeners('timeout').length > 0) {
        self.emit('timeout', next, job)
      } else {
        next()
      }
    }, this.timeout)
    this.timers[timeoutId] = timeoutId
  }

  if (this.results) {
    resultIndex = this.results.length
    this.results[resultIndex] = null
  }

  this.pending++
  var promise = job(next)
  if (promise && promise.then && typeof promise.then === 'function') {
    promise.then(function (result) {
      next(null, result)
    }).catch(function (err) {
      next(err || true)
    })
  }

  if (this.running && this.jobs.length > 0) {
    this.start()
  }
}

Queue.prototype.stop = function () {
  this.running = false
}

Queue.prototype.end = function (err) {
  clearTimers.call(this)
  this.jobs.length = 0
  this.pending = 0
  done.call(this, err)
}

function clearTimers () {
  for (var key in this.timers) {
    var timeoutId = this.timers[key]
    delete this.timers[key]
    clearTimeout(timeoutId)
  }
}

function callOnErrorOrEnd (cb) {
  var self = this
  this.on('error', onerror)
  this.on('end', onend)

  function onerror (err) { self.end(err) }
  function onend (err) {
    self.removeListener('error', onerror)
    self.removeListener('end', onend)
    cb(err, this.results)
  }
}

function done (err) {
  this.session++
  this.running = false
  this.emit('end', err)
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWMzOTgxNzlkMmEwZjE4MzRlZmUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9xdWV1ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6WyJpbnB1dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImJ1dHRvbiIsIkFMUEhBQkVUIiwidW5pY29kZSIsInBpcGUiLCJmbiIsImZucyIsImFyZ3MiLCJyZWR1Y2UiLCJyZXN1bHQiLCJjb21wb3NlIiwicmV2ZXJzZSIsIlBsYXllciIsImlzUGxheWluZyIsInBsYXkiLCJwYXVzZSIsInBsYXlQYXVzZSIsIlNwZWFrZXIiLCJjb25zdHJ1Y3RvciIsInN5bnRoIiwid2luZG93Iiwic3BlZWNoU3ludGhlc2lzIiwib252b2ljZWNoYW5nZWQiLCJldmVudCIsImNvbnNvbGUiLCJsb2ciLCJvbnZvaWNlc2NoYW5nZWQiLCJzcGVhayIsInV0dGVyIiwiY3VycmVudFV0dGVyYW5jZSIsInJhdGUiLCJyZXN1bWUiLCJzZXRTcGVlZCIsInZhbHVlIiwiYXBwIiwidmVyc2lvbiIsImdldFZlcnNpb24iLCJwbGF5ZXIiLCJzcGVha2VyIiwiZGV0ZWN0TGFuZ0J5U3RyIiwic3RyIiwiY3VycmVudENoYXJJbmRleCIsIm1heENoYXJJbmRleCIsImNoYXJDb2RlIiwidG9Mb3dlckNhc2UiLCJjaGFyQ29kZUF0IiwiYWxwaGFiZXQiLCJpc1RoZVNhbWVMYW5ndWFnZSIsIndvcmQxIiwid29yZDIiLCJsYW5nIiwiam9pbk9uZUxhbmd1YWdlV29yZHMiLCJ3b3JkcyIsInNlbnRlbmNlcyIsImZvckVhY2giLCJ3b3JkIiwibGVuZ3RoIiwicHVzaCIsInRva2VuIiwiam9pbiIsInNwbGl0VGV4dEludG9TZW50ZW5jZXMiLCJ0ZXh0Iiwic3BsaXQiLCJzcGxpdFNlbnRlbmNlSW50b1dvcmRzIiwic2VudGVuY2UiLCJjb252ZXJ0V29yZHNJbnRvVG9rZW5zIiwibWFwIiwiZmlsdGVyV29yZHNBcnJheSIsImZpbHRlciIsImNyZWF0ZVNwZWFrRXZlbnQiLCJ1dHRlclRoaXMiLCJTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UiLCJjcmVhdGVTcGVha0V2ZW50cyIsInBhcnRzIiwidHJhbnNmb3JtU3BlYWtFdmVudHNJbnRvUHJvbWlzZXMiLCJzcGVha0V2ZW50cyIsInNwZWFrRXZlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNwZWFrSXRMb3VkIiwidHJpbSIsInRleHRUb2tlbnNBcnJheSIsImxvZ0FuZENvbnRpbnVlIiwic3BlYWtFdmVudHNTZW50ZW5jZXMiLCJ0ZXh0VG9rZW5zIiwicXVldWUiLCJwaHJhc2UiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNURBOztBQUVBLE1BQU1BLFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWQ7QUFDQSxNQUFNQyxTQUFTRixTQUFTQyxhQUFULENBQXVCLFNBQXZCLENBQWY7O0FBRUEsTUFBTUUsV0FBVztBQUNmLFdB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UixDQUFZLFNBQVo7QUFDQXNEO0FBQ0QsQ0FIRDs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsSzs7Ozs7O0FDM0xBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWMzOTgxNzlkMmEwZjE4MzRlZmUiLCIvLyBAZmxvd1xuaW1wb3J0IFF1ZXVlIGZyb20gJ3F1ZXVlJ1xuXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYScpXG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJylcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gICdydS1SVSc6IHtcbiAgICB1bmljb2RlOiBbMTA3MiwgMTEwM11cbiAgfVxufVxuXG4vLyBmcCBjb21wb3NpdGlvbiAmIHBpcGUgaGVscGVyc1xuY29uc3QgcGlwZSA9IChmbiwgLi4uZm5zKSA9PiAoLi4uYXJncykgPT4gZm5zLnJlZHVjZSgocmVzdWx0LCBmbikgPT4gZm4ocmVzdWx0KSwgZm4oLi4uYXJncykpXG5jb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gKC4uLmFyZ3MpID0+IHBpcGUoLi4uZm5zLnJldmVyc2UoKSkoLi4uYXJncylcblxuY2xhc3MgUGxheWVyIHtcbiAgaXNQbGF5aW5nOiBib29sZWFuID0gZmFsc2VcbiAgcGxheSAoKSB7IHRoaXMuaXNQbGF5aW5nID0gdHJ1ZSB9XG4gIHBhdXNlICgpIHsgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZSB9XG4gIHBsYXlQYXVzZSAoKSB7IHRoaXMuaXNQbGF5aW5nID0gIXRoaXMuaXNQbGF5aW5nIH1cbn1cblxuY2xhc3MgU3BlYWtlciBleHRlbmRzIFBsYXllciB7XG4gIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xuICBjdXJyZW50VXR0ZXJhbmNlOiBPYmplY3RcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN5bnRoLm9udm9pY2VjaGFuZ2VkID0gZXZlbnQgPT4gY29uc29sZS5sb2coZXZlbnQpXG4gICAgdGhpcy5zeW50aC5vbnZvaWNlc2NoYW5nZWQgPSBldmVudCA9PiBjb25zb2xlLmxvZyhldmVudClcbiAgfVxuICBzcGVhayAodXR0ZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UgPSB1dHRlciB8fCB0aGlzLmN1cnJlbnRVdHRlcmFuY2VcbiAgICB0aGlzLmN1cnJlbnRVdHRlcmFuY2UucmF0ZSA9IHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlICsgMC4xXG4gICAgdGhpcy5zeW50aC5zcGVhayh0aGlzLmN1cnJlbnRVdHRlcmFuY2UpXG4gICAgY29uc29sZS5sb2codGhpcy5zeW50aClcbiAgfVxuICBwYXVzZSAoKSB7IHRoaXMuc3ludGgucGF1c2UoKSB9XG4gIHJlc3VtZSAoKSB7IHRoaXMuc3ludGgucmVzdW1lKCkgfVxuICBzZXRTcGVlZCAodmFsdWU6IG51bWJlcikge1xuICAgIC8vIHRoaXMuY3VycmVudFV0dGVyYW5jZS5yYXRlID0gdmFsdWVcbiAgICAvLyB0aGlzLnNwZWFrKClcbiAgfVxufVxuXG5jb25zdCBhcHAgPSB7XG4gIHZlcnNpb246ICcwLjAuMicsXG4gIGdldFZlcnNpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudmVyc2lvbilcbiAgfSxcbiAgcGxheWVyOiBuZXcgUGxheWVyKCksXG4gIHNwZWFrZXI6IG5ldyBTcGVha2VyKClcbn1cblxuLypcbiAqIEFuYWx5c2VzIHRoZSBmaXJzdCBsZXR0ZXIgaW4gdGhlIHdvcmRcbiAqIE5vdyBpdCBjYW4gZ3Vlc3MgYmV0d2VlbiBjeXJpbGljIGFuZCBsYXRpbiBsZXR0ZXIgb25seVxuICovXG5jb25zdCBkZXRlY3RMYW5nQnlTdHIgPSAoc3RyOiBzdHJpbmcpID0+IHtcbiAgbGV0IGN1cnJlbnRDaGFySW5kZXggPSAwXG4gIGxldCBtYXhDaGFySW5kZXggPSAzXG4gIHdoaWxlIChjdXJyZW50Q2hhckluZGV4IDw9IG1heENoYXJJbmRleCkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdChjdXJyZW50Q2hhckluZGV4KVxuICAgIGZvciAobGV0IGFscGhhYmV0IGluIEFMUEhBQkVUKSB7XG4gICAgICBpZiAoY2hhckNvZGUgPj0gQUxQSEFCRVRbYWxwaGFiZXRdLnVuaWNvZGVbMF0gJiZcbiAgICAgICAgICBjaGFyQ29kZSA8PSBBTFBIQUJFVFthbHBoYWJldF0udW5pY29kZVsxXSkge1xuICAgICAgICByZXR1cm4gYWxwaGFiZXRcbiAgICAgIH1cbiAgICB9XG4gICAgY3VycmVudENoYXJJbmRleCsrXG4gIH1cbiAgcmV0dXJuICdlbidcbn1cblxudHlwZSB3b3JkVHlwZSA9IHtcbiAgbGFuZzogc3RyaW5nLFxuICB0b2tlbjogc3RyaW5nXG59XG5cbmNvbnN0IGlzVGhlU2FtZUxhbmd1YWdlID0gKFxuICB3b3JkMTogd29yZFR5cGUsXG4gIHdvcmQyOiB3b3JkVHlwZVxuKSA9PiB3b3JkMS5sYW5nID09PSB3b3JkMi5sYW5nXG5cbmNvbnN0IGpvaW5PbmVMYW5ndWFnZVdvcmRzID0gKHdvcmRzOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTx3b3JkVHlwZT4gPT4ge1xuICBjb25zdCBzZW50ZW5jZXMgPSBbXVxuICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc2VudGVuY2VzLnB1c2god29yZClcbiAgICBpc1RoZVNhbWVMYW5ndWFnZShzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLCB3b3JkKVxuICAgICAgPyBzZW50ZW5jZXNbc2VudGVuY2VzLmxlbmd0aCAtIDFdLnRva2VuID1cbiAgICAgICAgICBbc2VudGVuY2VzW3NlbnRlbmNlcy5sZW5ndGggLSAxXS50b2tlbiwgd29yZC50b2tlbl0uam9pbignICcpXG4gICAgICA6IHNlbnRlbmNlcy5wdXNoKHdvcmQpXG4gIH0pXG4gIHJldHVybiBzZW50ZW5jZXNcbn1cblxuY29uc3Qgc3BsaXRUZXh0SW50b1NlbnRlbmNlcyA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+ID0+IHRleHQuc3BsaXQoJy4nKVxuY29uc3Qgc3BsaXRTZW50ZW5jZUludG9Xb3JkcyA9IChzZW50ZW5jZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiA9PiBzZW50ZW5jZS5zcGxpdCgnICcpXG5jb25zdCBjb252ZXJ0V29yZHNJbnRvVG9rZW5zID0gKHdvcmRzOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8d29yZFR5cGU+ID0+XG4gIHdvcmRzLm1hcCgodG9rZW46IHN0cmluZykgPT4gKHtcbiAgICBsYW5nOiBkZXRlY3RMYW5nQnlTdHIodG9rZW4pLFxuICAgIHRva2VuOiB0b2tlblxuICB9KSlcbmNvbnN0IGZpbHRlcldvcmRzQXJyYXkgPSAod29yZHM6IEFycmF5PHdvcmRUeXBlPikgPT5cbiAgd29yZHMuZmlsdGVyKHdvcmQgPT4gd29yZC50b2tlbi5sZW5ndGggIT09IDApXG5cbmNvbnN0IGNyZWF0ZVNwZWFrRXZlbnQgPSAoc2VudGVuY2U6IHdvcmRUeXBlKTogT2JqZWN0ID0+IHtcbiAgY29uc3QgdXR0ZXJUaGlzID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZShzZW50ZW5jZS50b2tlbilcbiAgdXR0ZXJUaGlzLmxhbmcgPSBzZW50ZW5jZS5sYW5nXG4gIHV0dGVyVGhpcy5yYXRlID0gMS45XG4gIHJldHVybiB1dHRlclRoaXNcbn1cblxuY29uc3QgY3JlYXRlU3BlYWtFdmVudHMgPSAocGFydHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PE9iamVjdD4gPT5cbiAgcGFydHMubWFwKGNyZWF0ZVNwZWFrRXZlbnQpXG5cbmNvbnN0IHRyYW5zZm9ybVNwZWFrRXZlbnRzSW50b1Byb21pc2VzID0gKHNwZWFrRXZlbnRzOiBBcnJheTxPYmplY3Q+KSA9PlxuICBzcGVha0V2ZW50cy5tYXAoc3BlYWtFdmVudCA9PiAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAvLyBzcGVha0V2ZW50Lm9uRW5kID0gcmVzb2x2ZSgoKSA9PiApXG4gIH0pKVxuXG5mdW5jdGlvbiBzcGVha0l0TG91ZCAoKSB7XG4gIGNvbnN0IHRleHQgPSBpbnB1dC52YWx1ZS50cmltKClcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRUZXh0SW50b1NlbnRlbmNlcyh0ZXh0KVxuICBjb25zdCB0ZXh0VG9rZW5zQXJyYXkgPSBzZW50ZW5jZXMubWFwKHNlbnRlbmNlID0+IGNvbXBvc2UoXG4gICAgZmlsdGVyV29yZHNBcnJheSxcbiAgICBjb252ZXJ0V29yZHNJbnRvVG9rZW5zLFxuICAgIHNwbGl0U2VudGVuY2VJbnRvV29yZHNcbiAgKShzZW50ZW5jZSkpXG5cbiAgY29uc29sZS5sb2codGV4dFRva2Vuc0FycmF5KVxuICBjb25zdCBsb2dBbmRDb250aW51ZSA9IChhcmdzKSA9PiB7IGNvbnNvbGUubG9nKGFyZ3MpOyByZXR1cm4gYXJncyB9XG5cbiAgY29uc3Qgc3BlYWtFdmVudHNTZW50ZW5jZXMgPSB0ZXh0VG9rZW5zQXJyYXkubWFwKFxuICAgICh0ZXh0VG9rZW5zOiBBcnJheTx3b3JkVHlwZT4pOiBBcnJheTxBcnJheTxPYmplY3Q+PiA9PiBjb21wb3NlKFxuICAgICAgLy8gdHJhbnNmb3JtU3BlYWtFdmVudHNJbnRvUHJvbWlzZXMsXG4gICAgICBjcmVhdGVTcGVha0V2ZW50cyxcbiAgICAgIGpvaW5PbmVMYW5ndWFnZVdvcmRzXG4gICAgKSh0ZXh0VG9rZW5zKSlcblxuICBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZSgpXG4gIHNwZWFrRXZlbnRzU2VudGVuY2VzLmZvckVhY2goc2VudGVuY2UgPT4ge1xuICAgIHNlbnRlbmNlLmZvckVhY2gocGhyYXNlID0+IHtcbiAgICAgIGFwcC5zcGVha2VyLnNwZWFrKHBocmFzZSlcbiAgICB9KVxuICB9KVxufVxuXG5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgY29uc29sZS5sb2coJ2NsaWNrZWQnKVxuICBzcGVha0l0TG91ZCgpXG59KVxuXG4vLyBjb25zdCBzcGVha0V2ZW50cyA9IGNvbXBvc2UoXG4vLyAgIC8vIHRyYW5zZm9ybVNwZWFrRXZlbnRzSW50b1Byb21pc2VzLFxuLy8gICAocGFydHM6IEFycmF5PHdvcmRUeXBlPik6IEFycmF5PE9iamVjdD4gPT4gcGFydHMubWFwKGNyZWF0ZVNwZWFrRXZlbnQpLFxuLy8gICBsb2dBbmRDb250aW51ZSxcbi8vICAgam9pbk9uZUxhbmd1YWdlV29yZHMsXG4vLyAgIC8vIGxvZ0FuZENvbnRpbnVlXG4vLyApKHRleHRUb2tlbnNBcnJheVswXSlcblxuLy8gY29uc29sZS5sb2coc3BlYWtFdmVudHMpXG4vLyBhcHAuc3BlYWtlci5zcGVhayhzcGVha0V2ZW50c1swXSlcbi8vIGNvbnNvbGUubG9nKHF1ZXVlKVxuXG4vLyBxdWV1ZS5wdXNoKCgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG4vLyB9KSlcblxuLy8gbGV0IGN1cnJlbnQgPSAxXG4vLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgIGFwcC5zcGVha2VyLnNldFNwZWVkKGN1cnJlbnQpXG4vLyAgIGN1cnJlbnQgKz0gLjJcbi8vIH0sIDEwMDApXG5cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4vLyAgIC8vIElmIHNwYWNlIGlzIHByZXNzZWRcbi8vICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4vLyAgICAgYXBwLnBsYXllci5wbGF5UGF1c2UoKVxuLy8gICB9XG4vLyAgIGNvbnNvbGUubG9nKGV2ZW50LmtleUNvZGUpXG4vLyB9KVxuXG5cbi8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhldmVudClcbi8vICAgY29uc3QgdGV4dCA9IGV2ZW50LnRhcmdldC52YWx1ZVxuLy8gfSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWVcblxuZnVuY3Rpb24gUXVldWUgKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFF1ZXVlKSkge1xuICAgIHJldHVybiBuZXcgUXVldWUob3B0aW9ucylcbiAgfVxuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHRoaXMuY29uY3VycmVuY3kgPSBvcHRpb25zLmNvbmN1cnJlbmN5IHx8IEluZmluaXR5XG4gIHRoaXMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAwXG4gIHRoaXMuYXV0b3N0YXJ0ID0gb3B0aW9ucy5hdXRvc3RhcnQgfHwgZmFsc2VcbiAgdGhpcy5yZXN1bHRzID0gb3B0aW9ucy5yZXN1bHRzIHx8IG51bGxcbiAgdGhpcy5wZW5kaW5nID0gMFxuICB0aGlzLnNlc3Npb24gPSAwXG4gIHRoaXMucnVubmluZyA9IGZhbHNlXG4gIHRoaXMuam9icyA9IFtdXG4gIHRoaXMudGltZXJzID0ge31cbn1cbmluaGVyaXRzKFF1ZXVlLCBFdmVudEVtaXR0ZXIpXG5cbnZhciBhcnJheU1ldGhvZHMgPSBbXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAnaW5kZXhPZicsXG4gICdsYXN0SW5kZXhPZidcbl1cblxuYXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICBRdWV1ZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlW21ldGhvZF0uYXBwbHkodGhpcy5qb2JzLCBhcmd1bWVudHMpXG4gIH1cbn0pXG5cblF1ZXVlLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChiZWdpbiwgZW5kKSB7XG4gIHRoaXMuam9icyA9IHRoaXMuam9icy5zbGljZShiZWdpbiwgZW5kKVxuICByZXR1cm4gdGhpc1xufVxuXG5RdWV1ZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5qb2JzLnJldmVyc2UoKVxuICByZXR1cm4gdGhpc1xufVxuXG52YXIgYXJyYXlBZGRNZXRob2RzID0gW1xuICAncHVzaCcsXG4gICd1bnNoaWZ0JyxcbiAgJ3NwbGljZSdcbl1cblxuYXJyYXlBZGRNZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICBRdWV1ZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kUmVzdWx0ID0gQXJyYXkucHJvdG90eXBlW21ldGhvZF0uYXBwbHkodGhpcy5qb2JzLCBhcmd1bWVudHMpXG4gICAgaWYgKHRoaXMuYXV0b3N0YXJ0KSB7XG4gICAgICB0aGlzLnN0YXJ0KClcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZFJlc3VsdFxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUXVldWUucHJvdG90eXBlLCAnbGVuZ3RoJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wZW5kaW5nICsgdGhpcy5qb2JzLmxlbmd0aFxuICB9XG59KVxuXG5RdWV1ZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoY2IpIHtcbiAgaWYgKGNiKSB7XG4gICAgY2FsbE9uRXJyb3JPckVuZC5jYWxsKHRoaXMsIGNiKVxuICB9XG5cbiAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuXG4gIGlmICh0aGlzLnBlbmRpbmcgPj0gdGhpcy5jb25jdXJyZW5jeSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHRoaXMuam9icy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nID09PSAwKSB7XG4gICAgICBkb25lLmNhbGwodGhpcylcbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGpvYiA9IHRoaXMuam9icy5zaGlmdCgpXG4gIHZhciBvbmNlID0gdHJ1ZVxuICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvblxuICB2YXIgdGltZW91dElkID0gbnVsbFxuICB2YXIgZGlkVGltZW91dCA9IGZhbHNlXG4gIHZhciByZXN1bHRJbmRleCA9IG51bGxcblxuICBmdW5jdGlvbiBuZXh0IChlcnIsIHJlc3VsdCkge1xuICAgIGlmIChvbmNlICYmIHNlbGYuc2Vzc2lvbiA9PT0gc2Vzc2lvbikge1xuICAgICAgb25jZSA9IGZhbHNlXG4gICAgICBzZWxmLnBlbmRpbmctLVxuICAgICAgaWYgKHRpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgICBkZWxldGUgc2VsZi50aW1lcnNbdGltZW91dElkXVxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKVxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIsIGpvYilcbiAgICAgIH0gZWxzZSBpZiAoZGlkVGltZW91dCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJlc3VsdEluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgc2VsZi5yZXN1bHRzW3Jlc3VsdEluZGV4XSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmVtaXQoJ3N1Y2Nlc3MnLCByZXN1bHQsIGpvYilcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYuc2Vzc2lvbiA9PT0gc2Vzc2lvbikge1xuICAgICAgICBpZiAoc2VsZi5wZW5kaW5nID09PSAwICYmIHNlbGYuam9icy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkb25lLmNhbGwoc2VsZilcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLnJ1bm5pbmcpIHtcbiAgICAgICAgICBzZWxmLnN0YXJ0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpZFRpbWVvdXQgPSB0cnVlXG4gICAgICBpZiAoc2VsZi5saXN0ZW5lcnMoJ3RpbWVvdXQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuZW1pdCgndGltZW91dCcsIG5leHQsIGpvYilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQoKVxuICAgICAgfVxuICAgIH0sIHRoaXMudGltZW91dClcbiAgICB0aGlzLnRpbWVyc1t0aW1lb3V0SWRdID0gdGltZW91dElkXG4gIH1cblxuICBpZiAodGhpcy5yZXN1bHRzKSB7XG4gICAgcmVzdWx0SW5kZXggPSB0aGlzLnJlc3VsdHMubGVuZ3RoXG4gICAgdGhpcy5yZXN1bHRzW3Jlc3VsdEluZGV4XSA9IG51bGxcbiAgfVxuXG4gIHRoaXMucGVuZGluZysrXG4gIHZhciBwcm9taXNlID0gam9iKG5leHQpXG4gIGlmIChwcm9taXNlICYmIHByb21pc2UudGhlbiAmJiB0eXBlb2YgcHJvbWlzZS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIG5leHQobnVsbCwgcmVzdWx0KVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIG5leHQoZXJyIHx8IHRydWUpXG4gICAgfSlcbiAgfVxuXG4gIGlmICh0aGlzLnJ1bm5pbmcgJiYgdGhpcy5qb2JzLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLnN0YXJ0KClcbiAgfVxufVxuXG5RdWV1ZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5ydW5uaW5nID0gZmFsc2Vcbn1cblxuUXVldWUucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgY2xlYXJUaW1lcnMuY2FsbCh0aGlzKVxuICB0aGlzLmpvYnMubGVuZ3RoID0gMFxuICB0aGlzLnBlbmRpbmcgPSAwXG4gIGRvbmUuY2FsbCh0aGlzLCBlcnIpXG59XG5cbmZ1bmN0aW9uIGNsZWFyVGltZXJzICgpIHtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMudGltZXJzKSB7XG4gICAgdmFyIHRpbWVvdXRJZCA9IHRoaXMudGltZXJzW2tleV1cbiAgICBkZWxldGUgdGhpcy50aW1lcnNba2V5XVxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbE9uRXJyb3JPckVuZCAoY2IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHRoaXMub24oJ2Vycm9yJywgb25lcnJvcilcbiAgdGhpcy5vbignZW5kJywgb25lbmQpXG5cbiAgZnVuY3Rpb24gb25lcnJvciAoZXJyKSB7IHNlbGYuZW5kKGVycikgfVxuICBmdW5jdGlvbiBvbmVuZCAoZXJyKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKVxuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKVxuICAgIGNiKGVyciwgdGhpcy5yZXN1bHRzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvbmUgKGVycikge1xuICB0aGlzLnNlc3Npb24rK1xuICB0aGlzLnJ1bm5pbmcgPSBmYWxzZVxuICB0aGlzLmVtaXQoJ2VuZCcsIGVycilcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3F1ZXVlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=