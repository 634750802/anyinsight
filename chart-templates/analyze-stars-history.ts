import { ChartOptionTemplate, once, watch } from '@/components/Chart';

export type AnalyzeStarsHistoryResponse = {
  data: {
    event_month: string
    repo_id: number
    total: number
  }[];
}

export async function getData ({ repoId }: { repoId: any }): Promise<AnalyzeStarsHistoryResponse> {
  const resp = await fetch(`https://api.ossinsight.io/q/analyze-stars-history?repoId=${repoId}`);
  if (resp.ok) {
    return await resp.json();
  } else {
    throw new Error(resp.statusText);
  }
}

export const template: ChartOptionTemplate<[AnalyzeStarsHistoryResponse, string]> = (data, repo) => {
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
