import type { FormSection } from '@/components/shared/forms';
import { QuantityField } from '@/components/shared/forms/field';
import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  HeightUnit,
  MAX_LENHEI,
  MIN_LENHEI,
  MONTH_IN_YEARS,
  MUACUnit,
  SystemCodes,
  TSFUnit,
  WeightUnit,
} from '@/constants';
import { logger } from '@/lib/utils/logger';
import { numberInputSchema } from '@/lib/utils/number-input-schema';
import * as v from 'valibot';

const WeightField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.WEIGHT,
  label: 'Poids',
  unitOptions: [
    { value: WeightUnit.KG, label: WeightUnit.KG },
    { value: WeightUnit.G, label: WeightUnit.G },
  ],
  default: { unit: WeightUnit.KG, value: 0 },
  validation: { required: false },
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(WeightUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(WeightUnit) }),
        v.check((data) => {
          if (data.unit === WeightUnit.G) return data.value >= 500;
          if (data.unit === WeightUnit.KG) return data.value >= 0.5;
          return false;
        }, 'Le poids doit être au moins 500g ou 0.5kg.'),
        v.transform((data) => ({
          code: AnthroSystemCodes.WEIGHT,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const HeightField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.HEIGHT,
  label: 'Taille',
  unitOptions: [{ value: HeightUnit.CM, label: HeightUnit.CM }],
  default: { unit: HeightUnit.CM, value: 0 },
  validation: { required: false },
  alwaysShow: false,
  condition: (values) => {
    if (
      typeof values === 'object' &&
      values !== null &&
      SystemCodes.AGE_IN_DAY in values &&
      typeof values[SystemCodes.AGE_IN_DAY] === 'number'
    ) {
      return values[SystemCodes.AGE_IN_DAY] >= MONTH_IN_YEARS * DAY_IN_MONTHS * 2;
    } else {
      return false;
    }
  },
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(HeightUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(HeightUnit) }),
        v.check((data) => {
          if (data.unit === HeightUnit.CM)
            return data.value >= MIN_LENHEI && data.value <= MAX_LENHEI;
          if (data.unit === HeightUnit.M)
            return data.value >= MIN_LENHEI * 0.01 && data.value <= MAX_LENHEI * 0.01;
          return false;
        }, `La taille doit être comprise entre ${MIN_LENHEI}${HeightUnit.CM} et ${MAX_LENHEI}${HeightUnit.CM}.`),
        v.transform((data) => ({
          code: AnthroSystemCodes.HEIGHT,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const LengthField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.LENGTH,
  label: 'Longueur',
  unitOptions: [{ value: HeightUnit.CM, label: HeightUnit.CM }],
  default: { unit: HeightUnit.CM, value: 0 },
  validation: { required: false },
  alwaysShow: false,
  condition: (values) => {
    if (
      typeof values === 'object' &&
      values !== null &&
      SystemCodes.AGE_IN_DAY in values &&
      typeof values[SystemCodes.AGE_IN_DAY] === 'number'
    ) {
      return values[SystemCodes.AGE_IN_DAY] < MONTH_IN_YEARS * DAY_IN_MONTHS * 2;
    }
    return false;
  },
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(HeightUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(HeightUnit) }),
        v.check((data) => {
          if (data.unit === HeightUnit.CM)
            return data.value >= MIN_LENHEI && data.value <= MAX_LENHEI;
          if (data.unit === HeightUnit.M)
            return data.value >= MIN_LENHEI * 0.01 && data.value <= MAX_LENHEI * 0.01;
          return false;
        }, `La longueur doit être comprise entre ${MIN_LENHEI}${HeightUnit.CM} et ${MAX_LENHEI}${HeightUnit.CM}.`),
        v.transform((data) => ({
          code: AnthroSystemCodes.LENGTH,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const MUACField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.MUAC,
  label: 'PB',
  unitOptions: [
    { value: MUACUnit.CM, label: MUACUnit.CM },
    { value: MUACUnit.MM, label: MUACUnit.MM },
  ],
  default: { unit: MUACUnit.CM, value: 0 },
  validation: { required: false },
  alwaysShow: true,
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(MUACUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(MUACUnit) }),
        v.check((data) => {
          if (data.unit === MUACUnit.CM) return data.value >= 6.5 && data.value <= 35;
          if (data.unit === MUACUnit.MM) return data.value >= 65 && data.value <= 350;
          return false;
        }, 'Le périmètre brachial doit être compris entre 6.5cm et 35cm ou 65mm et 350mm.'),
        v.transform((data) => ({
          code: AnthroSystemCodes.MUAC,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const HeadCirField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
  label: 'Circumférence crânienne',
  unitOptions: [{ value: MUACUnit.CM, label: MUACUnit.CM }],
  default: { unit: MUACUnit.CM, value: 0 },
  validation: { required: false },
  alwaysShow: true,
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(MUACUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(MUACUnit) }),
        v.check((data) => {
          if (data.unit === MUACUnit.CM) return data.value >= 5 && data.value <= 100;
          if (data.unit === MUACUnit.MM) return data.value >= 50 && data.value <= 1000;
          return false;
        }, 'La circumférence crânienne doit être comprise entre 5cm et 100cm.'),
        v.transform((data) => ({
          code: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const TSFField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.TSF,
  label: 'Pli cutané tricipal',
  unitOptions: [{ value: TSFUnit.MM, label: TSFUnit.MM }],
  default: { unit: TSFUnit.MM, value: 0 },
  validation: { required: false },
  alwaysShow: true,
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(TSFUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(TSFUnit) }),
        v.check((data) => {
          if (data.unit === TSFUnit.MM) return data.value > 0 && data.value <= 1000;
          return true;
        }, 'La valeur du pli cutané tricipital doit être comprise entre 0mm (exclusif) et 1000mm.'),
        v.transform((data) => ({
          code: AnthroSystemCodes.TSF,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

const SSFField: QuantityField = {
  type: 'quantity',
  name: AnthroSystemCodes.SSF,
  label: 'Pli cutané sous-scapulaire',
  unitOptions: [{ value: TSFUnit.MM, label: TSFUnit.MM }],
  default: { value: 0, unit: TSFUnit.MM },
  alwaysShow: true,
  schema: v.optional(
    v.union([
      v.pipe(
        v.object({ value: v.union([v.literal('0'), v.literal(0)]), unit: v.enum(TSFUnit) }),
        v.transform(() => undefined),
      ),
      v.pipe(
        v.object({ value: numberInputSchema, unit: v.enum(TSFUnit) }),
        v.check((data) => {
          if (data.unit === TSFUnit.MM) return data.value >= 0 && data.value <= 1000;
          return true;
        }, 'La valeur du pli cutané sous-scapulaire doit être comprise entre 0mm et 1000mm.'),
        v.transform((data) => ({
          code: AnthroSystemCodes.SSF,
          value: data.value,
          unit: data.unit,
        })),
      ),
    ]),
  ),
};

export const anthropometryMeasuresForm: FormSection[] = [
  {
    name: 'Mesures anthropométriques',
    fields: [WeightField, HeightField, LengthField, MUACField, HeadCirField, TSFField, SSFField],
  },
];

export function getAnthropometryFormField(
  code: AnthroSystemCodes,
  withCondition: boolean = true,
): FormSection['fields'] {
  switch (code) {
    case AnthroSystemCodes.WEIGHT:
      return [
        { ...WeightField, ...(!withCondition && { condition: undefined, alwaysShow: true }) },
      ];
    case AnthroSystemCodes.HEIGHT:
      return [
        { ...HeightField, ...(!withCondition && { condition: undefined, alwaysShow: true }) },
      ];
    case AnthroSystemCodes.LENGTH:
      return [
        { ...LengthField, ...(!withCondition && { condition: undefined, alwaysShow: true }) },
      ];
    case AnthroSystemCodes.MUAC:
      return [{ ...MUACField, ...(!withCondition && { condition: undefined, alwaysShow: true }) }];
    case AnthroSystemCodes.HEAD_CIRCUMFERENCE:
      return [
        { ...HeadCirField, ...(!withCondition && { condition: undefined, alwaysShow: true }) },
      ];
    case AnthroSystemCodes.TSF:
      return [{ ...TSFField, ...(!withCondition && { condition: undefined, alwaysShow: true }) }];
    case AnthroSystemCodes.SSF:
      return [{ ...SSFField, ...(!withCondition && { condition: undefined, alwaysShow: true }) }];
    default: {
      logger.warn('Unsupported anthropometry form field', { code });
      return [];
    }
  }
}
