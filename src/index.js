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

class Player {
  isPlaying: boolean = false
  play () { this.isPlaying = true }
  pause () { this.isPlaying = false }
  playPause () { this.isPlaying = !this.isPlaying }
}

class Speaker extends Player {
  synth = window.speechSynthesis
  currentUtterance: Object
  constructor () {
    super()
    this.synth.onvoicechanged = event => console.log(event)
    this.synth.onvoiceschanged = event => console.log(event)
  }
  speak (utter) {
    this.currentUtterance = utter || this.currentUtterance
    this.currentUtterance.rate = this.currentUtterance.rate + 0.1
    this.synth.speak(this.currentUtterance)
    console.log(this.synth)
  }
  pause () { this.synth.pause() }
  resume () { this.synth.resume() }
  setSpeed (value: number) {
    // this.currentUtterance.rate = value
    // this.speak()
  }
}

const app = {
  version: '0.0.1',
  getVersion () {
    console.log(this.version)
  },
  player: new Player(),
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

const joinOneLanguageWords = (words: Array<wordType>) => {
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

const text = input.value.trim()
const sentences = splitTextIntoSentences(text)
sentences.forEach(sentence => {
  let textTokens = compose(
    filterWordsArray,
    convertWordsIntoTokens,
    splitSentenceIntoWords
  )(text)
  console.log(textTokens)

  const speakEvents = joinOneLanguageWords(textTokens).map(
    sentence => {
      const utterThis = new SpeechSynthesisUtterance(sentence.token)
      utterThis.lang = sentence.lang
      utterThis.rate = 1.9
      return utterThis
    }
  )

  speakEvents.forEach(utter => {
    app.speaker.speak(utter)
  })
})

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
// button.addEventListener('click', (event) => {})

// input.addEventListener('paste', (event: Event) => {
//   console.log(event)
//   const text = event.target.value
// })