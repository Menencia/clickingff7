import { NgModule } from '@angular/core';

import { ViewGameRoutingModule } from './view-game-routing.module';
import { ViewGameComponent } from './view-game.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewGameComponent],
  imports: [SharedModule, ViewGameRoutingModule],
})
export class ViewGameModule {}
