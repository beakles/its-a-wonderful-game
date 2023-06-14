class bankRushScene extends Phaser.Scene {
  constructor() {
    super("bankRushScene");
  }

  preload() {
    this.load.image('characterPlayer', './assets/george.png');

    this.load.image('customerMan1', './assets/man1.png');
    this.load.image('customerMan2', './assets/man2.png');
  }

  create() {

    this.characterPlayer = new Player(this, gameConfiguration.width / 2 - 500, gameConfiguration.height, 'characterPlayer').setOrigin(0.5, 0.5);
    this.characterPlayer.y -= this.characterPlayer.height / 2;

    this.customersArray = [];

    this.customersSpawned = 0;

    this.customerSpawnTimer = 0;
  }

  update(time, delta) {
    globalVariables.gameDelta = 1000 / delta;

    if (this.customersArray.length < gameConfiguration.sceneSettings.bankRushScene.customersCap && this.customersSpawned < gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers) {
      this.customerSpawnTimer += 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
    }

    if (this.customerSpawnTimer >= gameConfiguration.sceneSettings.iceCreamScene.customerSpawnTime) {
      this.customerSpawnTimer = 0;
      if (this.customersArray.length < gameConfiguration.sceneSettings.iceCreamScene.customersCap) {
        let newCustomer = new Customer(this, gameConfiguration.width, gameConfiguration.height, 'customerMan1', 0).setOrigin(0.5, 0.5);
        let newCustomerTexture = Phaser.Math.Between(0, 100);
        if (newCustomerTexture <= 50) {
          newCustomer.setTexture('customerMan2', 0);
        }
        newCustomer.x -= newCustomer.width / 2 + 150;
        newCustomer.y -= newCustomer.height / 2;
        this.customersArray.push(newCustomer);
        this.customersSpawned += 1;
      }
    }

    for (let customersArrayItem = 0; customersArrayItem < this.customersArray.length; customersArrayItem += 1) {
      let currentCustomer = this.customersArray[customersArrayItem];

      if (currentCustomer.status == "ordering") {
        /*
        if (this.comparePlayerWithCustomer(currentCustomer)) {
          currentCustomer.status = "satisfied";
        }
        */
      } else if (currentCustomer.status == "satisfied") {
        let poppedCustomer = this.customersArray.splice(customersArrayItem, 1)[0];
        poppedCustomer.destroy();
        customersArrayItem -= 1;
        // this.sound.play('orderCorrect');
        continue;
      } else if (currentCustomer.status == "waiting") {
        let currentCustomerTargetPosition = 500 + (currentCustomer.width * 1.5 * customersArrayItem);
        if (currentCustomer.x > currentCustomerTargetPosition) {
          currentCustomer.x -= 200 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
        } else {
          currentCustomer.x = currentCustomerTargetPosition;
          if (customersArrayItem == 0) {
            currentCustomer.status = "ordering";
            // this.sound.play('orderPresent');
          }
        }
      }
    }
  }
}