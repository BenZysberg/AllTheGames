class TitleScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'TitleScene'
		});
	}
	preload() {}
	create() {
		this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
		console.log("TITLE");
		//this.scene.bringToTop();
	}
	update(time, delta) {
		if (this.startKey.isDown) {
			//this.scene.stop('TitleScene');
			//this.registry.set('attractMode', false);
			this.scene.switch('PacManScene');
		}
	}
}