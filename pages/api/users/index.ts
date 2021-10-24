import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const users: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  const limit = Number(query.limit) > 0 && Number(query.limit) <= 100 ? Number(query.limit) : 100;
  const cursor = Number(query.cursor) > 0 ? Number(query.cursor) : 0;
  const search = query.search ?? null;

  let { data: Users, error } = await supabase
    .from('User')
    .select('*')
    .order('username')
    .ilike('username', `%${search || ''}%`)
    .range(cursor, cursor + limit - 1);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json({ options: { limit, cursor, search }, results: Users });
  res.end();
};

export default users;
