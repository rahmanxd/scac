// api/icon.js - Generate app icon (MUST be 1024x1024 PNG without alpha)
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  // 1024x1024 icon (will be converted to PNG by browser/client)
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background (no transparency - solid color) -->
      <rect width="1024" height="1024" rx="180" fill="url(#grad)"/>
      
      <!-- Icon -->
      <circle cx="512" cy="400" r="120" fill="white" opacity="0.2"/>
      <text x="512" y="480" font-size="240" text-anchor="middle" fill="white">📊</text>
      
      <!-- Text -->
      <text x="512" y="720" font-size="72" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
        CAST
      </text>
      <text x="512" y="810" font-size="60" text-anchor="middle" fill="white" opacity="0.9" font-family="Arial, sans-serif">
        ANALYZER
      </text>
    </svg>
  `;

  return res.status(200).send(svg);
}