class BootScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'BootScene'
		});
	}
	preload() {}
	create() {
		console.log("BOOTED");
		this.resize();
		this.scene.switch('TitleScene');
	}
	
	resize() {
		console.log("Resize");
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }	
}