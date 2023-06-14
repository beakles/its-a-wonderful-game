let gameConfiguration = {
    type: Phaser.AUTO,
    gameSpeed: 1,
    width: 1280,
    height: 720,
    scene: [titleScreen, iceCreamScene, bankRushScene, creditsScene],
    sceneSettings: {
        iceCreamScene: {
            playerInventoryCap: 3,              // maximum amount of ingredients the player can "hold" at any given time
            customersCap: 3,                    // maximum amount of customers that can be present on the screen at any given time
            customerSpawnTime: 2,               // time (in seconds) to wait before spawning a new customer
            customerOrderComplexity: [          // the range of the number of ingredients a customer's order can contain
                1,
                3
            ]
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
            maxSceneCustomers: 20,              // total number of customers that need to be satisfied to complete the scene
            customersCap: 3,                     // maximum number of customers that can be present on the screen at any given time
            customerSpawnTime: 3                // time (in seconds) to wait before spawning a new customer
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
    lastIngredientSelected: "null"
}

let game = new Phaser.Game(gameConfiguration);