import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneGuard implements CanActivate {

  constructor(
    public gameService: GameService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.gameService.zones.levelMax >= 5;
  }

}
