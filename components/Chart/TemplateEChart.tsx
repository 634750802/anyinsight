import { useEffect, useState } from 'react';
import templates, { OSSTemplateModule } from '@/chart-templates';
import ECharts, { EchartsProps } from './ECharts';

export interface TemplateEChartProps extends Omit<EchartsProps<any>, 'children'> {
  template: string;
  query: any;
  name: string;
}

export const TemplateEChart = ({ template, query, name, ...props }: TemplateEChartProps) => {
  const [tmpl, setTmpl] = useState<OSSTemplateModule<any>>();
  const [data, setData] = useState(null);

  useEffect(() => {
    templates[template]().then(module => setTmpl(module)).catch(console.error);
  }, [template]);

  useEffect(
    () => {
      setData(null);
      if (tmpl) {
        tmpl.getData(query).then(setData).catch(console.error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tmpl, JSON.stringify(query)],
  );

  if (tmpl && data) {
    return (
      <ECharts {...props}>
        {tmpl.template(data, name)}
      </ECharts>
    );
  } else {
    return <div {...props} />;
  }
};
