import { TestBed } from '@angular/core/testing';
import { SwUpdate, type VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { PwaUpdateService, UPDATE_CHECK_INTERVAL } from './pwa-update.service';

describe('PwaUpdateService', () => {
  let versionUpdates: Subject<VersionEvent>;
  let unrecoverable: Subject<unknown>;
  let checkForUpdate: ReturnType<typeof vi.fn>;

  function create(isEnabled = true) {
    versionUpdates = new Subject();
    unrecoverable = new Subject();
    checkForUpdate = vi.fn().mockResolvedValue(false);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useValue: {
            isEnabled,
            versionUpdates,
            unrecoverable,
            checkForUpdate,
          },
        },
      ],
    });
    return TestBed.inject(PwaUpdateService);
  }

  const versionReady = {
    type: 'VERSION_READY',
    currentVersion: { hash: 'a' },
    latestVersion: { hash: 'b' },
  } as VersionEvent;

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports a downloaded version', () => {
    const service = create();
    versionUpdates.next({ type: 'VERSION_DETECTED', version: { hash: 'b' } });
    expect(service.state()).toBe('none');

    versionUpdates.next(versionReady);
    expect(service.state()).toBe('ready');
  });

  it('reports an unrecoverable state', () => {
    const service = create();
    unrecoverable.next({ type: 'UNRECOVERABLE_STATE', reason: 'test' });
    expect(service.state()).toBe('broken');
  });

  it('hides the notice when dismissed', () => {
    const service = create();
    versionUpdates.next(versionReady);
    service.dismiss();
    expect(service.state()).toBe('none');
  });

  it('checks for updates periodically', () => {
    vi.useFakeTimers();
    create();
    expect(checkForUpdate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(UPDATE_CHECK_INTERVAL);
    expect(checkForUpdate).toHaveBeenCalledTimes(1);
  });

  it('does nothing without a service worker', () => {
    vi.useFakeTimers();
    const service = create(false);
    versionUpdates.next(versionReady);
    vi.advanceTimersByTime(UPDATE_CHECK_INTERVAL);

    expect(service.state()).toBe('none');
    expect(checkForUpdate).not.toHaveBeenCalled();
  });
});
