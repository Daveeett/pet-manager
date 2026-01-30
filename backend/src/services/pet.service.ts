import { v4 as uuidv4 } from "uuid";
import { Pet } from "../entities/pet/pet.entity";
import { CreatePetDTO } from "../dtos/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../dtos/request/pet/update-pet.dto";
import { encrypt, decrypt } from "../utils/encryption.util";
import { array } from "joi";

//  Los datos sensibles (nombre del dueño) se encriptan antes de almacenar.
class PetService {
  private pets: Map<string, Pet> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  // Inicializa datos de ejemplo
  private initializeSampleData(): void {
    const samplePets: CreatePetDTO[] = [
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

  // Obtiene todas las mascotas
  // Desencripta los datos sensibles antes de retornar
  findAll(): Pet[] {
    return Array.from(this.pets.values()).map((pet) => ({
      ...pet,
      ownerName: decrypt(pet.ownerName), // Desencriptar nombre del dueño
    }));
  }

  // Busca una mascota por su ID
  findById(id: string): Pet | undefined {
    const pet = this.pets.get(id);

    if (!pet) {
      return undefined;
    }

    return {
      ...pet,
      ownerName: decrypt(pet.ownerName), // Desencriptar nombre del dueño
    };
  }

  // Busca mascotas por criterio de búsqueda
  findBySearch(searchTerm: string): Pet[] {
    const term = searchTerm.toLowerCase().trim();

    return this.findAll().filter(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term) ||
        pet.ownerName.toLowerCase().includes(term)
    );
  }

  // Crea una nueva mascota
  create(data: CreatePetDTO): Pet {
    const now = new Date();

    const pet: Pet = {
      id: uuidv4(),//genera un id con identificador unico de 128 bits(36 caracteres)
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
    return {...pet,ownerName: data.ownerName};
  }

  update(id: string, data: UpdatePetDTO): Pet | undefined {
    const existingPet = this.pets.get(id);

    if (!existingPet) {
      return undefined;
    }

    const updatedPet: Pet = {...existingPet,  ...data,
      // Encriptar nombre del dueño si se proporciona
      ownerName: data.ownerName ? encrypt(data.ownerName) : existingPet.ownerName,
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

  getRawData(): Pet[] {
    return Array.from(this.pets.values());
  }
}
export const petService = new PetService();
