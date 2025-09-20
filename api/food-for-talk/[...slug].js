// Vercel API route that proxies all Food for Talk requests to Railway
export default async function handler(req, res) {
  const railwayUrl = 'https://webpersonacentric-personacentric.up.railway.app';
  const { slug } = req.query;
  
  // Reconstruct the path
  const path = Array.isArray(slug) ? slug.join('/') : slug || '';
  const targetUrl = `${railwayUrl}/api/food-for-talk/${path}`;
  
  console.log(`Proxying ${req.method} request to: ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    
    console.log(`Response status: ${response.status}`);
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
