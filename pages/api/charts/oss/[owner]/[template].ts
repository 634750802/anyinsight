import { NextApiRequest, NextApiResponse } from 'next';
import { renderPng, renderSvg } from '@/lib/echarts.ssr';
import templates from '@/chart-templates/oss-user';
import { resolveUserId } from '@/lib/oss';

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { owner, template: templateName, type = 'svg' } = req.query;
  const { template: makeSources, getData } = await templates[String(templateName)]();
  const userId = await resolveUserId(String(owner));

  const data = await getData({ userId });
  const template = makeSources(data, String(owner));

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
