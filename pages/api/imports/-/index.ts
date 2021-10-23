import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { data: VanityModules, error } = await supabase.from('VanityModule').select('name');

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  const modules = VanityModules.map(({ name }: { name: string }) => name).sort();

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json(modules);
  res.end();
};

export default handler;
