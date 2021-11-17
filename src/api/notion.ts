import { Client } from '@notionhq/client';
import { VercelRequest } from '@vercel/node';

export const auth = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

console.log('auth', auth);

// Initializing a client
export const createNotion = (req: VercelRequest) => {
  if (req.headers.token && !Array.isArray(req.headers.token)) {
    return new Client({
      auth: req.headers.token,
    });
  }

  throw new Error('No token provided');
};
