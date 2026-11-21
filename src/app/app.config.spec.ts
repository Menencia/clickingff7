import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { appConfig } from './app.config';
import { DataService } from './core/services/data.service';
import { GameService } from './core/services/game.service';

describe('appConfig initializer', () => {
  it('starts the game only once the data is loaded', async () => {
    const preload = new Subject<void>();
    const run = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        { provide: DataService, useValue: { preloadAll: () => preload } },
        { provide: GameService, useValue: { run } },
      ],
    });
    const status = TestBed.inject(ApplicationInitStatus);

    expect(run).not.toHaveBeenCalled();

    preload.next();
    preload.complete();
    await status.donePromise;

    expect(run).toHaveBeenCalledTimes(1);
  });
});
