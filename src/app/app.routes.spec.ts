import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

describe('routes', () => {
  it('redirects the old /game address to /battle', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          routes.map((route) =>
            route.loadComponent ? { path: route.path, children: [] } : route,
          ),
        ),
      ],
    });
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/game');

    expect(router.url).toBe('/battle');
  });
});
