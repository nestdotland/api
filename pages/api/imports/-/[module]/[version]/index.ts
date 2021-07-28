import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { module: name, version: versionName } = req.query;

  if (!name) {
    res.status(400);
    res.end(`parameter "module" is required`);
  } else if (!versionName) {
    res.status(400);
    res.end(`parameter "version" is required`);
  }

  let { data: VanityModules, error: VanityModulesError } = await supabase
    .from('VanityModule')
    .select('authorName, moduleName')
    .eq('name', name);

  if (VanityModulesError) {
    res.status(500);
    res.end(`Internal Server Error`);
    throw new Error(`${VanityModulesError.message} (hint: ${VanityModulesError.hint})`);
  }

  if (VanityModules.length < 1) {
    res.status(404);
    res.end(`Not Found`);
  } else if (VanityModules.length > 1) {
    res.status(500);
    res.end(`Internal Server Error`);
    throw new Error(`Too many "VanityModules" with name "${name}"`);
  } else {
    const { authorName, moduleName } = VanityModules[0];

    let { data: Files, error } = await supabase
      .from('File')
      .select('path')
      .eq('authorName', authorName)
      .eq('moduleName', moduleName)
      .eq('versionName', versionName);

    if (error) {
      res.status(500);
      res.end(`Internal Server Error`);
      throw new Error(`${error.message} (hint: ${error.hint})`);
    }

    const paths = Files.map(({ path }: { path: string }) => path);

    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(paths);
    res.end();
  }
};

export default handler;
