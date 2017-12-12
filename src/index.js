// @flow
import NoSleep from 'nosleep.js'

const $input = document.querySelector('#input-textarea')
const $initialText = document.querySelector('#initial-text')
const $button = document.querySelector('#button')

const $incrementSpeedButton = document.querySelector('#increment-speed')
const $decrementSpeedButton = document.querySelector('#decrement-speed')

const $progressBar = document.querySelector('#progress-bar')
const $progressPointer = document.querySelector('#progress-pointer')

const $timeLeft = document.querySelector('#time-left')

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  },
  'number': {
    unicode: [48, 57]
  }
}

// when speaking speed is 1
const DEFAULT_WORDS_PER_MINUTE = 117.6
const MIN_SPEED = 0.52
const DEFAULT_LANGUAGE = 'en-US'

// fp composition & pipe helpers
const pipe = (fn, ...fns) => (...args) => fns.reduce((result, fn) => fn(result), fn(...args))
const compose = (...fns) => (...args) => pipe(...fns.reverse())(...args)

const concat = list => Array.prototype.concat.bind(list)
const promiseConcat = f => x => f().then(concat(x))
const promiseReduce = (acc, x) => acc.then(promiseConcat(x))
/*
 * serial executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]))

class Speaker {
  synth = window.speechSynthesis
  currentUtterance: Object
  isSpeaking: boolean = false
  isChangingSpeed: boolean = false
  isStopped: boolean = false
  currentSpeed: number = 1.2

  constructor() {
    // this.synth.cancel()
  }

  speak(utter) {
    if (!utter && !this.currentUtterance) return false
    if (!utter) {
      console.error('Empty utter text')
      return false
    }
    this.currentUtterance = utter || this.currentUtterance
    if (this.synth.speaking) {
      console.error(`can't speak ${utter}. Already speaking`)
      this.synth.cancel()
      this.speak(utter)
      return false
    }
    this.currentUtterance.rate = this.currentSpeed
    // if (this.isStopped) this.play()

    console.log(this.synth)
    this.synth.speak(this.currentUtterance)
    console.log(this.synth)
    window.synth = this.synth
    this.isStopped = false
  }
  stop() {
    this.currentUtterance = null
    this.synth.cancel()
    this.isStopped = true
    return false
  }
  play() {
    this.isStopped = true
    this.synth.resume()
  }
  pause() {
    this.isStopped = false
    this.synth.pause()
  }
  playPause() {
    this.isStopped = !this.isStopped
    this.isStopped ? this.synth.pause() : this.synth.resume()
  }
  _changeSpeed(delta: number) {
    this.synth.cancel()
    this.currentSpeed = delta > 0
      ? this.currentSpeed + delta
      : this.currentSpeed <= MIN_SPEED ? MIN_SPEED : this.currentSpeed + delta
    this.isChangingSpeed = true
    this.speak()
    console.log(this.currentSpeed)
  }
  incrementSpeed() { this._changeSpeed(0.2) }
  decrementSpeed() { this._changeSpeed(-0.2) }
}

const app = {
  version: '0.0.4',
  getVersion() {
    console.log(this.version)
  },
  reader: {
    tokensCount: 0,
    currentTokenIndex: 0,
    textReadingDuration: 0,
    get currentProgress() {
      return this.currentTokenIndex / this.tokensCount
    },
    get timeLeftReading() {
      return this.textReadingDuration -
        (this.textReadingDuration * this.currentProgress)
    }
  },
  speaker: new Speaker(),
  noSleep: new NoSleep(),
  dom: {
    updateProgressBar(progress: number) {
      $progressPointer.style.transform =
        `translate(${progress * $progressBar.clientWidth - 16}px, 0)`
    },
    updateTimeLeft() {
      /* calculates time left reading */
      $timeLeft.innerText = `${app.reader.timeLeftReading.toFixed(1)} min`
    },
    highlightCurrentSentence(text: string) {
      $input.querySelector(`#token-${app.reader.currentTokenIndex}`)
        .classList.add('token--highlighted')
      /* Remove highlight from previous token */
      if (app.reader.currentTokenIndex > 0) {
        $input.querySelector(`#token-${app.reader.currentTokenIndex - 1}`)
          .classList.remove('token--highlighted')
      }
    }
  }
}
window.app = app

/*
 * Analyses the first letter in the word
 * Now it can guess between cyrilic and latin letter only
 */
const detectLangByStr = (str: string) => {
  let currentCharIndex = 0
  let maxCharIndex = 3

  while (currentCharIndex <= maxCharIndex) {
    const charCode = str.toLowerCase().charCodeAt(currentCharIndex)
    for (let alphabet in ALPHABET) {
      if (charCode >= ALPHABET[alphabet].unicode[0] &&
          charCode <= ALPHABET[alphabet].unicode[1]) {
        return alphabet
      }
    }
    currentCharIndex++
  }

  return DEFAULT_LANGUAGE
}

/*
 * If the words are in the same language, returns truw
 * If one of the words is number, returns true
 * Otherwise, returns false
 */
