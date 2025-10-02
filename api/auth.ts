import type { VercelRequest, VercelResponse } from '@vercel/node'

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Get a fresh OAuth access token from Keycloak
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const username = process.env.SHEARSTREAM_USERNAME
  const password = process.env.SHEARSTREAM_PASSWORD

  if (!username || !password) {
    throw new Error('SHEARSTREAM_USERNAME and SHEARSTREAM_PASSWORD must be configured')
  }

  // Request new token from Keycloak
  const tokenUrl = 'https://shield.shearfrac.com/realms/sfg/protocol/openid-connect/token'

  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: 'production-shearstreamweb-9836353444ef91f9ac6f5f3b842b860a',
    username,
    password,
    scope: 'openid organization email profile',
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OAuth authentication failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const accessToken = data.access_token
  const expiresIn = data.expires_in || 3600 // Default to 1 hour

  // Cache the token (expire 5 minutes early to be safe)
  cachedToken = {
    token: accessToken,
    expiresAt: Date.now() + (expiresIn - 300) * 1000,
  }

  return accessToken
}

/**
 * API endpoint to get current access token (for debugging)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getAccessToken()
    res.status(200).json({
      success: true,
      tokenLength: token.length,
      expiresAt: cachedToken?.expiresAt,
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

// Export the getAccessToken function for use in other API routes
export { getAccessToken }
