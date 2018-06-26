let config = {
	type: Phaser.WEBGL,
	parent: 'content',
	width: 900, //1280
	height: 1334, //720
	/*scaleMode: 0,
	pixelart: true,
	zoom: document.body.clientWidth / 1280,*/
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
		KnifeScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
		ThreesScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
	]
};

let game = new Phaser.Game(config);

window.focus()
resize();
window.addEventListener("resize", resize, false);

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

//More ideas : choose the right door for the meeting (VIP, BCR, DCR) and Mazi is behind one of those