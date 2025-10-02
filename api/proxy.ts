import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Get the path from query parameter
    const path = req.query.path as string || ''

    // Construct the target URL
    const targetUrl = `https://app.shearstreaming.com/api/v1/${path}`

    // Get environment variables for authentication
    const username = process.env.SHEARSTREAM_USERNAME || ''
    const password = process.env.SHEARSTREAM_PASSWORD || ''

    // Forward the request to the ShearStream API
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add basic auth if credentials are available
    if (username && password) {
      const authString = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${authString}`
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.json()

    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy request failed', message: error instanceof Error ? error.message : 'Unknown error' })
  }
}
