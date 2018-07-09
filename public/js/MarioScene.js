class MarioScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'MarioScene',
			physics: {
				arcade: {
					gravity: {
						y: 500
					},
					//debug: true
				},
			}			
		});
		this.map;
		this.player;
		this.cursors;
		this.groundLayer, this.coinLayer;
		this.text;
		this.score = 0;
	}



	preload() {
		// this.map made with Tiled in JSON format
		this.load.tilemapTiledJSON('map', 'assets/map.json');
		// tiles in spritesheet 
		this.load.spritesheet('tiles', 'assets/tilesMario.png', {frameWidth: 70, frameHeight: 70});
		// simple coin image
		this.load.image('coin', 'assets/coinGold.png');
		// player animations
		this.load.atlas('playerMario', 'assets/playerMario.png', 'assets/player.json');
	}

	create() {
		// load the this.map 
		this.map = this.make.tilemap({key: 'map'});

		// tiles for the ground layer
		var groundTiles = this.map.addTilesetImage('tiles');
		// create the ground layer
		this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
		// the player will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);

		// coin image used as tileset
		var coinTiles = this.map.addTilesetImage('coin');
		// add coins as tiles
		this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

		// set the boundaries of our game world
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;

		// create the player sprite    
		this.player = this.physics.add.sprite(200, 200, 'playerMario');
		this.player.setBounce(0.2); // our player will bounce from items
		this.player.setCollideWorldBounds(true); // don't go out of the this.map    
		
		// small fix to our player images, we resize the physics body object slightly
		this.player.body.setSize(this.player.width, this.player.height-8);
		
		// player will collide with the level tiles 
		this.physics.add.collider(this.groundLayer, this.player);

		this.coinLayer.setTileIndexCallback(17, this.collectCoin, this);
		// when the player overlaps with a tile with index 17, collectCoin 
		// will be called    
		this.physics.add.overlap(this.player, this.coinLayer);

		// player walk animation
		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNames('playerMario', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
			frameRate: 10,
			repeat: -1
		});
		// idle with only one frame, so repeat is not neaded
		this.anims.create({
			key: 'idle',
			frames: [{key: 'playerMario', frame: 'p1_stand'}],
			frameRate: 10,
		});


		this.cursors = this.input.keyboard.createCursorKeys();

		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(this.player);

		// set background color, so the sky is not black    
		this.cameras.main.setBackgroundColor('#ccccff');

		// this this.text will show the this.score
		this.text = this.add.text(20, 570, '0', {
			fontSize: '20px',
			fill: '#ffffff'
		});
		// fix the this.text to the camera
		this.text.setScrollFactor(0);
	}

// this function will be called when the player touches a coin
	collectCoin(sprite, tile) {
		this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
		this.score++; // add 10 points to the this.score
		this.text.setText(this.score); // set the this.text to show the current this.score
		return false;
	}

	update(time, delta) {
		if (this.cursors.left.isDown)
		{
			this.player.body.setVelocityX(-200);
			this.player.anims.play('walk', true); // walk left
			this.player.flipX = true; // flip the sprite to the left
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.setVelocityX(200);
			this.player.anims.play('walk', true);
			this.player.flipX = false; // use the original sprite looking to the right
		} else {
			this.player.body.setVelocityX(0);
			this.player.anims.play('idle', true);
		}
		// jump 
		if (this.cursors.up.isDown && this.player.body.onFloor())
		{
			this.player.body.setVelocityY(-500);        
		}
	}
}