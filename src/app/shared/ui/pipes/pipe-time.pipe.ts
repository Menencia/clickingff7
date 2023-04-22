import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class PipeTimePipe implements PipeTransform {

  transform(elapsed: number): string {
    let res = '';
    const hours = Math.floor(elapsed / 3600);
    res += hours;
    elapsed -= hours * 3600;

    const minutes = Math.floor(elapsed / 60);
    res += ':';
    if (minutes < 10) {
      res += '0';
    }
    res += minutes;

    const seconds = elapsed - minutes * 60;
    res += ':';
    if (seconds < 10) {
      res += '0';
    }
    res += seconds;

    return res;
  }

}
