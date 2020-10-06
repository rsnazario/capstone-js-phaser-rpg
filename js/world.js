class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('tiles', 'assets/map/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    this.load.spritesheet('player', 'assets/RPG_assets.png', {
      frameWidth: 16, frameHeight: 16
    });
    this.load.image('dragonblue', 'assets/dragonblue.png');
    this.load.image('dragonorange', 'assets/dragonblue.png');
  }

  create() {
    this.scene.start('WorldScene');
  }
};

class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  preload() {

  }

  create() {
    var map = this.make.tilemap({key: 'map'});
    var tiles = map.addTilesetImage('spritesheet', 'tiles');

    var grass = map.createStaticLayer('Grass', tiles, 0, 0);
    var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion(-1);

    this.player = this.physics.add.sprite(50, 100, 'player', 6);

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, obstacles);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;


    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {frames: [1, 7, 1, 13]}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {frames: [1, 7, 1, 13]}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {frames: [2, 8, 2, 14]}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {frames: [0, 6, 0, 12]}),
      frameRate: 10,
      repeat: -1
    });

  }

  
}