class CrateScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'CrateScene',
			physics: {
				matter: {
					//debug: true, Interesting side effect of matter : make things roll
					gravity: { y: 0.5 }
				},
				arcade: {
					gravity: {
						y: 500
					},
					//debug: true
				},
			},				
		});	
		this.cursors;
		this.isPlayerAlive = true;
	}

	init(){
		/*game.config.physics = {default: 'matter'}
		game.config.defaultPhysicsSystem = 'matter';*/
	}

    // function to be executed when the scene is loading
    preload(){

        // loading crate image
        this.load.image("crate", "assets/crate.png");
		this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 36,
			frameHeight: 48
		});		
    }

    // function to be executed once the scene has been created
    create(){

			// The player and its settings
		this.player = this.physics.add.sprite(100, 450, 'dude');
		this.player.setCollideWorldBounds(true);

		//  Our this.player animations, turning, walking left and walking right.
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{
				key: 'dude',
				frame: 4
			}],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});

		//  Input Events
		this.cursors = this.input.keyboard.createCursorKeys();
		
        // setting Matter world bounds
        //this.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

        // waiting for user input
        this.input.on("pointerdown", function(pointer){

            // getting Matter bodies under the pointer
            //var bodiesUnderPointer = Phaser.Physics.Matter.Matter.Query.point(this.matter.world.localWorld.bodies, pointer);

            // if there isn't any body under the pointer...
            //if(bodiesUnderPointer.length == 0){

                // create a crate
                this.physics.add.overlap(this.player,this.physics.add.sprite(pointer.x, pointer.y, "crate"), this.gameOver, null, this);
            //}

            // this is where I wanted to remove the crate. Unfortunately I did not find a quick way to delete the Sprite
            // bound to a Matter body, so I am setting it to invisible, then remove the body.
            /*else{
                bodiesUnderPointer[0].gameObject.visible = false;
                this.matter.world.remove(bodiesUnderPointer[0])
            }*/
        }, this);
    }
	
	gameOver() {
		// flag to set player is dead
		//this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		// restart game
		this.time.delayedCall(500, function() {
			this.scene.switch('PlaneScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}
	
	update(time, delta) {
		if (!this.isPlayerAlive) {
			return;
		}

		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
	}
}
