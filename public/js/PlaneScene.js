class PlaneScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'PlaneScene'
		});	
	}
	
	preload() {
		console.log("Plane");
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
        this.resize();

        this.anims.create({
            key: 'plane',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('sheet', { start: 1,  end: 3, prefix: 'planeBlue', suffix: '.png' })
        });

        this.bg = this.add.tileSprite(0, 0, 800, 480, 'sheet', 'background.png').setOrigin(0);
        var plane = this.add.sprite(400, 300, 'sheet').play('plane');
    }

	update(time, delta) {
        this.bg.tilePositionX += 5;
    }
}

/*if (!window.cordova) {
    window.dispatchEvent('deviceready');
}*/