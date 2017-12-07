// @flow

const ButtonStyles = `
    color: blue;
    font-size: 34px;
`

type ButtonProps = {
  id?: string,
  label: string,
  styles?: string,
  onClick?: Function
}

export default function Button (props: ButtonProps) {
  const { label, id } = props
  const componentId = Math.random().toString().slice(2)
  return {
    ...props,
    component: `
      <button style="${ButtonStyles}"
        id="${id || componentId}">
        ${label}
      </button>
    `
  }
}
