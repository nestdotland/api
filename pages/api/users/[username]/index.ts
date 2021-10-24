import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const users: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username } = req.query;

  if (!username) {
    res.status(400);
    res.end(`parameter "module" is required`);
  }

  let { data: Users, error } = await supabase.from('User').select('*').eq('username', username);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  if (Users.length > 1) {
    throw new Error(`Too many users with username: "${username}"`);
  } else if (Users.length < 1) {
    res.status(404);
    res.end(`Not Found`);
  } else {
    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(Users[0]);
    res.end();
  }
};

export default users;
