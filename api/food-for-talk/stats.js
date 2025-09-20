// Vercel API route that proxies to Railway
export default async function handler(req, res) {
  const railwayUrl = 'https://webpersonacentric-personacentric.up.railway.app';
  
  try {
    const response = await fetch(`${railwayUrl}/api/food-for-talk/stats`, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
