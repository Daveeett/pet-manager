import {Component,Input,Output,EventEmitter,OnInit,OnChanges,SimpleChanges} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from "@angular/forms";
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
export class PetFormComponent implements OnInit, OnChanges {
  @Input() pet: Pet | null = null;
  @Input() isEditing = false;
  @Input() isLoading = false;
  @Input() species: string[] = [];

  @Output() save = new EventEmitter<CreatePetDTO | UpdatePetDTO>();
  @Output() cancel = new EventEmitter<void>();

  petForm!: FormGroup;
  private readonly TEXT_ONLY_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["pet"] && this.petForm) {
      this.updateFormValues();
    }
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

    this.updateFormValues();
  }

  private updateFormValues(): void {
    if (this.pet && this.petForm) {
      this.petForm.patchValue({
        name: this.pet.name,
        species: this.pet.species,
        breed: this.pet.breed,
        age: this.pet.age,
        ownerName: this.pet.ownerName,
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
