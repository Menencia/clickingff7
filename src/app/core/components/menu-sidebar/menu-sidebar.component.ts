import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';
import { NavLink } from '../../../shared/models/nav-link';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-menu-sidebar',
  imports: [TranslatePipe, RouterModule],
  templateUrl: './menu-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-sidebar.component.scss',
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  @Input() visible = false;

  @Output() public visibleChange = new EventEmitter();

  displayNextZone: boolean;

  displayPhs: boolean;

  navLinks: NavLink[];

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private gameService: GameService,
  ) {
    this.displayNextZone = this.gameService.zones.isNextZone();
    this.displayPhs = this.gameService.zones.levelMax >= 5;
    this.navLinks = [
      new NavLink('Game'),
      new NavLink('Map', true, this.displayNextZone),
      new NavLink('Shop'),
      new NavLink('Equip'),
      new NavLink('Materia'),
      new NavLink('Items'),
      new NavLink('Config'),
      new NavLink('PHS', this.displayPhs),
      new NavLink('Save'),
    ].filter((navLink) => navLink.display === true);
  }

  ngOnInit(): void {
    /** Close automatically the sidebar when a url change is detected */
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.visible = false;
          this.visibleChange.emit(this.visible);
        }
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updateVisible(): void {
    this.visibleChange.emit(this.visible);
  }
}
