import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private baseUrl = `${environment.apiUrl}/users`;

  /** Attach JWT headers */
  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  /** GET /users */
  getAll() {
    return this.http
      .get<any[]>(this.baseUrl, {
        headers: this.authHeaders(),
      })
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch users', err);
          return throwError(() => err);
        })
      );
  }

  /** GET /users/:id */
  getById(id: string) {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`, {
        headers: this.authHeaders(),
      })
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch user', err);
          return throwError(() => err);
        })
      );
  }
}
