import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewMateriaRoutingModule } from './view-materia-routing.module';
import { ViewMateriaComponent } from './view-materia.component';

@NgModule({
  declarations: [ViewMateriaComponent],
  imports: [SharedModule, ViewMateriaRoutingModule],
})
export class ViewMateriaModule {}
