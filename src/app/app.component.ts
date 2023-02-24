import { Component, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { GameService } from './services/game.service'
import { HttpClient } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'
import { BattleService } from './services/battle.service'

// declare this to by pass typescript error
// can put this in index.d.ts file
declare var introJs: any

enum Theme {
  Light = 'light',
  Dark = 'dark',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clickingff7'
  theme: string

  constructor(
    public gameService: GameService,
    public battleService: BattleService,
    public router: Router,
    public http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    // default theme
    const theme = localStorage.getItem('theme') as Theme
    this.theme = theme ? theme: Theme.Light
    this.applyTheme()
  }

  toggleDark() {
    this.theme = this.theme === Theme.Light ? Theme.Dark : Theme.Light
    this.applyTheme()
  }

  applyTheme() {
    localStorage.setItem('theme', this.theme)
    const htmlNode = this.document.querySelector('html')
    if (htmlNode) {
      if (this.theme === Theme.Dark) {
        htmlNode.classList.add('dark')
      } else {
        htmlNode.classList.remove('dark')
      }
    }
  }

  /**
   * Go to the game
   */
  goGame(): void {
    this.router.navigateByUrl('game')
  }

  /**
   * Go to the map
   */
  goMap(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('map')
    }
  }

  /**
   * Go to the shop
   */
  goShop(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('shop')
    }
  }

  /**
   * Go to the items
   */
  goItems(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('items')
    }
  }

  /**
   * Go to the weapons
   */
  goEquip(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('equip')
    }
  }

  /**
   * Go to the materias
   */
  goMateria(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('materia')
    }
  }

  /**
   * Go to the game configuration
   */
  goConfig(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('config')
    }
  }

  /**
   * Go to the PHS
   */
  goPHS(): void {
    if (!this.battleService.isBattle && this.gameService.zones.levelMax >= 5) {
      this.router.navigateByUrl('phs')
    }
  }

  /**
   * Save the game
   */
  goSave(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('save')
    }
  }

  // Show help
  help(): void {
    if (!this.battleService.isBattle) {
      this.router.navigateByUrl('game')

      this.http.get('/assets/help/' + this.gameService.language + '.json')
        .subscribe((data) => {
          const intro = introJs()
          intro.setOptions(data)
          intro.start()
        })
    }
  }
}
