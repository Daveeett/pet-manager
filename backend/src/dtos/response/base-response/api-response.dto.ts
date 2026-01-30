import { ValidationError } from "../../../interfaces/response/validation-error.interface";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  //Detalles de errores de validación
  details?: ValidationError[];
}
