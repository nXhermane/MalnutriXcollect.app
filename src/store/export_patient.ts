import { observable } from '@legendapp/state';

export const export_patient$ = observable<{
  compiled_patient_ids: string[];
  data_frames: string[] | null;
  isRunning: boolean;
}>({
  compiled_patient_ids: [],
  data_frames: null,
  isRunning: false,
});
