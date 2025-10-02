import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Get the path from query parameter
    const path = req.query.path as string || ''

    // Construct the target URL
    const targetUrl = `https://production.api.shearstreaming.com/api/v1/${path}`

    // Get Authorization header from client request
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No Authorization header provided'
      })
    }

    // Forward the request to the ShearStream API with client's auth token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader,
    }

    console.log('Proxy request:', { method: req.method, url: targetUrl, hasAuth: !!headers['Authorization'] })

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    })

    console.log('Proxy response:', { status: response.status, statusText: response.statusText })

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      res.status(response.status).json(data)
    } else {
      const text = await response.text()
      console.error('Non-JSON response:', text.substring(0, 200))
      res.status(response.status).send(text)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
