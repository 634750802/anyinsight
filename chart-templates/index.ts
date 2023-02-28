import oss from './oss';
import ossUser from './oss-user';
import { ChartOptionTemplate } from '@/components/Chart';

export type StringTemplate = string | ((name: string) => string)

export type OSSTemplateModule<T> = {
  template: ChartOptionTemplate<[T, string]>
  getData: (query: Record<string, any>) => Promise<T>
  title: StringTemplate
  description: StringTemplate
}

const templates: Record<string, Record<string, () => Promise<OSSTemplateModule<any>>>> = {
  oss,
  'oss-user': ossUser,
};



export function getTemplateValue (tmpl: StringTemplate, name: string) {
  if (typeof tmpl === 'function') {
    return tmpl(name);
  } else {
    return tmpl;
  }
}
export default templates;
