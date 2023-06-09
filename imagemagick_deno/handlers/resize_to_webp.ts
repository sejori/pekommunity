import { RequestContext, staticHandler } from "peko"
import {
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
} from "imagemagick_deno"

await initializeImageMagick()

export const resizableImage =  (fileUrl: URL, resolutionMap: Map<string, number>) => async (ctx: RequestContext) => {
  const params = new URL(ctx.request.url).searchParams
  const res = resolutionMap.get(params.get("res") || "")

  return await staticHandler(fileUrl, {
    transform: (contents) => {
      if (!res) return contents
      console.log("Resizing " + fileUrl + " to res: " + res)
      
      return new Promise(resolve => ImageMagick.read(contents, (img) => {
        img.resize(res, res)
        img.write(data => resolve(new Uint8Array(data)), MagickFormat.Webp)
      }))
    },
    headers: res 
      ? new Headers({
        "Content-Type": "image/webp"
      }) 
      : new Headers()
  })(ctx)
}