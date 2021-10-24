import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const modules: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { author, module: modulename, version } = req.query;

  if (!author) {
    res.status(400);
    res.end(`parameter "author" is required`);
  } else if (!modulename) {
    res.status(400);
    res.end(`parameter "module" is required`);
  } else if (!version) {
    res.status(400);
    res.end(`parameter "version" is required`);
  }

  let { data: Versions, error } = await supabase
    .from('Version')
    .select('*')
    .eq('authorName', author)
    .eq('moduleName', modulename)
    .eq('name', version);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  if (Versions.length > 1) {
    throw new Error(`Too many versions with author/module@version: "${author}/${modulename}@${version}"`);
  } else if (Versions.length < 1) {
    res.status(404);
    res.end(`Not Found`);
  } else {
    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(Versions[0]);
    res.end();
  }
};

export default modules;
