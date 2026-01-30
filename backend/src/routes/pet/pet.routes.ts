import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {createPetSchema, updatePetSchema, uuidSchema} from "../../schemas/pet.schema";
import {getAllPets, getPetById, createPet, updatePet, deletePet} from "../../controllers/pet.controller";

//Router para endpoints de mascotas
const router = Router();

router.get("/", getAllPets);

router.get("/:id", validate(uuidSchema, "params"), getPetById);

//POST /api/pets
router.post("/", validate(createPetSchema, "body"), createPet);

//PUT /api/pets/:id
router.put("/:id",validate(uuidSchema, "params"),validate(updatePetSchema, "body"),updatePet);

//DELETE /api/pets/:id
router.delete("/:id", validate(uuidSchema, "params"), deletePet);

export default router;
