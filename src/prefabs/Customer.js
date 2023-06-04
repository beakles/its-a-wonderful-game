class Customer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);

    this.favoriteIngredients = [];
    this.withdrawAmount = 0;
  }

  selectFavoriteIngredients(ingredientsArray) {
    let randomIngredientAmount = Phaser.Math.Between(1, 3);
    for (let ingredientSelectionCount = 0; ingredientSelectionCount < randomIngredientAmount; ingredientSelectionCount += 1) {
      let randomIngredient = ingredientsArray[Phaser.Math.Between(0, ingredientsArray.length)];
      this.favoriteIngredients.push(randomIngredient);
    }
  }
}