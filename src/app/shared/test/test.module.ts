import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StoreService } from '@shared/services/store.service';

import { StoreServiceMock } from './store.mock';

@NgModule({
  imports: [TranslateModule.forRoot()],
  providers: [{ provide: StoreService, useClass: StoreServiceMock }],
  exports: [TranslateModule],
})
export class TestModule {}
