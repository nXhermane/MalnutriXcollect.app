type ValueOf<T> = T[keyof T];

export const VITAL_SIGNS = {
  TEMPERATURE: 'vital_sign_temperature',
  RESPIRATORY_RATE: 'vital_sign_respiratory_rate',
  PULSE_RATE: 'vital_sign_pulse_rate',
} as const;

export const OBSERVATIONS = {
  CONSCIOUSNESS_LEVEL: 'observation_consciousness_level',
  EYELIDS_DURING_SLEEP: 'observation_eyelids_during_sleep',
  GENERAL_CONDITION: 'observation_general_condition',
  SUBCOSTAL_RETRACTION: 'observation_subcostal_retraction',
  TACHYCARDIA: 'observation_tachycardia',
  EDEMA_PRESENCE: 'observation_edema_presence',
  EDEMA_GODET_COUNT: 'observation_edema_godet_count',
  SKIN_CHANGES: 'observation_skin_changes',
  HAIR_CHANGES: 'observation_hair_changes',
  NAIL_CHANGES: 'observation_nail_changes',
  CORNEA_CHANGES: 'observation_cornea_changes',
  MOUTH_CHANGES: 'observation_mouth_changes',
  HEMORRHAGE_SIGNS: 'observation_hemorrhage_signs',
  MUSCLE_LOSS: 'observation_muscle_loss',
  JOINT_ENLARGEMENT: 'observation_joint_enlargement',
  NEURO_SIGNS: 'observation_neuro_signs',
  HEPATOMEGALY: 'observation_hepatomegaly',
  CHILD_EATEN_WELL: 'observation_child_eaten_well',
  CAPILLARY_REFILL: 'observation_capillary_refill',
  EXTREMITIES_TEMPERATURE: 'observation_extremities_temperature',
  EYE_SIGNS: 'observation_eye_signs',
  RECENT_FLUID_LOSS: 'observation_recent_fluid_loss',
  EYES_SUNKEN: 'observation_eyes_sunken',
  SKIN_PINCH_SLOW: 'observation_skin_pinch_slow',
  ORAL_THRUSH: 'observation_oral_thrush',
  CANDIDOSIS_SUSPECTED: 'observation_candidosis_suspected',
  CONJUNCTIVITIS: 'observation_conjunctivitis',
  CORNEA_ULCERATED: 'observation_cornea_ulcerated',
  EYE_PAIN_CLOSED: 'observation_eye_pain_closed',
  EYE_RED_BLEEDING: 'observation_eye_red_bleeding',
  IMPETIGO_SIGNS: 'observation_impetigo_signs',
  SKIN_LESIONS_KWASH: 'observation_skin_lesions_kwashiorkor',
  SKIN_PUSTULES: 'observation_skin_pustules',
  PERINEAL_EXCORIATION: 'observation_perineal_excoriation',
  SKIN_TEXTURE_DOUGHY: 'observation_skin_texture_doughy',
  SKIN_TEXTURE_NORMAL: 'observation_skin_texture_normal',
  STOOL_BLOOD: 'observation_stool_blood',
  SPLASH_SIGN: 'observation_splash_sign',
  ABDOMINAL_DISTENSION: 'observation_abdominal_distension',
  BOWEL_SOUNDS_PRESENT: 'observation_bowel_sounds_present',
  BOWEL_SOUNDS_ABSENT: 'observation_bowel_sounds_absent',
  GASTRIC_RESIDUE: 'observation_gastric_residue',
  ABDOMEN_SCAPHOID: 'observation_abdomen_scaphoid',
  PULSE_NORMAL: 'observation_pulse_normal',
  LIVER_SIZE_NORMAL: 'observation_liver_size_normal',
  NEW_NEURO_SYMPTOMS: 'observation_new_neuro_symptoms',
  PULSE_WEAK_FAST: 'observation_pulse_weak_fast',
  EXTREMITIES_COLD: 'observation_extremities_cold',
  CAPILLARY_REFILL_SLOW: 'observation_capillary_refill_slow',
  CONSCIOUSNESS_ALTERED: 'observation_consciousness_altered',
  LIVER_SIZE_INCREASE: 'observation_liver_size_increase',
  JUGULAR_VEINS_DISTENDED: 'observation_jugular_veins_distended',
  ANOREXIA_SEVERE: 'observation_anorexia_severe',
} as const;

