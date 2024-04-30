import { Injectable } from '@angular/core';
import { Zone } from 'src/app/models/zone';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private data: DataService) {}

  getZone(ref: string): Zone {
    const found = this.data.zones.find((zone) => zone.ref === ref);
    if (found) {
      return found;
    }
    throw new Error('Zone not found');
  }
}
