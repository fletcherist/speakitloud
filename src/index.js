// @flow

const input = document.querySelector('#input-textarea')
const button = document.querySelector('#button')

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  }
}

class Player {
  isPlaying: boolean = false
  play () { this.isPlaying = true }
  pause () { this.isPlaying = false }
  playPause () { this.isPlaying = !this.isPlaying }
}

class Speaker extends Player {
  synth = window.speechSynthesis
  constructor () {
    super()
    this.synth.onvoicechanged = event => console.log(event)
    this.synth.onvoiceschanged = event => console.log(event)
  }
  speak (utter) {
    this.synth.speak(utter)
    console.log(this.synth)
  }
  pause () { this.synth.pause() }
  resume () { this.synth.resume() }
}

const app = {
  version: '0.0.1',
  getVersion () {
    console.log(this.version)
  },
  player: new Player(),
  speaker: new Speaker()
}

input.addEventListener('paste', (event: Event) => {
  console.log(event)
  const text = event.target.value

})

/*
 * Analyses the first letter in the word
 * Now it can guess between cyrilic and latin letter only
 */
const detectLangByStr = (str: string) => {
  const firstCharCode = str.toLowerCase().charCodeAt(0)
  for (let alphabet in ALPHABET) {
    if (firstCharCode >= ALPHABET[alphabet].unicode[0] &&
        firstCharCode <= ALPHABET[alphabet].unicode[1]) {
      return alphabet
    }
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

const joinOneLanguageWords = (words: Array<Object>) => {
  const sentences = []
  words.forEach(word => {
    if (sentences.length === 0) return sentences.push(word)
    isTheSameLanguage(sentences[sentences.length - 1], word)
      ? sentences[sentences.length - 1].token =
          [sentences[sentences.length - 1].token, word.token].join(' ')
      : sentences.push(word)
  })
  console.log(sentences)
  return sentences
}

const splitTextIntoSentences = (text: string): Array => text.split('.')
const splitSentenceIntoWords = (sentence: string): Array => sentence.split(' ')

const text = input.value
const sentences = splitTextIntoSentences(text)
sentences.forEach(sentence => {
  const textTokens = splitSentenceIntoWords(sentence)
    .map((token: string) => ({
      lang: detectLangByStr(token),
      token: token
    }))

  const speakEvents = joinOneLanguageWords(textTokens).map(
    sentence => {
      const utterThis = new SpeechSynthesisUtterance(sentence.token)
      utterThis.lang = sentence.lang
      utterThis.rate = 1.6
      return utterThis
    }
  )

  speakEvents.forEach(utter => {
    app.speaker.speak(utter)
  })
})

// document.addEventListener('keydown', (event: Event) => {
//   // If space is pressed
//   if (event.keyCode === 32) {
//     app.player.playPause()
//   }
//   console.log(event.keyCode)
// })
// button.addEventListener('click', (event) => {})