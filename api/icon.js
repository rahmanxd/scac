// api/icon.js - Generate app icon (256x256)
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  const svg = `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="256" height="256" rx="48" fill="url(#grad)"/>
      
      <!-- Icon -->
      <text x="128" y="180" font-size="120" text-anchor="middle" fill="white">📊</text>
    </svg>
  `;

  return res.status(200).send(svg);
}