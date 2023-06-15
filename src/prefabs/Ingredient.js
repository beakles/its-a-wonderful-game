// The ingredient class that will represent the ingredients available in the ice cream minigame.
// To reduce redundancy and repeat code, the ingredients will have the ability to be set as a clickable interactable.

class Ingredient extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, name, interactable) {
    super(scene, x, y, texture, frame);

    // Fix weird scoping issues when detecting mouse clicks.
    this.parentScene = scene;

    this.alpha = 1;

    // Used to associate the ingredient's name with the customer's favorite ingredients.
    this.name = name;

    // Boolean to determine whether the ingredient is clickable or not.
    if (interactable) {

      // Give the ingredient a button click sound.
      this.ingredientClick = this.parentScene.sound.add('buttonClick');

      // Make the ingredient clickable.
      this.setInteractive();

      // Sets the last-clicked ingredient to this ingredient's name, and play a click sound.
      // Set a debounce to make sure that ingredients only get added once.
      this.on('pointerdown', function(pointer) {
        globalVariables.ingredientSelected = true;
        globalVariables.lastIngredientSelected = this.name;
        this.ingredientClick.play();
      });

      // These two events are to make sure that ingredients don't get accidentally selected more than once on a single click.
      this.on('pointerup', function(pointer) {
        globalVariables.ingredientSelected = false;
      });
  
      this.on('pointerout', function(pointer) {
        globalVariables.ingredientSelected = false;
      });
    }

    scene.add.existing(this);
  }

  // Unused.
  update() {
    
  }
}