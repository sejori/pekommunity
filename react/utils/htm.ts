import React from "react"
import htm from "htm"
export { 
  renderToString,
  renderToReadableStream 
} from "react-dom/server"

export const html = htm.bind(React.createElement)