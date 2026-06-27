import { Subject } from 'rxjs';

export abstract class Effect {
  completed = new Subject<boolean>();

  abstract execute(): void;

  complete() {
    this.completed.next(true);
    this.completed.complete();
  }

  returnPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.completed.subscribe((completed) => {
        if (completed) {
          resolve();
        }
      });
    });
  }
}
