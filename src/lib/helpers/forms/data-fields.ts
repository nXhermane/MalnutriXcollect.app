import { FormSection } from '@/components/shared/forms';
import { FormField } from '@/components/shared/forms/field';
import { DataFieldCategory, DataFieldConditionOperator, FieldDataType } from '@/constants/clinical';
import { DataFieldRefDto } from '@/data/fields';
import { numberInputSchema } from '@/lib/utils/number-input-schema';
import * as v from 'valibot';

const mapFieldTypeWithQuantitySupport = (dataType: FieldDataType, hasUnits?: boolean): string => {
  switch (dataType) {
    case FieldDataType.INT:
      return 'number';
    case FieldDataType.QUANTITY:
      return hasUnits ? 'quantity' : 'number';
    case FieldDataType.BOOL:
      return 'checkbox';
    case FieldDataType.ENUM:
      return 'select';
    case FieldDataType.RANGE:
      return 'radio';
    default:
      return 'text';
  }
};

const groupFieldsByCategory = (
  fields: DataFieldRefDto[],
): Record<DataFieldCategory, DataFieldRefDto[]> => {
  const grouped: Record<DataFieldCategory, DataFieldRefDto[]> = {
    [DataFieldCategory.VITAL_SIGN]: [],
    [DataFieldCategory.QUESTION]: [],
    [DataFieldCategory.OBSERVATION]: [],
  };

  fields.forEach((field) => {
    grouped[field.category as DataFieldCategory].push(field);
  });

  return grouped;
};

const getCategoryName = (category: DataFieldCategory): string => {
  switch (category) {
    case DataFieldCategory.VITAL_SIGN:
      return 'Signes vitaux';
    case DataFieldCategory.QUESTION:
      return 'Questions';
    case DataFieldCategory.OBSERVATION:
      return 'Observations cliniques';
    default:
      return category;
  }
};

export const convertClinicalDataFieldsToFormConfigWithSchema = (
  dataFieldRefs: DataFieldRefDto[],
  withCondition: boolean = true,
): FormSection[] => {
  const groupedFields = groupFieldsByCategory(dataFieldRefs);

  const sections: FormSection[] = [];

  Object.entries(groupedFields).forEach(([category, fields]) => {
    if (fields.length > 0) {
      const categoryName = getCategoryName(category as DataFieldCategory);
      sections.push({
        name: categoryName,
        fields: fields.map((field) => convertDataFieldToFormFieldWithSchema(field, withCondition)),
      });
    }
  });

  return sections;
};

