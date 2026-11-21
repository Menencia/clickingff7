import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';
import { ThemePickerComponent } from './shared/components/theme-picker/theme-picker.component';
import { UiFooterComponent } from './shared/ui/ui-footer/ui-footer.component';

@Component({
  selector: 'app-root',
  imports: [
    UiFooterComponent,
    RouterOutlet,
    SidemenuComponent,
    ThemePickerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  readonly drawerToggle = viewChild<ElementRef>('drawerToggle');

  version = packageJson.version;

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const drawer = this.drawerToggle()?.nativeElement;
        if (drawer) drawer.checked = false;
      }
    });
  }
}
