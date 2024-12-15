import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { PlayerService } from '../services/player.service';

@Injectable({
  providedIn: 'root',
})
export class ZoneGuard {
  constructor(public playerService: PlayerService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.playerService.zones.levelMax >= 5;
  }
}
