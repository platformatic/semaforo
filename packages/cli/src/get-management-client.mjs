import * as dotenv from 'dotenv'
import { mkdirp } from 'mkdirp'
import { request } from 'undici'
import { createVerifier } from 'fast-jwt'
import buildGetJwks from 'get-jwks'
import findCacheDirectory from 'find-cache-dir'
import { join } from 'path'
import { readFile, writeFile, access } from 'fs/promises'
import https from 'https'
import { ManagementClient } from 'auth0'

dotenv.config()

const cacheFolder = findCacheDirectory({ name: 'semaforo' })
await mkdirp(cacheFolder)

const getJwks = buildGetJwks({
  max: 100,
  ttl: 60 * 1000,
  allowedDomains: [`https://${process.env.AUTH0_DOMAIN}`],
  providerDiscovery: false,
  agent: new https.Agent({
    keepAlive: true
  })
})

const getNewToken = async () => {
  const tokenResponseData = await request(`https://${process.env.AUTH0_DOMAIN}/oauth/token`
    , {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  const oauthData = await tokenResponseData.body.json()
  const token = oauthData.access_token
  return token
}

const getToken = async () => {
  // Check if the token is cached
  const cachePath = join(cacheFolder, 'token')
  let cacheExists = false
  try {
    await access(cachePath)
    cacheExists = true
  } catch (error) {
    // on purpose
  }

  if (cacheExists) {
    const token = await readFile(cachePath, 'utf8')
    const verifier = createVerifier({
      key: async function (token) {
        const publicKey = await getJwks.getPublicKey({
          kid: token.kid,
          alg: token.alg,
          domain: `https://${process.env.AUTH0_DOMAIN}`
        })
        return publicKey
      }
    })

    try {
      await verifier(token)
      return token
    } catch (err) {
      const token = await getNewToken()
      await writeFile(cachePath, token, 'utf8')
      return token
    }
  }
  // Token is not cached, get a new one
  const token = await getNewToken()
  await writeFile(cachePath, token, 'utf8')
  return token
}

const getManagementClient = async () => {
  const token = await getToken()
  const management = new ManagementClient({
    token,
    domain: process.env.AUTH0_DOMAIN
  })
  return management
}

export default getManagementClient
