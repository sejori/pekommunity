import { Handler } from "peko"
import { getAccess } from "../utils/auth.ts"

export const subscribe = (bucketName: string): Handler => async (ctx) => {
  const data = await ctx.request.formData()
  const email = data.get("email") as string
  if (!data || !email) return new Response("No 'email' field in request FormData.", { status: 400 })

  const access_creds = await getAccess("https://www.googleapis.com/auth/devstorage.full_control")
  const existingRes = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${email}`, {
    headers: {
      "Authorization": "Bearer " + access_creds.access_token
    }
  })
  const existingData = await existingRes.json()
  if (existingData.id) return new Response(`Email: ${email} is already subscribed! :^)`)

  await fetch(`https://storage.googleapis.com/upload/storage/v1/b/shineponics-mailing-list/o?name=${email}&uploadType=media`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + access_creds.access_token
    }
  })

  return new Response(`Email ${email} has successfully been subscribed. Welcome to the family!`)
}

export const unsubscribe = (bucketName: string): Handler => async (ctx) => {
  const email = new URL(ctx.request.url).searchParams.get("email")
  if (!email) return new Response("No 'email' param in request url.", { status: 400 })

  const access_creds = await getAccess("https://www.googleapis.com/auth/devstorage.full_control")
  await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${email}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + access_creds.access_token
    }
  })

  return new Response(`Email: ${email} has been removed. Farewell traveller, we wish you pleasant surf.`)
}