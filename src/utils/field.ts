import * as v from 'valibot';
export type ShowMode = 'auto';
export type Data<T> = {
  showMode: T;
};

export type Field<T extends ShowMode = 'auto', U extends Data<T> = any> = {
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
  schema?: v.AnySchema;
};
