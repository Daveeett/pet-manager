import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModal, NgbModalRef, NgbTooltipModule, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { Pet } from "../../models/response/pet/pet.dto";
import { CreatePetDTO } from "../../models/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../../models/request/pet/update-pet.dto";
import { PET_SPECIES } from "../../models/constants/pet-species.constants";
import { PetService } from "../../services/pet.service";
import { PetFormComponent } from "../pet-form/pet-form.component";
import { PetCardComponent } from "../pet-card/pet-card.component";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";

@Component({
  selector: "app-pet-list",
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NgbTooltipModule,NgbAlertModule,
    PetFormComponent,PetCardComponent,ConfirmModalComponent,
  ],
  templateUrl: "./pet-list.component.html",
  styleUrl: "./pet-list.component.scss",
})

export class PetListComponent implements OnInit {
  private petService = inject(PetService);
  private modalService = inject(NgbModal);

  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  searchTerm = "";
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  showForm = false;
  isEditing = false;
  selectedPet: Pet | null = null;
  readonly species = PET_SPECIES;

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = pets;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || "Error al cargar las mascotas";
        this.isLoading = false;
      },
    });
  }

  //Busca mascotas por nombre
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredPets = this.pets;
      return;
    }

    // Búsqueda local para mejor UX
    this.filteredPets = this.pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term) ||
        pet.ownerName.toLowerCase().includes(term),
    );
  }

  //Limpia la búsqueda
  clearSearch(): void {
    this.searchTerm = "";
    this.filteredPets = this.pets;
  }

  //Abre el formulario para agregar una nueva mascota
  openAddForm(): void {
    this.isEditing = false;
    this.selectedPet = null;
    this.showForm = true;
    this.clearMessages();
  }

  //Abre el formulario para editar una mascota existente
  openEditForm(pet: Pet): void {
    this.isEditing = true;
    this.selectedPet = { ...pet };
    this.showForm = true;
    this.clearMessages();
  }

  //Cierra el formulario
  closeForm(): void {
    this.showForm = false;
    this.selectedPet = null;
    this.isEditing = false;
  }

  //Guarda una mascota (crear o actualizar)
  onSavePet(petData: CreatePetDTO | UpdatePetDTO): void {
    this.isLoading = true;
    this.clearMessages();

    if (this.isEditing && this.selectedPet) {
      // Actualizar mascota existente
      this.petService
        .updatePet(this.selectedPet.id, petData as UpdatePetDTO)
        .subscribe({
          next: (updatedPet) => {
            const index = this.pets.findIndex((p) => p.id === updatedPet.id);
            if (index !== -1) {
              this.pets[index] = updatedPet;
              this.onSearch(); // Actualizar lista filtrada
            }
            this.successMessage = `¡${updatedPet.name} ha sido actualizado exitosamente!`;
            this.closeForm();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage =
              error.message || "Error al actualizar la mascota";
            this.isLoading = false;
          },
        });
    } else {
      // Crear nueva mascota
      this.petService.createPet(petData as CreatePetDTO).subscribe({
        next: (newPet) => {
          this.pets.unshift(newPet);
          this.onSearch(); // Actualizar lista filtrada
          this.successMessage = `¡${newPet.name} ha sido agregado exitosamente!`;
          this.closeForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || "Error al crear la mascota";
          this.isLoading = false;
        },
      });
    }
  }

  confirmDelete(pet: Pet): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmModalComponent,
      {
        centered: true,
        backdrop: "static",
      },
    );

    modalRef.componentInstance.title = "Confirmar eliminación";
    modalRef.componentInstance.message = `¿Estás seguro de que deseas eliminar a "${pet.name}"? Esta acción no se puede deshacer.`;
    modalRef.componentInstance.confirmText = "Eliminar";
    modalRef.componentInstance.cancelText = "Cancelar";
    modalRef.componentInstance.confirmClass = "btn-danger";

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.deletePet(pet);
        }
      },
      () => {},
    );
  }

  private deletePet(pet: Pet): void {
    this.isLoading = true;
    this.clearMessages();

    this.petService.deletePet(pet.id).subscribe({
      next: () => {
        this.pets = this.pets.filter((p) => p.id !== pet.id);
        this.onSearch(); 
        this.successMessage = `${pet.name} ha sido eliminado exitosamente`;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || "Error al eliminar la mascota";
        this.isLoading = false;
      },
    });
  }

  clearMessages(): void {
    this.errorMessage = "";
    this.successMessage = "";
  }

  closeAlert(type: "success" | "error"): void {
    if (type === "success") {
      this.successMessage = "";
    } else {
      this.errorMessage = "";
    }
  }

  getSpeciesIcon(species: string): string {
    const icons: Record<string, string> = {
      Perro: "bi-dog",
      Gato: "bi-cat",
      Ave: "bi-bird",
      Pez: "bi-water",
      Conejo: "bi-balloon-heart",
      Hámster: "bi-balloon",
      Tortuga: "bi-shield",
      Reptil: "bi-bug",
    };
    return icons[species] || "bi-heart";
  }
}
