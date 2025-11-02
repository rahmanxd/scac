// api/og-image.js - Generate OG Image (MUST be 3:2 ratio - 1200x800)
export default async function handler(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  // Generate SVG image with 3:2 aspect ratio (1200x800)
  const svg = `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="800" fill="url(#grad)"/>
      
      <!-- Icon -->
      <circle cx="600" cy="280" r="90" fill="white" opacity="0.2"/>
      <text x="600" y="330" font-size="120" text-anchor="middle" fill="white">📊</text>
      
      <!-- Title -->
      <text x="600" y="480" font-size="80" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
        Cast Analyzer
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="560" font-size="36" text-anchor="middle" fill="white" opacity="0.9" font-family="Arial, sans-serif">
        Analyze cast popularity on Farcaster
      </text>
      
      <!-- Bottom text -->
      <text x="600" y="680" font-size="28" text-anchor="middle" fill="white" opacity="0.7" font-family="Arial, sans-serif">
        Likes • Recasts • Replies • Top Likers
      </text>
    </svg>
  `;

  return res.status(200).send(svg);
}