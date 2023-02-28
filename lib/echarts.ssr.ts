import { buildOptions, WatchSource } from '@/components/Chart';
import * as echarts from 'echarts';
import { createCanvas } from '@napi-rs/canvas';
import '@/chart-themes/ossinsight';
import { EChartsOption } from 'echarts';

const devicePixelRatio = 2;

type Options = {
  width: number
  height: number
  theme: string
}

export function renderSvg (sources: WatchSource<any>[], { width, height, theme }: Options): string {
  const ec = echarts.init(null as never, theme, {
    width,
    height,
    renderer: 'svg',
    ssr: true,
    devicePixelRatio,
  });

  buildOptions(ec, sources);

  return ec.renderToSVGString();
}

export function renderPng (sources: WatchSource<any>[], { width, height, theme }: Options): Buffer {
  const canvas = createCanvas(width * devicePixelRatio, height * devicePixelRatio);
  const ec = echarts.init(canvas as never, theme, {
    width,
    height,
    renderer: 'canvas',
    devicePixelRatio,
  });

  buildOptions(ec, sources);

  ec.setOption<EChartsOption>({
    animation: false,
    tooltip: {
      show: false,
    },
    toolbox: {
      show: false,
    }
  })
  return canvas.toBuffer('image/png');
}