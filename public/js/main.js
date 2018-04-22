let config = {
	type: Phaser.WEBGL,
	parent: 'content',
	width: 1280,
	height: 720,
	scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
	pixelart: true,
	zoom: document.body.clientWidth / 1280,
	/*physics: {
		matter: {
			//debug: true,
			gravity: { y: 0.5 }
		},
		arcade: {
			gravity: {
				y: 300
			},
			//debug: true
		},
	},*/
	scene: [
		BootScene,
		TitleScene,
		BreakoutScene, //THURSDAY : SQUASH BUGS (Space invaders ?)
		PlaneScene,  //TUESDAY : GET TO THE BLUE CONFERENCE ROOM
		PacManScene, //WEDNESDAY : DRIVE DESTINY TO SCHOOL 
		SokobanScene, //FRIDAY : PUSH CODE
		StarScene, //SUNDAY : KIMCHI TIME
		FrogerScene, //SATURDAY : QUIT SMOKING
		CrateScene, //MONDAY : AVOID YOUTUBE POLITICAL VIDEOS OR WEBEX MEETINGSs
		MarioScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
	]
};

let game = new Phaser.Game(config);

//More ideas : choose the right door for the meeting (VIP, BCR, DCR) and Mazi is behind one of those