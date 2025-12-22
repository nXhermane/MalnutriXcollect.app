import * as v from 'valibot';
export type ShowMode = 'auto';
export type Data<T> = {
  showMode: T;
};

// Define the structure of a data field reference
export interface DataFieldReference {
  category: string;
  code: string;
  label: string;
  question: string;
  type: string;
  defaultValue: any;
  enumValue?: { value: string; label: string }[];
  dataRange?: [number, number];
  units?: {
    available: string[];
    default: string;
  };
}

export type Field<T extends ShowMode = 'auto', U extends Data<T> = any, TSchema = any> = {
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
  condition?: (data: U) => boolean;
  schema?: v.BaseSchema<TSchema, U[keyof U], any> | v.BaseSchemaAsync<TSchema, U[keyof U], any>;
};
export type NumberField = Omit<Field, 'validation'> & {
  type: 'number';
  validation?: Field['validation'] & {
    min?: number;
    max?: number;
  };
  default?: number;
};

type CheckBoxOption<Value> = {
  value: Value;
  label: string;
};
export type CheckBoxField<TValues extends string = string> = Field & {
  type: 'checkbox';
  options: CheckBoxOption<TValues>[];
  default: TValues[];
};
export type DateField = Omit<Field, 'validation'> & {
  type: 'date';
  mode: 'date' | 'time';
  validation?: Field['validation'] & {
    min?: Date;
    max?: Date;
  };
  default: Date;
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
};
type QuantityUnitOption<Value> = {
  value: Value;
  label: string;
};
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
  | RadioField
  | SelectField
  | DateField
  | QuantityField;
