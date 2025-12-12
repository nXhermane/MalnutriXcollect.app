import { FormField } from '@/utils/field';
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
import {
  forwardRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { useToast } from '@/providers/Toast';
import * as Hapatic from 'expo-haptics';
import { numberInputSchema } from '@/utils/shared';

export type FormSection = {
  name?: string;
  fields: FormField[];
};
interface DynamicFormProps<TOutput = any> {
  sections: FormSection[];
  onLoading?: (state: boolean) => void;
  onError?: (error?: string) => void;
  onSucess?: (state: boolean) => void;
  onSubmit?: (data: TOutput) => void;
  onFormIsValid?: (state: boolean) => void;
  onInvalidInputCount?: (counter: number) => void;
  outputSchema?: v.BaseSchema<any, TOutput, any>;
  transformData?: (data: any) => TOutput;
  initialValues?: TOutput;
  readonly?: boolean;
}
export interface DynamicFromMethods {
  submit: () => void;
  reset: (values: any) => void;
}

function buildValibotSchema(fields: FormField[]) {
  const schemaObject: Record<string, v.AnySchema> = {};

  fields.forEach((field) => {
    if (field.schema) {
      schemaObject[field.name] = field.schema as any;
    } else {
      switch (field.type) {
        case 'text':
          schemaObject[field.name] = field.validation?.required
            ? (v.pipe(v.string(), v.minLength(1, `${field.label} est requis`)) as any) // !!ATTENTION: il va faloire ressoudre et enlever le any
            : v.optional(v.string());
          break;
        case 'number':
          let numberSchema: any = numberInputSchema;

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
          {
            let numberSchema: any = numberInputSchema;
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
            schemaObject[field.name] = v.object({
              value: numberSchema,
              unit: v.string(),
            }) as any;
          }
          break;
        default:
          console.warn('unexpected case.');
      }
    }
  });

  return v.object(schemaObject);
}

function DynamicFormComponent<TOutput = any>(
  {
    sections,
    onError,
    onSucess,
    onLoading,
    onSubmit,
    onFormIsValid,
    onInvalidInputCount,
    outputSchema,
    transformData,
    initialValues,
    readonly,
  }: DynamicFormProps<TOutput>,
  ref: React.Ref<DynamicFromMethods>,
) {
  const toast = useToast();
  const schema = buildValibotSchema(sections.flatMap((section) => section.fields));
  const [outputErrors, setOutputErrors] = useState<any>({});
  const {
    watch,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: { ...initialValues },
    mode: 'onChange',
  });

  const formData = watch();

  // Filter visible fields based on conditions
  const filteredSections = useMemo(
    () =>
      sections.map(({ fields, name }) => ({
        name,
        fields: fields.filter((field) => {
          if (field.alwaysShow) return true;
          if (!field.condition) return true;
          return field.condition(formData);
        }),
      })),
    [formData, sections],
  );
  const handleFormSubmit = useCallback(
    async (data: TOutput) => {
      try {
        onError && onError(undefined);
        onLoading && onLoading(true);
        onSucess && onSucess(false);
        setOutputErrors({});
        let finalData = data;
        if (transformData) {
          finalData = transformData(data);
        }
        if (outputSchema) {
          const result = v.safeParse(outputSchema, finalData);
          if (!result.success) {
            console.error(
              'Erreur de validation du schéma de sortie:',
              v.flatten(result.issues).nested,
            );
            setOutputErrors(v.flatten(result.issues).nested);
            Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
            onError && onError('Erreur de transformation des données');
            onLoading && onLoading(false);
            toast.show('Error', 'Erreur de transformation des données', undefined, 'top');
            return;
          }
          finalData = result.output;
        }

        onSubmit && (await onSubmit(finalData));
        onSucess && onSucess(true);
        Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
        onError && onError('Erreur lors de la soumission du formulaire');
        toast.show('Error', 'Erreur lors de la soumission du formulaire', undefined, 'top');
      } finally {
        onLoading && onLoading(false);
      }
    },
    [toast, onError, onSubmit, onSucess, onLoading, outputSchema, transformData],
  );
  const handleOnInvalidData = useCallback(
    (data: any) => {
      console.log('Erreur de validation des données:', data);
      Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
      onError && onError('Erreur de validation des données');
      toast.show(
        'Error',
        'Erreur de validation des données',
        'Veuillez bien verifier les données entrées',
        'top',
      );
    },
    [onError, toast],
  );

  useEffect(() => {
    const visibleFields = filteredSections.flatMap(({ fields }) => fields);
    onFormIsValid &&
      onFormIsValid(
        visibleFields.every((field) => {
          if (errors[field.name]) return false;
          if (field.validation?.required) {
            const value = formData[field.name];
            switch (field.type) {
              case 'text':
              case 'select':
              case 'radio':
              case 'date':
                return value && value.length > 0;
              case 'number':
                return value !== undefined && value !== null && value !== '';
              case 'checkbox':
                return Array.isArray(value) && value.length > 0;
              case 'quantity':
                return (
                  value && value.value !== undefined && value.value !== null && value.value !== ''
                );
              default:
                return true;
            }
          }

          return true;
        }),
      );
    onInvalidInputCount &&
      onInvalidInputCount(
        visibleFields.filter((field) => {
          if (errors[field.name] || outputErrors[field.name]) return true;
          if (field.validation?.required) {
            const value = formData[field.name];

            switch (field.type) {
              case 'text':
              case 'select':
              case 'radio':
              case 'date':
                return !value || value.length === 0;
              case 'number':
                return value === undefined || value === null || value === '';
              case 'checkbox':
                return !Array.isArray(value) || value.length === 0;
              case 'quantity':
                return (
                  !value || value.value === undefined || value.value === null || value.value === ''
                );
              default:
                return false;
            }
          }

          return false;
        }).length,
      );
  }, [filteredSections, errors, onFormIsValid, formData, outputErrors, onInvalidInputCount]);
  useImperativeHandle(
    ref,
    () => ({
      submit: handleSubmit(handleFormSubmit as any, handleOnInvalidData),
      reset,
    }),
    [handleFormSubmit, handleOnInvalidData, handleSubmit, reset],
  );

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'number':
        return (
          <NumberFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'select':
        return (
          <SelectFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'radio':
        return (
          <RadioFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'checkbox':
        return (
          <CheckBoxFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'date':
        return (
          <DateFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      case 'quantity':
        return (
          <QuantityFieldComponent
            key={field.name}
            field={field}
            control={control}
            errors={{ ...errors, ...outputErrors }}
            readonly={readonly}
          />
        );
      default:
        return null;
    }
  };
  const structuredData = (data: FormSection[]) => {
    const structured: (FormSection & { rowFields: FormField[] })[] = [];
    let currentParent: (FormSection & { rowFields: FormField[] }) | null = null;

    data.forEach((item) => {
      if (item.name) {
        currentParent = { ...item, rowFields: [] };
        structured.push(currentParent);
      } else {
        currentParent && currentParent.rowFields.push(...item.fields);
      }
    });
    return structured;
  };

  return (
    <VStack className="flex-1 gap-v-3 px-2">
      {structuredData(filteredSections).map(({ fields, name, rowFields }, index) => {
        return (
          <VStack key={name || index.toString()} className="gap-v-2">
            {name && (
              <HStack className={'items-center justify-between px-4'}>
                <Text className="font-h4 text-lg font-medium text-foreground">{name}</Text>
              </HStack>
            )}
            <VStack className="gap-v-3 rounded-xl border border-border bg-card  p-4 ">
              {fields.map(renderField)}
              {rowFields.length > 0 && (
                <HStack className="justify-between gap-3">{rowFields.map(renderField)}</HStack>
              )}
            </VStack>
          </VStack>
        );
      })}
    </VStack>
  );
}

export const DynamicForm = forwardRef(DynamicFormComponent);

export function useDynamicFormHelpers() {
  const dynamicFromRef = useRef<DynamicFromMethods>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [onSucess, setOnSucess] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorInputCounter, setErrorInputCounter] = useState<number>(0);
  const props = {
    ref: dynamicFromRef,
    onError: (error: string | undefined) => setError(error),
    onSucess: (state: boolean) => {
      setOnSucess(state);
      if (state) dynamicFromRef.current?.reset({});
    },
    onLoading: (state: boolean) => setIsLoading(state),
    onFormIsValid: (state: boolean) => setIsFormValid(state),
    onInvalidInputCount: (counter: number) => setErrorInputCounter(counter),
  };
  return {
    props,
    submit: dynamicFromRef.current?.submit,
    reset: dynamicFromRef.current?.reset,
    loading: isLoading,
    error,
    sucess: onSucess,
    formReady: !isFormValid,
    invalidInputCount: errorInputCounter,
  };
}
