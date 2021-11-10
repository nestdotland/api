import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const modules: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { author, module: modulename, version } = req.query;

  const limit = Number(query.limit) > 0 && Number(query.limit) <= 100 ? Number(query.limit) : 100;
  const cursor = Number(query.cursor) > 0 ? Number(query.cursor) : 0;

  let { data: Files, error } = await supabase
    .from('DependencyGraph')
    .select('dependencyAuthor, dependencyName, dependencyVersion')
    .eq('dependentAuthor', author)
    .eq('dependentName', modulename)
    .eq('dependentVersion', version)
    .order('dependentName')
    .order('dependentAuthor')
    .range(cursor, cursor + limit - 1);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

  res.status(200);
  res.json({
    options: { limit, cursor },
    results: Files.map(({ dependencyAuthor, dependencyName, dependencyVersion }) => ({
      author: dependencyAuthor,
      module: dependencyName,
      version: dependencyVersion,
    })),
  });
  res.end();
};

export default modules;
