import { TestBed } from '@angular/core/testing';
import { App } from './app';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideLocationMocks(),
      ],
    });
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('Task Manager Tool');
  });
});
