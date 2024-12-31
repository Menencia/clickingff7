import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { BattleService } from '@shared/services/battle.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BattleGuard {
  constructor(public battleService: BattleService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this.battleService.battle();
  }
}
