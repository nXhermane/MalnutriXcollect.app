import { Field } from '@/utils/field';

type QuantityUnitOption<Value> = {
  value: Value;
  label: string;
};
export type QuantityField<TValues extends string = string> = Field & {
  type: 'quantity';
  unitOptions: QuantityUnitOption<TValues>[];
  default: { unit: TValues; value: number };
};
