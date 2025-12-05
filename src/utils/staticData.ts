import { AnthroSystemCodes, AnthroUnit, DATA_POINTS, GENERAL_CONDITION_VALUES, OBSERVATIONS } from '@/constants';
import { Patient, PatientMeasure } from '@/models/schemas';
import { ParentRelation, Sex } from '@/models/schemas/patientSchema';

// Static patient data for demo purposes
export const staticPatients: Patient[] = [
  {
    id: 'demo-patient-1',
    name: 'Marie Dupont',
    birthdate: '2020-05-15',
    sex: Sex.FEMALE,
    isLocked: false,
    contact: {
      email: 'marie.dupont@example.com',
      tel: '+33123456789'
    },
    parents: [
      {
        relation: ParentRelation.MOTHER,
        name: 'Sophie Martin',
        tel: '+33123456790'
      },
      {
        relation: ParentRelation.FATHER,
        name: 'Jean Dupont',
        tel: '+33123456791'
      }
    ],
    address: {
      fullAddress: '123 Rue de la Paix, 75001 Paris, France',
      city: 'Paris'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-patient-2',
    name: 'Ahmed Hassan',
    birthdate: '2019-11-03',
    sex: Sex.MALE,
    isLocked: false,
    contact: {
      email: 'ahmed.hassan@example.com',
      tel: '+33123456792'
    },
    parents: [
      {
        relation: ParentRelation.MOTHER,
        name: 'Fatima Hassan',
        tel: '+33123456793'
      },
      {
        relation: ParentRelation.FATHER,
        name: 'Ali Hassan',
        tel: '+33123456794'
      }
    ],
    address: {
      fullAddress: '456 Avenue des Champs-Élysées, 75008 Paris, France',
      city: 'Paris'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-patient-3',
    name: 'Emma Johnson',
    birthdate: '2021-02-20',
    sex: Sex.FEMALE,
    isLocked: false,
    contact: {
      email: 'emma.johnson@example.com',
      tel: '+33123456795'
    },
    parents: [
      {
        relation: ParentRelation.MOTHER,
        name: 'Sarah Johnson',
        tel: '+33123456796'
      },
      {
        relation: ParentRelation.FATHER,
        name: 'Michael Johnson',
        tel: '+33123456797'
      }
    ],
    address: {
      fullAddress: '789 Boulevard Saint-Germain, 75005 Paris, France',
      city: 'Paris'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Static patient measures for demo purposes
export const staticPatientMeasures: Record<string, PatientMeasure[]> = {
  'demo-patient-1': [
    {
      id: 'measure-1-1',
      patientId: 'demo-patient-1',
      measures: [
        {
          code: AnthroSystemCodes.WEIGHT,
          value: 12.5,
          unit: AnthroUnit.KG
        },
        {
          code: AnthroSystemCodes.HEIGHT,
          value: 85.2,
          unit: AnthroUnit.CM
        },
        {
          code: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
          value: 48.5,
          unit: AnthroUnit.CM
        }
      ],
      fields: [
        {
          code: DATA_POINTS.LIQUID_STOOL_COUNT,
          value: 3
        },
        {
          code: DATA_POINTS.VOMITING_COUNT,
          value: 1
        },
        {
          code: DATA_POINTS.GENERAL_CONDITION,
          value: GENERAL_CONDITION_VALUES.NORMAL
        },
        {
          code: OBSERVATIONS.SUBCOSTAL_RETRACTION,
          value: false
        }
      ],
      isExported: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'measure-1-2',
      patientId: 'demo-patient-1',
      measures: [
        {
          code: AnthroSystemCodes.WEIGHT,
          value: 13.2,
          unit: AnthroUnit.KG
        },
        {
          code: AnthroSystemCodes.HEIGHT,
          value: 87.5,
          unit: AnthroUnit.CM
        }
      ],
      fields: [
        {
          code: DATA_POINTS.LIQUID_STOOL_COUNT,
          value: 1
        },
        {
          code: DATA_POINTS.GENERAL_CONDITION,
          value: GENERAL_CONDITION_VALUES.NORMAL
        }
      ],
      isExported: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  'demo-patient-2': [
    {
      id: 'measure-2-1',
      patientId: 'demo-patient-2',
      measures: [
        {
          code: AnthroSystemCodes.WEIGHT,
          value: 11.8,
          unit: AnthroUnit.KG
        },
        {
          code: AnthroSystemCodes.LENGTH,
          value: 82.3,
          unit: AnthroUnit.CM
        },
        {
          code: AnthroSystemCodes.MUAC,
          value: 14.2,
          unit: AnthroUnit.CM
        }
      ],
      fields: [
        {
          code: DATA_POINTS.LIQUID_STOOL_COUNT,
          value: 5
        },
        {
          code: DATA_POINTS.VOMITING_COUNT,
          value: 2
        },
        {
          code: DATA_POINTS.GENERAL_CONDITION,
          value: GENERAL_CONDITION_VALUES.ALTERED
        },
        {
          code: OBSERVATIONS.SUBCOSTAL_RETRACTION,
          value: true
        }
      ],
      isExported: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  'demo-patient-3': [
    {
      id: 'measure-3-1',
      patientId: 'demo-patient-3',
      measures: [
        {
          code: AnthroSystemCodes.WEIGHT,
          value: 9.5,
          unit: AnthroUnit.KG
        },
        {
          code: AnthroSystemCodes.HEIGHT,
          value: 78.0,
          unit: AnthroUnit.CM
        }
      ],
      fields: [
        {
          code: DATA_POINTS.LIQUID_STOOL_COUNT,
          value: 0
        },
        {
          code: DATA_POINTS.GENERAL_CONDITION,
          value: GENERAL_CONDITION_VALUES.NORMAL
        }
      ],
      isExported: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Utility function to initialize demo data
export const initializeDemoData = () => {
  // This function can be used to programmatically initialize demo data if needed
  console.log('Demo data initialized with', staticPatients.length, 'patients');
  return { patients: staticPatients, measures: staticPatientMeasures };
};