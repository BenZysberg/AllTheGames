class CarScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'CarScene'
		});
        this.map = null;
        this.layer = null;
        this.car = null;

        this.safetile = 1;
        this.gridsize = 32;

        this.speed = 150;
        this.threshold = 3;
        this.turnSpeed = 150;

        this.marker = new Phaser.Geom.Point();
        this.turnPoint = new Phaser.Geom.Point();

        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

        this.current = Phaser.UP;
        this.turning = Phaser.NONE;		
	}
	
	/*init(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
	}*/

	preload() {
		this.load.tilemapTiledJSON('map', 'assets/maze.json');
		this.load.image('tiles', 'assets/tiles.png');
		this.load.image('car', 'assets/car.png');		
	}

	create() {
		console.log("CAR");
		this.map = this.add.tilemap('map');
		this.tileset = this.map.addTilesetImage('tiles', 'tiles');
	
		this.layer = this.map.createDynamicLayer('Tile Layer 1', this.tileset, 0, 0);

		this.map.setCollision(20, true, this.layer);

		this.car = this.add.sprite(48, 48, 'car');
		this.car.setOrigin(0.5,0.5);

		//this.physics.arcade.enable(this.car);

		this.cursors = this.input.keyboard.createCursorKeys();

		//this.move(Phaser.DOWN);		
		this.physics.add.collider(this.car, this.layer);
	}
	
	checkKeys() {

		if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
		{
			this.checkDirection(Phaser.LEFT);
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

		if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
		{
			//  Invalid direction if they're already set to turn that way
			//  Or there is no tile there, or the tile isn't index a floor tile
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

		var cx = Math.floor(this.car.x);
		var cy = Math.floor(this.car.y);

		//  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
		if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
		{
			return false;
		}

		this.car.x = this.turnPoint.x;
		this.car.y = this.turnPoint.y;

		this.car.body.reset(this.turnPoint.x, this.turnPoint.y);

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
			this.car.body.velocity.x = speed;
		}
		else
		{
			this.car.body.velocity.y = speed;
		}

		this.add.tween(this.car).to( { angle: this.getAngle(direction) }, this.turnSpeed, "Linear", true);

		this.current = direction;

	}

	getAngle(to) {

		//  About-face?
		if (this.current === this.opposites[to])
		{
			return "180";
		}

		if ((this.current === Phaser.UP && to === Phaser.LEFT) ||
			(this.current === Phaser.DOWN && to === Phaser.RIGHT) ||
			(this.current === Phaser.LEFT && to === Phaser.DOWN) ||
			(this.current === Phaser.RIGHT && to === Phaser.UP))
		{
			return "-90";
		}

		return "90";

	}

	update(time, delta) {
		//this.physics.arcade.collide(this.car, this.layer);

		this.marker.x = Phaser.Math.Snap.To(Math.floor(this.car.x), this.gridsize) / this.gridsize;
		this.marker.y = Phaser.Math.Snap.To(Math.floor(this.car.y), this.gridsize) / this.gridsize;
		console.log(this.marker.x);
		console.log(this.marker.y);

		//  Update our grid sensors
		this.directions[1] = Phaser.Tilemaps.Components.GetTileAt(this.marker.x-1, this.marker.y,true,this.layer);
		this.directions[2] = Phaser.Tilemaps.Components.GetTileAt(this.marker.x+1, this.marker.y,true,this.layer);
		this.directions[3] = Phaser.Tilemaps.Components.GetTileAt(this.marker.x, this.marker.y-1,true,this.layer);
		this.directions[4] = Phaser.Tilemaps.Components.GetTileAt(this.marker.x, this.marker.y+1,true,this.layer);

		this.checkKeys();

		if (this.turning !== Phaser.NONE)
		{
			this.turn();
		}		
	}
	
	render() {

		//  Un-comment this to see the debug drawing

		for (var t = 1; t < 5; t++)
		{
			if (this.directions[t] === null)
			{
				continue;
			}

			var color = 'rgba(0,255,0,0.3)';

			if (this.directions[t].index !== this.safetile)
			{
				color = 'rgba(255,0,0,0.3)';
			}

			if (t === this.current)
			{
				color = 'rgba(255,255,255,0.3)';
			}

			this.game.debug.geom(new Phaser.Rectangle(this.directions[t].worldX, this.directions[t].worldY, 32, 32), color, true);
		}

		this.game.debug.geom(this.turnPoint, '#ffff00');

	}	
}