import { EChartsThemeProvider, TemplateEChart } from '@/components/Chart';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import templates, { getTemplateValue } from '@/chart-templates';
import '@/chart-themes/ossinsight';
import { resolveRepoId } from '@/lib/oss';
import { ParsedUrlQuery } from 'querystring';

interface IPageData {
  owner: string;
  repo: string;
  template: string;
  repoId: number;
  title: string;
  description: string;
}

interface IParams extends ParsedUrlQuery {
  owner: string;
  repo: string;
  template: string;
}

export const getServerSideProps: GetServerSideProps<IPageData, IParams> = async (context) => {
  const { owner, repo, template } = context.params!;
  const repoId = await resolveRepoId(owner, repo);
  const name = `${owner}/${repo}`;

  const chartTemplate = await templates[template]();

  return {
    props: {
      owner,
      repo,
      template,
      repoId,
      title: getTemplateValue(chartTemplate.title, name),
      description: getTemplateValue(chartTemplate.description, name),
    },
  };
};

const Page = ({ title, description, owner, repo, template, repoId }: IPageData) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:image" content={`${HOST}/api/charts/oss/${owner}/${repo}/${template}.png`} />
        <meta name="og:image" content={`${HOST}/api/charts/oss/${owner}/${repo}/${template}.png`} />
      </Head>
      <EChartsThemeProvider value={{ theme: 'ossinsight' }}>
        <TemplateEChart template={template} query={{ repoId }} name={`${owner}/${repo}`} style={{ height: '300px' }} />
      </EChartsThemeProvider>
    </>
  );
};

const HOST = 'https://anyinsight.vercel.app';

export default Page;
