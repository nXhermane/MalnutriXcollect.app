import { Field } from '@/utils/field';

type RadioOption<Value> = {
  value: Value;
  label: string;
};
export type RadioField<TValues extends string = string> = Field & {
  type: 'radio';
  options: RadioOption<TValues>[];
  default: TValues
};
