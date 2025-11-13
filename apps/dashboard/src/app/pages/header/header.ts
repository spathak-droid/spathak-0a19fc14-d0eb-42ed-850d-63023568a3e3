import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
})
export class HeaderComponent {
  title = 'Task Manager Tool';
  // user: any = null;

  constructor(public auth: AuthService, private router: Router) {}

  get user() {
    return this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
