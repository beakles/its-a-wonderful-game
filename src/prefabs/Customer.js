class Customer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);

    this.status = "waiting";
    this.favoriteIngredients = [];

    let customerWithdrawTolerance = Phaser.Math.Between(gameConfiguration.sceneSettings.bankRushScene.customerNegotiationTolerance[0], gameConfiguration.sceneSettings.bankRushScene.customerNegotiationTolerance[1]);

    this.preferredWithdrawAmount = [
      gameConfiguration.sceneSettings.bankRushScene.customerWithdrawRange[0] * customerWithdrawTolerance,
      gameConfiguration.sceneSettings.bankRushScene.customerWithdrawRange[1] / customerWithdrawTolerance,
    ];

    this.withdrawMood = "happy";
  }

  selectFavoriteIngredients(ingredientsArray) {
    let randomIngredientAmount = Phaser.Math.Between(gameConfiguration.sceneSettings.iceCreamScene.customerOrderComplexity[0], gameConfiguration.sceneSettings.iceCreamScene.customerOrderComplexity[1]);
    for (let ingredientSelectionCount = 0; ingredientSelectionCount < randomIngredientAmount; ingredientSelectionCount += 1) {
      let randomIngredient = ingredientsArray[Phaser.Math.Between(0, ingredientsArray.length - 1)];
      this.favoriteIngredients.push(randomIngredient);
    }
  }

  update() {
    
  }
}