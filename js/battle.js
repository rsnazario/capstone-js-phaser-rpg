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

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index++;

      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      var r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);

      this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
    }
  }

  checkEndBattle() {
    var victory = true;
    var gameOver = true;

    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) 
        victory = false;
    }

    for (var i = 0; i < this.enemies.length; i++) {
      if (this.heroes[i].living)
        gameOver = false;
    }

    return victory || gameOver;
  }

  endBattle() {
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (var i = 0; i < this.units.length; i++) {
      this.units[i].destroy();
    }

    this.units.length = 0;

    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this})
  }

  wake() {
    this.scene.restart('UIScene');
    this.time.addEvent({delay: 3000, callback: this.exitBattle, callbackScope: this})
  }

  exitBattle() {
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
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