import { NextApiRequest, NextApiResponse } from 'next';
import { renderSvg } from '@/lib/echarts.ssr';
import { resolveRepoId } from '@/lib/oss';
import templates from '@/chart-templates';

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {

  const { owner, repo, template: templateName } = req.query;
  const repoId = await resolveRepoId(String(owner), String(repo));
  const { template: makeSources, getData } = await templates[String(templateName)]();

  const data = await getData({ repoId });
  const template = makeSources(data, `${owner}/${repo}`);

  const buffer = renderSvg(template, {
    width: 800,
    height: 418,
    theme: 'ossinsight',
  });

  res.status(200).setHeader('content-type', 'image/svg+xml').send(buffer);
};

export default handler;
