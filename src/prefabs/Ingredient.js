class Ingredient extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, name, interactable) {
    super(scene, x, y, texture, frame);

    this.parentScene = scene;

    this.alpha = 1;
    this.name = name;
    
    if (interactable) {
      this.ingredientClick = this.parentScene.sound.add('buttonClick');

      this.setInteractive();
  
      this.on('pointerdown', function(pointer) {
        globalVariables.ingredientSelected = true;
        globalVariables.lastIngredientSelected = this.name;
        this.ingredientClick.play();
      });
  
      this.on('pointerup', function(pointer) {
        globalVariables.ingredientSelected = false;
      });
  
      this.on('pointerout', function(pointer) {
        globalVariables.ingredientSelected = false;
      });
    }

    scene.add.existing(this);
  }

  update() {
    
  }
}