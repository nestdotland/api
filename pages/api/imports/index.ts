import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', ['maxage=86400', 's-maxage=86400', 'stale-if-error=1']);
  res.status(200);
  res.json({
    scoped: {
      users: '/imports/x',
      modules: '/imports/x/:user',
      versions: '/imports/x/:user/:module',
      files: '/imports/x/:user/:module/:version',
    },
    vanity: {
      modules: '/imports/-',
      versions: '/imports/-/:module',
      files: '/imports/-/:module/:version',
    },
  });
  res.end();
};

export default handler;
