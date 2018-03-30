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
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;		
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
		this.map.setCollisionByExclusion([this.safetile], true, this.layer);

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
		this.move(Phaser.LEFT);		
		
		this.physics.add.collider(this.pacman, this.layer);
		//this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);		
	}

	checkKeys() {

		if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
		{
			this.checkDirection(Phaser.Input.Keyboard.LEFT);
		}
		else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
		{
			this.checkDirection(Phaser.RIGHT);
		}
		else if (this.cursors.up.isDown && this.current !== Phaser.UP)
		{
			this.checkDirection(Phaser.UP);
		}
		else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
		{
			this.checkDirection(Phaser.DOWN);
		}
		else
		{
			//  This forces them to hold the key down to turn the corner
			this.turning = Phaser.NONE;
		}

	}

	checkDirection(turnTo) {

		//if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
		//{
			//  Invalid direction if they're already set to turn that way
			//  Or there is no tile there, or the tile isn't index 1 (a floor tile)
			//return;
		//}

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

		this.turning = Phaser.NONE;

		return true;

	}

	move(direction) {

		var speed = this.speed;

		if (direction === Phaser.LEFT || direction === Phaser.UP)
		{
			speed = -speed;
		}

		if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
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

		if (direction === Phaser.LEFT)
		{
			this.pacman.setScale(-1);
		}
		else if (direction === Phaser.UP)
		{
			this.pacman.angle = 270;
		}
		else if (direction === Phaser.DOWN)
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
		//this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
		//this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

		//  Update our grid sensors
		//this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
		//this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
		//this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
		//this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

		this.checkKeys();

		if (this.turning !== Phaser.NONE)
		{
			this.turn();
		}		
	}
}