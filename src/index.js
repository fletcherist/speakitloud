// @flow

const synth = window.speechSynthesis
const input = document.querySelector('#input-textarea')
const button = document.querySelector('#button')

const ALPHABET = {
  'ru-RU': {
    unicode: [1072, 1103]
  }
}

const voices = synth.getVoices()
console.log(voices)

input.addEventListener('paste', (event: Event) => {
  console.log(event)
  const text = event.target.value

})


const detectLangByWord = (word: string) => {
  const firstCharCode = word.toLowerCase().charCodeAt(0)
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
  console.log(words)
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

const text = input.value

console.log(text)
let textTokens = text.split(' ')
textTokens = textTokens.map((token: string) => ({
  lang: detectLangByWord(token),
  token: token
}))

console.log(joinOneLanguageWords(textTokens))

const speakEvents = joinOneLanguageWords(textTokens).map(
  sentence => {
    const utterThis = new SpeechSynthesisUtterance(sentence.token)
    utterThis.lang = sentence.lang
    utterThis.rate = 1.3
    return utterThis
  }
)

speakEvents.forEach(utter => synth.speak(utter))

// button.addEventListener('click', (event) => {})