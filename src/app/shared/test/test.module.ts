import { NgModule } from '@angular/core';
import { StoreService } from '@shared/services/store.service';

import { StoreServiceMock } from './store.mock';

@NgModule({
  imports: [],
  providers: [{ provide: StoreService, useClass: StoreServiceMock }],
  exports: [],
})
export class TestModule {}
