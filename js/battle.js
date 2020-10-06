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
  constructor() {
    super('UIScene');
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);

    this.graphics.strokeRect(2, 150, 90, 100);
    this.graphics.fillRect(2, 150, 90, 100);

    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);

    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    this.currentMenu = this.actionsMenu;

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');

    this.input.keyboard.on('keydown', this.onKeyInput, this);

    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
    this.events.on('SelectedAction', this.onSelectedAction, this);
    this.events.on('Enemy', this.onEnemy, this);

    this.sys.events.on('wake', this.createMenu, this);

    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  }

  createMenu() {
    this.remapHeroes();
    this.remapEnemies();
    this.battleScene.nextTurn();
  }

  remapHeroes() {
    var heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    var enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  }

  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {

      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      }
      else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      }
      else if (event.code === 'ArrowLeft' || event.code === 'Space') {
        this.currentMenu.confirm();
      }
    }
  }

  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }
};

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