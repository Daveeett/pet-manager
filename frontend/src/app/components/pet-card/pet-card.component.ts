import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Pet } from "../../models/response/pet/pet.dto";

@Component({
  selector: "app-pet-card",
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: "./pet-card.component.html",
  styleUrl: "./pet-card.component.scss",
})
export class PetCardComponent {
  
  pet = input.required<Pet>();
  edit = output<Pet>();
  delete = output<Pet>();

  onEdit(): void {
    this.edit.emit(this.pet());
  }

  onDelete(): void {
    this.delete.emit(this.pet());
  }

  getSpeciesIcon(species: string): string {
    const icons: Record<string, string> = {
      Perro: "bi-emoji-heart-eyes",
      Gato: "bi-emoji-sunglasses",
      Ave: "bi-feather",
      Pez: "bi-water",
      Conejo: "bi-balloon-heart",
      Hámster: "bi-circle-fill",
      Tortuga: "bi-shield-fill",
      Reptil: "bi-bug-fill",
    };
    return icons[species] || "bi-heart-fill";
  }
}