export const QUESTIONS = {
  IS_BREASTFED: 'question_is_breastfed',
  LIQUID_STOOL_COUNT: 'question_liquid_stool_count_per_day',
  VOMITING_COUNT: 'question_vomiting_count',
  NUTRITIONAL_MILK_CONSUMPTION_G_PER_DAY: 'question_nutritional_milk_consumption_in_g_per_day',
  NUTRITIONAL_MILK_CONSUMPTION_DAILY_VOLUME_IN_PERCENT:
    'question_nutritional_milk_consumption_daily_volume_in_percent',
  CHILD_REFUSED_TO_EAT_RUTF: 'question_child_refused_to_eat_rutf',
  CHILD_DOES_NOT_EAT_ANY_FOOD_THAN_MILK: 'question_child_does_not_eat_any_food_than_milk',
  PARASITES_DIAGNOSED: 'question_parasites_diagnosed',
  CHOLERA_CONFIRMED: 'question_cholera_confirmed',
  AMOEBA_SUSPECTED: 'question_amoeba_suspected',
  GIARDIA_SUSPECTED: 'question_giardia_suspected',
  SYSTEMATIC_TREATMENT_DUE: 'question_systematic_treatment_due',
  DRUG_CHOICE: 'question_drug_choice',
  LAST_DOSE_GT_1_MONTH: 'question_last_dose_gt_1_month',
  INTAKED_THERAPEUTIC_PRODUCT_QUANTITY: 'question_intaked_milk_quantity_per_day',
  RECOMMENDED_THERAPEUTIC_PRODUCT_QUANTITY: 'question_recommended_milk_quantity_per_day',
} as const;

export type DATA_FIELD_CODE_TYPE =
  | ValueOf<typeof OBSERVATIONS>
  | ValueOf<typeof VITAL_SIGNS>
  | ValueOf<typeof QUESTIONS>;

export enum GENERAL_CONDITION_VALUES {
  ALTERED = 'altered',
  NORMAL = 'normal',
}

export enum ClinicalDataType {
  INT = 'number',
  BOOL = 'boolean',
  STR = 'string',
  RANGE = 'range',
  ENUM = 'enum',
  QUANTITY = 'quantity',
}

export enum FieldDataType {
  INT = 'number',
  BOOL = 'boolean',
  STR = 'string',
  RANGE = 'range',
  ENUM = 'enum',
  QUANTITY = 'quantity',
}

export enum FieldContext {
  CLINICAL = 'clinical',
  FIELD = 'field',
  FORMULA = 'formula',
}

export enum DataFieldCategory {
  OBSERVATION = 'observation_data_field',
  VITAL_SIGN = 'vital_sign_data_field',
  QUESTION = 'question_data_field',
}

export enum DataFieldConditionOperator {
  EQ = 'eq',
  NEQ = 'neq',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  IN = 'in',
  NIN = 'nin',
}

export enum MonitoringElementCategory {
  ANTHROPOMETRIC = 'anthropometric_monitoring_element',
  BIOCHEMICAL = 'biochemical_monitoring_element',
  CLINICAL_SIGNS = 'clinical_signs_monitoring_element',
  DATA_FIELD = 'data_field_monitoring_element',
  FORMULA_FIELD = 'formula_field_monitoring_element',
  APPETITE_TEST = 'appetite_test_monitorint_element',
}

export enum VariableType {
  ANTHRO = 'anthropometry',
  FIELD = 'field',
  BIOLOGICAL = 'biological',
  APPETITE_TEST = 'appetite_test',
  INDICATOR = 'indicator',
}
