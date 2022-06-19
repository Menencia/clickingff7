import { MateriaRef } from '../../refs/materias'
import { AttackMateria } from '../attack-materia'

export class Fire extends AttackMateria {

  ref = MateriaRef.Fire
  name = 'Fire'
  color = 'green'
  price = 300
  apBase = 3
  pwr = 50
  elements = ['fire']
  zoneAvailable = 2

}
