import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    access_token: 'abc123',
    user: {
      id: '1',
      name: 'John',
      email: 'john@test.com',
      role: { name: 'ADMIN' },
      organization: { id: 'org1', name: 'Org' }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,

        // 👇 CORRECT modern Angular imports
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  it('should login and store token + user in localStorage', (done) => {
    service.login('john@test.com', 'password').subscribe(() => {
      expect(localStorage.getItem('jwt_token')).toBe('abc123');
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockResponse.user);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);
  });

  afterEach(() => httpMock.verify());
});
