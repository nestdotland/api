import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { module: name } = req.query;

  if (!name) {
    res.status(400);
    res.end(`parameter "module" is required`);
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

    let { data: Versions, error: VersionsError } = await supabase
      .from('Version')
      .select('name')
      .eq('authorName', authorName)
      .eq('moduleName', moduleName)
      .neq('unlisted', true);

    if (VersionsError) {
      res.status(500);
      res.end(`Internal Server Error`);
      throw new Error(`${VersionsError.message} (hint: ${VersionsError.hint})`);
    }

    const names = Versions.map(({ name }: { name: string }) => name);

    res.setHeader('Cache-Control', ['public', 'maxage=21600', 's-maxage=21600', 'stale-while-revalidate=21600']);

    res.status(200);
    res.json(names);
    res.end();
  }
};

export default handler;
