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
		PlaneScene,  //DRIVE DESTINY TO SCHOOL 
		BreakoutScene, //FIX THE CSS
		SokobanScene, //FRIDAY : PUSH CODE
		FrogerScene, //HEAD OUT!!
		CrateScene, //DON'T SMOKE!!
		StarScene, //EAT THE RICE
		
		PacManScene, //WEDNESDAY : DRIVE DESTINY TO SCHOOL 
		
		
		
		
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