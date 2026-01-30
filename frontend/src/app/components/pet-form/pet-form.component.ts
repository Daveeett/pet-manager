import { Component, input, output, OnInit, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pet } from "../../models/response/pet/pet.dto";
import { CreatePetDTO } from "../../models/request/pet/create-pet.dto";
import { UpdatePetDTO } from "../../models/request/pet/update-pet.dto";

@Component({
  selector: "app-pet-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./pet-form.component.html",
  styleUrl: "./pet-form.component.css",
})
export class PetFormComponent implements OnInit {
  pet = input<Pet | null>(null);
  isEditing = input<boolean>(false);
  isLoading = input<boolean>(false);
  species = input<string[]>([]);
  backendError = input<string>("");

  save = output<CreatePetDTO | UpdatePetDTO>();
  cancel = output<void>();

  petForm!: FormGroup;
  private readonly TEXT_ONLY_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

  constructor(private fb: FormBuilder) {
    // Effect para actualizar el formulario cuando cambia pet
    effect(() => {
      const petValue = this.pet();
      if (this.petForm) {
        this.updateFormValues(petValue);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.TEXT_ONLY_PATTERN),
        ],
      ],
      species: ["", [Validators.required]],
      breed: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.TEXT_ONLY_PATTERN),
        ],
      ],
      age: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      ownerName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(this.TEXT_ONLY_PATTERN),
        ],
      ],
    });

    this.updateFormValues(this.pet());
  }

  private updateFormValues(petValue: Pet | null): void {
    
    if (petValue && this.petForm) {
      this.petForm.patchValue({
        name: petValue.name,
        species: petValue.species,
        breed: petValue.breed,
        age: petValue.age,
        ownerName: petValue.ownerName,
      });
    } else if (this.petForm) {
      this.petForm.reset();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName); 
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }


  onSubmit(): void {
    if (this.petForm.valid) {
      const formData = this.petForm.value;
      this.save.emit(formData);
    } else {
      Object.keys(this.petForm.controls).forEach((key) => {
        this.petForm.get(key)?.markAsTouched();
      });
    }
  }
  onCancel(): void {
    this.cancel.emit();
  }
}
