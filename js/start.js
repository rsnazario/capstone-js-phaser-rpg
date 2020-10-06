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
  scene: {
    BootScene,
    WorldScene,
    BattleScene,
    UIScene
  }
};

var game = new Phaser.Game(config);