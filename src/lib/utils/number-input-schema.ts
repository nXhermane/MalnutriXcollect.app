import * as v from 'valibot';

export const numberInputSchema = v.pipe(
  v.any(),
  v.toString(),
  v.string(''),
  v.regex(/d*([.,])?\d*$/, 'Format numérique invalide.'),
  v.transform((input) => {
    const cleanedString = input.replace(',', '.');
    return parseFloat(cleanedString);
  }),
  v.number('Veuillez entrer une valeur numérique valide.'),
);
