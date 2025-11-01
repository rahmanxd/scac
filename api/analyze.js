// api/analyze.js - Analyze cast with Neynar FREE endpoints
import fetch from 'node-fetch';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE = 'https://api.neynar.com/v2/farcaster';

// Get cast details by hash (FREE)
async function getCastByHash(castHash) {
  const response = await fetch(
    `${NEYNAR_BASE}/cast?identifier=${castHash}&type=hash`,
    {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cast: ${response.status}`);
  }
  
  const data = await response.json();
  return data.cast;
}

// Get cast reactions (FREE)
async function getCastReactions(castHash) {
  const response = await fetch(
    `${NEYNAR_BASE}/cast/reactions?hash=${castHash}&limit=50`,
    {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch reactions: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

// Get user details in bulk (FREE)
async function getUsersBulk(fids) {
  if (!fids || fids.length === 0) {
    return [];
  }

  const response = await fetch(
    `${NEYNAR_BASE}/user/bulk?fids=${fids.join(',')}`,
    {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { castHash } = req.body;

    if (!castHash) {
      return res.status(400).json({ 
        error: 'Cast hash is required',
        message: 'This Mini App must be run from a cast reply.' 
      });
    }

    console.log(`Analyzing cast: ${castHash}`);

    // Get cast details
    const cast = await getCastByHash(castHash);
    
    if (!cast) {
      return res.status(404).json({ 
        error: 'Cast not found',
        message: 'Cast not found or has been deleted.'
      });
    }

    // Get reactions
    const reactions = await getCastReactions(castHash);

    // Extract stats from cast
    const stats = {
      likes: cast.reactions?.likes_count || 0,
      recasts: cast.reactions?.recasts_count || 0,
      replies: cast.replies?.count || 0,
      watches: cast.reactions?.watches_count || 0,
    };

    // Get top likers (first 5)
    let topLikers = [];
    if (reactions.likes && reactions.likes.length > 0) {
      const likerFids = reactions.likes
        .slice(0, 5)
        .map(like => like.user.fid);
      
      topLikers = await getUsersBulk(likerFids);
    }

    // Get top recasters (first 5)
    let topRecasters = [];
    if (reactions.recasts && reactions.recasts.length > 0) {
      const recasterFids = reactions.recasts
        .slice(0, 5)
        .map(recast => recast.user.fid);
      
      topRecasters = await getUsersBulk(recasterFids);
    }

    // Prepare response
    const result = {
      cast: {
        hash: cast.hash,
        text: cast.text,
        timestamp: cast.timestamp,
        author: {
          fid: cast.author.fid,
          username: cast.author.username,
          display_name: cast.author.display_name,
          pfp_url: cast.author.pfp_url,
        },
        embeds: cast.embeds || [],
      },
      stats: stats,
      topLikers: topLikers.map(user => ({
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        follower_count: user.follower_count,
      })),
      topRecasters: topRecasters.map(user => ({
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        follower_count: user.follower_count,
      })),
      totalLikes: reactions.likes?.length || 0,
      totalRecasts: reactions.recasts?.length || 0,
    };

    console.log(`Analysis complete for cast by @${cast.author.username}`);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Return user-friendly error
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Failed to analyze cast. Please try again.',
    });
  }
}