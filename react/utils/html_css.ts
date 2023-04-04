import React from "react"
import htm from "htm"
export { 
  renderToString,
  renderToReadableStream 
} from "react-dom/server"

export const html = htm.bind(React.createElement)

export const accumulatedStyles = ""
export const css = (input: TemplateStringsArray) => {
  const string = String(input)
  accumulatedStyles.concat(string)
  return string
}