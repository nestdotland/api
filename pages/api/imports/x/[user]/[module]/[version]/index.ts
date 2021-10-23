import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user: authorName, module: moduleName, version: versionName } = req.query;

  if (!authorName) {
    res.status(400);
    res.end(`parameter "username" is required`);
  } else if (!moduleName) {
    res.status(400);
    res.end(`parameter "module" is required`);
  } else if (!versionName) {
    res.status(400);
    res.end(`parameter "version" is required`);
  }

  let { data: Files, error } = await supabase
    .from('File')
    .select('path')
    .eq('authorName', authorName)
    .eq('moduleName', moduleName)
    .eq('versionName', versionName);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  const paths = Files.map(({ path }: { path: string }) => path);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json(paths);
  res.end();
};

export default handler;
