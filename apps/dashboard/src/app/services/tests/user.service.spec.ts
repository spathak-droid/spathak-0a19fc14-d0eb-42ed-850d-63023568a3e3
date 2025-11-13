import { TestBed } from '@angular/core/testing';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockToken = 'xyz789';

  beforeEach(() => {
    const mockAuthService = {
      getToken: () => mockToken
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch all users with auth headers', () => {
    const mockUsers = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockUsers);
  });

  it('should fetch a single user by ID', () => {
    const mockUser = { id: '1', name: 'Alice' };

    service.getById('1').subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockUser);
  });

  it('should handle errors on getAll()', () => {
    service.getAll().subscribe({
      next: () => fail('Should have errored'),
      error: err => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  it('should handle errors on getById()', () => {
    service.getById('1').subscribe({
      next: () => fail('Should have errored'),
      error: err => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });
  });

  afterEach(() => httpMock.verify());
});
