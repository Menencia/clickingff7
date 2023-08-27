import { BattleService } from 'src/app/core/services/battle.service';
import { MateriaRef } from '../../refs/materias';
import { AttackMateria } from '../attack-materia';
import { ActionSub } from '../../action-sub';

export class Bolt extends AttackMateria {

  ref = MateriaRef.Bolt;
  name = 'Bolt';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  zoneAvailable = 1;
  elements = ['bolt'];

}
