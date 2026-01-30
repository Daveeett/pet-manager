import { ValidationError } from "../validation-error.dto";

// Estructura de respuesta API estandarizada
export interface ApiResponse<T> {
  // Indica si la operación fue exitosa
  success: boolean;

  // Datos de la respuesta (presente solo en caso de éxito)
  data?: T;

  // Mensaje descriptivo de la operación
  message?: string;

  // Mensaje de error (presente sólo en caso de fallo)
  error?: string;

  // Detalles de errores de validación
  details?: ValidationError[];
}
