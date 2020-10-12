import config from './../../index';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  backButtonAction() {
    this.backButton.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('black');
    this.add.text(
      config.width / 2,
      20,
      'Thanks for Playing', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      }
    ).setOrigin(0.5);

    this.add.text(
      config.width / 2,
      50,
      'Dragon Quest', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      }
    ).setOrigin(0.5);

    this.add.text(
      config.width / 2,
      100,
      'Your Score:', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif'
      }
    ).setOrigin(0.5);

    this.add.text(
      config.width / 2,
      140,
      window.playerName + ': ' + window.score, {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif',
      }
    ).setOrigin(0.5);

    this.backButton = this.add.text(
      config.width / 2,
      config.height - 20,
      'Back to Main Menu', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif'
      }
    ).setOrigin(0.5);

    this.backButton.setInteractive();
    this.backButtonAction();
  }
}