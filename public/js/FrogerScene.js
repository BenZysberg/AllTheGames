class FrogerScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'FrogerScene',
			physics: {
				arcade: {
					gravity: {
						y: 0
					},
					debug: true
				},
			}	
		});	
		this.livesText;    
		this.lives = 5; 	
	}

	init() {
		this.playerSpeed = 51;
		this.enemies = [];
		this.numberEnemyRows = 11;
	}

	preload() {
		this.load.image('backgroundFroger', 'assets/vip.jpg');
		this.load.image('playerFroger', 'assets/player.png');
		this.load.image('mazi', 'assets/MaziarFarzam.png');
		this.load.image('michelle', 'assets/MichelleFarzam.png');
		this.load.image('ari', 'assets/AriKaplan.png');
		this.load.image('penn', 'assets/PennArthur.png');
		this.load.image('treasure', 'assets/Door.jpg');
	}

	create() {

        this.input.on("pointerup", this.endSwipe, this);			
		this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);	
		this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);		
		this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);		
		this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.bLeftKeyDown = false;
		this.bRightKeyDown = false;
		this.bUpKeyDown = false;
		this.bDownKeyDown = false;	
		//this.scene.bringToTop();
		// backgroundFroger
		this.bg = this.add.sprite(0, 0, 'backgroundFroger');
		//this.bg.setScale(0.5);

		// change origin to the top-left of the sprite
		this.bg.setOrigin(0, 0);

		// player
		this.player = this.physics.add.sprite(41, this.sys.game.config.height / 2, 'playerFroger');

		// scale down
		this.player.setScale(0.5);

		// goal
		this.treasure = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
		this.treasure.setScale(0.6);


		for(let i=0; i<this.numberEnemyRows; i++)
		{
			let enemyType = 'mazi';
			let enemySpeed = 1;
			console.log(i%4);
			switch(i%4){
				case 0:
					enemyType = 'mazi';
					break;
				case 1:	
					enemyType = 'michelle';
					break;
				case 2:	
					enemyType = 'ari';
					break;		
				case 3:	
					enemyType = 'penn';
					break;									
			}
			switch(i%2){
				case 0:
					enemySpeed = 1;
					break;
				case 1:	
					enemySpeed = -1;
					break;
			}

			this.enemies[i] = this.physics.add.group({
				key: enemyType,
				repeat: 4,
				setXY: {
					x: 92+i*92+i*10,
					y: 0,
					stepX: 0,
					stepY: 144
				}
			});
			Phaser.Actions.ScaleXY(this.enemies[i].getChildren(), -0.5, -0.5);
			Phaser.Actions.Call(this.enemies[i].getChildren(), function(enemy) {
				enemy.speed = enemySpeed;
			}, this);			
		}			

		// player is alive
		this.isPlayerAlive = true;
		
		this.cursors = this.input.keyboard.createCursorKeys();

		this.livesText = this.add.text(16, 16, 'Lives : '+this.lives, { fontFamily: "Nintendo NES Font", fontSize: 74, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 16);
		//this.livesText.setShadow(2, 2, "#ffffff", 2, true, true);	
	}
	
	endSwipe(e) {

    }	

	update(time, delta) {
		// only if the player is alive
		if (!this.isPlayerAlive) {
			return;
		}
		
		if (!this.bLeftKeyDown)
		{
			if(this.leftKey.isDown)
			{ 
				this.bLeftKeyDown = true;
				this.player.x -= this.playerSpeed;
			}			
		}
		else
		{
			if(this.leftKey.isUp)
			{ 
				this.bLeftKeyDown = false;
			}
		}
		
		
		
		if (!this.bRightKeyDown)
		{
			if(this.rightKey.isDown)
			{ 
				this.bRightKeyDown = true;
				this.player.x += this.playerSpeed;
			}			
		}
		else
		{
			if(this.rightKey.isUp)
			{ 
				this.bRightKeyDown = false;
			}
		}
		
		
		if (!this.bUpKeyDown)
		{
			if(this.upKey.isDown)
			{ 
				this.bUpKeyDown = true;
				this.player.y -= this.playerSpeed;
			}			
		}
		else
		{
			if(this.upKey.isUp)
			{ 
				this.bUpKeyDown = false;
			}
		}	


		if (!this.bDownKeyDown)
		{
			if(this.downKey.isDown)
			{ 
				this.bDownKeyDown = true;
				this.player.y += this.playerSpeed;
			}			
		}
		else
		{
			if(this.downKey.isUp)
			{ 
				this.bDownKeyDown = false;
			}
		}

		// treasure collision
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
			this.gameOver();
		}

		for(let i=0; i<this.numberEnemyRows; i++)
		{

			// enemy movement and collision
			let oneRow = this.enemies[i].getChildren();
			let numEnemies = oneRow.length;

			for (let j = 0; j < numEnemies; j++) {

				// move enemies
				oneRow[j].y += oneRow[j].speed;

				switch(i%2){
					case 0:
						if (oneRow[j].y >= 720) {
							oneRow[j].y = 0;
						}
						break;
					case 1:	
						if (oneRow[j].y <= 0) {
							oneRow[j].y = 720;
						}
						break;					
				}

				// enemy collision
				if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), oneRow[j].getBounds())) {
					this.die();
					break;
				}		
			}
		}
	}

	die() {
		this.player.x = 41;
		this.player.y = this.sys.game.config.height / 2;
		this.lives = this.lives - 1;
		this.livesText.setText('Lives : '+this.lives)
		if(this.lives==0)
			this.gameOver();		
	}

	gameOver() {
		// flag to set player is dead
		this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		// restart game
		this.time.delayedCall(500, function() {
			this.scene.switch('CrateScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}

	cleanUp() {
		// Scenes isn't properly destroyed yet.
		// lists from    console.log(Object.keys(this));
		let ignore = ["sys", "anims", "cache", "registry", "sound", "textures", "events", "cameras", "make", "add", "scene", "children", "cameras3d", "time", "data", "input", "load", "tweens", "lights", "physics"];
		let whatThisHad = ["sys", "anims", "cache", "registry", "sound", "textures", "events", "cameras", "make", "add", "scene", "children", "cameras3d", "time", "data", "input", "load", "tweens", "lights", "physics", "attractMode", "destinations", "rooms", "eightBit", "music", "map", "tileset", "groundLayer", "mario", "enemyGroup", "powerUps", "keys", "blockEmitter", "bounceTile", "levelTimer", "score", "finishLine", "touchControls"];



		whatThisHad.forEach(key => {
			if (ignore.indexOf(key) === -1 && this[key]) {

				switch (key) {
					case "enemyGroup":
					case "music":
					case "map":
						//case "tileset":
						this[key].destroy();

						break;
				}

				this[key] = null;

			}
		})
	}

}