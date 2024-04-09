import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BattleService } from '../services/battle.service';

@Injectable({
  providedIn: 'root'
})
export class BattleGuard  {

  constructor(
    public battleService: BattleService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this.battleService.isBattle;
  }

}
