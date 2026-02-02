import { Request, Response, NextFunction, response } from "express";
import { petService } from "../services/pet.service";
import { PaginatedResult } from "../interfaces/response/paginated-result.interface";
import { CreatePetRequest } from "../interfaces/request/pet/create-pet.interface";
import { UpdatePetRequest } from "../interfaces/request/pet/update-pet.interface";
import { ApiResponse } from "../interfaces/response/api-response.interface";
import { PaginatedResponse } from "../interfaces/response/paginated-response.interface";
import { Pet } from "../entities/pet/pet.entity";

// Obtiene todas las mascotas o busca por criterio con paginación
export const getAllPets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, page = "1", limit = "6" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 6) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 6) || 6));

    let result: PaginatedResult<Pet>;

    if (search && typeof search === "string" && search.trim().length > 0) {
      result = petService.findBySearch(search.trim(), pageNum, limitNum);
    } else {
      result = petService.findAll(pageNum, limitNum);
    }

    const response: PaginatedResponse<Pet> = {
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: `Se encontraron ${result.pagination.total} mascota(s)`,
    };

    //se envia la respuesta al frontend
    res.json(response);

  } catch (error) {
    next(error);
  }
};

// Obtiene una mascota específica por su ID (UUID)
export const getPetById = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  
  try {
    const id = req.params.id as string; //forma de recibir datos por params
    const pet = petService.findById(id);

    if (!pet) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Mascota no encontrada",
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Pet> = { success: true, data: pet };
    res.json(response);

  } catch (error) {
    next(error);
  }
};

// Crea una nueva mascota con los datos proporcionados
export const createPet = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const data: CreatePetRequest = req.body; 

    if (petService.existsDuplicate(data)) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          "Ya existe una mascota con los mismos datos (nombre, especie, raza y dueño)",
      };
      res.status(409).json(response); // 409 Conflict
      return;
    }

    const newPet = petService.create(data);

    const response: ApiResponse<Pet> = {
      success: true,
      data: newPet,
      message: "Mascota creada exitosamente",
    };

    res.status(201).json(response); //201 created
  
  } catch (error) {
    next(error);
  }
};

// Actualiza una mascota existente con los datos proporcionados
export const updatePet = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data: UpdatePetRequest = req.body;

    // Validar si ya existe otra mascota con los mismos datos
    const existingPet = petService.findById(id);
    if (existingPet) {
      const checkData: CreatePetRequest = {
        name: data.name || existingPet.name,
        species: data.species || existingPet.species,
        breed: data.breed || existingPet.breed,
        age: data.age !== undefined ? data.age : existingPet.age,
        ownerName: data.ownerName || existingPet.ownerName,
      };

      if (petService.existsDuplicate(checkData, id)) {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "Ya existe otra mascota con los mismos datos (nombre, especie, raza y dueño)",
        };

        res.status(409).json(response); // 409 Conflict
        return;

      }
    }

    const updatedPet = petService.update(id, data);

    if (!updatedPet) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Mascota no encontrada",
      };

      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Pet> = {
      success: true,
      data: updatedPet,
      message: "Mascota actualizada exitosamente",
    
    };

    res.json(response);
  
  } catch (error) {
    next(error);
  }
};

// Elimina una mascota por su ID (UUID)
export const deletePet = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deleted = petService.delete(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Mascota no encontrada",
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "Mascota eliminada exitosamente",
    };

    res.json(response);
  
  } catch (error) {
    next(error);
  }
};
