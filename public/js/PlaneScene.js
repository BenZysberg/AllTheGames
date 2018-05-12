class PlaneScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'PlaneScene',
			physics: {
				arcade: {
					gravity: {
						y: 300
					},
					debug: true
				},
			}			
		});
		this.cursors;
		this.isPlayerAlive = true;	
	}
	
	preload() {
		this.load.spritesheet('plane', 'assets/plane.png', {
			frameWidth: 90,
			frameHeight: 73
		});
		this.load.image('flappyBg', 'assets/stars.jpg');
    }
	
	resize() {
		console.log("Resize");
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
	
	create() {
        //window.addEventListener('resize', resize);
        //this.resize();

        this.anims.create({
            key: 'fly',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('plane', { start: 0,  end: 2})
        });
		
		this.cursors = this.input.keyboard.createCursorKeys();

        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'flappyBg').setOrigin(0);
		this.bg.setOrigin(0);
		//this.bg.setScale(2);
        this.plane = this.physics.add.sprite(400, 300, 'sheet');
		this.plane.body.setSize(90,73,45,0);
        this.plane.play('fly');
		this.plane.setCollideWorldBounds(true);
    }

	update(time, delta) {
        this.bg.tilePositionX += 5;
		
		if (!this.isPlayerAlive) {
			return;
		}

		if (this.cursors.up.isDown) {
			this.plane.setVelocityY(-330);
		}		
    }
}

/*if (!window.cordova) {
    window.dispatchEvent('deviceready');
}*/