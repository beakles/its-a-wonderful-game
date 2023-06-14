class creditsScene extends Phaser.Scene {
  constructor() {
    super("creditsScene");
  }

  preload() {
      // this.load.image('title', './assets/title.png');
  }

  create() {
      const self = this;

      let creditsTextConfig = {
        fontFamily: 'CourierBold',
        fontSize: '32px',
        backgroundColor: '#202020FF',
        color: '#FFFFFF',
        align: 'left',
        padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5
        },
        // fixedWidth: 100,
        stroke: '#000000',
        strokeThickness: 0
    }

      this.creditsText = this.add.text(gameConfiguration.width / 2, gameConfiguration.height / 2, "", creditsTextConfig).setOrigin(0.5, 0.5);

      this.creditsText.text = "Samuel Hadus:\n-Art\n-Design\n-Programming\n\nBrannon Eakles:\n-Design\n-Programming"

      this.backButton = this.add.rectangle(20, 500, 400, 175, 0x808080).setOrigin(0, 0);
      this.backButton.alpha = 0.5;
      this.backButton.setInteractive();
      this.backButton.on('pointerdown', function(pointer) {
          self.scene.start('titleScreen');
      });
  }

  update(time, delta) {
      globalVariables.gameDelta = 1000 / delta;
  }
}