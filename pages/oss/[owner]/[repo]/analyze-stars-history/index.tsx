import ECharts from '@/components/Chart';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import analyzeStarsHistoryTemplate, { AnalyzeStarsHistoryResponse, getAnalyzeStarsHistory } from '@/chart-templates/analyze-stars-history';

interface IPageData {
  owner: string;
  repo: string;
  repoId: number;
  data: AnalyzeStarsHistoryResponse;
}

const resolveRepoId = async (owner: string, repo: string) => {
  console.log('resolving repoId for %s/%s', owner, repo);
  const resp = await fetch(`https://api.ossinsight.io/gh/repo/${owner}/${repo}`);
  if (resp.ok) {
    const id = (await resp.json()).data.id;
    console.log('resolved %d', id);
    return parseInt(id);
  } else {
    console.log(await resp.text());
    throw new Error(resp.statusText);
  }
};

export const getServerSideProps: GetServerSideProps<IPageData, { owner: string, repo: string }> = async (context) => {
  const { owner, repo } = context.params!;
  const repoId = await resolveRepoId(owner, repo);

  return {
    props: {
      owner,
      repo,
      repoId,
      data: await getAnalyzeStarsHistory(repoId),
    },
  };
};

const Page = ({ data, owner, repo, repoId }: IPageData) => {
  return (
    <>
      <Head>
        <title>
          {`Star History for ${owner}/${repo}`}
        </title>
        <meta name="description" content="Star history from OSSInsight" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="anyscript.io" />
        <meta name="twitter:title" content={`Star History for ${owner}/${repo}`} />
        <meta name="twitter:description" content="Star history from OSSInsight" />
        <meta name="twitter:image" content={`/api/charts/analyze-stars-history.svg?repoId=${repoId}`} />
      </Head>
      <ECharts style={{ height: 300 }}>
        {analyzeStarsHistoryTemplate(data)}
      </ECharts>
    </>
  );
};

export default Page;
