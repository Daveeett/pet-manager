import { Injectable } from "@angular/core";

export interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  delay?: number;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  toasts: Toast[] = [];

  show(message: string,type: "success" | "error" | "info" | "warning" = "info",delay: number = 5000) {
    this.toasts.push({ message, type, delay });
  }

  success(message: string, delay: number = 5000) {
    this.show(message, "success", delay);
  }

  error(message: string, delay: number = 7000) {
    this.show(message, "error", delay);
  }

  info(message: string, delay: number = 5000) {
    this.show(message, "info", delay);
  }

  warning(message: string, delay: number = 6000) {
    this.show(message, "warning", delay);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
