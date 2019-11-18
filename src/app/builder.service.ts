import { Injectable } from '@angular/core';
import { FirstRay } from './units/enemies/first-ray';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  constructor() { }

  /**
   * Build a uni
   * @param unitInfos unit infos
   */
  buildUnit(unitInfos) {
    const unit = this.getUnit(unitInfos.name);

    // todo handle level and rarity

    return unit;
  }

  /**
   * Get unit model by name
   * @param name name of unit
   */
  getUnit(name) {
    let model;
    switch (name) {
      case 'FirstRay':
        model = new FirstRay();
        break;
    }
    return model;
  }

}
