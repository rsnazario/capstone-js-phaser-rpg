export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('tiles', 'assets/map/spritesheet.png');
      
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    
    // our two characters
    this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

    // enemies
    this.load.image('dragonblue', 'assets/dragonblue.png');
    this.load.image('dragonorange', 'assets/dragonorange.png');
    this.load.image('dragonwhite', 'assets/dragonwhite.png');
    this.load.image('dragonred', 'assets/dragonred.png');
  }

  create() {
    // this.scene.start('WorldScene');
    this.scene.start('WorldScene');
  }
};
