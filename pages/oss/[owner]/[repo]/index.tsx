import { EChartsThemeProvider, TemplateEChart } from '@/components/Chart';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import templates from '@/chart-templates/oss-user';
import '@/chart-themes/ossinsight';
import { resolveUserId } from '@/lib/oss';
import { ParsedUrlQuery } from 'querystring';
import { getTemplateValue } from '@/chart-templates';

interface IPageData {
  owner: string;
  template: string;
  userId: number;
  title: string;
  description: string;
  data: any;
}

interface IParams extends ParsedUrlQuery {
  owner: string;
  repo: string;
}

export const getServerSideProps: GetServerSideProps<IPageData, IParams> = async (context) => {
  const { owner, repo: template } = context.params!;
  const userId = await resolveUserId(owner);
  const name = `${owner}`;
  const chartTemplate = await templates[template]();

  return {
    props: {
      owner,
      template,
      userId,
      title: getTemplateValue(chartTemplate.title, name),
      description: getTemplateValue(chartTemplate.description, name),
      data: await chartTemplate.getData({ userId }),
    },
  };
};

const Page = ({ title, data, description, owner, template, userId }: IPageData) => {
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
        <meta name="twitter:image" content={`${HOST}/api/charts/oss/${owner}/${template}?type=png`} />
        <meta name="og:image" content={`${HOST}/api/charts/oss/${owner}/${template}?type=png`} />
      </Head>
      <EChartsThemeProvider value={{ theme: 'ossinsight' }}>
        <TemplateEChart category="oss-user" template={template} query={{ userId }} data={data} name={owner} style={{ height: '300px' }} />
      </EChartsThemeProvider>
    </>
  );
};

const HOST = 'https://anyinsight.vercel.app';

export default Page;
