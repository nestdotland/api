import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const modules: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { author, module: modulename } = req.query;

  if (!author) {
    res.status(400);
    res.end(`parameter "author" is required`);
  } else if (!modulename) {
    res.status(400);
    res.end(`parameter "module" is required`);
  }

  let { data: Modules, error } = await supabase
    .from('Module')
    .select('*')
    .eq('authorName', author)
    .eq('name', modulename);

  if (error) throw new Error(`${error.message} (hint: ${error.hint})`);

  if (Modules.length > 1) {
    throw new Error(`Too many modules with author/module: "${author}/${modulename}"`);
  } else if (Modules.length < 1) {
    res.status(404);
    res.end(`Not Found`);
  } else {
    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(Modules[0]);
    res.end();
  }
};

export default modules;
