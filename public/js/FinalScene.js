class FinalScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'FinalScene'
		});
	}

	preload() {
		this.load.image('backgroundFinal', 'assets/Final.jpg');
	}

	create() {
		this.bg = this.add.sprite(0, 0, 'backgroundFinal');
		this.bg.setOrigin(0, 0);
		this.finalText = this.add.text(0, 300, 'THANKS FOR PLAYING!!', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.finalText.setStroke('#0000ff', 8);
	}

	update(time, delta) {

	}
}