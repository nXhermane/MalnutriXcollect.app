import { AnthroSystemCodes, AnthroUnit } from "@/constants"
import * as v from "valibot"

export const anthropometricSchema = v.object({
    code: v.enum(AnthroSystemCodes),
    value: v.pipe(v.number(), v.minValue(0, "La valeur anthropométrique ne peut être négative.")),
    unit: v.enum(AnthroUnit)
})

export const dataFieldValueSchema = v.object({
    value: v.pipe(v.any(), v.nonEmpty()),
    code: v.string()
})
export const createPatientMeasureSchema = v.object({
    measures: v.array(anthropometricSchema),
    fields: v.array(dataFieldValueSchema),
})

export const patientMeasureSchema = v.object({
    id: v.pipe(v.string(), v.nanoid("ID invalide")),
    measures: v.array(anthropometricSchema),
    fields: v.array(dataFieldValueSchema),
    isExported: v.boolean(),
    createdAt: v.pipe(v.string(), v.isoTimestamp()),
    updatedAt: v.pipe(v.string(), v.isoTimestamp()),
})

export type PatientMeasureDTO = v.InferOutput<typeof patientMeasureSchema>
export type CreatePatientMeasureDTO = v.InferOutput<typeof createPatientMeasureSchema>
export type AnthropometricDTO = v.InferOutput<typeof anthropometricSchema>
export type DataFieldDTO =v.InferOutput<typeof dataFieldValueSchema>