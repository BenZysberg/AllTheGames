class InstructionsScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'InstructionsScene',
			active: true,
		});
	}

	preload() {
		this.load.image('backgroundInstructions', 'assets/Paris.jpg');
	}

	create() {
		this.scene.setVisible(false);
		this.bg = this.add.sprite(0, 0, 'backgroundInstructions');
		this.bg.setOrigin(0, 0);	
        this.titleText = this.add.text(0, 0, ''+titles[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.titleText.setStroke('#0000ff', 8);

		this.instructionsText = this.add.text(0, 48, 'USE : '+instructions[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.instructionsText.setStroke('#0000ff', 8);     		
	}

	nextScene(){
		this.instructionsText.setText('USE : '+instructions[currentScene]);
		this.scene.bringToTop();
	}

	update(time, delta) {}
}