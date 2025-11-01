// api/splash.js - Generate splash screen (1200x630)
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#grad)"/>
      
      <!-- Icon -->
      <circle cx="600" cy="220" r="80" fill="white" opacity="0.2"/>
      <text x="600" y="260" font-size="100" text-anchor="middle" fill="white">📊</text>
      
      <!-- Title -->
      <text x="600" y="380" font-size="72" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
        Cast Analyzer
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="450" font-size="32" text-anchor="middle" fill="white" opacity="0.9" font-family="Arial, sans-serif">
        Loading...
      </text>
    </svg>
  `;

  return res.status(200).send(svg);
}