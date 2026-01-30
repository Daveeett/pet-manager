import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Pet } from "../models/response/pet/pet.dto";
import { CreatePetDTO } from "../models/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../models/request/pet/update-pet.dto";
import { ApiResponse } from "../models/response/ibase-response/api-response.dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PetService {
  private readonly apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getAllPets(): Observable<Pet[]> {
    return this.http.get<ApiResponse<Pet[]>>(this.apiUrl).pipe(
      map((response) => {
        if (response.success && response.data) {
          //se extrae solo response.data
          return response.data;
        }
        throw new Error(response.error || "Error al obtener las mascotas");
      }),
      catchError(this.handleError),
    );
  }

  searchPets(searchTerm: string): Observable<Pet[]> {
    const params = new HttpParams().set("search", searchTerm.trim());

    return this.http.get<ApiResponse<Pet[]>>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || "Error en la búsqueda");
      }),
      catchError(this.handleError),
    );
  }

  getPetById(id: string): Observable<Pet> {
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || "Mascota no encontrada");
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
        throw new Error(response.error || "Error al crear la mascota");
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
        throw new Error(response.error || "Error al actualizar la mascota");
      }),
      catchError(this.handleError),
    );
  }

  deletePet(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || "Error al eliminar la mascota");
        }
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = "Ha ocurrido un error inesperado";
    let validationDetails: { field: string; message: string }[] | undefined;

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.error) {
      // Error del servidor con mensaje
      errorMessage = error.error.error;

      // Capturar detalles de validación si existen
      if (error.error.details && Array.isArray(error.error.details)) {
        validationDetails = error.error.details;
        // Construir mensaje con los detalles
        const detailMessages = error.error.details
          .map((d: { field: string; message: string }) => `${d.message}`)
          .join("; ");
        errorMessage = detailMessages || errorMessage;
      }
    } else if (error.status) {
      // Error HTTP sin mensaje personalizado
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
