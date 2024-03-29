import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const imports: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { data: Users, error } = await supabase.from('User').select('username');

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  if (Users.length < 1) {
    throw new Error(`No users found`);
  } else {
    const usernames = Users.map(({ username }: { username: string }) => username).sort();

    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(usernames);
    res.end();
  }
};

export default imports;