type wordType = {
  lang: string,
  token: string
}
const isTheSameLanguage = (
  word1: wordType,
  word2: wordType
) => word1.lang === word2.lang ||
  [word1.lang, word2.lang].includes('number')

const joinOneLanguageWords = (words: Array<wordType>): Array<wordType> => {
  const sentences = []
  words.forEach(word => {
    if (sentences.length === 0) return sentences.push(word)
    const previousWord = sentences[sentences.length - 1]
    isTheSameLanguage(previousWord, word)
      ? sentences[sentences.length - 1].token =
          [sentences[sentences.length - 1].token, word.token].join(' ')
      : sentences.push(word)
  })
  return sentences
}

const formatText = (text: string) => text.replace(/\–/g, '.').replace(/—/g, ';')
const splitTextIntoSentences = (text: string): Array<string> => text.split('.')
const splitSentenceIntoWords = (sentence: string): Array<string> => sentence.split(' ')
const countWordsInText = (text: string) => splitSentenceIntoWords(text).length
const convertWordsIntoTokens = (words: Array<string>): Array<wordType> =>
  words.map((token: string) => ({
    lang: detectLangByStr(token),
    token: token
  }))
const filterWordsArray = (words: Array<wordType>) =>
  words.filter(word => word.token.length !== 0)

/*
 * A Medium-like function calculates time left reading
 */
const getTextReadingDuration = (text: string, speed: number = 1) =>
  countWordsInText(text) / (DEFAULT_WORDS_PER_MINUTE * speed)

const createSpeakEvent = (sentence: wordType): Object => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token)
  utterThis.lang = sentence.lang || DEFAULT_LANGUAGE
  utterThis.rate = 1.9
  return utterThis
}

const createSpeakEvents = (parts: Array<wordType>): Array<Object> =>
  parts.map(createSpeakEvent)

const concatSpeakEventsSentences =
  (speakEventsSentences: Array<Array<Object>>): Array<Object> =>
    speakEventsSentences.reduce((a, b) => a.concat(b), [])

app.speakItLoud = () => {
  const text = formatText($input.innerText.trim())
  const sentences = splitTextIntoSentences(text)
  console.log(sentences)

  app.reader.textReadingDuration = getTextReadingDuration(text, app.speaker.currentSpeed)

  const textTokensArray = sentences.map(sentence => compose(
    filterWordsArray,
    convertWordsIntoTokens,
    splitSentenceIntoWords
  )(sentence))

  console.log(textTokensArray)
  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(
    (textTokens: Array<wordType>): Array<Array<Object>> => compose(
      createSpeakEvents,
      joinOneLanguageWords
    )(textTokens))

  const promises = []
  const phrases = concatSpeakEventsSentences(speakEventsSentences)
  console.log(phrases)
  app.reader.tokensCount = phrases.length
  phrases.forEach(phrase =>
    promises.push(() => new Promise((resolve, reject) => {

      app.speaker.speak(phrase)
      // app.dom.highlightCurrentSentence(phrase.text)

      app.reader.currentTokenIndex = app.reader.currentTokenIndex + 1
      app.dom.updateProgressBar(app.reader.currentProgress)
      app.dom.updateTimeLeft()

      phrase.onend = () => {
        if (app.speaker.isChangingSpeed) {
          app.speaker.isChangingSpeed = false
          return
        }
        if (app.speaker.isStopped) {
          return false
        }
        return resolve(phrase.text)
      }
    }))
  )

  serial(promises).then(console.log)
}

/*
 * Triggers when «speak» button is pressed
 */

app.noSleep.enable()
$button.addEventListener('click', (event) => {
  console.log('clicked')
  app.speakItLoud()
})

/*
 * Triggers when user is trying to refresh/close app
 */
window.addEventListener('beforeunload', event => {
  console.log(app.speaker.stop())
})

document.addEventListener('keydown', (event: Event) => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause()
  }

  if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
    app.speakItLoud()
  }
})

$input.focus()

$initialText.focus()


$incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed()
})

$decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed()
})

$input.addEventListener('click', (event: Event) => {
  $initialText.remove()
  // TODO: start from the selected sentence (token)
  console.log(event)
})

$input.addEventListener('keydown', (event: Event) => {
  $initialText.remove()
})

$input.classList.add('input-textarea--initial')
$input.addEventListener('paste', (event: Event) => {
  $initialText.remove()
  $input.classList.remove('input-textarea--initial')
  event.preventDefault()

  let pastedText = ''
  const clipboardData = event.clipboardData ||
    window.clipboardData || event.originalEvent.clipboardData

  pastedText = clipboardData.getData('Text')

  const hiddenInput = document.createElement('div')
  hiddenInput.innerHTML = pastedText

  const text = hiddenInput.textContent
  const sentences = splitTextIntoSentences(text)
  console.log(sentences)
  sentences.forEach((sentence, index) => {
    const divToken = document.createElement('span')
    divToken.innerText = sentence + '.'
    divToken.id = `token-${index}`
    divToken.classList.add('token')
    divToken.setAttribute('spellcheck', 'false')
    $input.appendChild(divToken)
  })
  // $input.innerHTML = text
  console.log(text)
})
