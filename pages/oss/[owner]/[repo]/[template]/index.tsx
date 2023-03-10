import { EChartsThemeProvider, TemplateEChart } from '@/components/Chart';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import templates from '@/chart-templates/oss';
import '@/chart-themes/ossinsight';
import { resolveRepoId } from '@/lib/oss';
import { ParsedUrlQuery } from 'querystring';
import { getTemplateValue } from '@/chart-templates';

interface IPageData {
  owner: string;
  repo: string;
  template: string;
  repoId: number;
  title: string;
  description: string;
  data: any;
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
      data: await chartTemplate.getData({ repoId }),
    },
  };
};

const Page = ({ title, data, description, owner, repo, template, repoId }: IPageData) => {
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
        <meta name="twitter:image" content={`${HOST}/api/charts/oss/${owner}/${repo}/${template}?type=png`} />
        <meta name="og:image" content={`${HOST}/api/charts/oss/${owner}/${repo}/${template}?type=png`} />
      </Head>
      <EChartsThemeProvider value={{ theme: 'ossinsight' }}>
        <TemplateEChart category='oss' template={template} query={{ repoId }} data={data} name={`${owner}/${repo}`} style={{ height: '300px' }} />
      </EChartsThemeProvider>
    </>
  );
};

const HOST = 'https://anyinsight.vercel.app';

export default Page;
