import Unit from './unit';

export default class Enemy extends Unit {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage, 0.8);
  }
}
