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
		InstructionsScene,
		KnifeScene, //PREPARE SNACKS
		PlaneScene,  //DRIVE DESTINY TO SCHOOL 
		BreakoutScene, //BREAK THE CSS
		SokobanScene, //PUSH CODE
		FrogerScene, //HEAD OUT!!
		ThreesScene, //BONUS STAGE : PARTY MODE	
		CrateScene, //DON'T SMOKE!!
		StarScene, //EAT THE RICE
		PacManScene, //WEDNESDAY : DRIVE DESTINY TO SCHOOL 								
		MarioScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
	]
};

var game = new Phaser.Game(config);
var instructions = ["Click", "Up Arrow", "Touchpad","Arrows","Arrows","Arrows","Arrows","Arrows"];
var titles = ["MAKE SNACKS!!", "DRIVE DESTINY TO SCHOOL!!", "FIX THE CSS!!", "PUSH CODE!!", "HEAD OUT!!", "BONUS STAGE : DRINKING GAME!!", "DON'T SMOKE!!", "STAY VEGAN!!"]
var order = ["KnifeScene","PlaneScene","BreakoutScene","SokobanScene","FrogerScene","ThreesScene","CrateScene","StarScene"];
var currentScene = 0;
var bInstructions = false;
var transitionTime = 5000;
var victories = [false, false, false, false, false, false, false, false];
var score = [0,0,0,0,0,0,0,0];

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