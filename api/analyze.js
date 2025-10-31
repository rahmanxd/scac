// api/analyze.js - Analyze user connections
import fetch from 'node-fetch';

// Fetch user data from Neynar
async function getUserData(fid) {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        api_key: process.env.NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Neynar API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users[0];
}

// Fetch following list
async function getUserFollowing(fid, limit = 100) {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=${limit}`,
    {
      headers: {
        api_key: process.env.NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Neynar API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users || [];
}

// Fetch followers list
async function getUserFollowers(fid, limit = 100) {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=${limit}`,
    {
      headers: {
        api_key: process.env.NEYNAR_API_KEY,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Neynar API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users || [];
}

// Find mutual following (comparing with popular users)
async function findMutualFollowing(userFollowing) {
  // Get some popular Farcaster users to compare with
  const popularFids = [3, 2, 1, 99, 576]; // dwr, v, farcaster, jessepollak, etc
  
  const userFids = new Set(userFollowing.map(u => u.fid));
  const mutuals = [];
  
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${popularFids.join(',')}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      data.users.forEach(user => {
        if (userFids.has(user.fid)) {
          mutuals.push(user);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching popular users:', error);
  }
  
  return mutuals;
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
    const { fid } = req.body;

    if (!fid) {
      return res.status(400).json({ error: 'FID is required' });
    }

    console.log(`Analyzing connections for FID: ${fid}`);

    // Fetch user data
    const userData = await getUserData(fid);
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch following and followers
    const [following, followers] = await Promise.all([
      getUserFollowing(fid, 150),
      getUserFollowers(fid, 50),
    ]);

    // Find mutual following with popular users
    const mutualFollowing = await findMutualFollowing(following);

    // Prepare response
    const result = {
      user: {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
      },
      followersCount: userData.follower_count || followers.length,
      followingCount: userData.following_count || following.length,
      mutualFollowing: mutualFollowing.map(u => ({
        fid: u.fid,
        username: u.username,
        displayName: u.display_name,
        pfpUrl: u.pfp_url,
      })),
      topFollowing: following.slice(0, 20).map(u => ({
        fid: u.fid,
        username: u.username,
        displayName: u.display_name,
        pfpUrl: u.pfp_url,
      })),
    };

    console.log(`Analysis complete for ${userData.username}`);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze connections',
      message: error.message,
    });
  }
}