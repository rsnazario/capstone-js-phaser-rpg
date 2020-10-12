import Phaser from './phaser.min.js';
import BootScene from './js/scenes/boot';
import Game from './js/scenes/game';
import GetName from './js/scenes/getName';
import Instructions from './js/scenes/instructions';
import WorldScene from './js/scenes/world';
import BattleScene from './js/scenes/battle';
import UIScene from './js/scenes/ui';
import Scores from './js/scenes/scores';
import GameOver from './js/scenes/gameOver';

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
    Instructions,
    WorldScene,
    BattleScene,
    UIScene,
    Scores,
    GameOver
  ]
};

var game = new Phaser.Game(config);

window.score = 0;
window.key = 't82Jd3rsSodrA4KcbQ65';

export default config;