import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "angular-auth-app";
  currentView: 'home' | 'login' | 'register' = 'home';

  showLogin() {
    this.currentView = 'login';
  }

  showRegister() {
    this.currentView = 'register';
  }

  showHome() {
    this.currentView = 'home';
  }
}
