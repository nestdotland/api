import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const modules: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { author, module: modulename, version } = req.query;

  const limit = Number(query.limit) > 0 && Number(query.limit) <= 100 ? Number(query.limit) : 100;
  const cursor = Number(query.cursor) > 0 ? Number(query.cursor) : 0;
  const search = query.search ?? null;

  let { data: Files, error } = await supabase
    .from('File')
    .select('*')
    .eq('authorName', author)
    .eq('moduleName', modulename)
    .eq('versionName', version)
    .order('path')
    .ilike('path', `%${search || ''}%`)
    .range(cursor, cursor + limit - 1);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json({ options: { limit, cursor, search }, results: Files });
  res.end();
};

export default modules;
