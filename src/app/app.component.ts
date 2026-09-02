import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('drawerToggle') drawerToggle?: ElementRef;

  version = packageJson.version;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const drawer = this.drawerToggle?.nativeElement;
        if (drawer) drawer.checked = false;
      }
    });
  }
}
