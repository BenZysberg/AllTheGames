let config = {
	type: Phaser.WEBGL,
	parent: 'content',
	width: 1280,
	height: 720,
	scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
	pixelart: true,
	zoom: document.body.clientWidth / 1280,
	/*physics: {
		matter: {
			//debug: true,
			gravity: { y: 0.5 }
		},
		arcade: {
			gravity: {
				y: 300
			},
			//debug: true
		},
	},*/
	scene: [
		BootScene,
		TitleScene,
		BreakoutScene,
		PlaneScene,
		PacManScene,
		SokobanScene,
		StarScene,
		FrogerScene,
	]
};

let game = new Phaser.Game(config);