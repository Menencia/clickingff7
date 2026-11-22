import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-about',
  imports: [UiLayoutDefaultComponent, TranslatePipe],
  templateUrl: './view-about.component.html',
})
export class ViewAboutComponent {
  protected readonly version = packageJson.version;
}
