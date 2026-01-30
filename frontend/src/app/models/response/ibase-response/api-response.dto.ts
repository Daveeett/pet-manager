import { ValidationError } from "../validation-error.dto";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: ValidationError[];
}
