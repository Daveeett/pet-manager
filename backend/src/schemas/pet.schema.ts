import Joi from "joi";

//Regex para validar que un texto solo contiene letras y espacios
const TEXT_ONLY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

//Schema para validar creación de Pet
export const createPetSchema = Joi.object({
  name: Joi.string().min(2).max(50).pattern(TEXT_ONLY_REGEX).trim().required().messages({
      "string.empty": "El nombre es requerido",
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede exceder 50 caracteres",
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "any.required": "El nombre es requerido",
    }),

  species: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().required().messages({
      "string.empty": "La especie es requerida",
      "string.min": "La especie debe tener al menos 2 caracteres",
      "string.pattern.base": "La especie solo puede contener letras y espacios",
      "any.required": "La especie es requerida",
    }),

  breed: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().required().messages({
      "string.empty": "La raza es requerida",
      "string.min": "La raza debe tener al menos 2 caracteres",
      "string.pattern.base": "La raza solo puede contener letras y espacios",
      "any.required": "La raza es requerida",
    }),

  age: Joi.number().integer().min(0).max(100).required().messages({
    "number.base": "La edad debe ser un número entero",
    "number.integer": "La edad debe ser un número entero",
    "number.min": "La edad debe estar entre 0 y 100 años",
    "number.max": "La edad debe estar entre 0 y 100 años",
    "any.required": "La edad es requerida",
  }),

  ownerName: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().required().messages({
      "string.empty": "El nombre del dueño es requerido",
      "string.min": "El nombre del dueño debe tener al menos 2 caracteres",
      "string.pattern.base":"El nombre del dueño solo puede contener letras y espacios",
      "any.required": "El nombre del dueño es requerido",
    }),
});

//Schema para validar actualización de Pet
export const updatePetSchema = Joi.object({
  name: Joi.string().min(2).max(50).pattern(TEXT_ONLY_REGEX).trim().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
    "string.pattern.base": "El nombre solo puede contener letras y espacios",
  }),

  species: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().messages({
    "string.min": "La especie debe tener al menos 2 caracteres",
    "string.pattern.base": "La especie solo puede contener letras y espacios",
  }),

  breed: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().messages({
    "string.min": "La raza debe tener al menos 2 caracteres",
    "string.pattern.base": "La raza solo puede contener letras y espacios",
  }),

  age: Joi.number().integer().min(0).max(100).messages({
    "number.base": "La edad debe ser un número entero",
    "number.integer": "La edad debe ser un número entero",
    "number.min": "La edad debe estar entre 0 y 100 años",
    "number.max": "La edad debe estar entre 0 y 100 años",
  }),

  ownerName: Joi.string().min(2).pattern(TEXT_ONLY_REGEX).trim().messages({
    "string.min": "El nombre del dueño debe tener al menos 2 caracteres",
    "string.pattern.base":
      "El nombre del dueño solo puede contener letras y espacios",
  }),
})
  .min(1)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar",
  });


  //Schema para validar UUID en parámetros de ruta
export const uuidSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "ID inválido. Debe ser un UUID válido",
    "any.required": "El ID es requerido",
  }),
});

