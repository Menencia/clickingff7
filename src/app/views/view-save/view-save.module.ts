import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewSaveRoutingModule } from './view-save-routing.module';
import { ViewSaveComponent } from './view-save.component';

@NgModule({
  declarations: [ViewSaveComponent],
  imports: [SharedModule, ViewSaveRoutingModule],
})
export class ViewSaveModule {}
