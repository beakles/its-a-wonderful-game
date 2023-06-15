class creditsScene extends Phaser.Scene {
  constructor() {
    super("creditsScene");
  }

  preload() {
      this.load.image('credits', './assets/credits.png');
  }

  create() {
      const self = this;
      // background
      this.bg = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'credits').setOrigin(0, 0);
      // text formatting
      let creditsTextConfig = {
        fontFamily: 'Courier',
        fontSize: '32px',
        color: '#000000',
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

      this.creditsText.text = "Samuel Maturo:\n-Art\n-Design\n-Some Programming\n\nBrannon Eakles:\n-Design\n-Programming"
      // clickable button to go back to title screen
      this.backButton = this.add.rectangle(80, 500, 400, 175, 0x808080).setOrigin(0, 0);
      this.backButton.alpha = 0.01;
      this.backButton.setInteractive();
      this.backButton.on('pointerdown', function(pointer) {
          self.scene.start('titleScreen');
      });
  }

  update(time, delta) {
      globalVariables.gameDelta = 1000 / delta;
      // nothing to update
  }
}