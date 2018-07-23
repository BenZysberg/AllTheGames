class BreakoutScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'BreakoutScene',
			physics: {
				arcade: {
					gravity: {
						y: 0
					},
					//debug: true
				},
			}			
		});
		        this.bricks;
        this.paddle;
        this.ball;	
		this.scoreText;
        this.livesText;    
		this.lives = 3;            
    }

    preload()
    {
        this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
		this.count = 30;
		
		this.load.image('backgroundBreakout', 'assets/Sublime.png');
    }

    create()
    {
		
		this.bg = this.add.sprite(0, 0, 'backgroundBreakout');
		this.bg.setOrigin(0, 0);
		
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        //  Create the bricks in a 10x6 grid
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 15, height: 6, cellWidth: 64, cellHeight: 32, x: 180, y: 100 }
        });

        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 60, 1220);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }

        }, this);

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);

		this.scoreText = this.add.text(0, 0, 'BUGS : '+this.count, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreText.setStroke('#0000ff', 8);

		this.livesText = this.add.text(0, 48, 'SUNFLOWER SEEDS : '+this.lives, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 8);
        
    }

    hitBrick(ball, brick)
    {
        brick.disableBody(true, true);       
        this.count--;
		this.scoreText.setText('BUGS : '+this.count)          
        if (this.count === 0)
        {
            this.gameOver();
        }
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

    resetBall()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
		this.lives = this.lives - 1;
        this.livesText.setText('SUNFLOWER SEEDS : '+this.lives)
        if(this.lives == 0)
            this.gameOver();
    }

    resetLevel()
    {
        this.resetBall();

        this.bricks.children.each(function (brick) {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitPaddle(ball, paddle)
    {
        var diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    update()
    {
        if (this.ball.y > 600)
        {
            this.resetBall();
        }
    }

}