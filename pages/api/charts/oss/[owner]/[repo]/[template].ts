import { NextApiRequest, NextApiResponse } from 'next';
import { renderPng, renderSvg } from '@/lib/echarts.ssr';
import { resolveRepoId } from '@/lib/oss';
import templates from '@/chart-templates';

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { owner, repo, template: templateName, type = 'svg' } = req.query;
  const repoId = await resolveRepoId(String(owner), String(repo));
  const { template: makeSources, getData } = await templates[String(templateName)]();

  const data = await getData({ repoId });
  const template = makeSources(data, `${owner}/${repo}`);

  if (type === 'png') {
    const buffer = renderPng(template, {
      width: 800,
      height: 418,
      theme: 'ossinsight',
    });
    res.status(200).setHeader('content-type', 'image/png').send(buffer);
  } else if (type === 'svg') {
    const buffer = renderSvg(template, {
      width: 800,
      height: 418,
      theme: 'ossinsight',
    });

    res.status(200).setHeader('content-type', 'image/svg+xml').send(buffer);
  } else {
    res.status(404).send('Invalid type');
  }
};

export default handler;
