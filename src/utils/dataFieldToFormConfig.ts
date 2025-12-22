import { FormSection } from '@/components/custom/DynamicForm';
import {
  DATA_POINTS,
  DataFieldCategory,
  DataFieldConditionOperator,
  FieldDataType,
  GENERAL_CONDITION_VALUES,
  OBSERVATIONS,
  QUESTIONS,
  VITAL_SIGNS,
} from '@/constants';
import {
  CheckBoxField,
  FormField,
  NumberField,
  QuantityField,
  RadioField,
  SelectField,
} from '@/utils/field';
import * as v from 'valibot';
import { numberInputSchema } from './shared';

interface DataFieldReference {
  category: DataFieldCategory;
  code: string;
  label: string;
  question: string;
  type: FieldDataType;
  defaultValue: any;
  enumValue?: { value: string; label: string }[];
  dataRange?: [number, number];
  units?: {
    available: string[];
    default: string;
  };
  condition?: {
    field: string;
    fieldType: FieldDataType;
    operator: DataFieldConditionOperator;
    value: any;
  };
}

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

const mapValueToConditionUsableValue = (targetRefType: FieldDataType, value: any) => {
  switch (targetRefType) {
    case FieldDataType.BOOL: // This means the input is a checkbox so convert a true value to string 'true'
      return value ? 'true' : 'false';
    case FieldDataType.INT: // This means the input is a number so convert a number value to string
      return value.toString();
    default:
      return value;
  }
};

const groupFieldsByCategory = (
  fields: DataFieldReference[],
): Record<DataFieldCategory, DataFieldReference[]> => {
  const grouped: Record<DataFieldCategory, DataFieldReference[]> = {
    [DataFieldCategory.VITAL_SIGN]: [],
    [DataFieldCategory.QUESTION]: [],
    [DataFieldCategory.OBSERVATION]: [],
    [DataFieldCategory.DATA_POINTS]: [],
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
    case DataFieldCategory.DATA_POINTS:
      return 'Données générales';
    default:
      return category;
  }
};

export const convertClinicalDataFieldsToFormConfigWithSchema = (
  dataFieldRefs: DataFieldReference[],
): FormSection[] => {
  const groupedFields = groupFieldsByCategory(dataFieldRefs);

  const sections: FormSection[] = [];

  Object.entries(groupedFields).forEach(([category, fields]) => {
    if (fields.length > 0) {
      const categoryName = getCategoryName(category as DataFieldCategory);
      sections.push({
        name: categoryName,
        fields: fields.map(convertDataFieldToFormFieldWithSchema),
      });
    }
  });

  return sections;
};

const convertDataFieldToFormFieldWithSchema = (fieldRef: DataFieldReference): FormField => {
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

          const { field, fieldType, operator, value } = fieldRef.condition;
          const fieldValue = formData[field];
          const _value = mapValueToConditionUsableValue(fieldType, value);
          switch (operator) {
            case DataFieldConditionOperator.EQ: {
              if (fieldType === FieldDataType.BOOL) {
                return Array.isArray(fieldValue) && fieldValue.includes(_value);
              }
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
      } as NumberField;

    case 'checkbox':
      return {
        ...baseField,
        type: 'checkbox',
        options: [{ value: 'true', label: 'Oui' }],
        default: fieldRef.defaultValue ? ['true'] : [],
        schema: v.optional(
          v.pipe(
            v.array(v.string()),
            v.transform((values: string[]) => ({
              value: values.includes('true'),
              code: fieldRef.code,
            })),
          ),
        ),
      } as CheckBoxField<'true'>;

    case 'select':
      if (fieldRef.enumValue) {
        return {
          ...baseField,
          type: 'select',
          options: fieldRef.enumValue.map((opt) => ({
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
        } as SelectField<string>;
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
      } as SelectField<string>;

    case 'radio':
      if (fieldRef.dataRange) {
        const [min, max] = fieldRef.dataRange;
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
              v.string(),
              v.transform((value: string) => ({
                value: parseInt(value),
                code: fieldRef.code,
              })),
            ),
          ),
        } as RadioField<string>;
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
      } as RadioField<string>;
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
                value: v.number(),
                unit: v.string(),
              }),
              v.transform((data: { value: number; unit: string }) => ({
                value: data.value,
                unit: data.unit,
                code: fieldRef.code,
              })),
            ),
          ),
        } as QuantityField<string>;
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
              value: data.value,
              unit: data.unit,
              code: fieldRef.code,
            })),
          ),
        ),
      } as QuantityField<string>;

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

