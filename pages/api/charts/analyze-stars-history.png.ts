import { NextApiRequest, NextApiResponse } from 'next';
import analyzeStarsHistoryTemplate, { getAnalyzeStarsHistory } from '@/chart-templates/analyze-stars-history';
import * as echarts from 'echarts';
import { buildOptions } from '@/components/Chart';
import { createCanvas } from '@napi-rs/canvas'


const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {

  const id = parseInt(String(req.query.repoId));
  const resp = await getAnalyzeStarsHistory(id);
  const template = analyzeStarsHistoryTemplate(resp);

  const canvas = createCanvas(800, 418)

  const ec = echarts.init(canvas as never, undefined, {
    width: 800,
    height: 418,
  });

  buildOptions(ec, template);
  ec.setOption({
    animation: false,
  });

  res.status(200).setHeader('content-type', 'image/png').send(canvas.toBuffer('image/png'));
}

export default handler;
