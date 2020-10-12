import HeroesMenu from '../menus/heroesMenu';
import ActionsMenu from '../menus/actionsMenu';
import EnemiesMenu from '../menus/enemiesMenu';
import Message from '../menus/message';

export default class UIScene extends Phaser.Scene {
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
