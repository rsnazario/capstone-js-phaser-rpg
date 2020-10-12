import config from '../index';

export default class Instructions extends Phaser.Scene {
  constructor() {
    super('Instructions');
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
      25,
      'Dragon Quest', {
        fill: '#ffffff',
        fontSize: '32px',
        fontFamily: 'Georgias, Times, serif',
      }
    ).setOrigin(0.5);

    this.add.text(
      config.width / 2,
      60,
      'Move Around The World With Arrow Keys. \nOn Battle, Choose Action on Menu With Space Bar or Left Arrow Key. Kill Dragons to Score Up. \nAfter a Win, Heroes are Healed. Low Life Means Double Damage', {
        fill: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Georgias, Times, serif',
        align: 'center',
        wordWrap: {width: 260, useAdvancedWrap: true}
      }
    ).setOrigin(0.5, 0);

    // this.add.text(
    //   config.width / 2,
    //   100,
    //   'On Battle, Choose Action on Menu With Space Bar or Left Arrow Key', {
    //     fill: '#ffffff',
    //     fontSize: '20px',
    //     fontFamily: 'Georgia, Times, serif'
    //   }
    // ).setOrigin(0.5);

    // this.add.text(
    //   config.width / 2,
    //   120,
    //   'Kill Dragons to Score Up. \nAfter a Win, Heroes are Healed. \nLow Life Means Double Damage', {
    //     fill: '#ffffff',
    //     fontSize: '20px',
    //     fontFamily: 'Georgias, Times, serif'
    //   }
    // ).setOrigin(0.5);


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