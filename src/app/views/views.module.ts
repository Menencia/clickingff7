import { NgModule } from '@angular/core';
import { ViewGameModule } from './view-game/view-game.module';
// import { ViewConfigModule } from './view-config/view-config.module';
// import { ViewEquipModule } from './view-equip/view-equip.module';
// import { ViewItemsModule } from './view-items/view-items.module';
// import { ViewMapModule } from './view-map/view-map.module';
// import { ViewMateriaModule } from './view-materia/view-materia.module';
// import { ViewPhsModule } from './view-phs/view-phs.module';
// import { ViewSaveModule } from './view-save/view-save.module';
// import { ViewShopModule } from './view-shop/view-shop.module';

@NgModule({
  exports: [
    // ViewShopModule
    // ViewSaveModule
    // ViewPhsModule
    // ViewMateriaModule
    // ViewMapModule
    // ViewItemsModule
    // ViewEquipModule
    // ViewConfigModule
    ViewGameModule
  ]
})
export class ViewsModule { }
