import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const imports: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user: authorName, module: moduleName } = req.query;

  if (!authorName) {
    res.status(400);
    res.end(`parameter "username" is required`);
  } else if (!moduleName) {
    res.status(400);
    res.end(`parameter "module" is required`);
  }

  let { data: Versions, error } = await supabase
    .from('Version')
    .select('name')
    .eq('authorName', authorName)
    .eq('moduleName', moduleName)
    .neq('unlisted', true);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  const names = Versions.map(({ name }: { name: string }) => name);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json(names);
  res.end();
};

export default imports;
