import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { PlayerService } from '@shared/services/player.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoneGuard {
  constructor(public playerService: PlayerService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.playerService.zones.levelMax >= 5;
  }
}