const convertDataFieldToFormFieldWithSchema = (
  fieldRef: DataFieldRefDto,
  withCondition: boolean = true,
): FormField => {
  const baseField = {
    name: fieldRef.code,
    label: fieldRef.label,
    help: fieldRef.question,
    validation: {
      required: false,
    },
    condition: fieldRef.condition
      ? (formData: any) => {
          if (!fieldRef.condition) return true;
          const { field, operator, value } = fieldRef.condition;
          const fieldValue = formData[field];
          const _value = value;
          switch (operator) {
            case DataFieldConditionOperator.EQ: {
              return fieldValue === _value;
            }
            case DataFieldConditionOperator.NEQ:
              return fieldValue !== _value;
            case DataFieldConditionOperator.GT:
              return fieldValue > _value;
            case DataFieldConditionOperator.LT:
              return fieldValue < _value;
            case DataFieldConditionOperator.GTE:
              return fieldValue >= _value;
            case DataFieldConditionOperator.LTE:
              return fieldValue <= _value;
            case DataFieldConditionOperator.IN:
              return Array.isArray(_value) && _value.includes(fieldValue);
            case DataFieldConditionOperator.NIN:
              return Array.isArray(_value) && !_value.includes(fieldValue);
            default:
              return true;
          }
        }
      : undefined,
  };
  if (!withCondition) {
    baseField.condition = undefined;
    (baseField as Partial<FormField>).alwaysShow = true;
  }
  const fieldType = mapFieldTypeWithQuantitySupport(fieldRef.type, !!fieldRef.units);

  switch (fieldType) {
    case 'number':
      return {
        ...baseField,
        type: 'number',
        default: fieldRef.defaultValue,
        schema: v.optional(
          v.pipe(
            numberInputSchema,
            v.transform((value: number) => ({
              value,
              code: fieldRef.code,
            })),
          ),
        ),
      };

    case 'checkbox':
      return {
        ...baseField,
        type: 'checkbox',
        option: { label: 'Oui' },
        default: fieldRef.defaultValue,
        schema: v.optional(
          v.pipe(
            v.boolean(),
            v.transform((value) => ({
              value: value,
              code: fieldRef.code,
            })),
          ),
        ),
      };

    case 'select':
      if (fieldRef.enum) {
        return {
          ...baseField,
          type: 'select',
          options: fieldRef.enum.map((opt) => ({
            value: opt.value,
            label: opt.label,
          })),
          default: fieldRef.defaultValue,
          schema: v.optional(
            v.pipe(
              v.string(),
              v.transform((value: string) => ({
                value,
                code: fieldRef.code,
              })),
            ),
          ),
        };
      }
      return {
        ...baseField,
        type: 'select',
        options: [],
        default: '',
        schema: v.optional(
          v.pipe(
            v.string(),
            v.transform((value: string) => ({
              value,
              code: fieldRef.code,
            })),
          ),
        ),
      };

    case 'radio':
      if (fieldRef.range) {
        const [min, max] = fieldRef.range;
        const options = [];
        for (let i = min; i <= max; i++) {
          options.push({ value: i.toString(), label: i.toString() });
        }
        return {
          ...baseField,
          type: 'radio',
          options,
          default: fieldRef.defaultValue.toString(),
          schema: v.optional(
            v.pipe(
              v.union([v.string(), v.number()]),
              v.transform((v) => String(v)),
              v.transform((value: string) => ({
                value: parseInt(value),
                code: fieldRef.code,
              })),
            ),
          ),
        };
      }
      return {
        ...baseField,
        type: 'radio',
        options: [],
        default: '',
        schema: v.optional(
          v.pipe(
            v.string(),
            v.transform((value: string) => ({
              value,
              code: fieldRef.code,
            })),
          ),
        ),
      };
    case 'quantity':
      if (fieldRef.units) {
        return {
          ...baseField,
          type: 'quantity',
          unitOptions: fieldRef.units.available.map((unit) => ({
            value: unit,
            label: unit,
          })),
          default: {
            unit: fieldRef.units.default,
            value: fieldRef.defaultValue,
          },
          schema: v.optional(
            v.pipe(
              v.object({
                value: numberInputSchema,
                unit: v.string(),
              }),
              v.transform((data: { value: number; unit: string }) => ({
                value: { value: data.value, unit: data.unit },
                code: fieldRef.code,
              })),
            ),
          ),
        };
      }
      return {
        ...baseField,
        type: 'quantity',
        unitOptions: [{ value: 'unit', label: 'unit' }],
        default: {
          unit: 'unit',
          value: fieldRef.defaultValue,
        },
        schema: v.optional(
          v.pipe(
            v.object({
              value: v.number(),
              unit: v.string(),
            }),
            v.transform((data: { value: number; unit: string }) => ({
              value: { value: data.value, unit: data.unit },
              code: fieldRef.code,
            })),
          ),
        ),
      };

    default:
      return {
        ...baseField,
        type: 'text',
        mode: 'input',
        default: fieldRef.defaultValue?.toString() || '',
        schema: v.optional(
          v.pipe(
            v.string(),
            v.transform((value: string) => ({
              value,
              code: fieldRef.code,
            })),
          ),
        ),
      } as FormField;
  }
};
