class InstructionsScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'InstructionsScene',
			active: true,
		});
	}

	preload() {
		this.load.image('backgroundSuccess', 'assets/Success.jpg');
		this.load.image('backgroundFail', 'assets/Fail.jpg');
	}

	create() {
		this.scene.setVisible(false);

		this.bgFail = this.add.sprite(0, 0, 'backgroundFail');
		this.bgFail.setOrigin(0, 0);
		this.bgFail.setVisible(false);

		this.bgSuccess = this.add.sprite(0, 0, 'backgroundSuccess');
		this.bgSuccess.setOrigin(0, 0);	


		this.roundText = this.add.text(0, 300, ''+rounds[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.roundText.setStroke('#0000ff', 8);

        this.titleText = this.add.text(0, 348, ''+titles[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.titleText.setStroke('#0000ff', 8);

		this.instructionsText = this.add.text(0, 396, ''+instructions[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.instructionsText.setStroke('#0000ff', 8);   
		
		this.successText = this.add.text(400, 0, 'SUCCESS !!', { fontFamily: "Nintendo NES Font", fontSize: 64, color: "#ff0000" });
		this.successText.setStroke('#0000ff', 8); 
		this.successText.setVisible(false);

		this.failText = this.add.text(400, 0, 'FAIL !!', { fontFamily: "Nintendo NES Font", fontSize: 64, color: "#ff0000" });
		this.failText.setStroke('#0000ff', 8); 
		this.failText.setVisible(false);		

	}

	nextScene(){

		if(currentScene>0)
		{
				this.bgFail.setVisible(!victories[currentScene-1]);
				this.failText.setVisible(!victories[currentScene-1]);
				this.bgSuccess.setVisible(victories[currentScene-1]);
				this.successText.setVisible(victories[currentScene-1]);
		}

		this.roundText.setText(''+rounds[currentScene]);
		this.titleText.setText(''+titles[currentScene]);
		this.instructionsText.setText(''+instructions[currentScene]);
		this.scene.bringToTop();
	}

	update(time, delta) {}
}