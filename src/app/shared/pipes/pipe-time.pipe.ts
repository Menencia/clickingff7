import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class PipeTimePipe implements PipeTransform {
  transform(elapsed: number): string {
    const time = Math.ceil(elapsed / 1000);

    let res = '';
    const hours = Math.floor(time / 3600);
    res += hours;
    const leftTime = time - hours * 3600;

    const minutes = Math.floor(leftTime / 60);
    res += ':';
    if (minutes < 10) {
      res += '0';
    }
    res += minutes;

    const seconds = leftTime - minutes * 60;
    res += ':';
    if (seconds < 10) {
      res += '0';
    }
    res += seconds;

    return res;
  }
}
