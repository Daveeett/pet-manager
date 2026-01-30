import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: "./toast-container.component.html",
  styleUrl: "./toast-container.component.css",
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getBootstrapClass(type: string): string {
    const classMap: Record<string, string> = {
      success: "success",
      error: "error",
      info: "info",
      warning: "warning",
    };
    return classMap[type] || "info";
  }

  getIcon(type: string): string {
    const iconMap: Record<string, string> = {
      success: "bi-check-circle-fill",
      error: "bi-exclamation-triangle-fill",
      info: "bi-info-circle-fill",
      warning: "bi-exclamation-circle-fill",
    };
    return iconMap[type] || "bi-info-circle-fill";
  }
}
