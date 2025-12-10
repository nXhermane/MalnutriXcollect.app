import { Field } from '@/utils/field';

export type DateField = Omit<Field, 'validation'> & {
  type: 'date';
  mode: 'date' | 'time';
  validation?: Field['validation'] & {
    min?: Date;
    max?: Date;
  };
};
