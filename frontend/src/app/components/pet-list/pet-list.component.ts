import { Component, OnInit, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbModal,
  NgbModalRef,
  NgbTooltipModule,
  NgbAlertModule,
  NgbPaginationModule,
} from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Pet } from "../../models/response/pet/pet.dto";
import { CreatePetDTO } from "../../models/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../../models/request/pet/update-pet.dto";
import { PET_SPECIES } from "../../models/constants/pet-species.constants";
import { PetService } from "../../services/pet.service";
import { ToastService } from "../../services/toast.service";
import { PetFormComponent } from "../pet-form/pet-form.component";
import { PetCardComponent } from "../pet-card/pet-card.component";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";

@Component({
  selector: "app-pet-list",
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NgbTooltipModule,NgbAlertModule,NgbPaginationModule,
    PetFormComponent,PetCardComponent,ConfirmModalComponent,
  ],
  templateUrl: "./pet-list.component.html",
  styleUrl: "./pet-list.component.scss",
})
export class PetListComponent implements OnInit, OnDestroy {
  private petService = inject(PetService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  searchTerm = "";
  isLoading = false;

  // Paginación
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;
  totalPages = 0;

  showForm = false;
  isEditing = false;
  selectedPet: Pet | null = null;
  formError = "";
  readonly species = PET_SPECIES;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadPets();

    
    this.searchSubject
      .pipe(
        debounceTime(1000), 
        distinctUntilChanged(), 
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadPets();
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadPets(): void {
    this.isLoading = true;

    this.petService
      .getAllPets(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.pets = response.data;
          this.filteredPets = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isLoading = false;
        },
      });
  }

  //emite el término de búsqueda
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  //Limpia la búsqueda
  clearSearch(): void {
    this.searchTerm = "";
    this.currentPage = 1;
    this.loadPets();
  }

  // Cambiar de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPets();
  }

  //Abre el formulario para agregar una nueva mascota
  openAddForm(): void {
    this.isEditing = false;
    this.selectedPet = null;
    this.formError = "";
    this.showForm = true;
  }

  //Abre el formulario para editar una mascota existente
  openEditForm(pet: Pet): void {
    this.isEditing = true;
    this.selectedPet = { ...pet };
    this.formError = "";
    this.showForm = true;
  }

  //Cierra el formulario
  closeForm(): void {
    this.showForm = false;
    this.selectedPet = null;
    this.isEditing = false;
    this.formError = "";
  }

  //Guarda una mascota (crear o actualizar)
  onSavePet(petData: CreatePetDTO | UpdatePetDTO): void {
    this.isLoading = true;
    this.formError = "";

    if (this.isEditing && this.selectedPet) {
      // Actualizar mascota existente
      this.petService
        .updatePet(this.selectedPet.id, petData as UpdatePetDTO)
        .subscribe({
          next: (updatedPet) => {
            this.toastService.success(
              `¡${updatedPet.name} ha sido actualizado exitosamente!`,
            );
            this.closeForm();
            this.isLoading = false;
            this.loadPets();
          },
          error: (error) => {
            this.formError = error.message;
            this.toastService.error(error.message);
            this.isLoading = false;
          },
        });
    } else {
      // Crear nueva mascota
      this.petService.createPet(petData as CreatePetDTO).subscribe({
        next: (newPet) => {
          this.toastService.success(
            `¡${newPet.name} ha sido agregado exitosamente!`,
          );
          this.closeForm();
          this.isLoading = false;
          this.loadPets();
        },
        error: (error) => {
          this.formError = error.message;
          this.toastService.error(error.message);
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

    this.petService.deletePet(pet.id).subscribe({
      next: () => {
        this.toastService.success(`${pet.name} ha sido eliminado exitosamente`);
        this.isLoading = false;
        this.loadPets();
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isLoading = false;
      },
    });
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
