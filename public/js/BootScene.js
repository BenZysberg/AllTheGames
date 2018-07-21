class BootScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'BootScene'
		});
	}
	preload() {}
	create() {
		this.scene.switch('TitleScene');
	}
}