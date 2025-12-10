import { Field } from '@/utils/field';

type CheckBoxOption<Value> = {
  value: Value;
  label: string;
};
export type CheckBoxField<TValues extends string = string> = Field & {
  type: 'checkbox';
  options: CheckBoxOption<TValues>[];
  default: TValues[];
};
