class CrateScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'CrateScene',
			physics: {
				matter: {
					//debug: true,
					gravity: { y: 0.5 }
				},
			}
		});	
	}

	init(){
		/*game.config.physics = {default: 'matter'}
		game.config.defaultPhysicsSystem = 'matter';*/
	}

    // function to be executed when the scene is loading
    preload(){

        // loading crate image
        this.load.image("crate", "assets/crate.png");
    }

    // function to be executed once the scene has been created
    create(){

        // setting Matter world bounds
        this.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

        // waiting for user input
        this.input.on("pointerdown", function(pointer){

            // getting Matter bodies under the pointer
            var bodiesUnderPointer = Phaser.Physics.Matter.Matter.Query.point(this.matter.world.localWorld.bodies, pointer);

            // if there isn't any body under the pointer...
            if(bodiesUnderPointer.length == 0){

                // create a crate
                this.matter.add.sprite(pointer.x, pointer.y, "crate");
            }

            // this is where I wanted to remove the crate. Unfortunately I did not find a quick way to delete the Sprite
            // bound to a Matter body, so I am setting it to invisible, then remove the body.
            else{
                bodiesUnderPointer[0].gameObject.visible = false;
                this.matter.world.remove(bodiesUnderPointer[0])
            }
        }, this);
    }
}
