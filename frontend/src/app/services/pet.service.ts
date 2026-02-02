import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Pet } from "../models/response/pet/pet.dto";
import { CreatePetDTO } from "../models/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../models/request/pet/update-pet.dto";
import { ApiResponse } from "../models/response/ibase-response/api-response.dto";
import { PaginatedResponse } from "../models/response/paginated-response.dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PetService {
  private readonly apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getAllPets(page: number = 1, limit: number = 6, search?: string): Observable<PaginatedResponse<Pet>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString());

    if (search && search.trim()) {
      params = params.set("search", search.trim());
    }

    return this.http.get<PaginatedResponse<Pet>>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response; // Devuelve la respuesta completa
        }
        throw new Error("Error al obtener mascotas");
      }),
      catchError(this.handleError),
    );
  }

  searchPets(searchTerm: string, page: number = 1, limit: number = 6): Observable<PaginatedResponse<Pet>> {
    return this.getAllPets(page, limit, searchTerm);
  }

  getPetById(id: string): Observable<Pet> {
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error);
      }),
      catchError(this.handleError),
    );
  }

  createPet(pet: CreatePetDTO): Observable<Pet> {
    return this.http.post<ApiResponse<Pet>>(this.apiUrl, pet).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error);
      }),
      catchError(this.handleError),
    );
  }

  updatePet(id: string, pet: UpdatePetDTO): Observable<Pet> {
    return this.http.put<ApiResponse<Pet>>(`${this.apiUrl}/${id}`, pet).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }

        throw new Error(response.error);
      }),
      catchError(this.handleError),
    );
  }

  deletePet(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = "Ha ocurrido un error inesperado";
    let validationDetails: { field: string; message: string }[] | undefined;

      // Error del navegador
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;

    } 
    else if (error.error?.error) {
      // Error del servidor 
      errorMessage = error.error.error;

      // Capturar errores del backend con detalles de validación
      if (error.error.details && Array.isArray(error.error.details)) {
        validationDetails = error.error.details;
        //Construye el mensaje concatenado con los detalles
        const detailMessages = error.error.details
          .map((d: { field: string; message: string }) => `${d.message}`)
          //Se extrae únicamente el mensaje de error
          .join("; ");
        errorMessage = detailMessages || errorMessage;
      }
    } else if (error.status) {
      // Errores HTTP sin mensaje personalizado
      switch (error.status) {
        case 400:
          errorMessage = "Datos inválidos";
          break;
        case 404:
          errorMessage = "Recurso no encontrado";
          break;
        case 500:
          errorMessage = "Error del servidor";
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error("PetService Error:", error);
    console.error("Validation Details:", validationDetails);

    return throwError(() => new Error(errorMessage));
    
  }
}
