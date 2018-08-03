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
		FinalScene, //FINAL SCORE
		PacManScene, //WEDNESDAY : DRIVE DESTINY TO SCHOOL 								
		MarioScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
		MatchScene, //SUNDAY ALTERNATIVE : DRIVE DESTINY TO SCHOOL
	]
};

var game = new Phaser.Game(config);
var instructions = ["USE: CLICK", "USE: UP ARROW", "USE: TOUCHPAD","USE: ARROWS / R TO RETRY","USE: ARROWS","USE: ARROWS","USE: ARROWS","USE: ARROWS",""];
var titles = ["MAKE SNACKS!!", "DRIVE DESTINY!!", "FIX THE CSS!!", "PUSH CODE!!", "HEAD OUT!!", "DRINKING GAME!!", "DON'T SMOKE!!", "STAY VEGAN!!",""];
var rounds = ["NEXT: ROUND 1", "NEXT: ROUND 2", "NEXT: ROUND 3", "NEXT: ROUND 4", "NEXT: ROUND 5", "NEXT: BONUS ROUND", "NEXT: ROUND 6", "NEXT: FINAL ROUND",""];
var order = ["MatchScene","PlaneScene","BreakoutScene","SokobanScene","FrogerScene","ThreesScene","CrateScene","StarScene","FinalScene"];
var victories = [false, false, false, false, false, false, false, false, false];
var score = [0,0,0,0,0,0,0,0,0];
var currentScene = 0;
var bInstructions = false;
var transitionTime = 5000;


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