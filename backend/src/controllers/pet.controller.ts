import { Request, Response, NextFunction, response } from "express";
import { petService } from "../services/pet.service";
import { CreatePetDTO } from "../dtos/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../dtos/request/pet/update-pet.dto";
import { ApiResponse } from "../dtos/response/ibase-response/api-response.dto";
import { Pet } from "../entities/pet/pet.entity";

// Obtiene todas las mascotas o busca por criterio
export const getAllPets = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  try {
    const { search } = req.query //forma de recibir datos por query(despues del ? en la url)
    let pets: Pet[];
    if (search && typeof search === "string" && search.trim().length > 0) {
      pets = petService.findBySearch(search.trim());
    } else {
      pets = petService.findAll();
    }

    const response: ApiResponse<Pet[]> = {
      success: true,
      data: pets,
      message: `Se encontraron ${pets.length} mascota(s)`,
    };

    res.json(response)//metodo para enviar respuesta en formato json;200 ok por defecto
  } catch (error) {
    next(error);
  }
};

// Obtiene una mascota específica por su ID (UUID)
export const getPetById = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  try {
    const { id } = req.params; //forma de recibir datos por params(despues de los dos puntos en la url)
    const pet = petService.findById(id);

    if (!pet) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Mascota no encontrada",
      };
      res.status(404).json(response);//404 not found
      return;
    }

    const response: ApiResponse<Pet> = { success: true, data: pet };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Crea una nueva mascota con los datos proporcionados
export const createPet = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  try {
    const data: CreatePetDTO = req.body; //forma de recibir datos por body(en el cuerpo de la peticion)
    const newPet = petService.create(data);

    const response: ApiResponse<Pet> = {
      success: true,
      data: newPet,
      message: "Mascota creada exitosamente",
    };

    res.status(201).json(response);//201 created
  } catch (error) {
    next(error);
  }
};

// Actualiza una mascota existente con los datos proporcionados
export const updatePet = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdatePetDTO = req.body;

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

    res.json(response);//200 ok por defecto
  } catch (error) {
    next(error);
  }
};

// Elimina una mascota por su ID (UUID)
export const deletePet = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  try {
    const { id } = req.params;
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

export const getEncryptedData = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
  try {
    const rawData = petService.getRawData();
    const response = {success: true, data: rawData, message: "Datos en memoria (ownerName encriptado)",};
    res.json(response);
  } catch (error) {
    next(error);
  }
};
