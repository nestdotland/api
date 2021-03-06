import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', ['maxage=86400', 's-maxage=86400', 'stale-if-error=1']);
  res.status(200);
  res.json({
    docs: 'https://docs.nest.land/api',
  });
  res.end();
};

export default handler;
