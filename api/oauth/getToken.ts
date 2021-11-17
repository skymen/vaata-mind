import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { auth } from '../../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { code, redirect_uri } = req.body;
  const url = 'https://api.notion.com/v1/oauth/token';

  const basic = Buffer.from(`${auth.clientId}:${auth.clientSecret}`).toString('base64');
  console.log('basic', basic);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basic}`,
    },
    body: `{"grant_type":"authorization_code","code":"${code}","redirect_uri":"${redirect_uri}"}`,
  };

  console.log('options', options);

  try {
    const body = await fetch(url, options);
    const json = await body.json();
    return res.json(json);
  } catch (error: any) {
    return res.json({ error });
  }
};
