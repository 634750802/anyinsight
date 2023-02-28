import { ChartOptionTemplate } from '@/components/Chart';
import type { OSSTemplateModule, StringTemplate } from '@/chart-templates';

const templates: Record<string, () => Promise<OSSTemplateModule<any>>> = {
  'analyze-stars-history': () => import('./analyze-stars-history'),
};


export default templates;
