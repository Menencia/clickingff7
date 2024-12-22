import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Damage {
  id: number;
  value: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-damages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './damages.component.html',
  styleUrls: ['./damages.component.css'],
})
export class DamagesComponent {
  damages: Damage[] = [];

  // Add a new damage number
  addDamage(value: string, x: number, y: number): void {
    const id = Date.now(); // Unique ID
    this.damages.push({ id, value, x, y });
  }

  // Remove a damage number after the animation ends
  removeDamage(id: number): void {
    this.damages = this.damages.filter((damage) => damage.id !== id);
  }
}
