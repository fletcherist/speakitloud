// @flow
import NoSleep from 'nosleep.js'

const $input = document.querySelector('#input-textarea')
const $button = document.querySelector('#button')

const $incrementSpeedButton = document.querySelector('#increment-speed')
const $decrementSpeedButton = document.querySelector('#decrement-speed')

const $progressBar = document.querySelector('#progress-bar')
const $progressPointer = document.querySelector('#progress-pointer')

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
  currentSpeed: number = 1.1

  speak (utter) {
    if (!utter && !this.currentUtterance) return false
    this.currentUtterance = utter || this.currentUtterance
    this.currentUtterance.rate = this.currentSpeed
    this.play()
    this.synth.speak(this.currentUtterance)
    this.isStopped = false
    console.log(this.synth)
  }
  stop () {
    this.currentUtterance = null
    this.synth.cancel()
    this.isStopped = true
    return false
  }

  setSpeed (value: number) {
    // this.currentUtterance.rate = value
    // this.speak()
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
  incrementSpeed() { this._changeSpeed(0.1) }
  decrementSpeed() { this._changeSpeed(-0.1) }
}

const app = {
  version: '0.0.3',
  getVersion () {
    console.log(this.version)
  },
  reader: {
    tokensCount: 0,
    currentTokenIndex: 0,
    get currentProgress() {
      return this.currentTokenIndex / this.tokensCount
    }
  },
  speaker: new Speaker(),
  noSleep: new NoSleep()
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

  return 'en'
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

const formatText = (text: string) => text.replace(/\–/g, '.')
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
const timeLeftReading = (text: string, speed: number = 1) =>
  countWordsInText(text) / (DEFAULT_WORDS_PER_MINUTE * speed)

const createSpeakEvent = (sentence: wordType): Object => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token)
  utterThis.lang = sentence.lang
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

  console.log('timeLeftReading', timeLeftReading(text, app.speaker.currentSpeed))

  const textTokensArray = sentences.map(sentence => compose(
    filterWordsArray,
    convertWordsIntoTokens,
    splitSentenceIntoWords
  )(sentence))

  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(
    (textTokens: Array<wordType>): Array<Array<Object>> => compose(
      createSpeakEvents,
      joinOneLanguageWords
    )(textTokens))

  const promises = []
  const phrases = concatSpeakEventsSentences(speakEventsSentences)
  app.reader.tokensCount = phrases.length
  phrases.forEach(phrase =>
    promises.push(() => new Promise((resolve, reject) => {
      app.speaker.speak(phrase)
      app.reader.currentTokenIndex = app.reader.currentTokenIndex + 1
      $input.innerHTML = $input.innerText.replace(
        new RegExp(phrase.text),
        `<mark>${phrase.text}</mark>`
      )

      window.pointer = $progressPointer
      $progressPointer.style.transform =
        `translate(${app.reader.currentProgress * $progressBar.clientWidth}px, 0)`

      console.log(app.reader.currentProgress)
      phrase.onend = () => {
        if (app.speaker.isChangingSpeed) {
          app.speaker.isChangingSpeed = false
          return
        }
        if (app.speaker.isStopped) {
          return false
        }
        console.log('phrase endend')
        return resolve(phrase.text)
      }
    }))
  )

  console.time('read')
  serial(promises).then(() => console.timeEnd('read'))
}

$button.addEventListener('click', (event) => {
  console.log('clicked')
  app.noSleep.enable()
  app.speakItLoud()
})

console.log(app.speaker)
window.addEventListener('beforeunload', event => {
  console.log(app.speaker.stop())
})

document.addEventListener('keydown', (event: Event) => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause()
  }
})

$input.focus()
$incrementSpeedButton.addEventListener('click', event => {
  app.speaker.incrementSpeed()
})

$decrementSpeedButton.addEventListener('click', event => {
  app.speaker.decrementSpeed()
})

$input.addEventListener('paste', (event: Event) => {
  event.preventDefault()

  let pastedText = ''
  if (window.clipboardData && window.clipboardData.getData) { // IE
    pastedText = window.clipboardData.getData('Text')
  } else if (event.clipboardData && event.clipboardData.getData) {
    pastedText = event.clipboardData.getData('text/html')
  }

  const hiddenInput = document.createElement('div')
  hiddenInput.innerHTML = pastedText

  const text = hiddenInput.textContent

  $input.innerHTML = text
  console.log(text)
})
