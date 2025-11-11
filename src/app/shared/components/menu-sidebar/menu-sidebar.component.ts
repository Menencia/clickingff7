import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavLink } from '@shared/models/nav-link';
import { PlayerService } from '@shared/services/player.service';
import { SidebarModule } from 'primeng/sidebar';
import { filter } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-menu-sidebar',
    imports: [SidebarModule, TranslateModule, RouterModule],
    templateUrl: './menu-sidebar.component.html',
    styleUrl: './menu-sidebar.component.scss'
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  @Input() visible = false;

  @Output() public visibleChange = new EventEmitter();

  private sub = new SubSink();

  displayNextZone: boolean;

  displayPhs: boolean;

  navLinks: NavLink[];

  constructor(
    private router: Router,
    private playerService: PlayerService,
  ) {
    this.displayNextZone = this.playerService.zones.isNextZone();
    this.displayPhs = this.playerService.zones.levelMax >= 5;
    this.navLinks = [
      new NavLink('Game'),
      new NavLink('Team'),
      new NavLink('Map', true, this.displayNextZone),
      new NavLink('Shop'),
      new NavLink('Equip'),
      new NavLink('Materia'),
      new NavLink('Items'),
      new NavLink('Config'),
      new NavLink('Save'),
    ].filter((navLink) => navLink.display === true);
  }

  ngOnInit(): void {
    /** Close automatically the sidebar when a url change is detected */
    this.sub.sink = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.visible = false;
        this.visibleChange.emit(this.visible);
      }
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public updateVisible(): void {
    this.visibleChange.emit(this.visible);
  }
}
