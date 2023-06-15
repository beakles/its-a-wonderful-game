/*
Collaboration between Samuel Maturo and Brannon Eakles
Phaser components used: Text objects, prefabs, timers, sound manager, tilemaps for backgrounds, global variables, and clickable buttons and objects using setInteracive()
The crayon drawing art style as if a kid was playing this game with physical papers overlapping on each other is a unique representation of this film.
*/

let gameConfiguration = {
    type: Phaser.AUTO,
    gameSpeed: 1,
    width: 1280,
    height: 720,
    scene: [titleScreen, iceCreamScene, bankRushScene, creditsScene, transitionScene, endingScene],
    sceneSettings: {
        iceCreamScene: {
            playerInventoryCap: 3,              // maximum amount of ingredients the player can "hold" at any given time
            customersCap: 3,                    // maximum amount of customers that can be present on the screen at any given time
            customerSpawnTime: 2,               // time (in seconds) to wait before spawning a new customer
            customerOrderComplexity: [          // the range of the number of ingredients a customer's order can contain
                0,
                2
            ],
            sceneTimeLimit: 120                 // time (in seconds) until the minigame ends and the player moves on to the next scene
        },
        bankRushScene: {
            playerStartingMoney: 500,           // starting amount of money that the player can loan out to customers
            customerWithdrawRange: [            // the range of the amount of money a customer can withdraw (in cents)
                10,
                100
            ],
            customerNegotiationTolerance: [     // the range of how willing a customer is to negotiate with the player in terms of withdrawing money. higher numbers = less tolerant
                1,
                2
            ],
            maxSceneCustomers: 30,              // total number of customers that need to be satisfied to complete the scene
            customersCap: 4,                    // maximum number of customers that can be present on the screen at any given time
            customerSpawnTime: 3,               // time (in seconds) to wait before spawning a new customer
            sceneTimeLimit: 180                 // time (in seconds) until the minigame ends and the player moves on to the next scene
        }
    }
}

let globalVariables = {
    endingCriteria: {
        iceCream: false,
        bankRush: false
    },
    gameDelta: 0,
    ingredientSelected: false,
    ingredientSelectedDebounce: false,
    lastIngredientSelected: "null",
    sceneEnded: "null"
}

let game = new Phaser.Game(gameConfiguration);