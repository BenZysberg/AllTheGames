class TitleScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'TitleScene'
		});
	}
	preload() {}
	create() {
		this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
		//this.scene.bringToTop();
	}
	update(time, delta) {
		if (this.startKey.isDown) {
			//this.scene.stop('TitleScene');
			//this.registry.set('attractMode', false);
			let insScene = this.scene.get('InstructionsScene');
			this.scene.setVisible(false, insScene);
			this.scene.switch(order[currentScene]);
		}
	}
}