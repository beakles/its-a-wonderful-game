class iceCreamScene extends Phaser.Scene {
  constructor() {
    super("iceCreamScene");
  }

  preload() {

  }

  create() {

    this.customersArray = []; // pool of customers that the player can potentially interact with
    this.currentCustomersArray = []; // customers that are currently active in the game
    this.ingredientsArray = []; // pool of ingredients that the player has access to
    this.currentIngredientsArray = []; // ingredients the player currently has in their inventory

    this.customerSpawnTimer
  }

  update(time, delta) {
    globalVariables.gameDelta = 1000 / delta;


  }
}