export default class GetName extends Phaser.Scene {
  constructor() {
    super('GetName');
  }

  create() {
    console.log('getName Scene');

    this.add.text(10, 10, 'Enter your name: ', {
      font: '22px Courier', fill: '#ffffff'
    });

    this.text = this.add.text(10, 50, '', {
      font: '22px Courier', fill: '#ffff00'
    });

    var textEntry = '';

    this.input.keyboard.on('keydown', (event) => {
      if (event.keyCode === 8 && textEntry.length > 0) {
        textEntry = textEntry.substr(0, textEntry.length - 1);
      }
      else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 106)) {
        if (textEntry.length <= 15) {
          textEntry += event.key;
        }
      }
      this.text.setText(textEntry);
      if (event.keyCode === 13 && textEntry.length > 0) {
        window.playerName = textEntry;
        this.scene.start('WorldScene');
      }
    });
  } 
}
