import { staticHandler } from "peko"
import { emit, bundle } from "emit"

const decoder = new TextDecoder()

export const emitTS = (fileUrl: URL) => staticHandler(fileUrl, {
  transform: async (content) => {
    console.log("Emitting ts file: " + fileUrl.href)

    const result = await emit(fileUrl, {
      load(specifier: string) {
        return Promise.resolve({ kind: 'module', specifier, content: decoder.decode(content) })
      },
    })
    return result[fileUrl.toString()]
  },
  headers: new Headers({ "Content-Type": "application/javascript" })
})

export const emitTSBundle = (fileUrl: URL) => staticHandler(fileUrl, {
  transform: async () => {
    console.log("Emitting ts bundle: " + fileUrl.href)
    const { code } = await bundle(fileUrl)
    return code
  },
  headers: new Headers({ "Content-Type": "application/javascript" })
})