import { VercelRequest, VercelResponse } from '@vercel/node';
import { createNotion } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const notion = createNotion(req);

  const { pageId } = req.body;

  const page = await notion.pages.retrieve({
    page_id: pageId,
  });

  return res.json(page);
};
