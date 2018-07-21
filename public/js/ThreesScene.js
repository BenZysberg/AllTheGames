class ThreesScene extends Phaser.Scene {
	constructor(test) {
		super({
			key: 'ThreesScene'			
		});

		this.gameOptions = {
			tileSize: 180,
			tweenSpeed: 50,
			tileSpacing: 0
        }
		this.score = 0;
		this.isPlayerAlive = true;
		this.scoreText;
		this.livesText;
		this.lives = 100;        
	}

    preload(){
        this.load.image("tile", "tile.png");
        this.load.spritesheet("tiles", "assets/tiles_2048.png", {
            frameWidth: this.gameOptions.tileSize,
            frameHeight: this.gameOptions.tileSize
        });
		this.load.image('backgroundCafe', 'assets/CafeBleu.jpg');			
    }

    // function to be executed once the scene has been created
    create(){
		//  A simple background for our game
		this.bg = this.add.sprite(0, 0, 'backgroundCafe');
		this.bg.setOrigin(0, 0);
        this.fieldArray = [];
        this.fieldGroup = this.add.group();
        for(var i = 0; i < 4; i++){
            this.fieldArray[i] = [];
            for(var j = 0; j < 4; j++){
                var two = this.add.sprite(this.tileDestinationX(j), this.tileDestinationY(i), "tiles");
                two.alpha = 0;
                two.visible = 0;
                this.fieldGroup.add(two);
                this.fieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: two,
                    canUpgrade: true
                }
            }
        }
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.canMove = false;
        this.addTwo();
        this.addTwo();
        this.input.on("pointerup", this.endSwipe, this);
        this.scoreText = this.add.text(0, 0, 'ALCOHOL : '+this.score+'G', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.scoreText.setStroke('#0000ff', 8);
        this.scoreText.depth = 9000;
		this.livesText = this.add.text(0, 48, 'STAMINA : '+this.lives+'%', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
        this.livesText.setStroke('#0000ff', 8);
        this.livesText.depth = 9000;      
    }
	
    endSwipe(e){
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)){
            var children = this.fieldGroup.getChildren();
            if(swipeNormal.x > 0.8) {
                for (var i = 0; i < children.length; i++){
                    children[i].depth = game.config.width - children[i].x;
                }
                this.handleMove(0, 1);
            }
            if(swipeNormal.x < -0.8) {
                for (var i = 0; i < children.length; i++){
                    children[i].depth = children[i].x;
                }
                this.handleMove(0, -1);
            }
            if(swipeNormal.y > 0.8) {
                for (var i = 0; i < children.length; i++){
                    children[i].depth = game.config.height - children[i].y;
                }
                this.handleMove(1, 0);
            }
            if(swipeNormal.y < -0.8) {
                for (var i = 0; i < children.length; i++){
                    children[i].depth = children[i].y;
                }
                this.handleMove(-1, 0);
            }
        }
    }
	
    addTwo(){
        var emptyTiles = [];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(this.fieldArray[i][j].tileValue == 0){
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
        this.fieldArray[chosenTile.row][chosenTile.col].tileValue = 1;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
        this.tweens.add({
            targets: [this.fieldArray[chosenTile.row][chosenTile.col].tileSprite],
            alpha: 1,
            duration: this.gameOptions.tweenSpeed,
            onComplete: function(tween){
                tween.parent.scene.canMove = true;
            },
        });
	}
	
    handleKey(e){
        if(this.canMove){
            var children = this.fieldGroup.getChildren();
            switch(e.code){
                case "KeyA":
                case "ArrowLeft":
                    for (var i = 0; i < children.length; i++){
                        children[i].depth = children[i].x;
                    }
                    this.handleMove(0, -1);
                    break;
                case "KeyD":
                case "ArrowRight":
                    for (var i = 0; i < children.length; i++){
                        children[i].depth = game.config.width - children[i].x;
                    }
                    this.handleMove(0, 1);
                    break;
                case "KeyW":
                case "ArrowUp":
                    for (var i = 0; i < children.length; i++){
                        children[i].depth = children[i].y;
                    }
                    this.handleMove(-1, 0);
                    break;
                case "KeyS":
                case "ArrowDown":
                    for (var i = 0; i < children.length; i++){
                        children[i].depth = game.config.height - children[i].y;
                    }
                    this.handleMove(1, 0);
                    break;
            }
            this.lives -= 2;
            this.livesText.setText('STAMINA : '+ this.lives+'%');
            if(this.lives==0)
                this.gameOver();                 
        }
    }
	
    handleMove(deltaRow, deltaCol){
        this.canMove = false;
        var somethingMoved = false;
        this.movingTiles = 0;
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                var colToWatch = deltaCol == 1 ? (4 - 1) - j : j;
                var rowToWatch = deltaRow == 1 ? (4 - 1) - i : i;
                var tileValue = this.fieldArray[rowToWatch][colToWatch].tileValue;
                if(tileValue != 0){
                    var colSteps = deltaCol;
                    var rowSteps = deltaRow;
                    while(this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == 0){
                        colSteps += deltaCol;
                        rowSteps += deltaRow;
                    }
                    if(this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) && (this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == tileValue) && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade && this.fieldArray[rowToWatch][colToWatch].canUpgrade){
                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue ++;
                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade = false;
                        this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                        this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), true);
                        somethingMoved = true;
                    }
                    else{
                        colSteps = colSteps - deltaCol;
                        rowSteps = rowSteps - deltaRow;
                        if(colSteps != 0 || rowSteps != 0){
                            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue = tileValue;
                            this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                            this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), false);
                            somethingMoved = true;
                        }
                    }
                }
            }
        }
        if(!somethingMoved){
            this.canMove = true;
        }
    }
	
    moveTile(tile, row, col, distance, changeNumber){
        this.movingTiles ++;   
        this.tweens.add({
            targets: [tile.tileSprite],
            x: this.tileDestinationX(col),
            y: this.tileDestinationY(row),
            duration: this.gameOptions.tweenSpeed * distance,
            onComplete: function(tween){
                tween.parent.scene.movingTiles --;
                if(changeNumber){
                    tween.parent.scene.transformTile(tile, row, col);
                }
                if(tween.parent.scene.movingTiles == 0){
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    }
	
    transformTile(tile, row, col){
        this.movingTiles ++;
        tile.tileSprite.setFrame(this.fieldArray[row][col].tileValue - 1);
        this.score = this.score + this.fieldArray[row][col].tileValue * 2;
        this.scoreText.setText('ALCOHOL : '+ this.score+'G');
        this.tweens.add({
            targets: [tile.tileSprite],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: this.gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function(tween){
                tween.parent.scene.movingTiles --;
                if(tween.parent.scene.movingTiles == 0){
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    }
	
    resetTiles(){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                this.fieldArray[i][j].canUpgrade = true;
                this.fieldArray[i][j].tileSprite.x = this.tileDestinationX(j);
                this.fieldArray[i][j].tileSprite.y = this.tileDestinationY(i);
                if(this.fieldArray[i][j].tileValue > 0){
                    this.fieldArray[i][j].tileSprite.alpha = 1;
                    this.fieldArray[i][j].tileSprite.visible = true;
                    this.fieldArray[i][j].tileSprite.setFrame(this.fieldArray[i][j].tileValue - 1);
                }
                else{
                    this.fieldArray[i][j].tileSprite.alpha = 0;
                    this.fieldArray[i][j].tileSprite.visible = false;
                }
            }
        }
    }
	
    isInsideBoard(row, col){
        return (row >= 0) && (col >= 0) && (row < 4) && (col < 4);
    }
	
    tileDestinationX(pos){
        return 460 + (pos * (this.gameOptions.tileSize + this.gameOptions.tileSpacing) + this.gameOptions.tileSize / 2 + this.gameOptions.tileSpacing)
    }

    tileDestinationY(pos){
        return pos * (this.gameOptions.tileSize + this.gameOptions.tileSpacing) + this.gameOptions.tileSize / 2 + this.gameOptions.tileSpacing
    }   

    gameOver() {
		// flag to set player is dead
		this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		// restart game
		this.time.delayedCall(500, function() {
			this.scene.switch('CrateScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}   
}