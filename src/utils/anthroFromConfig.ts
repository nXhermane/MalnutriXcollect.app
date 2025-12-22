import { FormSection } from '@/components/custom';
import {
  AnthroSystemCodes,
  WeightUnit,
  HeightUnit,
  SystemCodes,
  MONTH_IN_YEARS,
  DAY_IN_MONTHS,
  MIN_LENHEI,
  MAX_LENHEI,
  MUACUnit,
  TSFUnit,
} from '@/constants';
import * as v from 'valibot';
import { numberInputSchema } from './shared';

export const anthropFromConfing: FormSection[] = [
  {
    name: 'Mesures anthropométriques',
    fields: [
      {
        type: 'quantity',
        name: AnthroSystemCodes.WEIGHT,
        label: 'Poids',
        unitOptions: [
          {
            value: WeightUnit.kg,
            label: WeightUnit.kg,
          },
          { value: WeightUnit.g, label: WeightUnit.g },
        ],
        default: {
          unit: WeightUnit.kg,
          value: 0,
        },
        validation: {
          required: true,
        },
        schema: v.pipe(
          v.object({
            value: v.pipe(numberInputSchema),
            unit: v.pipe(v.enum(WeightUnit)),
          }),
          v.check((data) => {
            if (data.unit === WeightUnit.g) return data.value >= 500;
            if (data.unit === WeightUnit.kg) return data.value >= 0.5;
            return false;
          }, 'Le poids doit être au moins 500g ou 0.5kg.'),
          v.transform((data) => {
            return {
              code: AnthroSystemCodes.WEIGHT,
              value: data.value,
              unit: data.unit,
            };
          }),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.HEIGHT,
        label: 'Taille',
        unitOptions: [
          {
            value: HeightUnit.cm,
            label: HeightUnit.cm,
          },
        ],
        default: {
          unit: HeightUnit.cm,
          value: 0,
        },
        validation: {
          required: false,
        },
        alwaysShow: false,
        condition: (values) => {
          return values[SystemCodes.AGE_IN_DAY] >= MONTH_IN_YEARS * DAY_IN_MONTHS * 2;
        },
        schema: v.optional(
          v.pipe(
            v.object({
              value: v.pipe(numberInputSchema),
              unit: v.pipe(v.enum(HeightUnit)),
            }),
            v.check((data) => {
              if (data.unit === HeightUnit.cm)
                return data.value >= MIN_LENHEI && data.value <= MAX_LENHEI;
              if (data.unit === HeightUnit.m)
                return data.value >= MIN_LENHEI * 0.01 && data.value <= MAX_LENHEI * 0.01;
              return false;
            }, `La taille debout doit être comprise entre ${MIN_LENHEI}${HeightUnit.cm} et ${MAX_LENHEI}${HeightUnit.cm}.`),
            v.transform((data) => {
              return {
                code: AnthroSystemCodes.HEIGHT,
                value: data.value,
                unit: data.unit,
              };
            }),
          ),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.LENGTH,
        label: 'Longueur',
        unitOptions: [
          {
            value: HeightUnit.cm,
            label: HeightUnit.cm,
          },
        ],
        default: {
          unit: HeightUnit.cm,
          value: 0,
        },
        validation: {
          required: false,
        },
        alwaysShow: false,
        condition: (values) => {
          return values[SystemCodes.AGE_IN_DAY] < MONTH_IN_YEARS * DAY_IN_MONTHS * 2;
        },
        schema: v.optional(
          v.pipe(
            v.object({
              value: v.pipe(numberInputSchema),
              unit: v.pipe(v.enum(HeightUnit)),
            }),
            v.check((data) => {
              if (data.unit === HeightUnit.cm)
                return data.value >= MIN_LENHEI && data.value <= MAX_LENHEI;
              if (data.unit === HeightUnit.m)
                return data.value >= MIN_LENHEI * 0.01 && data.value <= MAX_LENHEI * 0.01;
              return false;
            }, `La longueur doit être comprise entre ${MIN_LENHEI}${HeightUnit.cm} et ${MAX_LENHEI}${HeightUnit.cm}.`),
            v.transform((data) => {
              return {
                code: AnthroSystemCodes.LENGTH,
                value: data.value,
                unit: data.unit,
              };
            }),
          ),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.MUAC,
        label: 'PB',
        unitOptions: [
          {
            value: MUACUnit.cm,
            label: MUACUnit.cm,
          },
          {
            value: MUACUnit.mm,
            label: MUACUnit.mm,
          },
        ],
        default: {
          unit: MUACUnit.cm,
          value: 0,
        },
        validation: {
          required: false,
        },
        alwaysShow: true,
        schema: v.optional(
          v.union([
            v.pipe(
              v.object({
                value: v.union([v.literal('0'), v.literal(0)]),
                unit: v.enum(MUACUnit),
              }),
              v.transform(() => undefined),
            ),
            v.pipe(
              v.object({
                value: v.pipe(numberInputSchema),
                unit: v.pipe(v.enum(MUACUnit)),
              }),
              v.check((data) => {
                if (data.unit === MUACUnit.cm) return data.value >= 6.5 && data.value <= 35;
                if (data.unit === MUACUnit.mm) return data.value >= 65 && data.value <= 350;
                return false;
              }, `Le périmètre brachial doit être compris entre 6.5 cm et 35cm ou 65mm et 350mm.`),
              v.transform((data) => {
                return {
                  code: AnthroSystemCodes.MUAC,
                  value: data.value,
                  unit: data.unit,
                };
              }),
            ),
          ]),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
        label: 'Circumférence crânienne',
        unitOptions: [
          {
            value: MUACUnit.cm,
            label: MUACUnit.cm,
          },
        ],
        default: {
          unit: MUACUnit.cm,
          value: 0,
        },
        validation: {
          required: false,
        },
        alwaysShow: true,
        schema: v.optional(
          v.union([
            v.pipe(
              v.object({
                value: v.union([v.literal('0'), v.literal(0)]),
                unit: v.enum(MUACUnit),
              }),
              v.transform(() => undefined),
            ),
            v.pipe(
              v.object({
                value: v.pipe(numberInputSchema),
                unit: v.pipe(v.enum(MUACUnit)),
              }),
              v.check((data) => {
                if (data.unit === MUACUnit.cm) return data.value >= 5 && data.value <= 100;
                if (data.unit === MUACUnit.mm) return data.value >= 50 && data.value <= 1000;
                return false;
              }, `La circumférence crânienne doit être comprise entre 5 cm et 100cm ou 50mm et 1000mm.`),
              v.transform((data) => {
                return {
                  code: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
                  value: data.value,
                  unit: data.unit,
                };
              }),
            ),
          ]),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.TSF,
        label: 'Pli cutané tricipal',
        unitOptions: [
          {
            value: TSFUnit.mm,
            label: TSFUnit.mm,
          },
        ],
        default: {
          unit: TSFUnit.mm,
          value: 0,
        },
        validation: {
          required: false,
        },
        alwaysShow: true,
        schema: v.optional(
          v.union([
            v.pipe(
              v.object({
                value: v.union([v.literal('0'), v.literal(0)]),
                unit: v.enum(TSFUnit),
              }),
              v.transform(() => undefined),
            ),
            v.pipe(
              v.object({
                value: numberInputSchema,
                unit: v.enum(TSFUnit),
              }),
              v.check((data) => {
                if (data.unit === TSFUnit.mm) return data.value > 0 && data.value <= 1000;
                return true;
              }, `La valeur du pli cutané tricipital doit être comprise entre 0mm (exclusif) et 1000mm.`),
              v.transform((data) => {
                return {
                  code: AnthroSystemCodes.TSF,
                  value: data.value,
                  unit: data.unit,
                };
              }),
            ),
          ]),
        ),
      },
      {
        type: 'quantity',
        name: AnthroSystemCodes.SSF,
        label: 'Pli cutané sous-scapulaire',
        unitOptions: [
          {
            value: TSFUnit.mm,
            label: TSFUnit.mm,
          },
        ],
        default: {
          value: 0,
          unit: TSFUnit.mm,
        },
        alwaysShow: true,
        schema: v.optional(
          v.union([
            v.pipe(
              v.object({
                value: v.union([v.literal('0'), v.literal(0)]),
                unit: v.enum(TSFUnit),
              }),
              v.transform(() => undefined),
            ),
            v.pipe(
              v.object({
                value: v.pipe(numberInputSchema),
                unit: v.pipe(v.enum(TSFUnit)),
              }),
              v.check((data) => {
                if (data.unit === TSFUnit.mm) return data.value >= 0 && data.value <= 1000;
                return true;
              }, `La valeur du pli cutané sous-scapulaire doit être comprise entre 0mm et 1000mm.`),
              v.transform((data) => {
                return {
                  code: AnthroSystemCodes.SSF,
                  value: data.value,
                  unit: data.unit,
                };
              }),
            ),
          ]),
        ),
      },
    ],
  },
];
