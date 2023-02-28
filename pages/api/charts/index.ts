import { NextApiRequest, NextApiResponse } from 'next';
import analyzeStarsHistoryTemplate, { getAnalyzeStarsHistory } from '@/chart-templates/analyze-stars-history';
import echarts from 'echarts';
import { buildOptions } from '@/components/Chart';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const id = parseInt(String(req.query.repoId));
  const resp = await getAnalyzeStarsHistory(id);
  const template = analyzeStarsHistoryTemplate(resp);

  const ec = echarts.init(null as never, undefined, {
    width: 800,
    height: 418,
    renderer: 'svg',
    ssr: true,
  });

  buildOptions(ec, template);
  ec.setOption({
    animation: false,
  });

  const svg = ec.renderToSVGString();

  res.status(200).setHeader('content-type', 'image/xml+svg').send(svg);
}
