import { Crypto } from "peko"

let gcloud: Record<string, string>
if (Deno.env.get("DENO_REGION")) {
  const {
    gcp_private_key,
    gcp_client_email
  } = Deno.env.toObject()
  gcloud = { 
    private_key: gcp_private_key,
    client_email: gcp_client_email
  }
} else {
  gcloud = (await import(new URL(`../keys/gcp.json`, import.meta.url).pathname, {
    assert: { type: "json" },
  })).default
}

const gCrypto = new Crypto(gcloud.private_key, { name: "RSA", hash: "SHA-256" })
const access_creds: Record<string, { access_token: '', dob: 0, expires_in: 0 }> = {}

export const getAccess = async (scope: string) => {
  if (access_creds[scope]?.access_token && Date.now() < access_creds[scope]?.dob + access_creds[scope]?.expires_in * 1000) {
    return access_creds
  }

  const service_payload = {
    "iss": gcloud.client_email,
    "scope": scope,
    "aud": "https://oauth2.googleapis.com/token",
    "exp": Date.now()/1000 + 3600,
    "iat": Date.now()/1000
  }

  service_payload.exp = Date.now()/1000 + 3600
  service_payload.iat = Date.now()/1000

  const service_jwt = await gCrypto.sign(service_payload)

  const access_response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: JSON.stringify({
      "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
      "assertion": service_jwt
    })
  })

  access_creds[scope] = await access_response.json()

  return access_creds[scope]
}