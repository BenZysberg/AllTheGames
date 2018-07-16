class PlaneScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'PlaneScene',
			physics: {
				arcade: {
					gravity: {
						y: 0
					},
					debug: false
				},
			}			
		});
		this.cursors;
		this.isPlayerAlive = true;		
		this.newCrateTime = 0;
		this.newDifficultyTime = 0;
		this.timing = 3000;
		this.scoreText;
		this.livesText;
		this.distance = 0;
		this.lives = 3;
	}
	
	preload() {
		this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');
		this.load.image('pipe', 'assets/pipe.png');	
		this.load.image('nissan', 'assets/Nissan.png');	
    }
	
	create() {
        this.pipes = this.add.group();		
        this.anims.create({
            key: 'plane',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('sheet', { start: 1,  end: 3, prefix: 'planeBlue', suffix: '.png' })
        });
		
		this.cursors = this.input.keyboard.createCursorKeys();

        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'sheet', 'background.png').setOrigin(0);
		this.plane = this.physics.add.sprite(400, 300, 'nissan');
		this.plane.body.gravity.y = 1000; 

		this.scoreText = this.add.text(0, 0, 'DISTANCE : '+this.distance, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreText.setStroke('#0000ff', 8);

		this.livesText = this.add.text(0, 48, 'CARS : '+this.lives, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 8);
    }

	update(time, delta) {
        this.bg.tilePositionX += 4;
		
		if (!this.isPlayerAlive) {
			return;
		}

		if (this.cursors.up.isDown) {
			this.plane.setVelocityY(-200);	
		}	


		this.plane.y = Phaser.Math.Clamp(this.plane.y, 80, 640);	
		this.newCrateTime = this.newCrateTime + delta;
		if(this.newCrateTime > this.timing )
		{
			this.addRowOfPipes();
			this.newCrateTime = 0;
		}
		this.distance = this.distance + delta;
		if(this.distance > 60000)
			this.win();
		this.scoreText.setText('DISTANCE : '+Math.ceil((this.distance)/1000));			
	}
	

    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);

        pipe.body.velocity.x = -250;  
        pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
		this.physics.add.overlap(this.plane, pipe, this.die, null, this);
    }

    addRowOfPipes() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 15; i++)
            if (i != hole && i != hole +1 && i != hole +2) 
                this.addOnePipe(1600, i*50+20);   
	}

	win() {
		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		this.time.delayedCall(500, function() {
			this.scene.switch('BreakoutScene');
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}
	
	die() {
		this.lives = this.lives - 1;
		this.livesText.setText('CARS : '+this.lives)
		this.plane.setTint(0xff0000);
		let enemies = this.pipes.getChildren();
		let numEnemies = enemies.length;		

		for (let i = 0; i < numEnemies; i++) {

			enemies[i].disableBody(true, true);
		}

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		if(this.lives == 0)
		{
			this.time.delayedCall(500, function() {
				this.scene.switch('BreakoutScene');
			}, [], this);
		} /*else
		{
			this.time.delayedCall(500, function() {
				this.scene.switch('PlaneScene');
			}, [], this);			
		}*/

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
			this.plane.setTint(0xffffff);
		}, [], this);
	}	
}

/*if (!window.cordova) {
    window.dispatchEvent('deviceready');
}*/