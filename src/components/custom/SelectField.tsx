import { Field } from '@/utils/field';

type SelectOption<Value> = {
  value: Value;
  label: string;
};
export type SelectField<TValues extends string = string> = Field & {
  type: 'select';
  options: SelectOption<TValues>[];
  default: TValues;
};
