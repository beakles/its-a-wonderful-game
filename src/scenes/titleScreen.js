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
        this.playButton.alpha = 0.01;
        this.playButton.setInteractive();
        this.playButton.on('pointerdown', function(pointer) {
            self.scene.start('iceCreamScene');
        });

        this.creditsButton = this.add.rectangle(870, 500, 400, 175, 0x808080).setOrigin(0, 0);
        this.creditsButton.alpha = 0.01;
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerdown', function(pointer) {
            self.scene.start('creditsScene');
        });
    }

    update(time, delta) {
        globalVariables.gameDelta = 1000 / delta;
    }
  }