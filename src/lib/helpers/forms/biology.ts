import { FormSection } from '@/components/shared/forms';
import { QuantityField } from '@/components/shared/forms/field';
import { numberInputSchema } from '@/lib/utils/number-input-schema';
import * as v from 'valibot';

export interface BiologicalRefDto {
  code: string;
  name: string;
  unit: string;
  availableUnits: string[];
}

export const convertBiologyDataFieldsToFormConfig = (
  biologies: BiologicalRefDto[],
): FormSection[] => {
  const fields: QuantityField[] = biologies.map((biology) => ({
    type: 'quantity',
    name: biology.code,
    label: biology.name,
    unitOptions: biology.availableUnits.map((unit) => ({ label: unit, value: unit })),
    default: { unit: biology.unit, value: 0 },
    validation: { required: false, min: 0 },
    schema: v.optional(
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.string() }),
        v.transform(({ unit, value }) => ({ value, unit, code: biology.code })),
      ),
    ),
  }));

  return [{ name: 'Données biologiques', fields }];
};
