import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  const limit = Number(query.limit) > 0 && Number(query.limit) <= 100 ? Number(query.limit) : 100;
  const cursor = Number(query.cursor) > 0 ? Number(query.cursor) : 0;

  if (!query.username) {
    res.status(400);
    res.end(`parameter "module" is required`);
  }

  let { data: Users, error: UsersError } = await supabase.from('User').select().eq('username', query.username);
  if (UsersError) throw new Error(`${UsersError.message} (hint: ${UsersError.hint})`);

  if (Users.length < 1) {
    res.status(404);
    res.end(`Not Found`);
  } else {
    let { data: Modules, error } = await supabase
      .from('Module')
      .select('*')
      .eq('authorName', query.username)
      .range(cursor, cursor + limit - 1);

    if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(Modules);
    res.end();
  }
};

export default handler;
