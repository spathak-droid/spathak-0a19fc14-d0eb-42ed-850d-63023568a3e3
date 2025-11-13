import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: { name: string };
    permissions?: string[];
    organization: { id: string; name: string };
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'jwt_token';


  token = signal<string | null>(localStorage.getItem(this.tokenKey));
  user = signal<LoginResponse['user'] | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  isLoggedIn = computed(() => !!this.token());
  userRole = computed(() => this.user()?.role?.name ?? null);

  constructor(private http: HttpClient) {}


  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        this.token.set(res.access_token);
        this.user.set(res.user);

        localStorage.setItem(this.tokenKey, res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }


  logout() {
    this.token.set(null);
    this.user.set(null);

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
  }

  hasPermission(permission: string): boolean {
    return this.user()?.permissions?.includes(permission) ?? false;
  }

  getToken() {
    return this.token();
  }

  getCurrentUser() {
    return this.user();
  }
}
