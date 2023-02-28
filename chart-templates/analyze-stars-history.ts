import { ChartOptionTemplate, once, watch } from '@/components/Chart';

export type AnalyzeStarsHistoryResponse = {
  data: {
    event_month: string
    repo_id: number
    total: number
  }[];
}

export async function getAnalyzeStarsHistory (repoId: number): Promise<AnalyzeStarsHistoryResponse> {
  const resp = await fetch(`https://api.ossinsight.io/q/analyze-stars-history?repoId=${repoId}`);
  if (resp.ok) {
    return await resp.json();
  } else {
    throw new Error(resp.statusText);
  }
}

const analyzeStarsHistoryTemplate: ChartOptionTemplate<AnalyzeStarsHistoryResponse> = (data) => {
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
    watch([data], data => ({
      dataset: {
        id: 'main',
        source: data.data,
      },
    })),
  ];
};

export default analyzeStarsHistoryTemplate;
