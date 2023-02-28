import { useEffect, useState } from 'react';
import templates, { OSSTemplateModule } from '@/chart-templates';
import ECharts, { EchartsProps } from './ECharts';

export interface TemplateEChartProps extends Omit<EchartsProps<any>, 'children'> {
  template: string;
  query: any;
  name: string;
  data: any;
}

export const TemplateEChart = ({ template, query, data, name, ...props }: TemplateEChartProps) => {
  const [tmpl, setTmpl] = useState<OSSTemplateModule<any>>();

  useEffect(() => {
    templates[template]().then(module => setTmpl(module)).catch(console.error);
  }, [template]);

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
