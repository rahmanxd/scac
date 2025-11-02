// api/splash.js - Generate splash screen (MUST be 200x200)
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  // 200x200 splash screen
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="200" height="200" fill="url(#grad)"/>
      
      <!-- Icon -->
      <circle cx="100" cy="70" r="25" fill="white" opacity="0.2"/>
      <text x="100" y="90" font-size="40" text-anchor="middle" fill="white">📊</text>
      
      <!-- Text -->
      <text x="100" y="140" font-size="18" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
        Cast Analyzer
      </text>
      
      <text x="100" y="165" font-size="12" text-anchor="middle" fill="white" opacity="0.9" font-family="Arial, sans-serif">
        Loading...
      </text>
    </svg>
  `;

  return res.status(200).send(svg);
}