import { Character } from '../character'
import { CharacterRef } from '../refs/characters'
import { BusterSword } from '../weapons/broadswords/buster-sword'

export class Cloud extends Character {

  ref = CharacterRef.Cloud
  name = 'Cloud Strife'
  image = '/assets/images/characters/cloud.jpg'
  weaponType = 'broadsword'
  weapon = new BusterSword()
  hpBase = 3
  mpBase = 3
  xpBase = 3
  notA = []

}
