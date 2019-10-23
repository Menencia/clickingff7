import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-win',
  template: `
    <p>
      win works!
    </p>
    <button (click)="goNext()">Continue</button>
  `,
  styles: []
})
export class WinComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goNext() {
    this.router.navigateByUrl('/story');
  }

}
