let config = {
	type: Phaser.WEBGL,
	parent: 'content',
	width: 1280, //1280
	height: 720, //720
	scaleMode: 0,
	pixelart: true,
	zoom: document.body.clientWidth / 1280,
	scene: [
		BootScene,
		TitleScene,
		BreakoutScene, //FIX THE CSS
		PlaneScene,  //LEAVE THE BUILDING
		PacManScene, //WEDNESDAY : DRIVE DESTINY TO SCHOOL 
		SokobanScene, //FRIDAY : PUSH CODE
		StarScene, //EAT THE RICE
		FrogerScene, //HEAD OUT!!
		CrateScene, //DON'T SMOKE!!
		MarioScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
		KnifeScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
		ThreesScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
	]
};

let game = new Phaser.Game(config);

window.focus()
/*resize();
window.addEventListener("resize", resize, false);*/

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