class PlaneScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'PlaneScene',
			physics: {
				arcade: {
					gravity: {
						y: 0
					},
					debug: true
				},
			}			
		});
		this.cursors;
		this.isPlayerAlive = true;		
		this.newCrateTime = 0;
		this.newDifficultyTime = 0;
		this.timing = 3000;
	}
	
	preload() {
		this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');
        this.load.image('pipe', 'assets/pipe.png');		
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
		this.plane = this.physics.add.sprite(400, 300, 'sheet').play('plane');
		this.plane.body.gravity.y = 1000; 
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

		// enemy movement and collision
		let enemies = this.pipes.getChildren();
		let numEnemies = enemies.length;		

		for (let i = 0; i < numEnemies; i++) {

			// enemy collision
			if (Phaser.Geom.Intersects.RectangleToRectangle(this.plane.getBounds(), enemies[i].getBounds())) {
				this.gameOver();
				break;
			}
		}		
	}
	

    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);

        pipe.body.velocity.x = -250;  
        pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
		//this.physics.add.overlap(this.plane, pipe, this.gameOver, null, this);
    }

    addRowOfPipes() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 15; i++)
            if (i != hole && i != hole +1 && i != hole +2) 
                this.addOnePipe(1600, i*50+20);   
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
			this.scene.switch('BreakoutScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}	
}

/*if (!window.cordova) {
    window.dispatchEvent('deviceready');
}*/