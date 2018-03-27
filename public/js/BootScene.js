class BootScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'BootScene'
		});
	}
	preload() {}
	create() {
		console.log("BOOTED");
		this.scene.start('TitleScene');
	}
}