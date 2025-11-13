import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private baseUrl = `${environment.apiUrl}/tasks`;

  /** Attach JWT to every request */
  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  /** GET /tasks */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.authHeaders(),
    });
  }

  /** GET /tasks/:id */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers: this.authHeaders(),
    });
  }

  /** POST /tasks */
  create(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task, {
      headers: this.authHeaders(),
    });
  }

  /** PUT /tasks/:id */
  update(id: string, task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, task, {
      headers: this.authHeaders(),
    });
  }

  /** DELETE /tasks/:id */
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
