class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  startBattle() {
    
    var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', 100, 20);
    this.add.existing(warrior);

    var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', 80, 8);
    this.add.existing(mage);

    var dragonblue = new Enemy(this, 50, 40, 'dragonblue', null, 'Dragon', 50, 1);
    this.add.existing(dragonblue);

    var dragonorange = new Enemy(this, 50, 40, 'dragonorange', null, 'Dragon2', 50, 1);
    this.add.existing(dragonorange);

    this.heroes = [warrior, mage],
    this.enemies = [dragonblue, dragonorange];

    this.units = this.heroes.concat(this.enemies);

    this.index = -1;

    this.scene.run('UIScene');
  }
}

class UIScene extends Phaser.Scene {

}

class Unit extends Phaser.GameObjects.Sprite {

}

class PlayerCharacter extends Unit {

}

class Enemy extends Unit {

}

class Menu extends Phaser.GameObjects.Container {

}

class MenuItem extends Phaser.GameObjects.Text {

}

class HeroesMenu extends Menu {

}

class ActionsMenu extends Menu {

}

class EnemiesMenu extends Menu {

}

class Message extends Phaser.GameObjects.Container {

}