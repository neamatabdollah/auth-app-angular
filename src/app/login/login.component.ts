import { Component, Output, EventEmitter } from "@angular/core"
import type { NgForm } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface LoginForm {
  email: string
  password: string
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  @Output() backToHome = new EventEmitter<void>()
  @Output() goToRegister = new EventEmitter<void>()

  formData: LoginForm = {
    email: "",
    password: "",
  }

  isSubmitted = false

  onBackToHome() {
    this.backToHome.emit()
  }

  onGoToRegister() {
    this.goToRegister.emit()
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true

    if (form.valid) {
      console.log("Login successful!", this.formData)
      alert("Login successful!")
      // Reset form after successful submission
      this.isSubmitted = false
      form.resetForm()
      this.formData = { email: "", password: "" }
    } else {
      console.log("Form is invalid")
    }
  }
}
