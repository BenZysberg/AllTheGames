class PacManScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'PacManScene',
			physics: {
				arcade: {
					gravity: {
						y: 0
					},
					debug: true
				},
			}			
		});
        this.map = null;
        this.layer = null;
        this.pacman = null;
		this.none = 0;
		this.left = 1;
		this.right = 2;
		this.up = 3;
		this.down = 4;
        this.safetile = 14;
        this.gridsize = 16;

        this.speed = 50;
        this.threshold = 3;

        this.marker = new  Phaser.Geom.Point();
        this.turnPoint = new  Phaser.Geom.Point();

        this.directions = [ null, null, null, null, null ];
        this.opposites = [ this.none, this.right, this.left, this.down, this.up ];

        this.current = this.right;
        this.turning = this.none;	
	}
	
	/*init(){
		Phaser.Physics.Arcade.Body.setGravity(0,0);
	}*/

	preload() {
		this.load.image('dot', 'assets/dot.png');
		this.load.image('tilesPacman', 'assets/pacman-tiles.png');
		this.load.spritesheet('pacman', 'assets/pacman.png', { frameWidth: 16, frameHeight: 16 });
		//this.load.spritesheet('pacman', 'assets/PacWoman.png', { frameWidth: 128, frameHeight: 128 });
		this.load.tilemapTiledJSON('mapPacman', 'assets/pacman-map.json');

		//  Needless to say, graphics (C)opyright Namco		
	}

	create() {

		this.map = this.add.tilemap('mapPacman');
		this.tileset = this.map.addTilesetImage('pacman-tiles', 'tilesPacman');

		this.layer = this.map.createDynamicLayer('Pacman', this.tileset, 0, 0);

		//this.dots = this.physics.add.staticGroup();

		//this.dots = this.map.createFromTiles(7, this.safetile, 'dot', this, this.camera, this.layer);

		//  The dots will need to be offset by 6px to put them back in the middle of the grid
		//this.dots.setAll('x', 6, false, false, 1);
		//this.dots.setAll('y', 6, false, false, 1);

		//  Pacman should collide with everything except the safe tile
		//this.map.setCollisionByExclusion([this.safetile], true, true, this.layer);
		this.map.setCollision([0,1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33], true, true);

		//  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
		this.pacman = this.physics.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
		this.pacman.setOrigin(0.5,0.5);
		
		this.anims.create({
			key: 'munch',
			frames: this.anims.generateFrameNumbers('pacman', {
				start: 0,
				end: 3
			}),
			frameRate: 15,
			repeat: -1
		});		

		//this.physics.arcade.enable(this.pacman);
		this.pacman.body.setSize(16, 16, 0, 0);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.pacman.play('munch');
		//this.move(this.right);		
		
		this.physics.add.collider(this.pacman, this.layer);
		//this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);	
	}

	checkKeys() {

		if (this.cursors.left.isDown && this.current !== this.left)
		{
			this.checkDirection(this.left);
		}
		else if (this.cursors.right.isDown && this.current !== this.right)
		{
			this.checkDirection(this.right);
		}
		else if (this.cursors.up.isDown && this.current !== this.up)
		{
			this.checkDirection(this.up);
		}
		else if (this.cursors.down.isDown && this.current !== this.down)
		{
			this.checkDirection(this.down);
		}
		else
		{
			//  This forces them to hold the key down to turn the corner
			this.turning = this.none;
		}

	}

	checkDirection(turnTo) {

		if (this.turning === turnTo || this.directions[turnTo] === null )//|| this.directions[turnTo].index !== this.safetile)
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

		this.turning = this.none;

		return true;

	}

	move(direction) {

		var speed = this.speed;

		if (direction === this.left || direction === this.up)
		{
			speed = -speed;
		}

		if (direction === this.left || direction === this.right)
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

		if (direction === this.left )
		{
			this.pacman.angle = 180;
		}
		else if (direction === this.up)
		{
			this.pacman.angle = 270;
		}
		else if (direction === this.down)
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
		this.marker.x = Phaser.Math.Snap.Floor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
		this.marker.y = Phaser.Math.Snap.Floor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

		//  Update our grid sensors
		this.directions[this.left] = this.map.getTileAt(this.marker.x-1, this.marker.y);
		this.directions[this.right] = this.map.getTileAt(this.marker.x+1, this.marker.y);
		this.directions[this.up] = this.map.getTileAt(this.marker.x, this.marker.y-1);
		this.directions[this.down] = this.map.getTileAt(this.marker.x, this.marker.y+1);

		//console.log(this.directions[this.left].index);
		/*if(this.directions[this.left].index != 13)
		{
			this.pacman.body.velocity.x = 0;
			
		}*/
		
		this.checkKeys();

		if (this.turning !== this.none)
		{
			this.turn();
		}		
	}	
}