import type { OSSTemplateModule, StringTemplate } from '@/chart-templates';

const templates: Record<string, () => Promise<OSSTemplateModule<any>>> = {
  'personal-contribution-trends': () => import('./personal-contribution-trends'),
};

export default templates;
