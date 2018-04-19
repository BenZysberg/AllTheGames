class StarScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'StarScene',
			physics: {
				arcade: {
					gravity: {
						y: 300
					},
					//debug: true
				},
			}			
		});

		this.stars;
		this.bg;
		this.bombs;
		this.platforms;
		this.cursors;
		this.score = 0;
		this.isPlayerAlive = true;
		this.scoreText;
	}

	preload() {
		this.load.image('sky', 'assets/sky.png');
		this.load.image('ground', 'assets/ground.png');
		this.load.image('platform', 'assets/platform.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 36,
			frameHeight: 48
		});
	}

	create() {
		//  A simple background for our game
		this.bg = this.add.image(0, 0, 'sky');
		this.bg.setOrigin(0, 0);

		//  The this.platforms group contains the ground and the 2 ledges we can jump on
		this.platforms = this.physics.add.staticGroup();

		//  Here we create the ground.
		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		this.platforms.create(640, 688, 'ground').setScale(2).refreshBody();

		//  Now let's create some ledges
		
		for(let i=0; i<4; i++)
		{
			this.platforms.create(640+(Math.cos(Math.PI*i)*100), 608-(i*96), 'platform');
		}
		/*this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');*/

		// The player and its settings
		this.player = this.physics.add.sprite(100, 450, 'dude');

		//  this.player physics properties. Give the little guy a slight bounce.
		this.player.setBounce(0.2);
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

		//  Some this.stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70
			}
		});

		this.stars.children.iterate(function(child) {

			//  Give each star a slightly different bounce
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

		});

		this.bombs = this.physics.add.group();

		//  The this.score
		this.scoreText = this.add.text(16, 16, 'this.score: 0', {
			fontSize: '32px',
			fill: '#000'
		});

		//  Collide the this.player and the this.stars with the this.platforms
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.collider(this.bombs, this.platforms);

		//  Checks to see if the this.player overlaps with any of the this.stars, if he does call the collectStar function
		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

		this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
		
		// player is alive
		this.isPlayerAlive = true;
		
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

	collectStar(player, star) {
		star.disableBody(true, true);

		//  Add and update the this.score
		this.score += 10;
		this.scoreText.setText('this.score: ' + this.score);

		if (this.stars.countActive(true) === 0) {

			this.gameOver();
			//  A new batch of this.stars to collect
			/*this.stars.children.iterate(function(child) {

				child.enableBody(true, child.x, 0, true, true);

			});

			let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

			let bomb = this.bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;*/

		}
	}

	hitBomb(player, bomb) {
		this.physics.pause();

		this.player.setTint(0xff0000);

		this.player.anims.play('turn');

		this.isPlayerAlive = true;
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
			this.scene.stop('StarScene');
			this.scene.start('FrogerScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}	

}