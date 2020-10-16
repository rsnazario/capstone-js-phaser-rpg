/* eslint-disable import/no-cycle */

import Phaser from '../../phaser.min';
import game from '../../index';

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  startButtonAction() {
    this.startButton.on('pointerdown', () => {
      this.scene.start('GetName');
    });
  }

  instructionsAction() {
    this.instructionsButton.on('pointerdown', () => {
      this.scene.start('Instructions');
    });
  }

  scoresAction() {
    this.scoresButton.on('pointerdown', () => {
      this.scene.start('Scores');
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('black');
    this.add.text(
      game.config.width / 2,
      25,
      'Dragon Quest', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.startButton = this.add.text(
      game.config.width / 2,
      100,
      'START GAME',
      24, {
        fill: '#ffffff',
        fontSize: '26px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.instructionsButton = this.add.text(
      game.config.width / 2,
      130,
      'HOW TO PLAY',
      24, {
        fill: '#ffffff',
        fontSize: '26px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.scoresButton = this.add.text(
      game.config.width / 2,
      160,
      'LEADERBOARD',
      24, {
        fill: '#ffffff',
        fontSize: '26px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.startButton.setInteractive();
    this.startButtonAction();

    this.instructionsButton.setInteractive();
    this.instructionsAction();

    this.scoresButton.setInteractive();
    this.scoresAction();

    if (window.bgMusic === false) {
      window.bgMusic = true;
      game.bgMusic.play();
    }
  }
}