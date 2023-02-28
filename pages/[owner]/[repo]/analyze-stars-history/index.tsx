import ECharts, { once, watch } from '@/components/Chart/ECharts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface IPageData {
  owner: string;
  repo: string;
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
        owner,
        repo,
        data: await resp.json(),
      },
    };
  } else {
    console.error(await resp.text());
    throw new Error(resp.statusText);
  }
};

const Page = ({ data, owner, repo }: IPageData) => {
  return (
    <>
      <Head>
        <title>
          {`Star History for ${owner}/${repo}`}
        </title>
        <meta name="description" content="Star history from OSSInsight"/>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="anyscript.io" />
        <meta name="twitter:title" content={`Star History for ${owner}/${repo}`} />
        <meta name="twitter:description" content="Star history from OSSInsight"/>
      </Head>
      <ECharts style={{ height: 300 }} ssrMeta={['og:image', 'twitter:image']}>
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
              source: data.data,
            },
          })),
        ]}
      </ECharts>
    </>
  );
};

export default Page;
