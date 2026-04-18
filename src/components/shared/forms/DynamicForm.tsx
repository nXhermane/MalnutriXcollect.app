import { createLogger } from '@/lib/utils/logger';
import { FormField } from './field';
import * as v from 'valibot';
import { useToast } from '@/hooks/useToast';
import { buildValibotSchema } from './helpers/build-valibot-schema-form-field';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { RadioField } from './RadioField';
import { CheckBoxField } from './CheckBoxField';
import { CheckBoxGroupField } from './CheckBoxGroupField';
import { DateField } from './DateField';
import { QuantifyField } from './QuantityField';
import { Surface } from 'heroui-native';
import { View, Text } from 'react-native';
const logger = createLogger('DynamicForm');

export type FormSection = {
  name?: string | null;
  fields: FormField[];
  disableName?: boolean;
};

interface DynamicFormProps<TOutput = object> {
  sections: FormSection[];
  onLoading?: (state: boolean) => void;
  onError?: (error?: string) => void;
  onSuccess?: (state: boolean) => void;
  onSubmit?: (data: TOutput) => void;
  onFormIsValid?: (state: boolean) => void;
  onInvalidInputCount?: (counter: number) => void;
  outputSchema?: v.BaseSchema<object, TOutput, v.BaseIssue<unknown>>;
  transformData?: (data: { [key: string]: unknown }) => TOutput;
  initialValues?: TOutput;
  extraData?: Record<string, unknown>;
  readonly?: boolean;
  containerClassName?: string;
  submitOnlyDirty?: boolean;
}

export interface DynamicFromMethods {
  submit: () => void;
  reset: (values: object) => void;
}

function DynamicFormComponent<TOutput extends { [x: string]: unknown }>(
  {
    sections,
    onError,
    onSuccess,
    onLoading,
    onSubmit,
    onFormIsValid,
    onInvalidInputCount,
    outputSchema,
    transformData,
    initialValues,
    extraData,
    readonly,
    containerClassName,
    submitOnlyDirty,
  }: DynamicFormProps<TOutput>,
  ref: React.Ref<DynamicFromMethods>,
) {
  const toast = useToast();
  const schema = buildValibotSchema(sections.flatMap((section) => section.fields));
  const [outputErrors, setOutputErrors] = useState<
    { [x: string]: [string, ...string[]] | undefined } | undefined
  >(undefined);

  const {
    watch,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: { ...initialValues } as never,
    mode: 'all',
  });

  const formData = watch();

  const filteredSections = useMemo(
    () =>
      sections.map(({ fields, ...props }) => ({
        fields: fields.filter((field) => {
          if (field.alwaysShow) return true;
          if (!field.condition) return true;
          return field.condition({ ...formData, ...extraData });
        }),
        ...props,
      })),
    [formData, sections, extraData],
  );

  const handleFormSubmit = useCallback(
    async (data: TOutput) => {
      try {
        if (onError) onError(undefined);
        if (onLoading) onLoading(true);
        if (onSuccess) onSuccess(false);
        setOutputErrors({});
        let finalData = data;
        if (submitOnlyDirty) {
          finalData = Object.keys(data).reduce(
            (acc, key) => {
              if (control.getFieldState(key).isDirty) {
                acc[key] = data[key];
              }
              return acc;
            },
            {} as Record<string, unknown>,
          ) as TOutput;
          logger.debug('Données soumises:', finalData);
        }
        if (transformData) {
          finalData = transformData(data);
          logger.debug('Données transformées:', finalData);
        }
        if (outputSchema) {
          const result = v.safeParse(outputSchema, finalData);
          if (!result.success) {
            logger.error(
              'Erreur de validation du schéma de sortie:',
              v.flatten(result.issues).nested,
            );
            setOutputErrors(v.flatten(result.issues).nested);
            if (onError) onError('Erreur de transformation des données');
            if (onLoading) onLoading(false);
            toast.show(
              'Error',
              'Erreur de transformation des données',
              v.flatten(result.issues).nested
                ? Object.values(v.flatten(result.issues).nested as never).join(',\n ')
                : undefined,
            );
            return;
          }
          finalData = result.output;
        }
        if (onSubmit) await Promise.resolve(onSubmit(finalData));
        if (onSuccess) onSuccess(true);
      } catch (error) {
        logger.error('Erreur lors de la soumission:', error);
        if (onError) {
          if (error instanceof Error) onError(error.message);
          else onError('Erreur lors de la soumission du formulaire');
        }
        toast.show(
          'Error',
          'Erreur lors de la soumission du formulaire',
          error instanceof Error ? error.message : undefined,
        );
      } finally {
        if (onLoading) onLoading(false);
      }
    },
    [
      toast,
      onError,
      onSubmit,
      onSuccess,
      onLoading,
      outputSchema,
      transformData,
      control,
      submitOnlyDirty,
    ],
  );

  const handleOnInvalidData = useCallback(
    (data: TOutput) => {
      logger.error('Erreur de validation des données:', data);
      if (onError) onError('Erreur de validation des données');
      toast.show(
        'Error',
        'Erreur de validation des données',
        'Veuillez bien verifier les données entrées',
      );
    },
    [onError, toast],
  );

  useEffect(() => {
    const visibleFields = filteredSections.flatMap(({ fields }) => fields);
    if (onFormIsValid) {
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
                if (typeof value === 'string') return value && value.length > 0;
                else return false;
              case 'number':
                return value !== undefined && value !== null && value !== '';
              case 'checkbox':
                return value !== undefined || value !== null;
              case 'checkbox-group':
                return Array.isArray(value) && value.length > 0;
              case 'quantity': {
                if (typeof value === 'object' && value && 'value' in value) {
                  return (
                    value.value !== undefined &&
                    value.value !== null &&
                    typeof value.value === 'number'
                  );
                } else return false;
              }
              default:
                return true;
            }
          }
          return true;
        }),
      );
    }
    if (onInvalidInputCount) {
      onInvalidInputCount(
        visibleFields.filter((field) => {
          if (errors[field.name] || (outputErrors && outputErrors[field.name])) return true;
          if (field.validation?.required) {
            const value = formData[field.name];
            switch (field.type) {
              case 'text':
              case 'select':
              case 'radio':
              case 'date':
                if (typeof value === 'string') return !value && value.length === 0;
                else return false;
              case 'number':
                return value === undefined || value === null || value === '';
              case 'checkbox':
                return value === undefined || value === null;
              case 'checkbox-group':
                return !Array.isArray(value) || value.length === 0;
              case 'quantity': {
                if (typeof value === 'object' && value && 'value' in value) {
                  return (
                    value.value === undefined ||
                    value.value === null ||
                    (typeof value.value === 'string' && value.value.trim() === '')
                  );
                } else return false;
              }
              default:
                return false;
            }
          }
          return false;
        }).length,
      );
    }
  }, [filteredSections, errors, onFormIsValid, formData, outputErrors, onInvalidInputCount]);

  useEffect(() => {
    if (onSuccess && formData) onSuccess(false);
  }, [formData, onSuccess]);

  useImperativeHandle(
    ref,
    () => ({
      submit: handleSubmit(
        handleFormSubmit as SubmitHandler<{ [key: string]: unknown }>,
        handleOnInvalidData as SubmitErrorHandler<{ [x: string]: unknown }>,
      ),
      reset,
    }),
    [handleFormSubmit, handleOnInvalidData, handleSubmit, reset],
  );

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'number':
        return (
          <NumberField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'select':
        return (
          <SelectField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'radio':
        return (
          <RadioField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'checkbox':
        return (
          <CheckBoxField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'checkbox-group':
        return (
          <CheckBoxGroupField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'date':
        return (
          <DateField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
            readonly={readonly}
          />
        );
      case 'quantity':
        return (
          <QuantifyField
            key={field.name}
            control={control}
            field={field}
            errors={errors}
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
      if (item.name !== undefined) {
        currentParent = { ...item, rowFields: [] };
        structured.push(currentParent);
      } else {
        if (currentParent) currentParent.rowFields.push(...item.fields);
      }
    });
    return structured;
  };

  return (
    <View className={`gap-v-3 px-2 w-full ${containerClassName}`}>
      {structuredData(filteredSections).map(({ fields, name, rowFields, disableName }, index) => (
        <View key={name || index.toString()} className="gap-v-2">
          {disableName
            ? null
            : name && (
                <View className="flex-row w-full items-center justify-between px-4">
                  <Text className="text-base font-semibold text-foreground">{name}</Text>
                </View>
              )}
          <Surface className="gap-v-3 p-4">
            {fields.map(renderField)}
            {rowFields.length > 0 && (
              <View className="flex-row justify-between gap-3">{rowFields.map(renderField)}</View>
            )}
          </Surface>
        </View>
      ))}
    </View>
  );
}

export const DynamicForm = forwardRef(DynamicFormComponent) as <T extends { [x: string]: unknown }>(
  props: DynamicFormProps<T> & { ref: React.Ref<DynamicFromMethods> },
) => ReturnType<typeof DynamicFormComponent<T>>;
