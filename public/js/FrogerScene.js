class FrogerScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'FrogerScene'
		});
		
		this.bg;
	}

	init() {
		this.playerSpeed = 1.5;
		this.enemySpeed = 8;
		this.enemyMaxY = 640;
		this.enemyMinY = 80;
	}

	preload() {
		this.load.image('background', 'assets/background.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('dragon', 'assets/dragon.png');
		this.load.image('treasure', 'assets/treasure.png');
	}

	create() {

		console.log("FROGER");
		//this.scene.bringToTop();
		// background
		this.bg = this.add.sprite(0, 0, 'background');
		//this.bg.setScale(0.5);

		// change origin to the top-left of the sprite
		this.bg.setOrigin(0, 0);

		// player
		this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

		// scale down
		this.player.setScale(0.5);

		// goal
		this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
		this.treasure.setScale(0.6);

		// group of enemies
		this.enemies = this.add.group({
			key: 'dragon',
			repeat: 10,
			setXY: {
				x: 110,
				y: this.sys.game.config.height / 2,
				stepX: 80,
				stepY: 20
			}
		});

		// scale enemies
		Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

		// set speeds
		Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
			enemy.speed = Math.random() * 2 + 1;
		}, this);

		// player is alive
		this.isPlayerAlive = true;
	}

	update(time, delta) {
		// only if the player is alive
		if (!this.isPlayerAlive) {
			return;
		}

		// check for active input
		if (this.input.activePointer.isDown) {

			// player walks
			this.player.x += this.playerSpeed;
		}

		// treasure collision
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
			this.gameOver();
		}

		// enemy movement and collision
		let enemies = this.enemies.getChildren();
		let numEnemies = enemies.length;

		for (let i = 0; i < numEnemies; i++) {

			// move enemies
			enemies[i].y += enemies[i].speed;

			// reverse movement if reached the edges
			if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
				enemies[i].speed *= -1;
			} else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
				enemies[i].speed *= -1;
			}

			// enemy collision
			if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
				this.gameOver();
				break;
			}
		}
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
			this.scene.switch('StarScene');
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