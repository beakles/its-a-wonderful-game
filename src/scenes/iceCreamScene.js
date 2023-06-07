class iceCreamScene extends Phaser.Scene {
  constructor() {
    super("iceCreamScene");
  }

  preload() {
    this.load.image('iceCreamShop', './assets/ice_cream_shop.png');

    this.load.image('characterPlayer', './assets/george.png');

    this.load.image('characterCustomer', './assets/mary.png');

    this.load.image('cherry', './assets/cherry.png');
    this.load.image('choppedNuts', './assets/chopped_nuts.png');
    this.load.image('coconut', './assets/coconut.png');

    this.load.audio('buttonClick', './assets/buttonClick.wav');
    this.load.audio('orderPresent', './assets/orderPresent.wav');
    this.load.audio('orderCorrect', './assets/orderCorrect.wav');
  }

  create() {
    this.iceCreamSceneBackdrop = this.add.tileSprite(0, 0, gameConfiguration.width, gameConfiguration.height, 'iceCreamShop').setOrigin(0, 0);

    this.ingredientIconsBackground = this.add.rectangle(gameConfiguration.width / 2 + 270, 20, 170, 60, 0x808080).setOrigin(0, 0);

    this.playerInputBackground = this.add.rectangle(gameConfiguration.width / 2 - 585, 290, 170, 60, 0x808080).setOrigin(0, 0);
    this.playerInputBackground.alpha = 1;

    this.orderBackground = this.add.rectangle(415, 290, 170, 60, 0x808080).setOrigin(0, 0);
    this.orderBackground.alpha = 0;

    let scoreTextConfig = {
      fontFamily: 'Courier',
      fontSize: '40px',
      backgroundColor: '#808080FF',
      color: '#FFFFFFFF',
      align: 'left',
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }
    this.scoreText = this.add.text(gameConfiguration.width / 2 - gameConfiguration.width / 2.5, gameConfiguration.height / 2 - gameConfiguration.height / 2.5, "SCORE: 0", scoreTextConfig).setOrigin(0.5, 0.5);

    this.characterPlayer = new Player(this, gameConfiguration.width / 2 - 500, gameConfiguration.height, 'characterPlayer').setOrigin(0.5, 0.5);
    this.characterPlayer.y -= this.characterPlayer.height / 2;

    this.customersArray = []; // pool of customers that the player can potentially interact with
    this.currentCustomersArray = []; // customers that are currently active in the game
    this.customerSpawnTimer = 0; // timer to spawn a new customer

    this.ingredientCherry = new Ingredient(this, gameConfiguration.width / 2 + 300, 50, 'cherry', 0, 'cherry', true).setOrigin(0.5, 0.5);
    this.ingredientChoppedNuts = new Ingredient(this, gameConfiguration.width / 2 + 350, 50, 'choppedNuts', 0, 'choppedNuts', true).setOrigin(0.5, 0.5);
    this.ingredientCoconut = new Ingredient(this, gameConfiguration.width / 2 + 400, 50, 'coconut', 0, 'coconut', true).setOrigin(0.5, 0.5);

    this.ingredientsArray = [
      this.ingredientCherry,
      this.ingredientChoppedNuts,
      this.ingredientCoconut
    ]; // pool of ingredients that the player and customers have access to
    this.currentIngredientsArray = []; // ingredients the player currently has in their inventory
    
    this.currentOrder = [];

    this.currentScore = 0;
  }

  getOrder(customer) {
    this.orderBackground.alpha = 1;
    for (let customerFavoriteIngredientsItem = 0; customerFavoriteIngredientsItem < customer.favoriteIngredients.length; customerFavoriteIngredientsItem += 1) {
      let currentOrderIngredient = customer.favoriteIngredients[customerFavoriteIngredientsItem];
      let newOrderIngredient = new Ingredient(this, 445 + (50 * customerFavoriteIngredientsItem), 320, currentOrderIngredient.name, 0, currentOrderIngredient.name, false).setOrigin(0.5, 0.5);
      this.currentOrder.push(newOrderIngredient);
    }
  }

  clearOrder() {
    this.orderBackground.alpha = 0;
    while (this.currentOrder.length > 0) {
      let currentOrderIngredient = this.currentOrder.pop();
      currentOrderIngredient.destroy();
    }
  }

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

    if (globalVariables.ingredientSelected) {
      globalVariables.ingredientSelected = false;

      if (this.characterPlayer.ingredientsInventory.length >= gameConfiguration.sceneSettings.iceCreamScene.playerInventoryCap) {
        while (this.characterPlayer.ingredientsInventory.length > 0) {
          let inventoryIngredient = this.characterPlayer.ingredientsInventory.pop();
          inventoryIngredient.destroy();
        }
      }

      let newIngredient = new Ingredient(this, gameConfiguration.width / 2 - 555 + 50 * this.characterPlayer.ingredientsInventory.length, 320, globalVariables.lastIngredientSelected, 0, globalVariables.lastIngredientSelected, false).setOrigin(0.5, 0.5);
      this.characterPlayer.ingredientsInventory.push(newIngredient);
    }

    this.scoreText.text = "SCORE: " + this.currentScore;

    if (this.currentCustomersArray.length < gameConfiguration.sceneSettings.iceCreamScene.customersCap) {
      this.customerSpawnTimer += 1 * gameConfiguration.gameSpeed / globalVariables.gameDelta;
    }

    if (this.customerSpawnTimer >= gameConfiguration.sceneSettings.iceCreamScene.customerSpawnTime) {
      this.customerSpawnTimer = 0;
      if (this.currentCustomersArray.length < gameConfiguration.sceneSettings.iceCreamScene.customersCap) {
        let newCustomer = new Customer(this, gameConfiguration.width, gameConfiguration.height, 'characterCustomer', 0).setOrigin(0.5, 0.5);
        newCustomer.x -= newCustomer.width / 2 + 150;
        newCustomer.y -= newCustomer.height / 2;
        newCustomer.selectFavoriteIngredients(this.ingredientsArray);
        // console.log(newCustomer.favoriteIngredients);
        this.currentCustomersArray.push(newCustomer);
      }
    }

    for (let customersArrayItem = 0; customersArrayItem < this.currentCustomersArray.length; customersArrayItem += 1) {
      let currentCustomer = this.currentCustomersArray[customersArrayItem];

      if (currentCustomer.status == "ordering") {
        if (this.comparePlayerWithCustomer(currentCustomer)) {
          currentCustomer.status = "satisfied";
        }
      } else if (currentCustomer.status == "satisfied") {
        let poppedCustomer = this.currentCustomersArray.splice(customersArrayItem, 1)[0];
        poppedCustomer.destroy();
        customersArrayItem -= 1;
        this.clearOrder();
        this.currentScore += 10;
        this.sound.play('orderCorrect');
        while (this.characterPlayer.ingredientsInventory.length > 0) {
          let inventoryIngredient = this.characterPlayer.ingredientsInventory.pop();
          inventoryIngredient.destroy();
        }
        continue;
      } else if (currentCustomer.status == "waiting") {
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