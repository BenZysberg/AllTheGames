class TitleScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'TitleScene'
		});
	}
	preload() {
		this.load.image('backgroundTitle', 'assets/title.jpg');
		this.load.image('teresaSolo', 'assets/TeresaSolo.png');
	}
	create() {
		this.bgTitle = this.add.sprite(0, 0, 'backgroundTitle');
		this.bgTitle.setOrigin(0, 0);	
		this.teresa = this.add.sprite(370, 370, 'teresaSolo');
		this.startText = this.add.text(500, 300, 'PRESS T TO START', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#000000" });						
		this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
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