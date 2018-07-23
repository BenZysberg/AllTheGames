class TitleScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'TitleScene'
		});
	}
	preload() {}
	create() {
		this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
		this.bStartKeyDown = false;
	}
	update(time, delta) {
		if(!this.bStartKeyDown)
		{
			if (this.startKey.isDown) {
				this.bStartKeyDown = true;
				//this.scene.stop('TitleScene');
				//this.registry.set('attractMode', false);
				let insScene = this.scene.get('InstructionsScene');
				this.scene.setVisible(true, insScene);  
				bInstructions = true;
				insScene.nextScene();		
				this.time.delayedCall(transitionTime, function() {
					this.scene.setVisible(false, insScene);
					this.scene.switch(order[currentScene]);
				}, [], this);
			}
		}
	}
}