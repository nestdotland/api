import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const imports: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.query;

  if (!user) {
    res.status(400);
    res.end(`parameter "username" is required`);
  }

  let { data: Modules, error } = await supabase
    .from('Module')
    .select('name')
    .eq('authorName', user)
    .neq('private', true)
    .neq('unlisted', true);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  const names = Modules.map(({ name }: { name: string }) => name);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json(names);
  res.end();
};

export default imports;
