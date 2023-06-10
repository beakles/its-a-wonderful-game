class titleScreen extends Phaser.Scene {
    constructor() {
      super("titleScreen");
    }
  
    preload() {
        this.load.image('title', './assets/title.png');
    }
  
    create() {
        const self = this;
        this.titleScreen = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'title').setOrigin(0, 0);
        this.playButton = this.add.rectangle(330, 450, 475, 250, 0x808080).setOrigin(0, 0);
        this.playButton.alpha = 0.5;
        this.playButton.setInteractive();
        this.playButton.on('pointerdown', function(pointer) {
            self.scene.start('iceCreamScene');
        });
    }

    update(time, delta) {
        globalVariables.gameDelta = 1000 / delta;
    }
  }