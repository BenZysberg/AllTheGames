class PacManScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'PacManScene'
		});
        this.map = null;
        this.layer = null;
        this.pacman = null;

        this.safetile = 14;
        this.gridsize = 16;

        this.speed = 150;
        this.threshold = 3;

        this.marker = new  Phaser.Geom.Point();
        this.turnPoint = new  Phaser.Geom.Point();

        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.Input.Keyboard.KeyCodes.NONE, Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.UP ];

        this.current = Phaser.Input.Keyboard.KeyCodes.NONE;
        this.turning = Phaser.Input.Keyboard.KeyCodes.NONE;		
	}
	
	/*init(){
		Phaser.Physics.Arcade.Body.setGravity(0,0);
	}*/

	preload() {
		this.load.image('dot', 'assets/dot.png');
		this.load.image('tiles', 'assets/pacman-tiles.png');
		this.load.spritesheet('pacman', 'assets/pacman.png', { frameWidth: 32, frameHeight: 32 });
		this.load.tilemapTiledJSON('map', 'assets/pacman-map.json');

		//  Needless to say, graphics (C)opyright Namco		
	}

	create() {
		
		this.map = this.add.tilemap('map');
		this.tileset = this.map.addTilesetImage('pacman-tiles', 'tiles');

		this.layer = this.map.createDynamicLayer('Pacman', this.tileset, 0, 0);

		//this.dots = this.physics.add.staticGroup();

		//this.dots = this.map.createFromTiles(7, this.safetile, 'dot', this, this.camera, this.layer);

		//  The dots will need to be offset by 6px to put them back in the middle of the grid
		//this.dots.setAll('x', 6, false, false, 1);
		//this.dots.setAll('y', 6, false, false, 1);

		//  Pacman should collide with everything except the safe tile
		this.map.setCollisionByExclusion([this.safetile], true, true, this.layer);

		//  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
		this.pacman = this.physics.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
		this.pacman.setOrigin(0.5,0.5);
		
		this.anims.create({
			key: 'munch',
			frames: this.anims.generateFrameNumbers('pacman', {
				start: 0,
				end: 3
			}),
			frameRate: 20,
			repeat: -1
		});		

		//this.physics.arcade.enable(this.pacman);
		this.pacman.body.setSize(16, 16, 0, 0);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.pacman.play('munch');
		//this.move(Phaser.LEFT);		
		
		this.physics.add.collider(this.pacman, this.layer);
		//this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);		
	}

	checkKeys() {

		if (this.cursors.left.isDown && this.current !== Phaser.Input.Keyboard.KeyCodes.LEFT)
		{
			this.checkDirection(Phaser.Input.Keyboard.KeyCodes.LEFT);
		}
		else if (this.cursors.right.isDown && this.current !== Phaser.Input.Keyboard.KeyCodes.RIGHT)
		{
			this.checkDirection(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		}
		else if (this.cursors.up.isDown && this.current !== Phaser.Input.Keyboard.KeyCodes.UP)
		{
			this.checkDirection(Phaser.Input.Keyboard.KeyCodes.UP);
		}
		else if (this.cursors.down.isDown && this.current !== Phaser.Input.Keyboard.KeyCodes.DOWN)
		{
			this.checkDirection(Phaser.Input.Keyboard.KeyCodes.DOWN);
		}
		else
		{
			//  This forces them to hold the key down to turn the corner
			this.turning = Phaser.Input.Keyboard.KeyCodes.NONE;
		}

	}

	checkDirection(turnTo) {

		if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
		{
			//  Invalid direction if they're already set to turn that way
			//  Or there is no tile there, or the tile isn't index 1 (a floor tile)
			return;
		}
		
		//  Check if they want to turn around and can
		if (this.current === this.opposites[turnTo])
		{
			this.move(turnTo);
		}
		else
		{
			this.turning = turnTo;

			this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
			this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
		}

	}

	turn() {

		var cx = Math.floor(this.pacman.x);
		var cy = Math.floor(this.pacman.y);

		//  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
		if (!Phaser.Math.Fuzzy.Equal(cx, this.turnPoint.x, this.threshold) || !Phaser.Math.Fuzzy.Equal(cy, this.turnPoint.y, this.threshold))
		{
			return false;
		}

		//  Grid align before turning
		this.pacman.x = this.turnPoint.x;
		this.pacman.y = this.turnPoint.y;

		this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

		this.move(this.turning);

		this.turning = Phaser.Input.Keyboard.KeyCodes.NONE;

		return true;

	}

	move(direction) {
		
		console.log(direction);

		var speed = this.speed;

		if (direction === Phaser.Input.Keyboard.KeyCodes.LEFT || direction === Phaser.Input.Keyboard.KeyCodes.UP)
		{
			speed = -speed;
		}

		if (direction === Phaser.Input.Keyboard.KeyCodes.LEFT || direction === Phaser.Input.Keyboard.KeyCodes.RIGHT)
		{
			this.pacman.body.velocity.x = speed;
		}
		else
		{
			this.pacman.body.velocity.y = speed;
		}

		//  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
		this.pacman.setScale(1);
		this.pacman.angle = 0;

		if (direction === Phaser.Input.Keyboard.KeyCodes.LEFT)
		{
			this.pacman.setScale(-1);
		}
		else if (direction === Phaser.Input.Keyboard.KeyCodes.UP)
		{
			this.pacman.angle = 270;
		}
		else if (direction === Phaser.Input.Keyboard.KeyCodes.DOWN)
		{
			this.pacman.angle = 90;
		}

		this.current = direction;

	}

	eatDot(pacman, dot) {

		dot.kill();

		if (this.dots.total === 0)
		{
			this.dots.callAll('revive');
		}

	}
	
	update(time, delta) {
		this.marker.x = Phaser.Math.Snap.To(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
		this.marker.y = Phaser.Math.Snap.To(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
		console.log(this.marker.x+' '+this.marker.y);

		//  Update our grid sensors
		this.directions[1] = this.map.getTileAt(this.marker.x-1, this.marker.y);
		this.directions[2] = this.map.getTileAt(this.marker.x+1, this.marker.y);
		this.directions[3] = this.map.getTileAt(this.marker.x, this.marker.y-1);
		this.directions[4] = this.map.getTileAt(this.marker.x, this.marker.y+1);

		this.checkKeys();

		if (this.turning !== Phaser.NONE)
		{
			this.turn();
		}		
	}
}