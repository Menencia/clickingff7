import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UiFooterComponent } from '@shared/components/ui-footer/ui-footer.component';
import { UiNavbarComponent } from '@shared/components/ui-navbar/ui-navbar.component';
import { GameService } from '@shared/services/game.service';
import { ThemeService } from '@shared/services/theme.service';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  imports: [UiFooterComponent, UiNavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild('drawerToggle') drawerToggle?: ElementRef;

  version = packageJson.version;

  constructor(
    private gameService: GameService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit() {
    const save = this.gameService.searchSave();
    this.gameService.load(save);

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const drawer = this.drawerToggle?.nativeElement;
        if (drawer) drawer.checked = false;
      }
    });

    this.themeService.setupTheme();
  }
}
