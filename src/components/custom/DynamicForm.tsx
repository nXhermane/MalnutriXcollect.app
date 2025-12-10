import { FormField } from '@/utils/field';
import { observer } from '@legendapp/state/react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { TextFieldComponent } from './TextField';
import { NumberFieldComponent } from './NumberText';
import { SelectFieldComponent } from './SelectField';
import { RadioFieldComponent } from './RadioField';
import { CheckBoxFieldComponent } from './CheckBoxField';
import { DateFieldComponent } from './DateField';
import { QuantityFieldComponent } from './QuantityField';
import { VStack } from '../ui/vstack';
import { FlatList } from 'react-native';

interface DynamicFormProps<TOutput = any> {
  fields: FormField[];
  onSubmit: (data: TOutput) => void;
  title?: string;
  submitLabel?: string;
  outputSchema?: v.BaseSchema<any, TOutput, any>;
  transformData?: (data: any) => TOutput;
}

function buildValibotSchema(fields: FormField[]) {
  const schemaObject: Record<string, v.AnySchema> = {};

  fields.forEach((field) => {
    if (field.schema) {
      schemaObject[field.name] = field.schema;
    } else {
      switch (field.type) {
        case 'text':
          schemaObject[field.name] = field.validation?.required
            ? (v.pipe(v.string(), v.minLength(1, `${field.label} est requis`)) as any) // !!ATTENTION: il va faloire ressoudre et enlever le any
            : v.optional(v.string());
          break;
        case 'number':
          let numberSchema: any = v.number();
          if (field.validation?.min !== undefined) {
            numberSchema = v.pipe(
              numberSchema,
              v.minValue(field.validation.min, `Valeur minimale: ${field.validation.min}`),
            );
          }
          if (field.validation?.max !== undefined) {
            numberSchema = v.pipe(
              numberSchema,
              v.maxValue(field.validation.max, `Valeur maximale: ${field.validation.max}`),
            );
          }
          schemaObject[field.name] = field.validation?.required
            ? numberSchema
            : v.optional(numberSchema);
          break;
        case 'select':
        case 'radio':
          schemaObject[field.name] = field.validation?.required
            ? (v.pipe(v.string(), v.minLength(1, `${field.label} est requis`)) as any)
            : v.optional(v.string());
          break;
        case 'checkbox':
          schemaObject[field.name] = field.validation?.required
            ? (v.pipe(v.array(v.string()), v.minLength(1, `${field.label} est requis`)) as any)
            : v.optional(v.array(v.string()));
          break;
        case 'date':
          schemaObject[field.name] = field.validation?.required
            ? (v.pipe(v.string(), v.minLength(1, `${field.label} est requis`)) as any)
            : v.optional(v.string());
          break;
        case 'quantity':
          schemaObject[field.name] = v.object({
            value: field.validation?.required ? v.number() : v.optional(v.number()),
            unit: v.string(),
          }) as any;
          break;
        default:
          console.warn('unexpected case.');
      }
    }
  });

  return v.object(schemaObject);
}
// @non tested component
export const DynamicForm = observer(function DynamicForm<TOutput = any>({
  fields,
  onSubmit,
  outputSchema,
  transformData,
}: DynamicFormProps<TOutput>) {
  const schema = buildValibotSchema(fields);
  const {
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(schema),
    mode: 'onChange',
  });

  const formData = watch();

  // Filter visible fields based on conditions
  const visibleFields = fields.filter((field) => {
    if (field.alwaysShow) return true;
    if (!field.condition) return true;
    return field.condition(formData);
  });

  //   const handleFormSubmit = async (data: any) => {
  //     try {
  //       let finalData = data;
  //       if (transformData) {
  //         finalData = transformData(data);
  //       }
  //       if (outputSchema) {
  //         const result = v.safeParse(outputSchema, finalData);
  //         if (!result.success) {
  //           console.error('Erreur de validation du schéma de sortie:', result.issues);
  //           //   formState$.submitError.set('Erreur de transformation des données');
  //           //   formState$.isSubmitting.set(false);
  //           return;
  //         }
  //         finalData = result.output;
  //       }

  //       await onSubmit(finalData);
  //     } catch (error) {
  //       console.error('Erreur lors de la soumission:', error);
  //       //   formState$.submitError.set('Erreur lors de la soumission du formulaire');
  //     } finally {
  //       //   formState$.isSubmitting.set(false);
  //     }
  //   };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextFieldComponent key={field.name} field={field} control={control} errors={errors} />
        );
      case 'number':
        return (
          <NumberFieldComponent key={field.name} field={field} control={control} errors={errors} />
        );
      case 'select':
        return (
          <SelectFieldComponent key={field.name} field={field} control={control} errors={errors} />
        );
      case 'radio':
        return (
          <RadioFieldComponent key={field.name} field={field} control={control} errors={errors} />
        );
      case 'checkbox':
        return (
          <CheckBoxFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={errors}
          />
        );
      case 'date':
        return (
          <DateFieldComponent key={field.name} field={field} control={control} errors={errors} />
        );
      case 'quantity':
        return (
          <QuantityFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VStack className="flex-1 gap-4">
      <FlatList
        data={visibleFields}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => renderField(item)}
      />
    </VStack>
  );
});
