import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const modules: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  const limit = Number(query.limit) > 0 && Number(query.limit) <= 100 ? Number(query.limit) : 100;
  const cursor = Number(query.cursor) > 0 ? Number(query.cursor) : 0;
  const search = query.search ?? null;

  let { data: Modules, error } = await supabase
    .from('Module')
    .select('*')
    .ilike('name', `%${search || ''}%`)
    .range(cursor, cursor + limit - 1);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json({ limit, cursor, search, modules: Modules });
  res.end();
};

export default modules;
