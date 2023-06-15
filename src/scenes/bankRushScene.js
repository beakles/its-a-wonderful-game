class bankRushScene extends Phaser.Scene {
  constructor() {
    super("bankRushScene");
  }

  preload() {

    // load assets needed for the game
    this.load.image('bank', './assets/bank.png');

    this.load.image('characterPlayer', './assets/georgeBank.png');

    this.load.image('customerMan1', './assets/man1.png');
    this.load.image('customerMan2', './assets/man2.png');

    this.load.audio('buttonClick', './assets/buttonClick.wav');
    this.load.audio('buttonFail', './assets/buttonFail.wav');
    this.load.audio('bargainPresent', './assets/orderPresent.wav');
    this.load.audio('bargainResult', './assets/orderCorrect.wav');
  }

  create() {

    // text configs for the tutorial and other text boxes
    let tutorialTextConfig = {
      fontFamily: 'CourierBold',
      fontSize: '24px',
      backgroundColor: '#404040CC',
      color: '#FFFFFFFF',
      align: 'center',
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }

    let scoreTextConfig = {
      fontFamily: 'Courier',
      fontSize: '30px',
      backgroundColor: '#404040CC',
      color: '#FFFFFFFF',
      align: 'left',
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }

    let customerTextConfig = {
      fontFamily: 'Courier',
      fontSize: '30px',
      backgroundColor: '#404040CC',
      color: '#FFFFFFFF',
      align: 'left',
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }

    this.bankSceneBackdrop = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'bank').setOrigin(0, 0);

    this.tutorialText = this.add.text(gameConfiguration.width / 2, 70, "Maintain the bank's business until it closes for the day.\nThe bank's morale must stay above 50% before the time runs out.\nNo customers should remain before the time runs out.\nDeclining an offer reduces morale, while accepting an offer increases it.\nMinimize spent cents on each customer to improve success.", tutorialTextConfig).setOrigin(0.5, 0.5);

    this.characterPlayer = new Player(this, gameConfiguration.width / 2 - 525, gameConfiguration.height, 'characterPlayer').setOrigin(0.5, 0.5);
    this.characterPlayer.y -= this.characterPlayer.height / 2;

    this.currentMoneyText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5 + 30, 290, `DOLLARS: $${gameConfiguration.sceneSettings.bankRushScene.playerStartingMoney}.00`, scoreTextConfig).setOrigin(0.5, 0.5);

    this.currentMoraleText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5 + 10, 220, `MORALE: 100%`, scoreTextConfig).setOrigin(0.5, 0.5);

    this.sceneTimeText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5, gameConfiguration.height / 2 - gameConfiguration.height / 2.5 + 75, "TIME: 0", scoreTextConfig).setOrigin(0.5, 0.5);

    this.remainingCustomersText = this.add.text(gameConfiguration.width / 2 + 380, 290, `CUSTOMERS REMAINING: ${gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers}`, customerTextConfig).setOrigin(0.5, 0.5);

    this.customerBargainText = this.add.text(575, 290, "0", scoreTextConfig).setOrigin(0.5, 0.5);
    this.customerBargainText.alpha = 0;

    this.acceptBargainText = this.add.text(500, 200, "ACCEPT", scoreTextConfig).setOrigin(0.5, 0.5);
    this.acceptBargainText.alpha = 0;

    this.acceptBargainText.setInteractive();

    let parentScene = this;

    this.bargainState = "deciding";

    this.acceptBargainText.on('pointerdown', function(pointer) {
      if (parentScene.currentMoney >= parentScene.customerMoney) {
        parentScene.bargainState = "accept";
        parentScene.sound.play('buttonClick');
      } else {
        parentScene.sound.play('buttonFail');
      }
    });

    this.declineBargainText = this.add.text(650, 200, "DECLINE", scoreTextConfig).setOrigin(0.5, 0.5);
    this.declineBargainText.alpha = 0;

    this.declineBargainText.setInteractive();

    this.declineBargainText.on('pointerdown', function(pointer) {
      parentScene.bargainState = "decline";
      parentScene.sound.play('buttonClick');
    });

    this.bankMorale = 100;

    this.currentMoney = gameConfiguration.sceneSettings.bankRushScene.playerStartingMoney;

    this.customerMoney = 0;

    this.customersArray = [];
    this.customersSpawned = 0;
    this.customerSpawnTimer = 0;

    this.sceneTime = gameConfiguration.sceneSettings.bankRushScene.sceneTimeLimit;
  }

  presentCustomerBargain(customer) {
    this.customerMoney = Phaser.Math.Between(customer.preferredWithdrawAmount[0], customer.preferredWithdrawAmount[1]);
    this.customerBargainText.text = `$${this.customerMoney}.00`;
    this.customerBargainText.alpha = 1;
    this.acceptBargainText.alpha = 1;
    this.declineBargainText.alpha = 1;
  }

  clearCustomerBargain() {
    this.bargainState = "deciding";
    this.customerBargainText.alpha = 0;
    this.acceptBargainText.alpha = 0;
    this.declineBargainText.alpha = 0;
  }

  checkEnding() {
    if (this.customersArray.length <= 0 && this.bankMorale >= 50 && this.currentMoney >= 0){
      return true;
    } else {
      return false;
    }
  }

  update(time, delta) {
    globalVariables.gameDelta = 1000 / delta;

    this.sceneTime -= 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;

    if (this.sceneTime <= 0) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    if (this.currentMoney < 0) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    if (this.customersArray.length <= 0 && this.customersSpawned >= gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    if (Math.floor(this.sceneTime % 60) < 10) {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:0${Math.floor(this.sceneTime % 60)}`;
    } else {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:${Math.floor(this.sceneTime % 60)}`;
    }

    if (this.customersArray.length < gameConfiguration.sceneSettings.bankRushScene.customersCap && this.customersSpawned < gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers) {
      this.customerSpawnTimer += 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
    }

    if (this.customerSpawnTimer >= gameConfiguration.sceneSettings.bankRushScene.customerSpawnTime) {
      this.customerSpawnTimer = 0;
      if (this.customersArray.length < gameConfiguration.sceneSettings.bankRushScene.customersCap) {
        let newCustomer = new Customer(this, gameConfiguration.width, gameConfiguration.height, 'customerMan1', 0).setOrigin(0.5, 0.5);
        let newCustomerTexture = Phaser.Math.Between(0, 100);
        if (newCustomerTexture <= 50) {
          newCustomer.setTexture('customerMan2', 0);
        }
        newCustomer.x += newCustomer.width / 2;
        newCustomer.y -= newCustomer.height / 2;
        this.customersArray.push(newCustomer);
        this.customersSpawned += 1;

        this.remainingCustomersText.text = `CUSTOMERS REMAINING: ${gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers - this.customersSpawned}`;
      }
    }

    for (let customersArrayItem = 0; customersArrayItem < this.customersArray.length; customersArrayItem += 1) {
      let currentCustomer = this.customersArray[customersArrayItem];

      if (currentCustomer.status == "bargaining") {
        if (this.bargainState != "deciding") {
          if (this.bargainState == "accept") {
            this.bankMorale += 20;
            if (this.bankMorale >= 100) {
              this.bankMorale = 100;
            }
            this.currentMoney -= this.customerMoney;
          } else if (this.bargainState == "decline") {
            this.bankMorale -= 15;
            if (this.bankMorale <= 0) {
              this.bankMorale = 0;
            }
          }
          currentCustomer.status = "satisfied";
        }
      } else if (currentCustomer.status == "satisfied") {
        let poppedCustomer = this.customersArray.splice(customersArrayItem, 1)[0];
        poppedCustomer.destroy();
        customersArrayItem -= 1;
        this.sound.play('bargainResult');
        this.clearCustomerBargain();
        this.currentMoraleText.text = `MORALE: ${this.bankMorale}%`;
        this.currentMoneyText.text = `DOLLARS: $${this.currentMoney}.00`;
        continue;
      } else if (currentCustomer.status == "waiting") {
        let currentCustomerTargetPosition = 575 + (currentCustomer.width * 1.1 * customersArrayItem);
        if (currentCustomer.x > currentCustomerTargetPosition) {
          currentCustomer.x -= 200 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
        } else {
          currentCustomer.x = currentCustomerTargetPosition;
          if (customersArrayItem == 0) {
            currentCustomer.status = "bargaining";
            this.sound.play('bargainPresent');
            this.presentCustomerBargain(currentCustomer);
          }
        }
      }
    }
  }
}