// @flow
import Button from './components/button'
import TextArea from './components/text-area'

const APP_STATE = {
  mainTextArea: {
    get text () { return this._text || '' },
    set ['text'](value) {
      this._text = value
      render()
    }
  }
}
window.__codex_covers_state__ = APP_STATE

let HeadlineButton
let MainTextButton
let AttachImageButton
let MainTextArea

const App = () => `
    ${HeadlineButton().component}
    ${MainTextButton().component}
    ${AttachImageButton().component}
    <div>
      <svg xmlns="http://www.w3.org/2000/svg"
           width="500" height="40" viewBox="0 0 500 40">
        ${MainTextArea().component}
      </svg>
    </div>
`

function render () {
  console.log('rerendering', APP_STATE)
  HeadlineButton = Button.bind(null, {
    id: 'headline-button',
    label: 'Headline'
  })

  MainTextButton = Button.bind(null, {
    id: 'main-text-button',
    label: 'Main text'
  })

  AttachImageButton = Button.bind(null, {
    id: 'attach-image-button',
    label: 'Image'
  })

  MainTextArea = TextArea.bind(null, {
    id: 'main-text-area',
    text: APP_STATE.mainTextArea.text
  })
  document.body.innerHTML = App()
}
render()

const attachListener = (
  type: string,
  elementId: string,
  func: Function
) => document.getElementById(elementId).addEventListener(type, func)

const attachClickListener = attachListener.bind(null, 'click')

attachClickListener(HeadlineButton().id, () => console.log('im func'))
attachClickListener(MainTextButton().id, () => console.log('im another func'))
attachClickListener(AttachImageButton().id, () => console.log('im third func'))

attachClickListener(MainTextArea().id, (event: Object) => {
  console.log(event)
})

attachListener('keydown', MainTextArea().id, (event: Object) => {
  console.log(event)
})

window.addEventListener('keydown', (event: Object) => {
  console.log(event)
  const { key } = event
  APP_STATE.mainTextArea.text = APP_STATE.mainTextArea.text + key
})
