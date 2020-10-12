import config from '../index';

export default class Scores extends Phaser.Scene {
  constructor() {
    super('Scores');
  }

  backButtonAction() {
    this.backButton.on('pointerdown', () => {
      this.scene.start('Game');
    })
  }

  create() {
    this.cameras.main.setBackgroundColor('black');
    this.add.text(
      config.width / 2,
      25,
      'Dragon Quest', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      }
    ).setOrigin(0.5);

    this.backButton = this.add.text(
      config.width / 2,
      config.height - 20,
      'Back', {
        fill: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Georgias, Times, serif'
      }
    ).setOrigin(0.5);

    this.backButton.setInteractive();
    this.backButtonAction();
  }
}