export const clinicalDataFieldRefs: DataFieldReference[] = [
  {
    category: DataFieldCategory.VITAL_SIGN,
    code: VITAL_SIGNS.TEMPERATURE,
    label: 'Température corporelle',
    question: 'Quelle est la température axillaire du patient (en degrés Celsius) ?',
    type: FieldDataType.INT,
    defaultValue: 37,
    units: {
      available: ['°C'],
      default: '°C',
    },
  },
  {
    label: 'Aspect des paupières pendant le sommeil',
    category: DataFieldCategory.QUESTION,
    code: QUESTIONS.EYELIDS_DURING_SLEEP,
    question: "L'enfant garde-t-il les yeux partiellement ou ouverts pendant son sommeil ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Clarté et conscience',
    category: DataFieldCategory.QUESTION,
    code: QUESTIONS.CONSCIOUSNESS_LEVEL,
    question:
      "L'enfant présente-t-il une diminution de sa réactivité ou de son niveau de conscience ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Nombre de selles liquides par jour',
    category: DataFieldCategory.DATA_POINTS,
    code: DATA_POINTS.LIQUID_STOOL_COUNT,
    question: "Combien de selles liquides l'enfant a-t-il eu durant les dernières 24 heures ?",
    type: FieldDataType.INT,
    defaultValue: 0,
    units: {
      available: ['selles/24h'],
      default: 'selles/24h',
    },
  },
  {
    label: 'Nombre de vomissements par jour',
    category: DataFieldCategory.DATA_POINTS,
    code: DATA_POINTS.VOMITING_COUNT,
    question: 'Quel est le nombre de vomissements au cours des dernières 24h ?',
    type: FieldDataType.INT,
    defaultValue: 0,
    units: {
      available: ['vomissements/24h'],
      default: 'vomissements/24h',
    },
  },
  {
    label: 'État Général',
    category: DataFieldCategory.DATA_POINTS,
    code: DATA_POINTS.GENERAL_CONDITION,
    question: "Comment évaluez-vous l'état général du patient ? (normal ou altéré)",
    type: FieldDataType.ENUM,
    enumValue: [
      { value: GENERAL_CONDITION_VALUES.ALTERED, label: 'Altéré' },
      { value: GENERAL_CONDITION_VALUES.NORMAL, label: 'Normal' },
    ],
    defaultValue: GENERAL_CONDITION_VALUES.NORMAL,
  },
  {
    label: 'Fréquence respiratoire',
    category: DataFieldCategory.VITAL_SIGN,
    code: VITAL_SIGNS.RESPIRATORY_RATE,
    question:
      "Combien de respirations par minute l'enfant effectue-t-il (sur une minute complète) ?",
    type: FieldDataType.INT,
    defaultValue: 0,
    units: {
      available: ['respirations/min'],
      default: 'respirations/min',
    },
  },
  {
    label: 'Tirage sous-costal',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.SUBCOSTAL_RETRACTION,
    question: "Observez-vous un creusement sous les côtes lors de la respiration de l'enfant ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: "Présence d'œdèmes bilatéraux",
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.EDEMA_PRESENCE,
    question: "L'enfant présente-t-il des œdèmes bilatéraux prenant le godet ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Degré de sévérité des œdèmes',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.EDEMA_GODET_COUNT,
    question:
      'Quel est le degré de sévérité des œdèmes ? (0=Absent, 1=Léger/pieds, 2=Modéré/jambes et mains, 3=Sévère/généralisé)',
    type: FieldDataType.RANGE,
    dataRange: [0, 3],
    defaultValue: 0,
    condition: {
      field: OBSERVATIONS.EDEMA_PRESENCE,
      fieldType: FieldDataType.BOOL,
      operator: DataFieldConditionOperator.EQ,
      value: true,
    },
  },
  {
    label: 'État de la peau',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.SKIN_CHANGES,
    question: 'Observez-vous des altérations cutanées (peau sèche, crevasses) ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'État des cheveux',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.HAIR_CHANGES,
    question: 'Les cheveux sont-ils secs, cassants, ternes ou anormalement fins ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Altérations des ongles',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.NAIL_CHANGES,
    question: 'Les ongles présentent-ils des striations ou des déformations ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'État de la cornée',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.CORNEA_CHANGES,
    question: 'Observez-vous une sclérose ou une opacité de la cornée ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'État de la langue et la bouche',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.MOUTH_CHANGES,
    question: "Y a-t-il présence d'une langue dépapillée ou d'une stomatite excoriante ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Signes hémorragiques',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.HEMORRHAGE_SIGNS,
    question: 'Observez-vous des pétéchies ou des ecchymoses ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Perte musculaire',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.MUSCLE_LOSS,
    question: 'Observez-vous une perte de la masse musculaire ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Signes neurologiques',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.NEURO_SIGNS,
    question: "L'enfant présente-t-il des paresthésies ou une ataxie ?",
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Hépatoméalie',
    category: DataFieldCategory.OBSERVATION,
    code: OBSERVATIONS.HEPATOMEGALY,
    question: 'Constatez-vous une hépatomégalie ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
  {
    label: 'Allaitement actuel',
    category: DataFieldCategory.DATA_POINTS,
    code: DATA_POINTS.IS_BREASTFED,
    question: 'L’enfant est-il actuellement allaité (lait maternel) ?',
    type: FieldDataType.BOOL,
    defaultValue: false,
  },
];
