import ECharts, { once, watch } from '@/components/Chart/ECharts';
import { GetServerSideProps } from 'next';

interface IPageData {
  data: {
    data: {
      event_month: string
      repo_id: number
      total: number
    }[];
  };
}

const resolveRepoId = async (owner: string, repo: string) => {
  console.log('resolving repoId for %s/%s', owner, repo);
  const resp = await fetch(`https://api.ossinsight.io/gh/repo/${owner}/${repo}`);
  if (resp.ok) {
    const id = (await resp.json()).data.id;
    console.log('resolved %d', id);
    return id;
  } else {
    console.log(await resp.text());
    throw new Error(resp.statusText);
  }
};

export const getServerSideProps: GetServerSideProps<IPageData, { owner: string, repo: string }> = async (context) => {
  const { owner, repo } = context.params!;

  const repoId = await resolveRepoId(owner, repo);

  const resp = await fetch(`https://api.ossinsight.io/q/analyze-stars-history?repoId=${repoId}`);

  if (resp.ok) {
    return {
      props: {
        data: await resp.json(),
      },
    };
  } else {
    console.error(await resp.text());
    throw new Error(resp.statusText);
  }
};

const Page = ({ data }: IPageData) => {
  return (
    <ECharts style={{ height: 300 }} ssrMeta>
      {[
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
            source: (console.log('hi', data, data.data), data.data),
          },
        })),
      ]}
    </ECharts>
  );
};

export default Page;
