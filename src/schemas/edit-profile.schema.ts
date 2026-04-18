import { PROFESSION_OPTIONS } from '@/store/user/user.store';
import * as v from 'valibot';

const professionValues = PROFESSION_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const editProfileSchema = v.object({
  display_name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Le nom est requis')),
  profession: v.picklist(professionValues),
  phone: v.optional(v.pipe(v.string(), v.maxLength(20))),
  bio: v.optional(v.pipe(v.string(), v.maxLength(500))),
});

export type EditProfileDto = v.InferOutput<typeof editProfileSchema>;
