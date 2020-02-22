import { Component } from '@angular/core';
import { GameService } from './game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clickingff7';

  constructor(
    public game: GameService,
    public router: Router
  ) {
    // Global redirection
    if (this.game.isConnected()) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  /**
   * Quit the current game
   */
  exitGame() {
    this.game.quit();
    this.router.navigateByUrl('/home');
  }
}
