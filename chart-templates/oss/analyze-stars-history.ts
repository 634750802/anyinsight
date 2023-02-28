import { ChartOptionTemplate, once, watch } from '@/components/Chart';
import { ossinsightQuery } from '@/lib/oss';

type Data = {
  data: {
    event_month: string
    repo_id: number
    total: number
  }[];
}

export async function getData (params: Record<string, any>): Promise<Data> {
  return ossinsightQuery('analyze-stars-history', params);
}

export const template: ChartOptionTemplate<[Data, string]> = (data, repo) => {
  return [
    once({
      grid: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {},
      },
      legend: {},
      title: {
        text: 'Star history',
      },
      series: {
        type: 'line',
        datasetId: 'main',
        encode: {
          x: 'event_month',
          y: 'total',
        },
        itemStyle: {
          borderWidth: 0,
        },
        symbolSize: 0,
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'time',
      },
      dataset: {
        id: 'main',
        source: [],
      },
    }),
    watch([data, repo], (data, repo) => ({
      dataset: {
        id: 'main',
        source: data.data,
      },
      title: {
        text: `Star history of ${repo}`,
      },
    })),
  ];
};

export const title = (name: string) => `Star history of ${name} from ossinsight.io`;
export const description = (name: string) => `Star history of ${name} from ossinsight.io`;
