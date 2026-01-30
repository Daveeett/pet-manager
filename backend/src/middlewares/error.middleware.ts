import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../interfaces/response/api-response.interface";

//Captura todos los errores no manejados de la aplicación y los formatea

export const errorHandler = ( err: Error,_req: Request,res: Response,_next: NextFunction,): void => {
  // Formatea la respuesta de error
  const response: ApiResponse<null> = {
    success: false,
    error: err.message || "Error interno del servidor",
  };

  // Determina el código de estado HTTP
  const statusCode = 500;

  res.status(statusCode).json(response);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: "Ruta no encontrada",
  };

  res.status(404).json(response);

};
