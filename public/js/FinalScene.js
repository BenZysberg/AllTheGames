class FinalScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'FinalScene'
		});
		this.music;	
	}

	preload() {
		this.load.image('backgroundFinal', 'assets/Final.jpg');
		this.load.audio('musicFinal', ['assets/Final.mp3']); 			
	}

	create() {
		this.bg = this.add.sprite(0, 0, 'backgroundFinal');
		this.bg.setOrigin(0, 0);
		this.finalText = this.add.text(0, 32, 'THANKS FOR PLAYING!!', { fontFamily: "Nintendo NES Font", fontSize: 64, color: "#ff0000" });
		this.finalText.setStroke('#0000ff', 8);
		this.endTime = 0;
		this.scoreboardText = this.add.text(500, 326, 'THANKS FOR PLAYING!!', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreboardText.setStroke('#0000ff', 8);
		this.firstRun = true;
		this.music = this.sound.add('musicFinal');
		this.music.play();
	}

	update(time, delta) {
		if(this.firstRun)
		{
			let scoreboard = "";
			let finalScore = 0;
			for(let i=0; i<8; i++)
			{
				let condition = "FAIL";
				if(victories[i])
					condition = "PASS";
				scoreboard = scoreboard + titles[i] + "..." + condition + "\n";
				finalScore = finalScore + score[i];
			}
			scoreboard = scoreboard + "FINAL SCORE..." + finalScore;
			this.scoreboardText.setText(scoreboard);
			this.firstRun = false;
		}
		this.endTime = this.endTime + delta;
		if(this.endTime > 10000)
			document.location = ("endVideo.html");
	}
}