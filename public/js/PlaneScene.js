class PlaneScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'PlaneScene',
			physics: {
				arcade: {
					gravity: {
						y: 300
					},
					//debug: true
				},
			}			
		});
		this.cursors;
		this.isPlayerAlive = true;		
	}
	
	preload() {
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');
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
            key: 'plane',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('sheet', { start: 1,  end: 3, prefix: 'planeBlue', suffix: '.png' })
        });
		
		this.cursors = this.input.keyboard.createCursorKeys();

        this.bg = this.add.tileSprite(0, 0, 800, 480, 'sheet', 'background.png').setOrigin(0);
        this.plane = this.physics.add.sprite(400, 300, 'sheet').play('plane');
    }

	update(time, delta) {
        this.bg.tilePositionX += 5;
		
		if (!this.isPlayerAlive) {
			return;
		}

		if (this.cursors.left.isDown) {
			this.plane.setVelocityX(-160);

			this.plane.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.plane.setVelocityX(160);

			this.plane.anims.play('right', true);
		} else {
			this.plane.setVelocityX(0);

			this.plane.anims.play('turn');
		}

		if (this.cursors.up.isDown) {
			this.plane.setVelocityY(-330);
		}		
    }
}

/*if (!window.cordova) {
    window.dispatchEvent('deviceready');
}*/