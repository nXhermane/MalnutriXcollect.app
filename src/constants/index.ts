export enum AnthroSystemCodes {
  HEIGHT = 'height',
  LENGTH = 'length',
  WEIGHT = 'weight',
  HEAD_CIRCUMFERENCE = 'head_circumference',
  MUAC = 'muac',
  TSF = 'tsf',
  SSF = 'ssf',
}

/**
 * Nombre moyen de jours dans un mois (approximé à 30.4375 jours).
 * @constant
 */
export const DAY_IN_MONTHS = 30.4375;

/**
 * Nombre moyen de jours dans une année (incluant les années bissextiles).
 * @constant
 */
export const DAY_IN_YEARS = 365.25;

/**
 * Nombre de mois dans une année.
 * @constant
 */
export const MONTH_IN_YEARS = 12;

export const MAX_WEIGHT = 58.0;
export const MIN_WEIGHT = 0.9;
export const MIN_LENHEI = 38.0;
export const MAX_LENHEI = 150.0;

export const MAX_AGE_TO_USE_AGE_IN_DAY = DAY_IN_YEARS * 5;

export const DAY_IN_TWO_YEARS = Math.round(DAY_IN_YEARS * 2);

/**
 * Âge maximal en pédiatrie (19 ans).
 * @constant
 */
export const MAX_AGE_IN_PEDIATRIC = 19;
export const MAX_AGE_IN_MONTH_IN_PEDIATRIC = 228;

export const HOURS_IN_DAY = 24;

export const VITAL_SIGNS = {
  TEMPERATURE: 'vital_sign_temperature',
  RESPIRATORY_RATE: 'vital_sign_respiratory_rate',
} as const;

export const OBSERVATIONS = {
  SUBCOSTAL_RETRACTION: 'observation_subcostal_retraction',
  EDEMA_PRESENCE: 'observation_edema_presence',
  EDEMA_GODET_COUNT: 'observation_edema_godet_count',

  // Signes cutanés
  SKIN_CHANGES: 'observation_skin_changes',

  // Signes capillaires
  HAIR_CHANGES: 'observation_hair_changes',

  // Signes des ongles
  NAIL_CHANGES: 'observation_nail_changes',

  // Signes de la cornée
  CORNEA_CHANGES: 'observation_cornea_changes',

  // Signes buccaux
  MOUTH_CHANGES: 'observation_mouth_changes',

  // Signes hémorragiques
  HEMORRHAGE_SIGNS: 'observation_hemorrhage_signs',

  // État musculaire
  MUSCLE_LOSS: 'observation_muscle_loss',

  // Signes neurologiques
  NEURO_SIGNS: 'observation_neuro_signs',

  // État du foie
  HEPATOMEGALY: 'observation_hepatomegaly',

  // Articulations
  JOINT_ENLARGEMENT: 'observation_joint_enlargement',

  // Signes cardiaques
  TACHYCARDIA: 'observation_tachycardia',
} as const;

export const QUESTIONS = {
  EYELIDS_DURING_SLEEP: 'question_eyelids_during_sleep',
  CONSCIOUSNESS_LEVEL: 'question_consciousness_level',
} as const;

export const DATA_POINTS = {
  LIQUID_STOOL_COUNT: 'data_liquid_stool_count_per_day',
  VOMITING_COUNT: 'data_vomiting_count',
  GENERAL_CONDITION: 'data_general_condition',
  NUTRITIONAL_MILK_CONSUMPTION_G_PER_DAY: 'data_nutritional_milk_consumption_in_g_per_day',
  IS_BREASTFED: 'data_is_breastfed',
} as const;
type ValueOf<T> = T[keyof T];
export type DATA_FIELD_CODE_TYPE =
  | ValueOf<typeof OBSERVATIONS>
  | ValueOf<typeof VITAL_SIGNS>
  | ValueOf<typeof DATA_POINTS>
  | ValueOf<typeof QUESTIONS>;

export enum GENERAL_CONDITION_VALUES {
  ALTERED = 'altered',
  NORMAL = 'normal',
}

export enum FieldDataType {
  INT = 'number',
  BOOL = 'boolean',
  STR = 'string',
  RANGE = 'range',
  ENUM = 'enum',
  QUANTITY = 'quantity',
}

export enum DATA_TYPE_COUNTER {
  ANTHROPOMETRIC = 'anthropometric_counter',
  CLINICAL = 'clinical_sign_counter',
  BIOLOGICAL = 'biological_test_counter',
}

export enum DataFieldCategory {
  OBSERVATION = 'observation_data_field',
  VITAL_SIGN = 'vital_sign_data_field',
  QUESTION = 'question_data_field',
  DATA_POINTS = 'data_points_data_field',
}
export enum AnthroUnit {
  G = 'g',
  KG = 'kg',
  CM = 'cm',
  MM = 'mm',
}
