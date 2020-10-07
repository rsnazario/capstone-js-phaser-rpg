
class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    // change backgroundColor\
    this.warriorHP = 100;
    this.mageHP = 80;
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  startBattle() {
    // player character ==> warrior
    var warriorFactor = 1;
    if (this.warriorHP < 33) 
      warriorFactor = 2;

    var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', this.warriorHP, 15 * warriorFactor);
    this.add.existing(warrior);

    var mageFactor = 1;
    if (this.mageHP < 25) 
      mageFactor = 2;
    // player character ==> mage
    var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', this.mageHP, 20 * mageFactor);
    this.add.existing(mage);

    var dragonblue = new Enemy(this, 50, 40, 'dragonblue', null, 'Blue D.', 30, 10);
    this.add.existing(dragonblue);

    var dragonorange = new Enemy(this, 50, 110, 'dragonorange', null, 'Orange D.', 30, 10);

    var dragonwhite = new Enemy(this, 50, 40, 'dragonwhite', null, 'White D.', 40, 10);
    this.add.existing(dragonwhite);

    
    this.add.existing(dragonorange);

    this.heroes = [ warrior, mage ];
    this.enemies = [dragonblue, dragonorange ];

    this.units = this.heroes.concat(this.enemies);

    this.index = -1;

    this.scene.run("UIScene");
  }

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    };
    do {
      this.index++;
      // if there are no more units, start again from 1st one
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    // if its player hero
    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      // random index for attacking
      var r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living)
      // call attack function with enemy attacking random chosen hero to attack
      this.units[this.index].attack(this.heroes[r]);
      // add timer for next turn
      this.time.addEvent( {delay: 3000, callback: this.nextTurn, callbackScope: this});
    }
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);;
    }
    this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
  }

  exitBattle() {
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  wake() {
    this.scene.restart('UIScene');
    this.time.addEvent( {delay: 5000, callback: this.exitBattle, callbackScope: this})  
  }

  checkEndBattle() {
    var victory = true;
    var gameOver = true;

    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living)
        victory = false;
    }

    for(var i = 0; i < this.heroes.length; i++ ) {
      if (this.heroes[i].living) 
        gameOver = false;
    }

    return victory || gameOver;
  }

  endBattle() {
    this.warriorHP = this.heroes[0].hp + 12;
    this.mageHP = this.heroes[1].hp + 12;

    if (this.warriorHP > this.heroes[0].maxHP) 
      this.warriorHP = this.heroes[0].maxHP;

    if (this.mageHP > this.heroes[1].maxHP)
      this.mageHP = this.heroes[1].maxHP;
    
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (var i = 0; i < this.units.length; i++) {
      // link item
      this.units[i].destroy();
    }
    this.units.length = 0;
    // sleep UI
    this.scene.sleep('UIScene');
    // return WS
    this.scene.switch('WorldScene');
  }
};

class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    
    // rectangle 1
    this.graphics.strokeRect(2, 150, 110, 100);
    this.graphics.fillRect(2, 150, 110, 100);
    // rectangle 2
    this.graphics.strokeRect(115, 150, 70, 100);
    this.graphics.fillRect(115, 150, 70, 100);
    // rectangle 3
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

    // menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(120, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    this.currentMenu = this.actionsMenu;

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    // getting heroes and enemies from battleScene
    this.battleScene = this.scene.get('BattleScene');

    // cursors
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    // listener for turn-events
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
    this.events.on('SelectedAction', this.onSelectedAction, this);
    this.events.on('Enemy', this.onEnemy, this);

    // wake event listener
    this.sys.events.on('wake', this.createMenu, this);

    // messages
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
      else if (event.code === 'ArrowRight' || event.code === 'Shift') {

      }
      else if (event.code === 'Space' || event.code === 'ArrowLeft') {
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
  constructor(scene, x, y, texture, frame, type, hp, damage, scale) {
    super(scene, x, y, texture, frame);
    this.type = type;
    this.maxHP = this.hp = hp;
    this.damage = damage; // default damage
    this.setScale(scale);

    this.living = true;
    this.menuItem = null;
  };

  setMenuItem(item) {
    this.menuItem = item;
  }

  attack(target) {
    target.takeDamage(this.damage);
    this.scene.events.emit('Message', this.type + ' Attacks ' + target.type + ' for ' + this.damage + ' damage');
  };

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  }
}

class Enemy extends Unit {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage, 0.8);
  }
}

class PlayerCharacter extends Unit {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage, 1.3);
    // Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

    this.flipX = true;
    this.setScale(2);
  }
}

class Menu extends Phaser.GameObjects.Container {
  constructor(x, y, scene, heroes) {
    super(scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
    this.heroes = heroes;
    this.selected = false;
  }

  addMenuItem(unit) {
    var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  }

  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) {
        this.menuItemIndex = this.menuItems.length - 1;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex > this.menuItems.length - 1) {
        this.menuItemIndex = 0;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  // select the menu as a whole and an element with index from it
  select(index) {
    if (!index) {
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
      if (this.menuItemIndex == index) {
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  }

  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  }

  confirm() {
    
  }

  //
  clear() {
    for (var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  }

  remap(units) {
    this.clear();
    for(var i = 0; i < units.length ; i++) {
      var unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
      
    }
    this.menuItemIndex = 0;
  }
}

class MenuItem extends Phaser.GameObjects.Text {
  constructor(x, y, text, scene) {
    super(scene, x, y, text, { color: '#ffffff', align: 'left' });
  }

  select() {
    this.setColor('#f8ff38');
  }

  deselect() {
    this.setColor('#ffffff');
  }

  unitKilled() {
    this.active = false;
    this.visible = false;
  }
}

class HeroesMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
  }
}

class ActionsMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
    this.addMenuItem('Attack');
  }

  confirm() {
    this.scene.events.emit('SelectedAction');
  }
}

class EnemiesMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
  }

  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}

class Message extends Phaser.GameObjects.Container {
  constructor(scene, events) {
    super(scene, 160, 30);
    var graphics = this.scene.add.graphics();
    this.add(graphics);

    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(-90, -15, 180, 30);
    graphics.fillRect(-90, -15, 180, 30);

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {color: '#ffffff', align: 'center', fontSize: 13, wordWrap: {width: 170, useAdvancedWrap: true}}).setOrigin(0.5);
    this.add(this.text);

    events.on('Message', this.showMessage, this);
    this.visible = false;
  }

  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }
    this.hideEvent = this.scene.time.addEvent( {delay: 2000, callback: this.hideMessage, callbackScope: this} );
  }

  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }
}
