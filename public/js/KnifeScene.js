class KnifeScene extends Phaser.Scene {
	constructor(test) {
		super({
            key: 'KnifeScene'		
		});
		this.cursors;
		this.score = 3;
		this.isPlayerAlive = true;
		this.scoreText;
		this.livesText;
		this.lives = 10;	
		this.gameOptions = {

            // target rotation speed, in degrees per frame
            rotationSpeed: 3,
        
            // knife throwing duration, in milliseconds
            throwSpeed: 150,
        
            // minimum angle between two knives
            minAngle: 15,
        
            // max rotation speed variation, in degrees per frame
            rotationVariation: 2,
        
            // interval before next rotation speed variation, in milliseconds
            changeTime: 2000,
        
            // maximum rotation speed, in degrees per frame
            maxRotationSpeed: 6
        }
	}
    
     // method to be executed when the scene preloads
     preload(){

        // loading assets
        this.load.image("target", "assets/target.png");
        this.load.image("knife", "assets/knife.png");
        this.load.spritesheet("apple", "assets/apple.png", {
            frameWidth: 70,
            frameHeight: 96
        });
        this.load.image('backgroundKitchen', 'assets/cuisine.jpg');
    }   

     // method to be executed once the scene has been created
     create(){
		this.bg = this.add.sprite(0, 0, 'backgroundKitchen');
		this.bg.setOrigin(0, 0);	
        // at the beginning of the game, both current rotation speed and new rotation speed are set to default rotation speed
        this.currentRotationSpeed = this.gameOptions.rotationSpeed;
        this.newRotationSpeed = this.gameOptions.rotationSpeed;

        // can the player throw a knife? Yes, at the beginning of the game
        this.canThrow = true;

        // group to store all rotating knives
        this.knifeGroup = this.add.group();

        // adding the knife
        this.knife = this.add.sprite(120, 360, "knife");

        // adding the target
        this.target = this.add.sprite(game.config.width / 5 * 4, 360, "target");

        // moving the target to front
        this.target.depth = 1;

        // starting apple angle
        var appleAngle = 0;

        // determing apple angle in radians
        var radians = Phaser.Math.DegToRad(appleAngle - 90);

        // adding the apple
        this.apple = this.add.sprite(this.target.x + (this.target.width / 2) * Math.cos(radians), this.target.y + (this.target.width / 2) * Math.sin(radians), "apple");

        // setting apple's anchor point to bottom center
        this.apple.setOrigin(0.5, 1);

        // setting apple sprite angle
        this.apple.angle = appleAngle;

        // saving apple start angle
        this.apple.startAngle = appleAngle;

        // apple depth is the same as target depth
        this.apple.depth = 1;

        // has the apple been hit?
        this.apple.hit = false;

        // waiting for player input to throw a knife
        this.input.on("pointerdown", this.throwKnife, this);

        // this is how we create a looped timer event
        var timedEvent = this.time.addEvent({
            delay: this.gameOptions.changeTime,
            callback: this.changeSpeed,
            callbackScope: this,
            loop: true
        });

        this.scoreText = this.add.text(0, 0, 'APPLES LEFT : '+this.score, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreText.setStroke('#0000ff', 8);

		this.livesText = this.add.text(0, 48, 'KNIVES : '+this.lives, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 8);       
    }

    // method to change the rotation speed of the target
    changeSpeed(){

        /*// ternary operator to choose from +1 and -1
        var sign = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

        // random number between -gameOptions.rotationVariation and gameOptions.rotationVariation
        var variation = Phaser.Math.FloatBetween(-this.gameOptions.rotationVariation, this.gameOptions.rotationVariation);

        // new rotation speed
        this.newRotationSpeed = (this.currentRotationSpeed + variation) * sign;

        // setting new rotation speed limits
        this.newRotationSpeed = Phaser.Math.Clamp(this.newRotationSpeed, -this.gameOptions.maxRotationSpeed, this.gameOptions.maxRotationSpeed);*/
    }

    // method to throw a knife
    throwKnife(){

        // can the player throw?
        if(this.canThrow){

            // player can't throw anymore
            this.canThrow = false;

            // tween to throw the knife
            this.tweens.add({

                // adding the knife to tween targets
                targets: [this.knife],

                // y destination
                x: this.target.x + this.target.width / 2,

                // tween duration
                duration: this.gameOptions.throwSpeed,

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function(tween){

                    // at the moment, this is a legal hit
                    var legalHit = true;

                    // getting an array with all rotating knives
                    var children = this.knifeGroup.getChildren();

                    // looping through rotating knives
                    for (var i = 0; i < children.length; i++){

                        // is the knife too close to the i-th knife?
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.target.angle, children[i].impactAngle)) < this.gameOptions.minAngle){

                            // this is not a legal hit
                            legalHit = false;

                            // no need to continue with the loop
                            break;
                        }
                    }

                    // is this a legal hit?
                    if(legalHit){
                       
                        // player can now throw again
                        this.canThrow = true;

                        // adding the rotating knife in the same place of the knife just landed on target
                        var knife = this.add.sprite(this.knife.x, this.knife.y, "knife");

                        // impactAngle property saves the target angle when the knife hits the target
                        knife.impactAngle = this.target.angle;

                        // adding the rotating knife to knifeGroup group
                        this.knifeGroup.add(knife);

                        // bringing back the knife to its starting position
                        this.knife.x = 120;                        

                        // is the knife close enough to the apple? And the appls is still to be hit?
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.target.angle, -90 + this.apple.startAngle)) < this.gameOptions.minAngle && !this.apple.hit){

                            // apple has been hit
                            this.apple.hit = true;

                            // change apple frame to show one slice
                            this.apple.setFrame(1);

                            // add the other apple slice in the same apple posiiton
                            var slice = this.add.sprite(this.apple.x, this.apple.y, "apple", 2);

                            // same angle too.
                            slice.angle = this.apple.angle;

                            // and same origin
                            slice.setOrigin(0.5, 1);

                            // tween to make apple slices fall down
                            this.tweens.add({

                                // adding the knife to tween targets
                                targets: [this.apple, slice],

                                // y destination
                                y: game.config.height + this.apple.height,

                                // x destination
                                x: {

                                    // running a function to get different x ends for each slice according to frame number
                                    getEnd: function(target, key, value){
                                        return Phaser.Math.Between(0, game.config.width / 2) + (game.config.width / 2 * (target.frame.name - 1));
                                    }
                                },

                                // rotation destination, in radians
                                angle: 45,

                                // tween duration
                                duration: this.gameOptions.throwSpeed * 6,

                                // callback scope
                                callbackScope: this,

                                // function to be executed once the tween has been completed
                                onComplete: function(tween){

                                    // restart the game
                                    this.appleCut()
                                }
                            });
                        }

                        else{
                            this.lives -= 1;
                            this.livesText.setText('Knives : '+this.lives);    
                            if(this.lives == 0)
                                this.gameOver();      
                        }
                    }

                    // in case this is not a legal hit
                    else{

                        // tween to make the knife fall down
                        this.tweens.add({

                            // adding the knife to tween targets
                            targets: [this.knife],

                            // y destination
                            y: game.config.height + this.knife.height,

                            // rotation destination, in radians
                            rotation: 5,

                            // tween duration
                            duration: this.gameOptions.throwSpeed * 4,

                            // callback scope
                            callbackScope: this,

                            // function to be executed once the tween has been completed
                            onComplete: function(tween){

                                // restart the game
                                this.die();
                            }
                        });
                    }
                }
            });
        }
    }

    die(){
        this.canThrow = true;
        this.knife.x = 120;   
        this.knife.y = 360;   
        this.knife.angle = 0;
        this.lives -= 1;
        this.livesText.setText('KNIVES : '+this.lives);        
        if(this.lives == 0)
            this.gameOver();          
    }

    appleCut(){
        this.target.angle = 0;
        var appleAngle = 0;
        this.apple.hit = false;
        this.apple.setFrame(0);
        this.apple.x = this.target.x + (this.target.width / 2) * Math.cos(radians);
        this.apple.y = this.target.y + (this.target.width / 2) * Math.sin(radians);
        this.apple.angle = appleAngle;
        this.apple.startAngle = appleAngle;       
        var radians = Phaser.Math.DegToRad(this.apple.appleAngle - 90);        
        this.apple.depth = 1;
        let knives = this.knifeGroup.getChildren();
		let numKnives = knives.length;		
		for (let i = 0; i < numKnives; i++)
            knives[numKnives-1-i].destroy();
        this.score -= 1;
        this.scoreText.setText('APPLES LEFT : '+ this.score);
        this.lives = 10;
        this.livesText.setText('KNIVES : '+this.lives);    
        this.currentRotationSpeed = (this.currentRotationSpeed) * -1.5;
        if(this.score == 0)
            this.gameOver();
    }

    gameOver() {
		// flag to set player is dead
		//this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		/*this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
        }, [], this);*/

        currentScene += 1;
        let insScene = this.scene.get('InstructionsScene');
        this.scene.setVisible(true, insScene);  
        bInstructions = true;
        insScene.nextScene();

		this.time.delayedCall(transitionTime, function() {
            this.scene.setVisible(false, insScene);
            this.scene.switch(order[currentScene]);
		}, [], this);

		// reset camera effects
		/*this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);*/
	}   

    // method to be executed at each frame. Please notice the arguments.
    update(time, delta){
        if(!this.apple.hit){
        // rotating the target
            this.target.angle += this.currentRotationSpeed;

            // getting an array with all rotating knives
            var children = this.knifeGroup.getChildren();

            // looping through rotating knives
            for (var i = 0; i < children.length; i++){

                // rotating the knife
                children[i].angle += this.currentRotationSpeed;

                // turning knife angle in radians
                var radians = Phaser.Math.DegToRad(children[i].angle - 180);

                // trigonometry to make the knife rotate around target center
                children[i].x = this.target.x + (this.target.width / 2) * Math.cos(radians);
                children[i].y = this.target.y + (this.target.width / 2) * Math.sin(radians);
            }

            // if the apple has not been hit...


            // adjusting apple rotation
            this.apple.angle += this.currentRotationSpeed;

            // turning apple angle in radians
            var radians = Phaser.Math.DegToRad(this.apple.angle - 90);

            // adjusting apple position
            this.apple.x = this.target.x + (this.target.width / 2) * Math.cos(radians);
            this.apple.y = this.target.y + (this.target.width / 2) * Math.sin(radians);
        }

        // adjusting current rotation speed using linear interpolation
        //this.currentRotationSpeed = Phaser.Math.Linear(this.currentRotationSpeed, this.newRotationSpeed, delta / 1000);
    }
}