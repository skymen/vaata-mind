import { VercelRequest, VercelResponse } from '@vercel/node';
import { createNotion } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const notion = createNotion(req);

  const args: Parameters<typeof notion.search>['0'] = {};

  if (req.body.startCursor) {
    args.start_cursor = req.body.startCursor;
  }

  const search = await notion.search(args);

  return res.json(search);
};
