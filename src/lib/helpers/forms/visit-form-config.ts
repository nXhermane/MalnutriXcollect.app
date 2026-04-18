import { FormSection } from '@/components/shared/forms';
import { anthropometryMeasuresForm } from './anthropometry';
import { dataFieldRefs } from '@/data/fields';
import { convertClinicalDataFieldsToFormConfigWithSchema } from './data-fields';

const clinicalSections = convertClinicalDataFieldsToFormConfigWithSchema(dataFieldRefs);

export const visitFormSections: FormSection[] = [...anthropometryMeasuresForm, ...clinicalSections];
