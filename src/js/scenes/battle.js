import PlayerCharacter from '../entities/player';
import Enemy from '../entities/enemy';
import WorldScene from './world';
import game from './../../index';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    this.warriorHP = 130;
    this.mageHP = 80;
    this.score = 0;
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');


    if (window.battleMusic === false) {
      window.bgMusic = false;
      window.worldMusic = false;
      window.battleMusic = true;
      game.bgMusic.stop();
      game.worldMusic.stop();
      game.battleMusic.play();
    }

    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  generateRandomEnemies() {
    var allEnemies = ['dragonblue', 'dragonorange', 'dragonwhite', 'dragonred'];
    var enemiesNames = ['Blue D.', 'Orange D.', 'White D.', 'Red D.'];
    var enemiesHPs = [24, 29, 60, 33];
    var enemiesDamage = [250, 220, 180, 200];

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
    if (this.warriorHP > 0) {
      var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', this.warriorHP, 10);
      this.add.existing(warrior);
    }
    // player character ==> mage
    if (this.mageHP > 0) {
      var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', this.mageHP, 20);
      this.add.existing(mage); 
    }
    // enemies
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
    if (this.heroes[0].hp > 0 ) {
      this.heroes[0].hp += 12;
      if (this.heroes[0].hp > this.heroes[0].maxHP) {
        this.heroes[0].hp = this.heroes[0].maxHP;
      }
    }

    if (this.heroes[1].hp > 0) {
      this.heroes[1].hp += 12;
      if (this.heroes[1].hp > this.heroes[1].maxHP) {
        this.heroes[1].hp = this.heroes[1].maxHP;
      }  
    }

    this.warriorHP = this.heroes[0].hp;
    this.mageHP = this.heroes[1].hp;

    this.heroes.length = 0;
    this.enemies.length = 0;
    
    for (var i = 0; i < this.units.length; i++) {
      this.units[i].destroy();
    }
    this.units.length = 0;

    this.scene.sleep('UIScene');

    if (this.warriorHP <= 0 && this.mageHP <= 0) {
      this.gameIsOver();
    } else {
      // return WS
      this.scene.switch('WorldScene');
    }
  }

  gameIsOver() {
    this.scene.stop('WorldScene');
    this.scene.start('GameOver');
  }
};
