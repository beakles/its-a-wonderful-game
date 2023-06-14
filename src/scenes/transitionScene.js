class transitionScene extends Phaser.Scene {
  constructor() {
    super("transitionScene");
  }

  preload() {
    this.load.image('bg', './assets/transition.png');
  }

  create() {
    const self = this;
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

    this.mainText = this.add.text(gameConfiguration.width / 2, gameConfiguration.height / 2, "", creditsTextConfig).setOrigin(0.5, 0.5);
  }

  update(time, delta) {
  }
}