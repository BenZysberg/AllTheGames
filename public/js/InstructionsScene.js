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
		this.bg = this.add.sprite(0, 0, 'backgroundInstructions');
		this.bg.setOrigin(0, 0);	
        this.scoreText = this.add.text(0, 0, 'INSTRUCTIONS :', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreText.setStroke('#0000ff', 8);

		this.livesText = this.add.text(0, 48, 'USE : '+instructions[currentScene], { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 8);     		
	}

	nextScene(){
		this.livesText.setText('USE : '+instructions[currentScene]);
		this.scene.bringToTop();
	}

	update(time, delta) {}
}