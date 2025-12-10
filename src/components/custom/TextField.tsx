import { Field } from '@/utils/field';

export type TextField = Field & {
  type: 'text';
  mode: 'input' | 'textarea';
};
