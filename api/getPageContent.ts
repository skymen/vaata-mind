import { VercelRequest, VercelResponse } from '@vercel/node';
import { createNotion } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const notion = createNotion(req);

  const { blockId } = req.body;

  const page = await notion.blocks.children.list({
    block_id: blockId,
  });

  return res.json(page);
};
