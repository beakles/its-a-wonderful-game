class bankRushScene extends Phaser.Scene {
  constructor() {
    super("bankRushScene");
  }

  preload() {

    // Load assets necessary for the ice cream scene
    this.load.image('bank', './assets/bank.png');

    this.load.image('characterPlayerOld', './assets/georgeBank.png');

    this.load.image('customerMan1', './assets/man1.png');
    this.load.image('customerMan2', './assets/man2.png');

    this.load.audio('buttonClick', './assets/buttonClick.wav');
    this.load.audio('buttonFail', './assets/buttonFail.wav');
    this.load.audio('bargainPresent', './assets/orderPresent.wav');
    this.load.audio('bargainResult', './assets/orderCorrect.wav');
  }

  create() {

    // Text configurations for the tutorial, score, and customer text boxes.
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

    // Background picture showing the ice cream shop.
    this.bankSceneBackdrop = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'bank').setOrigin(0, 0);

    // Tutorial text to display to the player.
    this.tutorialText = this.add.text(gameConfiguration.width / 2, 70, "Maintain the bank's business until it closes for the day.\nThe bank's morale must stay above 50% before the time runs out.\nNo customers should remain before the time runs out.\nDeclining an offer reduces morale, while accepting an offer increases it.\nMinimize spent dollars on each customer to improve success.", tutorialTextConfig).setOrigin(0.5, 0.5);

    // The sprite for the player's character (George Bailey).
    this.characterPlayerOld = new Player(this, gameConfiguration.width / 2 - 525, gameConfiguration.height, 'characterPlayerOld').setOrigin(0.5, 0.5);
    this.characterPlayerOld.y -= this.characterPlayerOld.height / 2;

    // Text for the current amount of money the player has.
    this.currentMoneyText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5 + 30, 290, `DOLLARS: $${gameConfiguration.sceneSettings.bankRushScene.playerStartingMoney}.00`, scoreTextConfig).setOrigin(0.5, 0.5);

    // Text for the current morale of the bank.
    this.currentMoraleText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5 + 10, 220, `MORALE: 100%`, scoreTextConfig).setOrigin(0.5, 0.5);

    // Text for the remaining scene time.
    this.sceneTimeText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5, gameConfiguration.height / 2 - gameConfiguration.height / 2.5 + 75, "TIME: 0", scoreTextConfig).setOrigin(0.5, 0.5);

    // Text for the number of remaining customers to help.
    this.remainingCustomersText = this.add.text(gameConfiguration.width / 2 + 380, 290, `CUSTOMERS REMAINING: ${gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers}`, customerTextConfig).setOrigin(0.5, 0.5);

    // Text for the customer's asking amount in dollars.
    this.customerBargainText = this.add.text(575, 290, "0", scoreTextConfig).setOrigin(0.5, 0.5);
    this.customerBargainText.alpha = 0;

    // Text for the "accept bargain" button.
    this.acceptBargainText = this.add.text(500, 200, "ACCEPT", scoreTextConfig).setOrigin(0.5, 0.5);
    this.acceptBargainText.setBackgroundColor('#04CC04CC');
    this.acceptBargainText.alpha = 0;

    // Make the accept button clickable.
    this.acceptBargainText.setInteractive();

    // Fix scoping issues with detecting mouse clicks.
    let parentScene = this;

    // Tracks the current state the player is in, such as "accept" or "decline" in response to a customer's bargain.
    this.bargainState = "deciding";

    // Button event for accepting a bargain.
    this.acceptBargainText.on('pointerdown', function(pointer) {
      if (parentScene.currentMoney >= parentScene.customerMoney) {
        parentScene.bargainState = "accept";
        parentScene.sound.play('buttonClick');
      } else {
        parentScene.sound.play('buttonFail');
      }
    });

    // Text for the "decline bargain" option.
    this.declineBargainText = this.add.text(650, 200, "DECLINE", scoreTextConfig).setOrigin(0.5, 0.5);
    this.declineBargainText.setBackgroundColor('#CC0404CC');
    this.declineBargainText.alpha = 0;

    // Make the decline button clickable.
    this.declineBargainText.setInteractive();

    // Button event for declining a bargain.
    this.declineBargainText.on('pointerdown', function(pointer) {
      parentScene.bargainState = "decline";
      parentScene.sound.play('buttonClick');
    });

    // The current morale of the bank. Starts at 100%.
    this.bankMorale = 100;

    // The current amount of the player's dollars, set by the scene's configuration.
    this.currentMoney = gameConfiguration.sceneSettings.bankRushScene.playerStartingMoney;

    // The current amount of dollars a customer needs.
    this.customerMoney = 0;

    // Track the number of customers, the amount of customers that have spawned, and the time passed between customer spawns.
    this.customersArray = [];
    this.customersSpawned = 0;
    this.customerSpawnTimer = 0;

    // Track the number of seconds left before the player is forced to the transition scene.
    this.sceneTime = gameConfiguration.sceneSettings.bankRushScene.sceneTimeLimit;
  }

  // Function to get the current customer's asking amount of dollars.
  // Grabs a random amount between the customer's preferred range of dollars they need.
  presentCustomerBargain(customer) {
    this.customerMoney = Phaser.Math.Between(customer.preferredWithdrawAmount[0], customer.preferredWithdrawAmount[1]);
    this.customerBargainText.text = `$${this.customerMoney}.00`;
    this.customerBargainText.alpha = 1;
    this.acceptBargainText.alpha = 1;
    this.declineBargainText.alpha = 1;
  }

  // Function to clear the current customer's asking amount.
  clearCustomerBargain() {
    this.bargainState = "deciding";
    this.customerBargainText.alpha = 0;
    this.acceptBargainText.alpha = 0;
    this.declineBargainText.alpha = 0;
  }

  // Function to check the win state of the game.
  checkEnding() {
    if (this.customersArray.length <= 0 && this.bankMorale >= 50 && this.currentMoney >= 0){
      return true;
    } else {
      return false;
    }
  }

  // Updates the game every frame.
  update(time, delta) {

    // Tick that adjusts to the client's refresh rate.
    globalVariables.gameDelta = 1000 / delta;

    // Decrement the scene time as the game progresses.
    this.sceneTime -= 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;

    // End the game and move to the transition scene if time has run out.
    if (this.sceneTime <= 0) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    // End the game and move to the transition scene if the player has run out of money.
    if (this.currentMoney < 0) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    /*
    // End the game and move to the transition scene if the bank's morale drops to zero.
    if (this.bankMorale <= 0) {
      globalVariables.sceneEnded = 'bankRush';
      globalVariables.endingCriteria.bankRush = false;
      this.scene.start('transitionScene');
    }
    */

    // End the game and move to the transition scene if there are no more customers left to spawn.
    if (this.customersArray.length <= 0 && this.customersSpawned >= gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers) {
      globalVariables.sceneEnded = 'bankRush';
      if (this.checkEnding()) {
        globalVariables.endingCriteria.bankRush = true;
      } else {
        globalVariables.endingCriteria.bankRush = false;
      }
      this.scene.start('transitionScene');
    }

    // Update the time text to reflect the amount of time remaining.
    if (Math.floor(this.sceneTime % 60) < 10) {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:0${Math.floor(this.sceneTime % 60)}`;
    } else {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:${Math.floor(this.sceneTime % 60)}`;
    }

    // Increment the customer spawn time so long as there is space in the customer array and there are still customers that can be allowed to spawn.
    if (this.customersArray.length < gameConfiguration.sceneSettings.bankRushScene.customersCap && this.customersSpawned < gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers) {
      this.customerSpawnTimer += 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
    }

    // If the customer spawn time has reached the threshold and a new customer can be spawned, spawn a new customer.
    if (this.customerSpawnTimer >= gameConfiguration.sceneSettings.bankRushScene.customerSpawnTime) {
      this.customerSpawnTimer = 0;
      if (this.customersArray.length < gameConfiguration.sceneSettings.bankRushScene.customersCap) {

        // Create a new customer object.
        let newCustomer = new Customer(this, gameConfiguration.width, gameConfiguration.height, 'customerMan1', 0).setOrigin(0.5, 0.5);

        // Randomize between one of two customer textures.
        let newCustomerTexture = Phaser.Math.Between(0, 100);
        if (newCustomerTexture <= 50) {
          newCustomer.setTexture('customerMan2', 0);
        }

        // Move the customer just out of frame.
        newCustomer.x += newCustomer.width / 2;
        newCustomer.y -= newCustomer.height / 2;

        // Add the new customer to the array of customers, and increment the number of customers that have spawned.
        this.customersArray.push(newCustomer);
        this.customersSpawned += 1;

        // Update the text to reflect the amount of customers that remain.
        this.remainingCustomersText.text = `CUSTOMERS REMAINING: ${gameConfiguration.sceneSettings.bankRushScene.maxSceneCustomers - this.customersSpawned}`;
      }
    }

    // Iterate through each customer in the customer array to update their state.
    for (let customersArrayItem = 0; customersArrayItem < this.customersArray.length; customersArrayItem += 1) {

      // Get the current customer.
      let currentCustomer = this.customersArray[customersArrayItem];

      // Check if the current customer is currently bargaining.
      if (currentCustomer.status == "bargaining") {

        // Check if the player has decided on accepting or declining the bargain.
        if (this.bargainState != "deciding") {

          // Increase the bank's morale and subtract the dollars the current customer bargained for from the player.
          if (this.bargainState == "accept") {
            this.bankMorale += 20;
            if (this.bankMorale >= 100) {
              this.bankMorale = 100;
            }
            this.currentMoney -= this.customerMoney;

            // Decrease the bank's morale but keep the amount of dollars the player has the same.
            // Morale can go below 0% to prevent cheesing.
          } else if (this.bargainState == "decline") {
            this.bankMorale -= 15;
            /*
            if (this.bankMorale <= 0) {
              this.bankMorale = 0;
            }
            */
          }

          // Update the current customer to the "satisfied" state.
          currentCustomer.status = "satisfied";
        }

        // Check if the current customer is satisfied.
      } else if (currentCustomer.status == "satisfied") {

        // Remove the current customer from the customer array, and delete it.
        let poppedCustomer = this.customersArray.splice(customersArrayItem, 1)[0];
        poppedCustomer.destroy();
        customersArrayItem -= 1;

        // Play a sound to indicate that the customer is satisifed.
        this.sound.play('bargainResult');

        // Clear the customer's bargain.
        this.clearCustomerBargain();

        // Update the bank's morale and the player's dollars text boxes.
        this.currentMoraleText.text = `MORALE: ${this.bankMorale}%`;
        this.currentMoneyText.text = `DOLLARS: $${this.currentMoney}.00`;

        // Move on to the next customer.
        continue;

        // Check if the customer is waiting in line.
      } else if (currentCustomer.status == "waiting") {

        // The closest the customer is allowed to go to the player's sprite.
        let currentCustomerTargetPosition = 575 + (currentCustomer.width * 1.1 * customersArrayItem);

        // Check if the customer is at the closest location.
        if (currentCustomer.x > currentCustomerTargetPosition) {

          // Move the customer line forward.
          currentCustomer.x -= 200 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
        } else {

          // Stop the customer.
          currentCustomer.x = currentCustomerTargetPosition;

          // If the customer is first in line, present their bargain to the player.
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