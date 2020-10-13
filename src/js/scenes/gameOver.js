/* eslint-disable import/no-cycle */

import Phaser from '../../phaser.min';
import game from '../../index';
import scoreboard from '../api/scoreboard';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  backButtonAction() {
    this.backButton.on('pointerdown', () => {
      window.score = 0;
      this.scene.start('Game');
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('black');

    window.battleMusic = false;
    window.bgMusic = true;
    game.battleMusic.stop();
    game.bgMusic.play();

    this.add.text(
      game.config.width / 2,
      20,
      'Thanks for Playing', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.add.text(
      game.config.width / 2,
      50,
      'Dragon Quest', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.add.text(
      game.config.width / 2,
      100,
      'Your Score:', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.add.text(
      game.config.width / 2,
      140,
      `${window.playerName}: ${window.score}`, {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    this.backButton = this.add.text(
      game.config.width / 2,
      game.config.height - 20,
      'Back to Main Menu', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    scoreboard.setScore(window.playerName, window.score);

    this.backButton.setInteractive();
    this.backButtonAction();
  }
}