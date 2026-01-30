import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiResponse } from "../interfaces/response/api-response.interface";
import { ValidationError } from "../interfaces/response/validation-error.interface";

// middleware reutilizable para cualquier schema Joi y cualquier tipo de validación
export const validate = (schema: Joi.ObjectSchema,source: "body" | "params" | "query" = "body") => {
  return async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
      //Valida y transforma datos según el schema
      const { error, value } = schema.validate(req[source], {
        abortEarly: false, // Recopila todos los errores, no solo el primero
        stripUnknown: true, // Elimina campos desconocidos
      });

      if (error) {
        // Formatea errores de Joi al formato de la API
        const validationErrors: ValidationError[] = error.details.map(
          (detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          }),
        );

        const response: ApiResponse<null> = {
          success: false,
          error: "Error de validación",
          details: validationErrors,
        };

        res.status(400).json(response);
        return;

      }

      // Reemplaza los datos originales con los validados y transformados
      req[source] = value;

      next();
      
    } catch (err) {
      next(err);
    }
  };
};
