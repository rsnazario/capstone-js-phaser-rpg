/* eslint-disable import/no-cycle */

import Phaser from '../../phaser.min';
import PlayerCharacter from '../entities/player';
import Enemy from '../entities/enemy';
import game from '../../index';

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
    const all = ['dragonblue', 'dragonorange', 'dragonwhite', 'dragonred'];
    const names = ['Blue D.', 'Orange D.', 'White D.', 'Red D.'];
    const HPs = [24, 29, 60, 39];
    const dmg = [25, 22, 14, 20];

    // for the first enemy:
    const one = Math.floor(Math.random() * all.length);

    const fstEnemy = new Enemy(this, 50, 40, all[one], null, names[one], HPs[one], dmg[one]);
    this.add.existing(fstEnemy);

    // for the second enemy:
    const two = Math.floor(Math.random() * all.length);
    const secEnemy = new Enemy(this, 50, 110, all[two], null, names[two], HPs[two], dmg[two]);
    this.add.existing(secEnemy);

    return [fstEnemy, secEnemy];
  }

  startBattle() {
    // player character ==> warrior
    const warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', this.warriorHP, 12);
    this.add.existing(warrior);
    // player character ==> mage
    const mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', this.mageHP, 22);
    this.add.existing(mage);
    // enemies
    this.enemies = this.generateRandomEnemies();

    this.heroes = [warrior, mage];
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
      this.index += 1;
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
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      // call attack function with enemy attacking random chosen hero to attack
      this.units[this.index].attack(this.heroes[r]);
      // add timer for next turn
      this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  exitBattle() {
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  wake() {
    this.scene.restart('UIScene');
    this.time.addEvent({ delay: 5000, callback: this.exitBattle, callbackScope: this });
  }

  checkEndBattle() {
    let victory = true;
    let gameOver = true;

    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].living) victory = false;
    }

    for (let i = 0; i < this.heroes.length; i += 1) {
      if (this.heroes[i].living) { gameOver = false; }
    }

    return victory || gameOver;
  }

  endBattle() {
    if (this.heroes[0].hp > 0) {
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

    for (let i = 0; i < this.units.length; i += 1) {
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
}
