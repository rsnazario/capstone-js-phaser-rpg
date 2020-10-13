/* eslint-disable import/no-cycle */

import Phaser from '../../phaser.min';
import game from '../../index';
import scoreboard from '../api/scoreboard';

export default class Scores extends Phaser.Scene {
  constructor() {
    super('Scores');
  }

  backButtonAction() {
    this.backButton.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }

  displayLeaders(list) {
    for (let i = 0; i < 5; i += 1) {
      if (i >= list.length) {
        break;
      }
      this.add.text(
        game.config.width / 2,
        70 + 25 * i,
        `${list[i].user}   ${list[i].score}`, {
          fill: '#ffff00',
          fontSize: '24px',
          fontFamily: 'Georgias, Times, serif',
        },
      ).setOrigin(0.5);
    }
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

    this.backButton = this.add.text(
      game.config.width / 2,
      game.config.height - 20,
      'Back', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif',
      },
    ).setOrigin(0.5);

    scoreboard.getScore().then((leaderboard) => {
      const leaders = scoreboard.orderedScores(leaderboard);
      this.displayLeaders(leaders);
    }).catch(() => {
      this.scene.start('Game');
    });


    this.backButton.setInteractive();
    this.backButtonAction();
  }
}