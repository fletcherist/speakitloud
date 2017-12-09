// @flow

const input = document.querySelector('#input-textarea')
const button = document.querySelector('#button')

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  }
}

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
  // constructor () {
  //   super()
  //   this.synth.onvoicechanged = event => console.log(event)
  //   this.synth.onvoiceschanged = event => console.log(event)
  // }
  speak (utter) {
    this.currentUtterance = utter || this.currentUtterance
    this.currentUtterance.rate = this.currentUtterance.rate + 0.1
    this.synth.speak(this.currentUtterance)
    console.log(this.synth)
  }
  stop () { this.synth.calcel() }
  setSpeed (value: number) {
    // this.currentUtterance.rate = value
    // this.speak()
  }
  play () {
    this.isSpeaking = true
    this.synth.resume()
  }
  pause () {
    this.isSpeaking = false
    this.synth.pause()
  }
  playPause () {
    this.isSpeaking = !this.isSpeaking
    this.isSpeaking ? this.synth.pause() : this.synth.resume()
  }
}

const app = {
  version: '0.0.2',
  getVersion () {
    console.log(this.version)
  },
  speaker: new Speaker()
}

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

type wordType = {
  lang: string,
  token: string
}

const isTheSameLanguage = (
  word1: wordType,
  word2: wordType
) => word1.lang === word2.lang

const joinOneLanguageWords = (words: Array<wordType>): Array<wordType> => {
  const sentences = []
  words.forEach(word => {
    if (sentences.length === 0) return sentences.push(word)
    isTheSameLanguage(sentences[sentences.length - 1], word)
      ? sentences[sentences.length - 1].token =
          [sentences[sentences.length - 1].token, word.token].join(' ')
      : sentences.push(word)
  })
  return sentences
}

const splitTextIntoSentences = (text: string): Array<string> => text.split('.')
const splitSentenceIntoWords = (sentence: string): Array<string> => sentence.split(' ')
const convertWordsIntoTokens = (words: Array<string>): Array<wordType> =>
  words.map((token: string) => ({
    lang: detectLangByStr(token),
    token: token
  }))
const filterWordsArray = (words: Array<wordType>) =>
  words.filter(word => word.token.length !== 0)

const createSpeakEvent = (sentence: wordType): Object => {
  const utterThis = new SpeechSynthesisUtterance(sentence.token)
  utterThis.lang = sentence.lang
  utterThis.rate = 1.9
  return utterThis
}

const createSpeakEvents = (parts: Array<wordType>): Array<Object> =>
  parts.map(createSpeakEvent)

const transformSpeakEventsIntoCallbacks = (speakEvents: Array<Object>) =>
  speakEvents.map(speakEvent => () => new Promise(resolve => {
    // speakEvent.onEnd = resolve(() => )
  }))

const concatSpeakEventsSentences =
  (speakEventsSentences: Array<Array<Object>>): Array<Object> =>
    speakEventsSentences.reduce((a, b) => a.concat(b), [])

function speakItLoud () {
  const text = input.value.trim()
  const sentences = splitTextIntoSentences(text)
  const textTokensArray = sentences.map(sentence => compose(
    filterWordsArray,
    convertWordsIntoTokens,
    splitSentenceIntoWords
  )(sentence))

  // const logAndContinue = (args) => { console.log(args); return args }
  const speakEventsSentences = textTokensArray.map(
    (textTokens: Array<wordType>): Array<Array<Object>> => compose(
      // transformSpeakEventsIntoPromises,
      createSpeakEvents,
      joinOneLanguageWords
    )(textTokens))

  const promises = []
  concatSpeakEventsSentences(speakEventsSentences).forEach(phrase =>
    promises.push(() => new Promise((resolve, reject) => {
      app.speaker.speak(phrase)
      console.log(phrase)
      phrase.onend = () => {
        console.log(phrase.text)
        resolve(phrase.text)
      }
    }))
  )

  serial(promises).then(console.log)
}

button.addEventListener('click', (event) => {
  console.log('clicked')
  speakItLoud()
})

console.log(app.speaker)
// window.addEventListener('beforeunload', event => {
//   console.log(app.speaker.pause())
// })

document.addEventListener('keydown', (event: Event) => {
  // If space is pressed
  if (event.keyCode === 32) {
    app.speaker.playPause()
  }
})

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })