import { MonitoringElementCategory, VariableType } from '@/constants';
import * as v from 'valibot';

const doseValueSchema = v.union([
  v.object({ kind: v.literal('fixed'), value: v.number() }),
  v.object({ kind: v.literal('range'), min: v.number(), max: v.number() }),
]);

const frequencyOutputSchema = v.object({
  timesPerDay: v.number(),
  label: v.string(),
});

const computedDoseRowSchema = v.object({
  presentationCode: v.string(),
  presentationLabel: v.string(),
  form: v.string(),
  route: v.string(),
  dosePerIntake: doseValueSchema,
  unit: v.string(),
  displayFraction: v.string(),
  frequency: frequencyOutputSchema,
  dailyDose: doseValueSchema,
  dailyDoseUnit: v.string(),
});

const computedScheduleStepSchema = v.object({
  stepLabel: v.string(),
  offsetHours: v.number(),
  rows: v.array(computedDoseRowSchema),
});

const computedScheduleSchema = v.object({
  steps: v.array(computedScheduleStepSchema),
  totalDosesCount: v.optional(v.number()),
  durationDays: v.optional(v.number()),
  instructions: v.optional(v.string()),
});

const computedMedicineDosageSchema = v.object({
  medicineId: v.string(),
  medicineCode: v.string(),
  medicineName: v.string(),
  brandName: v.nullable(v.string()),
  category: v.string(),
  isApplicable: v.boolean(),
  inapplicableReason: v.optional(v.string()),
  rangeNotFound: v.boolean(),
  sodiumAlert: v.boolean(),
  maxDurationDays: v.nullable(v.number()),
  clinicalNotes: v.nullable(v.string()),
  clinicalContext: v.object({
    variables: v.record(v.string(), v.number()),
    appliedCondition: v.string(),
    appliedConditionDescription: v.string(),
    weightBracketLabel: v.string(),
    weightBracketMin: v.number(),
    weightBracketMax: v.nullable(v.number()),
  }),
  theoreticalBase: v.object({
    label: v.string(),
    dose: doseValueSchema,
    unit: v.string(),
    frequency: frequencyOutputSchema,
  }),
  totalDosePerIntake: doseValueSchema,
  totalDoseUnit: v.string(),
  globalFrequency: frequencyOutputSchema,
  rows: v.array(computedDoseRowSchema),
  schedule: v.optional(computedScheduleSchema),
});

const medicationResolvedDosageSchema = v.object({
  type: v.literal('medication'),
  computedAt: v.string(),
  dosage: v.object({
    medicineCode: v.string(),
    dosage: v.object({ value: v.number(), unit: v.string() }),
    computedDosage: v.optional(computedMedicineDosageSchema),
  }),
});

const mealDistributionSchema = v.object({
  frequency: v.number(),
  dosePerMeal: v.number(),
});

const calculatedTherapeuticDosageSchema = v.object({
  code: v.string(),
  contextId: v.string(),
  clinicalContext: v.object({
    weightUsed: v.number(),
    isAdmissionWeight: v.boolean(),
  }),
  practicalPrescription: v.object({
    unit: v.string(),
    mealDistributions: v.nullable(v.array(mealDistributionSchema)),
    totalPerDay: v.nullable(v.number()),
    totalPerWeek: v.nullable(v.number()),
  }),
  theoreticalTarget: v.object({
    min: v.number(),
    max: v.nullable(v.number()),
    unit: v.string(),
  }),
});

const nutritionalResolvedDosageSchema = v.object({
  type: v.literal('nutritional'),
  computedAt: v.string(),
  dosage: v.object({
    productCode: v.string(),
    dosage: v.object({ value: v.number(), unit: v.string() }),
    computedDosage: v.nullable(calculatedTherapeuticDosageSchema),
  }),
});

export const resolvedDosageSchema = v.union([
  medicationResolvedDosageSchema,
  nutritionalResolvedDosageSchema,
]);

const onCompletionTaskSchema = v.object({
  category: v.enum(MonitoringElementCategory),
  fields: v.array(v.string()),
});

export const syncMedicationTreatmentActionSchema = v.object({
  id: v.string(),
  treatmentCode: v.string(),
  treatmentType: v.literal('medication'),
  resolvedDosage: v.nullable(medicationResolvedDosageSchema),
  indications: v.null(),
  validFrom: v.string(),
  expiresAt: v.string(),
  onCompletionTasks: v.array(onCompletionTaskSchema),
});

export const syncNutritionalTreatmentActionSchema = v.object({
  id: v.string(),
  treatmentCode: v.string(),
  treatmentType: v.literal('nutritional'),
  resolvedDosage: v.nullable(nutritionalResolvedDosageSchema),
  indications: v.null(),
  validFrom: v.string(),
  expiresAt: v.string(),
  onCompletionTasks: v.array(onCompletionTaskSchema),
});

export const syncSupportiveTreatmentActionSchema = v.object({
  id: v.string(),
  treatmentCode: v.null(),
  treatmentType: v.literal('supportive'),
  resolvedDosage: v.null(),
  indications: v.array(v.string()),
  validFrom: v.string(),
  expiresAt: v.string(),
  onCompletionTasks: v.array(onCompletionTaskSchema),
});

export const syncTreatmentActionSchema = v.union([
  syncMedicationTreatmentActionSchema,
  syncNutritionalTreatmentActionSchema,
  syncSupportiveTreatmentActionSchema,
]);

export const syncMonitoringTaskSchema = v.object({
  id: v.string(),
  monitoringCode: v.string(),
  category: v.enum(MonitoringElementCategory),
  resolvedTemplate: v.object({
    type: v.enum(VariableType),
    fields: v.array(v.string()),
  }),
  validFrom: v.string(),
  expiresAt: v.string(),
});

export const syncDataCollectionTaskSchema = v.object({
  id: v.string(),
  category: v.enum(MonitoringElementCategory),
  requirements: v.array(
    v.object({
      code: v.string(),
      freshnessWindowInMinutes: v.number(),
    }),
  ),
});

export const localTaskStatusSchema = v.picklist([
  'pending_execution',
  'completed',
  'skipped',
  'missed',
]);

export const taskTypeSchema = v.picklist([
  'treatment_action',
  'monitoring_task',
  'data_collection_task',
]);

export const collectedFieldSchema = v.object({
  fieldCode: v.string(),
  dataId: v.string(),
  collectedAt: v.string(),
  value: v.unknown(),
});

export const localTaskSchema = v.object({
  id: v.string(),
  patientId: v.string(),
  taskType: taskTypeSchema,
  payload: v.union([
    syncTreatmentActionSchema,
    syncMonitoringTaskSchema,
    syncDataCollectionTaskSchema,
  ]),
  localStatus: localTaskStatusSchema,
  isLocked: v.boolean(),
  collectedFields: v.array(collectedFieldSchema),
  completedAt: v.nullable(v.string()),
  skippedAt: v.nullable(v.string()),
  skippedReason: v.nullable(v.string()),
  missedAt: v.nullable(v.string()),
  reportedOccurrenceAt: v.nullable(v.string()),
  isLateEntry: v.boolean(),
  receivedAt: v.string(),
});

export const taskBundleSchema = v.object({
  patientId: v.string(),
  treatmentActions: v.array(syncTreatmentActionSchema),
  monitoringTasks: v.array(syncMonitoringTaskSchema),
  dataCollectionTasks: v.array(syncDataCollectionTaskSchema),
});

export type SyncMedicationTreatmentAction = v.InferOutput<
  typeof syncMedicationTreatmentActionSchema
>;
export type SyncNutritionalTreatmentAction = v.InferOutput<
  typeof syncNutritionalTreatmentActionSchema
>;
export type SyncSupportiveTreatmentAction = v.InferOutput<
  typeof syncSupportiveTreatmentActionSchema
>;
export type SyncTreatmentAction = v.InferOutput<typeof syncTreatmentActionSchema>;
export type SyncMonitoringTask = v.InferOutput<typeof syncMonitoringTaskSchema>;
export type SyncDataCollectionTask = v.InferOutput<typeof syncDataCollectionTaskSchema>;
export type LocalTaskStatus = v.InferOutput<typeof localTaskStatusSchema>;
export type TaskType = v.InferOutput<typeof taskTypeSchema>;
export type CollectedField = v.InferOutput<typeof collectedFieldSchema>;
export type LocalTask = v.InferOutput<typeof localTaskSchema>;
export type TaskBundle = v.InferOutput<typeof taskBundleSchema>;
export type ResolvedDosage = v.InferOutput<typeof resolvedDosageSchema>;
