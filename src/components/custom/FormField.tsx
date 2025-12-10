import { CheckBoxField } from './CheckBoxField';
import { DateField } from './DateField';
import { NumberField } from './NumberText';
import { QuantityField } from './QuantityField';
import { RadioField } from './RadioField';
import { SelectField } from './SelectField';
import { TextField } from './TextField';

type FormField =
  | TextField
  | NumberField
  | CheckBoxField
  | RadioField
  | SelectField
  | DateField
  | QuantityField;
