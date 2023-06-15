class iceCreamScene extends Phaser.Scene {
  constructor() {
    super("iceCreamScene");
  }

  preload() {
    // Load assets needed for the scene
    this.load.image('iceCreamShop', './assets/ice_cream_shop.png');

    this.load.image('characterPlayer', './assets/george.png');

    this.load.image('mary', './assets/mary.png');
    this.load.image('violet', './assets/youngViolet.png');
    this.load.image('boy', './assets/boy.png');

    this.load.image('cherry', './assets/cherry.png');
    this.load.image('choppedNuts', './assets/chopped_nuts.png');
    this.load.image('coconut', './assets/coconut.png');
    this.load.image('vanilla', './assets/vanillaSelect.png');
    this.load.image('chocolate', './assets/chocolateSelect.png');
    this.load.image('strawberry', './assets/strawberrySelect.png');
    this.load.image('vanillaBowl', './assets/vanilla.png');
    this.load.image('chocolateBowl', './assets/chocolate.png');
    this.load.image('strawberryBowl', './assets/strawberry.png');

    this.load.audio('buttonClick', './assets/buttonClick.wav');
    this.load.audio('orderPresent', './assets/orderPresent.wav');
    this.load.audio('orderCorrect', './assets/orderCorrect.wav');
  }

  create() {
    const self = this;
    // Background for the scene (the ice cream shop)
    this.iceCreamSceneBackdrop = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'iceCreamShop').setOrigin(0, 0);
    // UI elements
    this.ingredientIconsBackground = this.add.rectangle(gameConfiguration.width / 2 + 270, 20, 170, 100, 0x404040).setOrigin(0, 0);

    this.playerInputBackground = this.add.rectangle(gameConfiguration.width / 2 - 585, 290 - 70, 55 * gameConfiguration.sceneSettings.iceCreamScene.playerInventoryCap, 60, 0x404040).setOrigin(0, 0);
    this.playerInputBackground.alpha = 1;

    this.orderBackground = this.add.rectangle(415, 290, 55 * gameConfiguration.sceneSettings.iceCreamScene.customerOrderComplexity[1] + 55, 60, 0x404040).setOrigin(0, 0);
    this.orderBackground.alpha = 0;
    // text formatting
    let tutorialTextConfig = {
      fontFamily: 'CourierBold',
      fontSize: '24px',
      backgroundColor: '#404040FF',
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
      backgroundColor: '#404040FF',
      color: '#FFFFFFFF',
      align: 'left',
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }
    // tutorial, score and timer
    this.tutorialText = this.add.text(gameConfiguration.width / 2 - 50, 50, "Match your list of ingredients\nwith the customer's list of ingredients (order matters)\nClick the ingredients at the top right to select them", tutorialTextConfig).setOrigin(0.5, 0.5);
    this.scoreText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5, gameConfiguration.height / 2 - gameConfiguration.height / 2.5, "CENTS: 0/100", scoreTextConfig).setOrigin(0.5, 0.5);
    this.sceneTimeText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5, gameConfiguration.height / 2 - gameConfiguration.height / 2.5 + 75, "TIME: 0", scoreTextConfig).setOrigin(0.5, 0.5);
    // player and position
    this.characterPlayer = new Player(this, gameConfiguration.width / 2 - 500, gameConfiguration.height, 'characterPlayer').setOrigin(0.5, 0.5);
    this.characterPlayer.y -= this.characterPlayer.height / 2;

    this.customersArray = []; // pool of customers that the player can potentially interact with
    this.currentCustomersArray = []; // customers that are currently active in the game
    this.customerSpawnTimer = 0; // timer to spawn a new customer

    // clickable ingredients to add to the order
    this.ingredientCherry = new Ingredient(this, gameConfiguration.width / 2 + 300, 50, 'cherry', 0, 'cherry', true).setOrigin(0.5, 0.5);
    this.ingredientChoppedNuts = new Ingredient(this, gameConfiguration.width / 2 + 350, 50, 'choppedNuts', 0, 'choppedNuts', true).setOrigin(0.5, 0.5);
    this.ingredientCoconut = new Ingredient(this, gameConfiguration.width / 2 + 400, 50, 'coconut', 0, 'coconut', true).setOrigin(0.5, 0.5);
    
    this.flavorVanilla = new Ingredient(this, gameConfiguration.width / 2 + 300, 100, 'vanilla', 0, 'vanilla', true).setOrigin(0.5, 0.5);
    this.flavorChocolate = new Ingredient(this, gameConfiguration.width / 2 + 350, 100, 'chocolate', 0, 'chocolate', true).setOrigin(0.5, 0.5);
    this.flavorStrawberry = new Ingredient(this, gameConfiguration.width / 2 + 400, 100, 'strawberry', 0, 'strawberry', true).setOrigin(0.5, 0.5);

    // ice cream bowls that can appear
    this.vanillaBowl = this.add.image(300, 500, 'vanillaBowl').setOrigin(0.5, 0.5);
    this.vanillaBowl.visible = false;
    this.chocolateBowl = this.add.image(300, 500, 'chocolateBowl').setOrigin(0.5, 0.5);
    this.chocolateBowl.visible = false;
    this.strawberryBowl = this.add.image(300, 500, 'strawberryBowl').setOrigin(0.5, 0.5);
    this.strawberryBowl.visible = false;

    // pools of ingredients that the player and customers have access to
    this.ingredientsArray = [
      this.ingredientCherry,
      this.ingredientChoppedNuts,
      this.ingredientCoconut
    ];
    this.flavorArray = [
      this.flavorVanilla,
      this.flavorChocolate,
      this.flavorStrawberry
    ];
    this.currentIngredientsArray = []; // ingredients the player currently has in their inventory
    this.currentOrder = []; // the customer's current order
    // reset button
    this.resetButton = this.add.rectangle(gameConfiguration.width / 2 + 300, 130, 100, 50, 0x404040).setOrigin(0, 0);
    this.resetButton.setInteractive();
    this.resetButton.on('pointerdown', function() {
      self.clearInventory();
    })
    this.resetText = this.add.text(gameConfiguration.width / 2 + 300, 130, "RESET", scoreTextConfig).setOrigin(0, 0);
    // what it's all about
    this.currentScore = 0;
    // set timer based on game configuration
    this.sceneTime = gameConfiguration.sceneSettings.iceCreamScene.sceneTimeLimit;
  }

  // make a new order for the current customer
  getOrder(customer) {
    this.orderBackground.alpha = 1;
    for (let customerFavoriteIngredientsItem = 0; customerFavoriteIngredientsItem < customer.favoriteIngredients.length; customerFavoriteIngredientsItem += 1) {
      let currentOrderIngredient = customer.favoriteIngredients[customerFavoriteIngredientsItem];
      let newOrderIngredient = new Ingredient(this, 445 + (50 * customerFavoriteIngredientsItem), 320, currentOrderIngredient.name, 0, currentOrderIngredient.name, false).setOrigin(0.5, 0.5);
      this.currentOrder.push(newOrderIngredient);
    }
  }

  // clear the customer's order
  clearOrder() {
    this.orderBackground.alpha = 0;
    while (this.currentOrder.length > 0) {
      let currentOrderIngredient = this.currentOrder.pop();
      currentOrderIngredient.destroy();
    }
    this.vanillaBowl.visible = false;
    this.chocolateBowl.visible = false;
    this.strawberryBowl.visible = false;
  }

  // clear all ingredients the player has clicked
  clearInventory() {
    while (this.characterPlayer.ingredientsInventory.length > 0) {
      let inventoryIngredient = this.characterPlayer.ingredientsInventory.pop();
      inventoryIngredient.destroy();
    }
    this.vanillaBowl.visible = false;
    this.chocolateBowl.visible = false;
    this.strawberryBowl.visible = false;
  }

  // check if order is complete
  comparePlayerWithCustomer(customer) {
    let playerIngredients = this.characterPlayer.ingredientsInventory;
    let customerIngredients = customer.favoriteIngredients;

    if (playerIngredients.length != customerIngredients.length) {
      return false;
    }

    for (let ingredientItem = 0; ingredientItem < playerIngredients.length; ingredientItem += 1) {
      if (playerIngredients[ingredientItem].name != customerIngredients[ingredientItem].name) {
        return false;
      }
    }

    return true;
  }

  update(time, delta) {
    globalVariables.gameDelta = 1000 / delta;
    // timer in seconds
    this.sceneTime -= 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;

    // check if player has completed the win requirement
    if (this.currentScore >= 100) {
      globalVariables.endingCriteria.iceCream = true;
    }

    // send player to transition scene when time ends
    if (this.sceneTime <= 0) {
      globalVariables.sceneEnded = "iceCream";
      this.scene.start('transitionScene');
      console.log(globalVariables.endingCriteria.iceCream + " end");
    }

    // timer update
    if (Math.floor(this.sceneTime % 60) < 10) {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:0${Math.floor(this.sceneTime % 60)}`;
    } else {
      this.sceneTimeText.text = `TIME: ${Math.floor(this.sceneTime / 60)}:${Math.floor(this.sceneTime % 60)}`;
    }

    // when the player clicks an ingredient
    if (globalVariables.ingredientSelected) {
      globalVariables.ingredientSelected = false;
      // clear if player already had 3 ingredients
      if (this.characterPlayer.ingredientsInventory.length >= gameConfiguration.sceneSettings.iceCreamScene.playerInventoryCap) {
        this.clearInventory();
      }
      // add clicked ingredient to order
      let newIngredient = new Ingredient(this, gameConfiguration.width / 2 - 555 + 50 * this.characterPlayer.ingredientsInventory.length, 320 - 70, globalVariables.lastIngredientSelected, 0, globalVariables.lastIngredientSelected, false).setOrigin(0.5, 0.5);
      this.characterPlayer.ingredientsInventory.push(newIngredient);
      // add correct ice cream bowl to scene when clicked
      if (newIngredient.name == 'vanilla'){
        this.vanillaBowl.visible = true;
        this.chocolateBowl.visible = false;
        this.strawberryBowl.visible = false;
      } else if (newIngredient.name == 'chocolate'){
        this.vanillaBowl.visible = false;
        this.chocolateBowl.visible = true;
        this.strawberryBowl.visible = false;
      } else if (newIngredient.name == 'strawberry'){
        this.vanillaBowl.visible = false;
        this.chocolateBowl.visible = false;
        this.strawberryBowl.visible = true;
      }
    }

    this.scoreText.text = "CENTS: " + this.currentScore + "/100"; // update score

    // spawn timer control
    if (this.currentCustomersArray.length < gameConfiguration.sceneSettings.iceCreamScene.customersCap) {
      this.customerSpawnTimer += 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
    }

    // spawn a new customer
    if (this.customerSpawnTimer >= gameConfiguration.sceneSettings.iceCreamScene.customerSpawnTime) {
      this.customerSpawnTimer = 0;
      if (this.currentCustomersArray.length < gameConfiguration.sceneSettings.iceCreamScene.customersCap) {
        let newCustomer = new Customer(this, gameConfiguration.width, gameConfiguration.height, 'mary', 0).setOrigin(0.5, 0.5);
        if (Phaser.Math.Between(0, 2) == 1) {
          newCustomer.setTexture('violet', 0);
        }
        if (Phaser.Math.Between(0, 2) == 2) {
          newCustomer.setTexture('boy', 0);
        }
        newCustomer.x -= newCustomer.width / 2 + 150;
        newCustomer.y -= newCustomer.height / 2;
        newCustomer.selectFavoriteIngredients(this.ingredientsArray, this.flavorArray);
        // console.log(newCustomer.favoriteIngredients);
        this.currentCustomersArray.push(newCustomer);
      }
    }

    // core game loop
    for (let customersArrayItem = 0; customersArrayItem < this.currentCustomersArray.length; customersArrayItem += 1) {
      let currentCustomer = this.currentCustomersArray[customersArrayItem];
      // check if order is correct
      if (currentCustomer.status == "ordering") {
        if (this.comparePlayerWithCustomer(currentCustomer)) {
          currentCustomer.status = "satisfied";
        }
      } else if (currentCustomer.status == "satisfied") { // if order is already correct, clear customer
        let poppedCustomer = this.currentCustomersArray.splice(customersArrayItem, 1)[0];
        poppedCustomer.destroy();
        customersArrayItem -= 1;
        this.clearOrder();
        this.currentScore += 5;
        this.sound.play('orderCorrect');
        this.clearInventory();
        continue;
      } else if (currentCustomer.status == "waiting") { // if current customer is not at the front move them forward
        let currentCustomerTargetPosition = 500 + (currentCustomer.width * 1.5 * customersArrayItem);
        if (currentCustomer.x > currentCustomerTargetPosition) {
          currentCustomer.x -= 200 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
        } else {
          currentCustomer.x = currentCustomerTargetPosition;
          if (customersArrayItem == 0) {
            currentCustomer.status = "ordering";
            this.getOrder(currentCustomer);
            this.sound.play('orderPresent');
          }
        }
      }
    }
  }
}