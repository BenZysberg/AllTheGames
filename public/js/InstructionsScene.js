class InstructionsScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'InstructionsScene',
			active: true,
		});
		this.bgFail = [];
		this.bgSuccess = [];
		this.musicFail;
		this.musicWin;
		this.musicIntro;
	}

	preload() {
		this.load.image('backgroundSuccessOne', 'assets/successOne.jpg');
		this.load.image('backgroundSuccessTwo', 'assets/successTwo.jpg');
		this.load.image('backgroundSuccessThree', 'assets/successThree.jpg');
		this.load.image('backgroundfailOne', 'assets/failOne.jpg');
		this.load.image('backgroundFailTwo', 'assets/failTwo.jpg');
		this.load.image('backgroundFailThree', 'assets/failThree.jpg');
		this.load.audio('musicFail', ['assets/Fail.ogg']);
		this.load.audio('musicWin', ['assets/Win.ogg']);
		this.load.audio('musicIntro', ['assets/Intro.mp3']);
	}

	create() {
		this.scene.setVisible(false);
		this.musicFail = this.sound.add('musicFail');
		this.musicWin = this.sound.add('musicWin');
		this.musicIntro = this.sound.add('musicIntro');
		this.bgSuccess[0] = this.add.sprite(0, 0, 'backgroundSuccessOne');
		this.bgSuccess[1] = this.add.sprite(0, 0, 'backgroundSuccessTwo');
		this.bgSuccess[2] = this.add.sprite(0, 0, 'backgroundSuccessThree');		
		this.bgFail[0] = this.add.sprite(0, 0, 'backgroundfailOne');
		this.bgFail[1] = this.add.sprite(0, 0, 'backgroundFailTwo');
		this.bgFail[2] = this.add.sprite(0, 0, 'backgroundFailThree');
		for(let i=0; i<3; i++){
			this.bgSuccess[i].setOrigin(0, 0);
			this.bgSuccess[i].setVisible(false);
			this.bgFail[i].setOrigin(0, 0);
			this.bgFail[i].setVisible(false);
		}

		this.bgSuccess[0].setVisible(true);

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
			for(let i=0; i<3; i++){
				this.bgSuccess[i].setVisible(false);
				this.bgFail[i].setVisible(false);
			}

				let current = Phaser.Math.Between(0, 2);
				if(victories[currentScene-1])
					this.musicWin.play()
				else
					this.musicFail.play()

				this.bgFail[current].setVisible(!victories[currentScene-1]);
				this.failText.setVisible(!victories[currentScene-1]);
				this.bgSuccess[current].setVisible(victories[currentScene-1]);
				this.successText.setVisible(victories[currentScene-1]);
		}
		else
			this.musicIntro.play();

		this.roundText.setText(''+rounds[currentScene]);
		this.titleText.setText(''+titles[currentScene]);
		this.instructionsText.setText(''+instructions[currentScene]);
		this.scene.bringToTop();
	}

	update(time, delta) {}
}