import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BattleService } from '../services/battle.service';

@Injectable({
  providedIn: 'root'
})
export class BattleGuard  {

  constructor(
    public battleService: BattleService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this.battleService.isBattle;
  }

}
