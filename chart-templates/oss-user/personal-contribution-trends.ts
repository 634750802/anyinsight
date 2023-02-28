import { ChartOptionTemplate, once, watch } from '@/components/Chart';
import { ossinsightQuery } from '@/lib/oss';

type Data = {
  data: {
    contribution_type: string
    event_month: string
    cnt: number
  }[];
}

export async function getData (params: Record<string, any>): Promise<Data> {
  return ossinsightQuery('personal-contribution-trends', params);
}

const types = ['issues', 'pull_requests', 'reviews', 'pushes', 'review_comments', 'issue_comments'];

export const template: ChartOptionTemplate<[Data, string]> = (data, repo) => {
  return [
    once({
      grid: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {},
      },
      legend: {
        show: true,
        bottom: 16,
        left: 'center',
      },
      title: {
        text: 'Star history',
      },
      series: types.map(key => ({
        type: 'line',
        datasetId: key,
        name: key,
        encode: {
          x: 'event_month',
          y: 'cnt',
        },
        itemStyle: {
          borderWidth: 0,
        },
        symbolSize: 0,
        areaStyle: { opacity: 0.15 },
      })),
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'time',
      },
      dataset: types.map(key => ({
        id: key,
        source: [],
      })),
    }),
    watch([data, repo], (data, login) => ({
      dataset: types.map(key => ({
        id: key,
        source: data.data.filter(item => item.contribution_type === key),
      })),
      title: {
        text: `Contribution trends for ${login}`,
      },
    })),
  ];
};

export const title = (name: string) => `Contribution trends of ${name} from ossinsight.io`;
export const description = (name: string) => `Contribution trends of ${name} from ossinsight.io`;
