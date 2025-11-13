import { TestBed } from '@angular/core/testing';
import { OrganizationService } from '../organization.service';
import { AuthService } from '../auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpMock: HttpTestingController;

  const mockToken = 'abc123';
  const mockOrgId = 'org001';
  const mockTree = [
    { id: 'org001', name: 'Root', children: [] }
  ];

  beforeEach(() => {
    const mockAuthService = {
      getToken: () => mockToken
    };

    TestBed.configureTestingModule({
      providers: [
        OrganizationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(OrganizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch organization tree with auth headers', () => {
    service.getTree(mockOrgId).subscribe(res => {
      expect(res).toEqual(mockTree);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/tree/${mockOrgId}`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTree);
  });

  afterEach(() => httpMock.verify());
});
