import { MeasureCategory, MonitoringElementCategory } from '@/constants';
import { getMeasureLabel } from '@/store/registry/registry.store';

export function getFieldLabel(code: string, category: MonitoringElementCategory): string {
  if (category === MonitoringElementCategory.ANTHROPOMETRIC) {
    return getMeasureLabel(code, MeasureCategory.ANTHRO);
  } else if (category === MonitoringElementCategory.BIOCHEMICAL) {
    return getMeasureLabel(code, MeasureCategory.BIOLOGICAL);
  } else if (category === MonitoringElementCategory.DATA_FIELD) {
    return getMeasureLabel(code, MeasureCategory.FIELD);
  } else {
    return code;
  }
}
