import Phaser from './phaser.min.js';
import BootScene from './js/boot';
import Game from './js/game';
import GetName from './js/getName';
import WorldScene from './js/world';
import BattleScene from './js/battle';
import UIScene from './js/ui';

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320,
  height: 240,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y : 0},
      debug: true
    }
  },
  scene: [
    BootScene,
    Game,
    GetName,
    WorldScene,
    BattleScene,
    UIScene
  ]
};

var game = new Phaser.Game(config);

window.score = 0;

export default config;