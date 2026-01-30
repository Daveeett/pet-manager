import { v4 as uuidv4 } from "uuid";
import { Pet } from "../entities/pet/pet.entity";
import { CreatePetRequest } from "../interfaces/request/pet/create-pet.interface";
import { UpdatePetRequest } from "../interfaces/request/pet/update-pet.interface";
import { PaginatedResult } from "../interfaces/response/paginated-result.interface";
import { encrypt, decrypt } from "../utils/encryption.util";

class PetService {

  private pets: Map<string, Pet> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  // Inicializa datos de ejemplo
  private initializeSampleData(): void {
    const samplePets: CreatePetRequest[] = [
      {
        name: "Max",
        species: "Perro",
        breed: "Golden Retriever",
        age: 3,
        ownerName: "Juan García",
      },
      {
        name: "Luna",
        species: "Gato",
        breed: "Siamés",
        age: 2,
        ownerName: "María López",
      },
      {
        name: "Rocky",
        species: "Perro",
        breed: "Bulldog Francés",
        age: 4,
        ownerName: "Carlos Rodríguez",
      },
      {
        name: "Mía",
        species: "Gato",
        breed: "Persa",
        age: 1,
        ownerName: "Ana Martínez",
      },
      {
        name: "Coco",
        species: "Ave",
        breed: "Loro",
        age: 5,
        ownerName: "Pedro Sánchez",
      },
    ];

    samplePets.forEach((pet) => this.create(pet));
  }

  // Verifica si existe una mascota con los mismos datos (nombre, especie, raza, dueño)
  existsDuplicate(data: CreatePetRequest, excludeId?: string): boolean {
    
    const pets = Array.from(this.pets.values());
    
    return pets.some((pet) => {
      
      if (excludeId && pet.id === excludeId) return false;
      const decryptedOwnerName = decrypt(pet.ownerName);
      
      return (
        pet.name.toLowerCase() === data.name.toLowerCase() &&
        pet.species.toLowerCase() === data.species.toLowerCase() &&
        pet.breed.toLowerCase() === data.breed.toLowerCase() &&
        decryptedOwnerName.toLowerCase() === data.ownerName.toLowerCase()
      );
    
    });
  }

  // Obtiene todas las mascotas con paginación
  findAll(page: number = 1, limit: number = 6): PaginatedResult<Pet> {
    
    const allPets = Array.from(this.pets.values())
      .map((pet) => ({...pet, ownerName: decrypt(pet.ownerName),}))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = allPets.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPets = allPets.slice(startIndex, endIndex);

    return {
      data: paginatedPets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // Busca una mascota por su ID
  findById(id: string): Pet | undefined {
    
    const pet = this.pets.get(id);

    if (!pet) {
      return undefined;
    }

    return {...pet, ownerName: decrypt(pet.ownerName)};
  }

  // Busca mascotas por criterio de búsqueda con paginación
  findBySearch(searchTerm: string, page: number = 1, limit: number = 6): PaginatedResult<Pet> {
    const term = searchTerm.toLowerCase().trim();

    const allPets = Array.from(this.pets.values())
      .map((pet) => ({...pet, ownerName: decrypt(pet.ownerName),}))
      .filter(
        (pet) =>
          pet.name.toLowerCase().includes(term) ||
          pet.species.toLowerCase().includes(term) ||
          pet.breed.toLowerCase().includes(term) ||
          pet.ownerName.toLowerCase().includes(term),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = allPets.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPets = allPets.slice(startIndex, endIndex);

    return {data: paginatedPets, pagination: {page, limit, total, totalPages}};
  }

  // Crea una nueva mascota
  create(data: CreatePetRequest): Pet {
    const now = new Date();

    const pet: Pet = {
      id: uuidv4(), //genera un id con identificador unico
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      ownerName: encrypt(data.ownerName), // Encripta nombre del dueño
      createdAt: now,
      updatedAt: now,
    };

    this.pets.set(pet.id, pet);

    // Retornar con datos desencriptados para la respuesta
    return { ...pet, ownerName: data.ownerName };
  }

  update(id: string, data: UpdatePetRequest): Pet | undefined {
    
    const existingPet = this.pets.get(id);

    if (!existingPet) return undefined;

    const updatedPet: Pet = {
      ...existingPet,
      ...data,
      // Encriptar nombre del dueño si se proporciona
      ownerName: data.ownerName
        ? encrypt(data.ownerName)
        : existingPet.ownerName,
      updatedAt: new Date(),
    
    };

    this.pets.set(id, updatedPet);

    // Retornar con datos desencriptados
    return { ...updatedPet, ownerName: decrypt(updatedPet.ownerName) };
  }

  // Elimina una mascota por su ID
  delete(id: string): boolean {
    return this.pets.delete(id);
  }

  // Verifica si existe una mascota con el ID dado
  exists(id: string): boolean {
    return this.pets.has(id);
  }
}
export const petService = new PetService();
