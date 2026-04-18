import { KeyboardTypeOptions } from 'react-native';
import * as v from 'valibot';

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  help?: string;
  disabled?: boolean;
  readonly?: boolean;
  alwaysShow?: boolean;
  validation?: {
    required?: boolean;
  };
  condition?: (data: unknown) => boolean;
  schema?: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> | false;
};
export type NumberField = Omit<Field, 'validation'> & {
  type: 'number';
  validation?: Field['validation'] & {
    min?: number;
    max?: number;
  };
  default?: number;
};

type CheckBoxGroupOption<Value> = {
  value: Value;
  label: string;
};
export type CheckBoxGroupField<TValues extends string = string> = Field & {
  type: 'checkbox-group';
  options: CheckBoxGroupOption<TValues>[];
  default: TValues[];
};

export type CheckBoxField = Field & {
  type: 'checkbox';
  option: { label: string };
  default: boolean;
};

export type DateField = Omit<Field, 'validation'> & {
  type: 'date';
  mode: 'date' | 'time';
  validation?: Field['validation'] & {
    min?: Date;
    max?: Date;
  };
  default: Date | undefined;
};

type RadioOption<Value> = {
  value: Value;
  label: string;
};
export type RadioField<TValues extends string = string> = Field & {
  type: 'radio';
  options: RadioOption<TValues>[];
  default: TValues;
};
type SelectOption<Value> = {
  value: Value;
  label: string;
};
export type SelectField<TValues extends string = string> = Field & {
  type: 'select';
  options: SelectOption<TValues>[];
  default: TValues;
};

export type TextField = Field & {
  type: 'text';
  mode: 'input' | 'textarea';
  default?: string;
  keyboardType?: KeyboardTypeOptions;
};
type QuantityUnitOption<Value> = {
  value: Value;
  label: string;
};
export interface QuantityValue {
  value: number;
  unit: string;
}
export type QuantityField<TValues extends string = string> = Omit<Field, 'validation'> & {
  type: 'quantity';
  unitOptions: QuantityUnitOption<TValues>[];
  default: { unit: TValues; value: number };
  validation?: Field['validation'] & {
    min?: number;
    max?: number;
  };
};

export type FormField =
  | TextField
  | NumberField
  | CheckBoxField
  | CheckBoxGroupField
  | RadioField
  | SelectField
  | DateField
  | QuantityField;
