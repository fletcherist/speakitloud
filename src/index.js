// @flow

const synth = window.speechSynthesis
const input = document.createElement('textarea')

const button = document.createElement('button')
button.innerText = 'Play'

const ALPHABETS = {
  'ru-RU': {
    unicode: [1072, 1103]
  },

}

const voices = synth.getVoices()
console.log(voices)

input.addEventListener('paste', (event: Event) => {
  console.log(event)
  const text = event.target.value

})

document.body.appendChild(input)
document.body.appendChild(button)

const detectLanguageByWord = (word: String) => {
  const firstCharCode = word.charCodeAt(0)
  for (let alphabet in ALPHABETS) {
    if (firstCharCode >= ALPHABETS[alphabet].unicode[0] &&
        firstCharCode <= ALPHABETS[alphabet].unicode[1]) {
      return alphabet
    }
  }
  return 'en'
}

const joinOneLanguageWords = (sentences: Array) => {
  const newSentences = []
  newSentences.push(sentences[0])
  console.log(sentences)
  for (let i = 1; i < sentences.length; i++) {
    if (sentences[i].language === sentences[i - 1].language) {
      newSentences[i - 1].token = [
        newSentences[newSentences.length - 1].token,
        sentences[i].token
      ].join(' ')
    } else {
      newSentences.push(sentences[i])
    }
  }
  return newSentences
}

button.addEventListener('click', (event) => {
  const text = input.value
  let textTokens = text.split(' ')
  textTokens = textTokens.map((token: String) => ({
    language: detectLanguageByWord(token),
    token: token
  }))

  const speakEvents = joinOneLanguageWords(textTokens).map(
    sentence => {
      const utterThis = new SpeechSynthesisUtterance(sentence.token)
      utterThis.lang = sentence.language
      return utterThis
    }
  )
  console.log(speakEvents)
  speakEvents.forEach(utter => synth.speak(utter))
})
