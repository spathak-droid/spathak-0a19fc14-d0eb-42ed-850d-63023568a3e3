import { TestBed } from '@angular/core/testing';
import { TaskService } from '../task.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get all tasks', () => {
    const mockTask = { id: '1', title: 'Test Task' };

    service.getAll().subscribe(res => {
      expect(res).toEqual([mockTask]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    req.flush([mockTask]);
  });

  afterEach(() => httpMock.verify());
});
