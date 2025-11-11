import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-materia-icon',
  imports: [],
  template: `<img class="inline-block" src="/assets/images/icons/materias/{{ color }}.webp" alt="materia" />`,
})
export class MateriaIconComponent {
  @Input() color = 'green';
}
