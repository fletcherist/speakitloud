// @flow

type TextAreaProps = {
  id?: string,
  text?: string
}

export default function TextArea (props: TextAreaProps) {
  const {
    id,
    text
  } = props
  const componentId = Math.random().toString().slice(2)
  return {
    ...props,
    component: `
      <text x="0" y="35" font-family="Verdana" font-size="35"
        id="${id || componentId}">
        ${text || ''}
      </text>
    `
  }
}
