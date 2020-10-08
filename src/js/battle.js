import PlayerCharacter from './player';
import Enemy from './enemy';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    // change backgroundColor\
    this.warriorHP = 130;
    this.mageHP = 80;
    this.score = 0;
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  generateRandomEnemies() {
    var allEnemies = ['dragonblue', 'dragonorange', 'dragonwhite', 'dragonred'];
    var enemiesNames = ['Blue D.', 'Orange D.', 'White D.', 'Red D.'];
    var enemiesHPs = [24, 29, 60, 33];
    var enemiesDamage = [25, 22, 18, 20];

    // for the first enemy:
    var firstIndex = Math.floor(Math.random() * allEnemies.length);

    var firstEnemy = new Enemy(this, 50, 40, allEnemies[firstIndex], null, enemiesNames[firstIndex], enemiesHPs[firstIndex], enemiesDamage[firstIndex]);
    this.add.existing(firstEnemy);

    // for the second enemy:
    var secondIndex = Math.floor(Math.random() * allEnemies.length);
    var secondEnemy = new Enemy(this, 50, 110, allEnemies[secondIndex], null, enemiesNames[secondIndex], enemiesHPs[secondIndex], enemiesDamage[secondIndex]);
    this.add.existing(secondEnemy);

    return [firstEnemy, secondEnemy];
  }

  startBattle() {
    // player character ==> warrior
    var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', this.warriorHP, 10);
    this.add.existing(warrior);

    // player character ==> mage
    var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', this.mageHP, 20);
    this.add.existing(mage); 

    this.enemies = this.generateRandomEnemies();

    this.heroes = [ warrior, mage ];

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
    if (this.warriorHP > 0 ) {
      this.warriorHP = this.heroes[0].hp + 12;
    }
    if (this.mageHP > 0) {
      this.mageHP = this.heroes[1].hp + 12;
    }
    if (this.warriorHP > this.heroes[0].maxHP) {
      this.warriorHP = this.heroes[0].maxHP;
    }
    if (this.mageHP > this.heroes[1].maxHP) {
      this.mageHP = this.heroes[1].maxHP;
    }
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
