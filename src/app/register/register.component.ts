import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
  @Output() backToHome = new EventEmitter<void>()
  @Output() goToLogin = new EventEmitter<void>()

  registerForm!: FormGroup
  isSubmitted = false

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        name: ["", [Validators.required]],
        username: ["", [Validators.required, Validators.pattern(/^\S+$/)]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&#64;$!%*?&])[A-Za-z\d@$!%*?&]/),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
        addresses: this.fb.array([this.createAddressGroup()]),
      },
      { validators: this.passwordMatchValidator },
    )
  }

  get addresses(): FormArray {
    return this.registerForm.get("addresses") as FormArray
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      address: ["", [Validators.required]],
      street: ["", [Validators.required]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
    })
  }

  addAddress() {
    this.addresses.push(this.createAddressGroup())
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index)
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")
    const confirmPassword = form.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
    } else if (confirmPassword?.errors?.["passwordMismatch"]) {
      delete confirmPassword.errors["passwordMismatch"]
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null)
      }
    }
    return null
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched || this.isSubmitted))
  }

  isAddressFieldInvalid(addressIndex: number, fieldName: string): boolean {
    const field = this.addresses.at(addressIndex).get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched || this.isSubmitted))
  }

  onBackToHome() {
    this.backToHome.emit()
  }

  onGoToLogin() {
    this.goToLogin.emit()
  }

  onSubmit() {
    this.isSubmitted = true

    if (this.registerForm.valid) {
      console.log("Registration successful!", this.registerForm.value)
      alert("Registration successful!")
      // Reset form after successful submission
      this.isSubmitted = false
      this.registerForm.reset()
      // Reset addresses array to have one empty address
      while (this.addresses.length > 1) {
        this.addresses.removeAt(1)
      }
      this.addresses.at(0).reset()
    } else {
      console.log("Form is invalid")
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm)
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field)
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl)
          } else {
            arrayControl.markAsTouched()
          }
        })
      } else {
        control?.markAsTouched()
      }
    })
  }
}
