import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewGameRoutingModule } from './view-game-routing.module';
import { ViewGameComponent } from './view-game.component';

@NgModule({
  declarations: [ViewGameComponent],
  imports: [SharedModule, ViewGameRoutingModule],
})
export class ViewGameModule {}
