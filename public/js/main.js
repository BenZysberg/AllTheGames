let config = {
	type: Phaser.WEBGL,
	parent: 'content',
	width: 1280,
	height: 720,
	scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
	pixelart: true,
	zoom: document.body.clientWidth / 1280,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 800
			},
			debug: false
		}
	},
	scene: [
		BootScene,
		TitleScene,
		FrogerScene,
		StarScene,
	]
};

let game = new Phaser.Game(config);