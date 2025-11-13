import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private baseUrl = `${environment.apiUrl}/organizations`;

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  getTree(orgId: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/tree/${orgId}`,
      { headers: this.authHeaders() }
    );
  }
}
