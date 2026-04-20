import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Race } from '../../../core/models/f1.models';
import { TimeService } from '../../../core/services/time.service';

@Component({
  selector: 'app-race-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './race-card.component.html',
  styleUrl: './race-card.component.css',
})
export class RaceCardComponent {
  @Input({ required: true }) race!: Race;

  constructor(public timeService: TimeService) {}

  getStatusClass(): string {
    switch (this.race.status) {
      case 'passed':
        return 'bg-gray-700 text-gray-400 border-gray-600';
      case 'current':
        return 'bg-f1-red text-white border-f1-red animate-pulse';
      case 'upcoming':
        return 'bg-green-900/50 text-green-400 border-green-500';
      default:
        return 'bg-gray-700 text-gray-400 border-gray-600';
    }
  }

  getStatusLabel(): string {
    switch (this.race.status) {
      case 'passed':
        return 'Terminado';
      case 'current':
        return 'EN VIVO';
      case 'upcoming':
        return 'Próximo';
      default:
        return this.race.status;
    }
  }

  getCircuitImage(): string {
    const id = this.race.circuitIcon?.split('/').pop() || this.race.id;
    return `https://www.formula1.com/f1 circuits/${id}.png`;
  }
}