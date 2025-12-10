import { Field } from '@/utils/field';

export type NumberField = Omit<Field, 'validation'> & {
type: 'number'
  validation?: Field['validation'] & {
    min?: number;
    max?: number;
  };
};
