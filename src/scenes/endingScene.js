class endingScene extends Phaser.Scene {
    constructor() {
        super("endingScene");
    }

    preload() {
        // preload endings
        this.load.image('goodEnding', './assets/goodEnding.png');
        this.load.image('badEnding', './assets/badEnding.png');
    }

    create() {
        // text formatting
        let endingTextConfig = {
            fontFamily: 'Courier',
            fontSize: '32px',
            color: '#ffffff',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            }
        }
        // check if both scenes were passed using global variables
        if (globalVariables.endingCriteria.iceCream == true && globalVariables.endingCriteria.bankRush == true) {
            this.goodEnding = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'goodEnding').setOrigin(0, 0);
        } else { // if not add text based on which scenes were failed
            this.badEnding = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'badEnding').setOrigin(0, 0);
            if (globalVariables.endingCriteria.iceCream == false) {
                this.badIceCream = this.add.text(gameConfiguration.width / 2, gameConfiguration.height / 12, 'You failed the ice cream shop.', endingTextConfig).setOrigin(0.5, 0.5);
            }
            if (globalVariables.endingCriteria.bankRush == false) {
                this.badBank = this.add.text(gameConfiguration.width / 2, gameConfiguration.height / 8, 'You failed the bank rush.', endingTextConfig).setOrigin(0.5, 0.5);
            }
        }
    }

    update() {
        // nothing to update
    }
}