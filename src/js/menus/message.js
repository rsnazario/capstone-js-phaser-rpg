import Phaser from '../../phaser.min';

export default class Message extends Phaser.GameObjects.Container {
  constructor(scene, events) {
    super(scene, 160, 30);
    const graphics = this.scene.add.graphics();
    this.add(graphics);

    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(-100, -15, 200, 30);
    graphics.fillRect(-100, -15, 200, 30);

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      color: '#ffffff',
      align: 'center',
      fontSize: 12,
      wordWrap: { width: 195, useAdvancedWrap: true },
    }).setOrigin(0.5);
    this.add(this.text);

    events.on('Message', this.showMessage, this);
    this.visible = false;
  }

  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }
    this.hideEvent = this.scene.time.addEvent(
      { delay: 2000, callback: this.hideMessage, callbackScope: this },
    );
  }

  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }
}