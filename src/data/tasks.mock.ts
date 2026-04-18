import { MonitoringElementCategory, VariableType } from '@/constants';
import type { LocalTask } from '@/schemas/task.schema';

const NOW = new Date().toISOString();
const VALID_FROM = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
const EXPIRES_AT = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
const PATIENT_ID = 'mock-patient-001';

export const mockTasks: LocalTask[] = [
  {
    id: 'task-medication-001',
    patientId: PATIENT_ID,
    taskType: 'treatment_action',
    localStatus: 'pending_execution',
    isLocked: false,
    collectedFields: [],
    completedAt: null,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: null,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-medication-001',
      treatmentType: 'medication',
      treatmentCode: 'amoxicillin',
      resolvedDosage: {
        type: 'medication',
        computedAt: NOW,
        dosage: {
          medicineCode: 'amoxicillin',
          dosage: { value: 250, unit: 'mg' },
          computedDosage: {
            medicineId: 'med-001',
            medicineCode: 'amoxicillin',
            medicineName: 'Amoxicilline',
            brandName: 'Clamoxyl',
            category: 'antibiotic',
            isApplicable: true,
            rangeNotFound: false,
            sodiumAlert: false,
            maxDurationDays: 7,
            clinicalNotes:
              'Administrer avec de la nourriture pour réduire les effets gastro-intestinaux.',
            clinicalContext: {
              variables: { weight: 8.5, age_in_month: 18 },
              appliedCondition: 'weight_8_to_10',
              appliedConditionDescription: 'Poids entre 8 et 10 kg',
              weightBracketLabel: '8–10 kg',
              weightBracketMin: 8,
              weightBracketMax: 10,
            },
            theoreticalBase: {
              label: '50 mg/kg/jour',
              dose: { kind: 'fixed', value: 50 },
              unit: 'mg/kg/j',
              frequency: { timesPerDay: 3, label: '3 fois par jour' },
            },
            totalDosePerIntake: { kind: 'fixed', value: 142 },
            totalDoseUnit: 'mg',
            globalFrequency: { timesPerDay: 3, label: '3 fois par jour' },
            rows: [
              {
                presentationCode: 'amox_250_susp',
                presentationLabel: 'Suspension 250 mg/5 ml',
                form: 'Suspension buvable',
                route: 'oral',
                dosePerIntake: { kind: 'fixed', value: 2.8 },
                unit: 'ml',
                displayFraction: '2,8 ml',
                frequency: { timesPerDay: 3, label: '3 fois par jour' },
                dailyDose: { kind: 'fixed', value: 8.5 },
                dailyDoseUnit: 'ml',
              },
            ],
          },
        },
      },
      indications: null,
      validFrom: VALID_FROM,
      expiresAt: EXPIRES_AT,
      onCompletionTasks: [
        { category: MonitoringElementCategory.ANTHROPOMETRIC, fields: ['weight'] },
      ],
    },
  },

  {
    id: 'task-nutritional-001',
    patientId: PATIENT_ID,
    taskType: 'treatment_action',
    localStatus: 'pending_execution',
    isLocked: false,
    collectedFields: [],
    completedAt: null,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: null,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-nutritional-001',
      treatmentType: 'nutritional',
      treatmentCode: 'RUTF',
      resolvedDosage: {
        type: 'nutritional',
        computedAt: NOW,
        dosage: {
          productCode: 'RUTF',
          dosage: { value: 3, unit: 'sachets/jour' },
          computedDosage: {
            code: 'RUTF',
            contextId: 'ctx-001',
            clinicalContext: {
              weightUsed: 8.5,
              isAdmissionWeight: false,
            },
            practicalPrescription: {
              unit: 'sachets',
              mealDistributions: [{ frequency: 3, dosePerMeal: 1 }],
              totalPerDay: 3,
              totalPerWeek: 21,
            },
            theoreticalTarget: {
              min: 2,
              max: 3,
              unit: 'sachets/jour',
            },
          },
        },
      },
      indications: null,
      validFrom: VALID_FROM,
      expiresAt: EXPIRES_AT,
      onCompletionTasks: [],
    },
  },

  {
    id: 'task-supportive-001',
    patientId: PATIENT_ID,
    taskType: 'treatment_action',
    localStatus: 'pending_execution',
    isLocked: false,
    collectedFields: [],
    completedAt: null,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: null,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-supportive-001',
      treatmentType: 'supportive',
      treatmentCode: null,
      resolvedDosage: null,
      indications: [
        'Maintenir une bonne hygiène buccale — nettoyer la bouche avec un linge humide 2 fois par jour.',
        "Positionner l'enfant en position semi-assise lors des repas pour éviter les fausses routes.",
        'Surveiller les signes de détresse respiratoire après chaque prise alimentaire.',
      ],
      validFrom: VALID_FROM,
      expiresAt: EXPIRES_AT,
      onCompletionTasks: [],
    },
  },

  {
    id: 'task-monitoring-anthro-001',
    patientId: PATIENT_ID,
    taskType: 'monitoring_task',
    localStatus: 'pending_execution',
    isLocked: false,
    collectedFields: [],
    completedAt: null,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: null,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-monitoring-anthro-001',
      monitoringCode: 'weight',
      category: MonitoringElementCategory.ANTHROPOMETRIC,
      resolvedTemplate: {
        type: VariableType.ANTHRO,
        fields: ['weight', 'muac'],
      },
      validFrom: VALID_FROM,
      expiresAt: EXPIRES_AT,
    },
  },

  {
    id: 'task-monitoring-bio-001',
    patientId: PATIENT_ID,
    taskType: 'monitoring_task',
    localStatus: 'completed',
    isLocked: false,
    collectedFields: [
      {
        fieldCode: 'hemoglobin',
        dataId: 'data-001',
        collectedAt: NOW,
        value: 9.2,
      },
    ],
    completedAt: NOW,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: NOW,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-monitoring-bio-001',
      monitoringCode: 'hemoglobin',
      category: MonitoringElementCategory.BIOCHEMICAL,
      resolvedTemplate: {
        type: VariableType.BIOLOGICAL,
        fields: ['hemoglobin', 'ferritin'],
      },
      validFrom: VALID_FROM,
      expiresAt: EXPIRES_AT,
    },
  },

  {
    id: 'task-datacollection-001',
    patientId: PATIENT_ID,
    taskType: 'data_collection_task',
    localStatus: 'pending_execution',
    isLocked: false,
    collectedFields: [],
    completedAt: null,
    skippedAt: null,
    skippedReason: null,
    reportedOccurrenceAt: null,
    isLateEntry: false,
    receivedAt: NOW,
    payload: {
      id: 'task-datacollection-001',
      category: MonitoringElementCategory.DATA_FIELD,
      requirements: [
        { code: 'observation_edema_presence', freshnessWindowInMinutes: 720 },
        { code: 'observation_consciousness_level', freshnessWindowInMinutes: 480 },
        { code: 'vital_sign_temperature', freshnessWindowInMinutes: 360 },
      ],
    },
  },
];

export const mockTasksById: Record<string, LocalTask> = Object.fromEntries(
  mockTasks.map((t) => [t.id, t]),
);
