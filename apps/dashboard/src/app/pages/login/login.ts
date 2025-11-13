import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.html',
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) return;

    this.auth.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => this.router.navigate(['/task']),
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        console.error('Login failed', err);
      },
    });
  }
}
