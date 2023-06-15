class transitionScene extends Phaser.Scene {
  constructor() {
    super("transitionScene");
  }

  preload() {
    this.load.image('bg', './assets/transition.png');
  }

  create() {
    const self = this;
    // background and text format
    this.bg = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'bg').setOrigin(0, 0);
    let transitionTextConfig = {
      fontFamily: 'Courier',
      fontSize: '32px',
      color: '#000000',
      align: 'left',
      padding: {
          top: 5,
          bottom: 5,
          left: 5,
          right: 5
      }
    }
    // add blank text we can add to
    this.mainText = this.add.text(gameConfiguration.width / 2, gameConfiguration.height / 2.5, "TEST\nTEST", transitionTextConfig).setOrigin(0.5, 0.5);
    // button to retry the last scene
    this.retryButton = this.add.rectangle(175, 475, 400, 250, 0x808080).setOrigin(0, 0);
    this.retryButton.alpha = 0.01;
    this.retryButton.setInteractive();
    this.retryButton.on('pointerdown', function(pointer) {
      if (globalVariables.sceneEnded == 'iceCream'){
        self.scene.start('iceCreamScene');
      } else if (globalVariables.sceneEnded == 'bankRush'){
        self.scene.start('bankRushScene');
      }
    });
    // button to move ahead to the next scene
    this.nextButton = this.add.rectangle(750, 475, 400, 250, 0x808080).setOrigin(0, 0);
    this.nextButton.alpha = 0.01;
    this.nextButton.setInteractive();
    this.nextButton.on('pointerdown', function(pointer) {
      if (globalVariables.sceneEnded == 'iceCream'){
        self.scene.start('bankRushScene');
      } else if (globalVariables.sceneEnded == 'bankRush'){
        self.scene.start('endingScene');
      }
    });
    if (globalVariables.sceneEnded == 'iceCream') {
      if (globalVariables.endingCriteria.iceCream == true) {
        this.mainText.text = "Congrats! You served enough customers.\nYou can move on without losing.";
      } else {
        this.mainText.text = "Uh oh, you didn't meet your quota.\nYou should try again to not lose.";
      }
    } else if (globalVariables.sceneEnded == 'bankRush') {
      if (globalVariables.endingCriteria.bankRush == true) {
        this.mainText.text = "The bank survived the rush! Well done!";
      } else {
        this.mainText.text = "The bank has been run out of business\nand Potter got his way. Try again?";
      }
    }
  }

  update(time, delta) {
    // nothing to update
  }
}