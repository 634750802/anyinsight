import { ChartOptionTemplate } from '@/components/Chart';

type StringTemplate = string | ((name: string) => string)

export type OSSTemplateModule<T> = {
  template: ChartOptionTemplate<[T, string]>
  getData: (query: { [key: string]: any, repoId: any }) => Promise<T>
  title: StringTemplate
  description: StringTemplate
}

const templates: Record<string, () => Promise<OSSTemplateModule<any>>> = {
  'analyze-stars-history': () => import('./analyze-stars-history'),
};

export function getTemplateValue (tmpl: StringTemplate, name: string) {
  if (typeof tmpl === 'function') {
    return tmpl(name);
  } else {
    return tmpl;
  }
}

export default templates;
