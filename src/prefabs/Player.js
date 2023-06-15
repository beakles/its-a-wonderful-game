// The player class that will represent George Bailey in the minigames.
// In the ice cream scene, it will represent a younger Bailey, while in the bank rush scene, an older Bailey will be present.

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);

    // As the player selects ingredients in the ice cream minigame, the ingredients picked will be stored here for later use.
    this.ingredientsInventory = [];
  }

  // Unused.
  update() {
    
  }
}