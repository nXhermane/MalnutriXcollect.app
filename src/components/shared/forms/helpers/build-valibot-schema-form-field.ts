import { logger } from '@/lib/utils/logger';
import { numberInputSchema } from '@/lib/utils/number-input-schema';
import * as v from 'valibot';
import { FormField } from '../field';

export function buildValibotSchema(fields: FormField[]) {
  const schemaObject: Record<string, v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>> = {};

  fields.forEach((field) => {
    if (field.schema) {
      schemaObject[field.name] = field.schema;
    } else if (field.schema === false) {
      schemaObject[field.name] = v.optional(v.any());
    } else {
      switch (field.type) {
        case 'text':
          schemaObject[field.name] = field.validation?.required
            ? v.pipe(v.string(), v.minLength(1, `${field.label} est requis`))
            : v.optional(v.string());
          break;
        case 'number':
          {
            let numberSchema: v.BaseSchema<
              unknown,
              unknown,
              v.BaseIssue<unknown>
            > = numberInputSchema;

            if (field.validation?.min !== undefined) {
              numberSchema = v.pipe(
                numberSchema,
                v.minValue(
                  field.validation.min,
                  `Valeur minimale: ${field.validation.min}`,
                ) as unknown as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
              );
            }
            if (field.validation?.max !== undefined) {
              numberSchema = v.pipe(
                numberSchema,
                v.maxValue(
                  field.validation.max,
                  `Valeur maximale: ${field.validation.max}`,
                ) as unknown as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
              );
            }
            schemaObject[field.name] = field.validation?.required
              ? numberSchema
              : v.optional(numberSchema);
          }
          break;
        case 'select':
        case 'radio':
          schemaObject[field.name] = field.validation?.required
            ? v.pipe(v.string(), v.minLength(1, `${field.label} est requis`))
            : v.optional(v.string());
          break;
        case 'checkbox':
          schemaObject[field.name] = field.validation?.required
            ? v.pipe(v.boolean())
            : v.optional(v.boolean());
          break;
        case 'checkbox-group':
          schemaObject[field.name] = field.validation?.required
            ? v.pipe(v.array(v.string()), v.minLength(1, `${field.label} est requis`))
            : v.optional(v.array(v.string()));
          break;
        case 'date':
          schemaObject[field.name] = field.validation?.required
            ? v.pipe(v.string(), v.minLength(1, `${field.label} est requis`))
            : v.optional(v.string());
          break;
        case 'quantity':
          {
            let numberSchema: v.BaseSchema<
              unknown,
              unknown,
              v.BaseIssue<unknown>
            > = numberInputSchema;
            if (field.validation?.min !== undefined) {
              numberSchema = v.pipe(
                numberSchema,
                v.minValue(
                  field.validation.min,
                  `Valeur minimale: ${field.validation.min}`,
                ) as unknown as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
              );
            }
            if (field.validation?.max !== undefined) {
              numberSchema = v.pipe(
                numberSchema,
                v.maxValue(
                  field.validation.max,
                  `Valeur maximale: ${field.validation.max}`,
                ) as unknown as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
              );
            }
            schemaObject[field.name] = v.object({
              value: numberSchema,
              unit: v.string(),
            });
          }
          break;
        default:
          logger.warn('unexpected case.');
      }
    }
  });

  return v.object(schemaObject);
}
