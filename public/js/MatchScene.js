class MatchScene extends Phaser.Scene {
	constructor() {
		super({
            key: 'MatchScene'            
        });
        this.fieldSize = 7;
        this.orbColors = 6;
        this.orbSize = 100;
        this.swapSpeed = 200;
        this.fallSpeed = 200;
        this.destroySpeed = 200;
        this.fastFall = true;
        this.gameArray = [];
        this.removeMap = [];
        this.orbGroup;
        this.selectedOrb;
        this.canPick = true;
		this.score = 0;
		this.isPlayerAlive = true;
		this.scoreText;
		this.livesText;
        this.lives = 100; 
        this.music;
        this.distance = 0;         
    }
    
	preload(){
          this.load.spritesheet("orbs", "assets/orbs.png",{
			frameWidth: this.orbSize,
			frameHeight: this.orbSize
        });
        this.load.image('backgroundRobata', 'assets/robata.jpg');	 
        this.load.audio('music06', ['assets/06.mp3']); 
        this.load.audio('cash', ['assets/cash.wav']);      
    }
    
	create(){
        this.music = this.sound.add('music06');
        this.music.play();
        this.sfx = this.sound.add('cash');
        this.bg = this.add.sprite(0, 0, 'backgroundRobata');
        this.bg.setOrigin(0, 0);        
        this.drawField();
        this.canPick = true;
        this.input.on("pointerdown", function(pointer){this.orbSelect(pointer)}, this);
        this.input.on("pointerup", function(pointer){this.orbDeselect(pointer)}, this);
        this.scoreText = this.add.text(720, 0, 'MONEY : $'+this.score, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
        this.scoreText.setStroke('#0000ff', 8);
        this.scoreText.depth = 9000;
        this.livesText = this.add.text(720, 48, 'STAMINA : 60', { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
        this.livesText.setStroke('#0000ff', 8);
        this.livesText.depth = 9000;      
	}	

    drawField(){
        this.orbGroup = this.add.group();
        for(var i = 0; i < this.fieldSize; i ++){
            this.gameArray[i] = [];
            for(var j = 0; j < this.fieldSize; j ++){
                var orb = this.add.sprite(this.orbSize * j + this.orbSize / 2, this.orbSize * i + this.orbSize / 2, "orbs");
                this.orbGroup.add(orb);
                do{
                        var randomColor = Phaser.Math.Between(0, this.orbColors - 1);  
                        orb.setFrame(randomColor);
                        this.gameArray[i][j] = {
                            orbColor: randomColor,
                            orbSprite: orb
                        }
                } while(this.isMatch(i, j));  
            }
        }
        this.selectedOrb = null;
    }

    orbSelect(e){
        if(this.canPick){ 
            if(this.lives==0)
                this.gameOver(true);  
            else{             
                console.log(e.x+" "+e.y);
                var row = Math.floor(e.y / this.orbSize);
                var col = Math.floor(e.x / this.orbSize);
                console.log(row+" "+col);
                var pickedOrb = this.gemAt(row, col)
                if(pickedOrb != -1){
                    if(this.selectedOrb == null){
                            pickedOrb.orbSprite.setScale(1.2);
                            //pickedOrb.orbSprite.bringToTop();
                            this.selectedOrb = pickedOrb;
                            //this.input.addMoveCallback(this.orbMove);
                    }
                    else{
                            if(this.areTheSame(pickedOrb, this.selectedOrb)){
                                this.selectedOrb.orbSprite.setScale(1);
                                this.selectedOrb = null;
                            }
                            else{     
                                if(this.areNext(pickedOrb, this.selectedOrb)){
                                    this.selectedOrb.orbSprite.setScale(1);
                                    this.swapOrbs(this.selectedOrb, pickedOrb, true);                  
                                }
                                else{
                                    this.selectedOrb.orbSprite.setScale(1);
                                    pickedOrb.orbSprite.setScale(1.2); 
                                    this.selectedOrb = pickedOrb;  
                                    //this.input.addMoveCallback(this.orbMove);      
                                }
                            }
                    } 
                }    
            }
        }
    }

    orbDeselect(e){
        //this.input.deleteMoveCallback(this.orbMove);     
    }

    orbMove(event, pX, pY){
        if(event.id == 0){
            var distX = pX - this.selectedOrb.orbSprite.x;
            var distY = pY - this.selectedOrb.orbSprite.y;
            var deltaRow = 0;
            var deltaCol = 0;
            if(Math.abs(distX) > this.orbSize / 2){
                if(distX > 0){
                        deltaCol = 1;
                }
                else{
                        deltaCol = -1;
                }
            }
            else{
                if(Math.abs(distY) > this.orbSize / 2){
                        if(distY > 0){
                            deltaRow = 1;
                        }
                        else{
                            deltaRow = -1;
                        }
                }
            }
            if(deltaRow + deltaCol != 0){
                var pickedOrb = this.gemAt(this.getOrbRow(this.selectedOrb) + deltaRow, this.getOrbCol(this.selectedOrb) + deltaCol); 
                if(pickedOrb != -1){
                        this.selectedOrb.orbSprite.setScale(1);
                        this.swapOrbs(this.selectedOrb, pickedOrb, true);
                        //this.input.deleteMoveCallback(this.orbMove);
                }    
            }
        }
    }

    swapOrbs(orb1, orb2, swapBack){ 
        this.canPick = false;   
        var fromColor = orb1.orbColor;
        var fromSprite = orb1.orbSprite;
        var toColor = orb2.orbColor;
        var toSprite = orb2.orbSprite;
        this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbColor = toColor;
        this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite = toSprite;
        this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbColor = fromColor;
        this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite = fromSprite;
 

        this.tweens.add({
            targets: [this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite],
            x: this.getOrbCol(orb1) * this.orbSize + this.orbSize / 2,
            y: this.getOrbRow(orb1) * this.orbSize + this.orbSize / 2,
            duration: this.swapSpeed,
            callbackScope: this,
            onComplete: function(tween){
            }
        });

        this.tweens.add({
            targets: [this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite],
            x: this.getOrbCol(orb2) * this.orbSize + this.orbSize / 2,
            y: this.getOrbRow(orb2) * this.orbSize + this.orbSize / 2,
            duration: this.swapSpeed,
            callbackScope: this,
            onComplete: function(tween){
                if(!this.matchInBoard() && swapBack){
                    this.swapOrbs(orb1, orb2, false);          
                }
                else{ 
                    if(this.matchInBoard()){
                            this.handleMatches();
                    }
                    else{        
                            this.canPick = true;
                            this.selectedOrb = null;
                    }
                }    
            }
        });


        /*var orb1Tween = this.add.tween(this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite).to({
            x: this.getOrbCol(orb1) * this.orbSize + this.orbSize / 2,
            y: this.getOrbRow(orb1) * this.orbSize + this.orbSize / 2
        }, this.swapSpeed, "Linear", true);*/     


        /*var orb2Tween = this.add.tween(this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite).to({
            x: this.getOrbCol(orb2) * this.orbSize + this.orbSize / 2,
            y: this.getOrbRow(orb2) * this.orbSize + this.orbSize / 2
        }, this.swapSpeed, "Linear", true);


        orb2Tween.onComplete.add(function(){
            if(!this.matchInBoard() && swapBack){
                this.swapOrbs(orb1, orb2, false);          
            }
            else{ 
                if(this.matchInBoard()){
                        this.handleMatches();
                }
                else{        
                        this.canPick = true;
                        this.selectedOrb = null;
                }
            }    
        });*/
    }

    areNext(orb1, orb2){
        return Math.abs(this.getOrbRow(orb1) - this.getOrbRow(orb2)) + Math.abs(this.getOrbCol(orb1) - this.getOrbCol(orb2)) == 1;
    }

    areTheSame(orb1, orb2){
        return this.getOrbRow(orb1) == this.getOrbRow(orb2) && this.getOrbCol(orb1) == this.getOrbCol(orb2);
    }

    gemAt(row, col){
        if(row < 0 || row >= this.fieldSize || col < 0 || col >= this.fieldSize){
            return -1;
        }
        return this.gameArray[row][col];
    }

    getOrbRow(orb){
        return Math.floor(orb.orbSprite.y / this.orbSize);
    }

    getOrbCol(orb){
        return Math.floor(orb.orbSprite.x / this.orbSize);
    }

    isHorizontalMatch(row, col){
        return this.gemAt(row, col).orbColor == this.gemAt(row, col - 1).orbColor && this.gemAt(row, col).orbColor == this.gemAt(row, col - 2).orbColor; 
    }

    isVerticalMatch(row, col){
        return this.gemAt(row, col).orbColor == this.gemAt(row - 1, col).orbColor && this.gemAt(row, col).orbColor == this.gemAt(row - 2, col).orbColor; 
    }

    isMatch(row, col){
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }

    matchInBoard(){
        for(var i = 0; i < this.fieldSize; i++){
            for(var j = 0; j < this.fieldSize; j++){
                if(this.isMatch(i, j)){
                        return true;
                }
            }
        }
        return false;
    }

    handleMatches(){   
        this.removeMap = []; 
        for(var i = 0; i < this.fieldSize; i++){
            this.removeMap[i] = [];
            for(var j = 0; j < this.fieldSize; j++){
                this.removeMap[i].push(0);
            }
        }
        this.handleHorizontalMatches();
        this.handleVerticalMatches();
        this.destroyOrbs();
    }

    handleVerticalMatches(){
        for(var i = 0; i < this.fieldSize; i++){
            var colorStreak = 1;
            var currentColor = -1;
            var startStreak = 0;
            for(var j = 0; j < this.fieldSize; j++){ 
                if(this.gemAt(j, i).orbColor == currentColor){
                        colorStreak ++;
                }              
                if(this.gemAt(j, i).orbColor != currentColor || j == this.fieldSize - 1){
                        if(colorStreak >= 3){
                            console.log("VERTICAL :: Length = "+colorStreak + " :: Start = ("+startStreak+","+i+") :: Color = "+currentColor);
                            this.sfx.play();
                            for(var k = 0; k < colorStreak; k++){
                                this.removeMap[startStreak + k][i] ++;
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this.gemAt(j, i).orbColor;
                }
            }
        }
    }

    handleHorizontalMatches(){
        for(var i = 0; i < this.fieldSize; i++){
            var colorStreak = 1;
            var currentColor = -1;
            var startStreak = 0;
            for(var j = 0; j < this.fieldSize; j++){ 
                if(this.gemAt(i, j).orbColor == currentColor){
                        colorStreak ++;
                }              
                if(this.gemAt(i, j).orbColor != currentColor || j == this.fieldSize - 1){
                        if(colorStreak >= 3){
                            console.log("HORIZONTAL :: Length = "+colorStreak + " :: Start = ("+i+","+startStreak+") :: Color = "+currentColor);
                            this.sfx.play();
                            for(var k = 0; k < colorStreak; k++){
                                this.removeMap[i][startStreak + k] ++;
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this.gemAt(i, j).orbColor;
                }
            }
        }
    }

    destroyOrbs(){
        var destroyed = 0;
        for(var i = 0; i < this.fieldSize; i++){
            for(var j = 0; j < this.fieldSize; j++){
                if(this.removeMap[i][j]>0){

                        this.tweens.add({
                            targets: [this.gameArray[i][j].orbSprite],
                            alpha: 0,
                            duration: this.destroySpeed,
                            callbackScope: this,
                            onComplete: function(tween){
                                tween.targets[0].destroy();
                                destroyed --;
                                if(destroyed == 0){
                                    this.makeOrbsFall();
                                    if(this.fastFall){
                                        this.replenishField();
                                    }    
                                }
                            }
                        });
                        destroyed ++;
                        this.score = this.score + 1;
                        this.scoreText.setText('MONEY : $'+this.score);
                        this.gameArray[i][j] = null;  

                        /*var destroyTween = this.add.tween(this.gameArray[i][j].orbSprite).to({
                            alpha: 0
                        }, this.destroySpeed, Phaser.Easing.Linear.None, true);
                        destroyed ++;
                        destroyTween.onComplete.add(function(orb){
                            orb.destroy();
                            destroyed --;
                            if(destroyed == 0){
                                this.makeOrbsFall();
                                if(this.fastFall){
                                    this.replenishField();
                                }    
                            }
                        });
                        this.gameArray[i][j] = null;*/  
                }
            }
        }
    }

    makeOrbsFall(){
        var fallen = 0;
        var restart = false;
        for(var i = this.fieldSize - 2; i >= 0; i--){
            for(var j = 0; j < this.fieldSize; j++){
                if(this.gameArray[i][j] != null){
                        var fallTiles = this.holesBelow(i, j);
                        if(fallTiles > 0){
                            if(!this.fastFall && fallTiles > 1){
                                fallTiles = 1;
                                restart = true;                             
                            }


                            /*var orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to({
                                y: this.gameArray[i][j].orbSprite.y + fallTiles * this.orbSize
                            }, this.fallSpeed, Phaser.Easing.Linear.None, true); 
                            fallen ++;
                            orb2Tween.onComplete.add(function(){
                                fallen --;
                                if(fallen == 0){
                                    if(restart){
                                            this.makeOrbsFall();
                                    }
                                    else{
                                            if(!this.fastFall){
                                                this.replenishField();
                                            }
                                    }      
                                }
                            })*/

                            this.tweens.add({
                                targets: [this.gameArray[i][j].orbSprite],
                                y: this.gameArray[i][j].orbSprite.y + fallTiles * this.orbSize,
                                duration: this.fallSpeed,
                                callbackScope: this,
                                onComplete: function(tween){
                                    fallen --;
                                    if(fallen == 0){
                                        if(restart){
                                                this.makeOrbsFall();
                                        }
                                        else{
                                                if(!this.fastFall){
                                                    this.replenishField();
                                                }
                                        }  
                                    }    
                                }
                            });
                            fallen ++;


                            this.gameArray[i + fallTiles][j] = {
                                orbSprite: this.gameArray[i][j].orbSprite,
                                orbColor: this.gameArray[i][j].orbColor     
                            }
                            this.gameArray[i][j] = null;
                        }
                }
            }
        }
        if(fallen == 0){
            this.replenishField();     
        }
    }

    replenishField(){
        var replenished = 0;
        var restart = false;
        for(var j = 0; j < this.fieldSize; j++){
            var emptySpots = this.holesInCol(j);
            if(emptySpots > 0){
                if(!this.fastFall && emptySpots > 1){
                        emptySpots = 1;
                        restart = true;   
                }
                for(var i = 0; i < emptySpots; i++){
                        var orb = this.add.sprite(this.orbSize * j + this.orbSize / 2, - (this.orbSize * (emptySpots - 1 - i) + this.orbSize / 2), "orbs");
                        //orb.anchor.set(0.5);
                        this.orbGroup.add(orb);
                        var randomColor = Phaser.Math.Between(0, this.orbColors - 1);  
                        orb.setFrame(randomColor);
                        this.gameArray[i][j] = {
                            orbColor: randomColor,
                            orbSprite: orb
                        }

                        this.tweens.add({
                            targets: [this.gameArray[i][j].orbSprite],
                            y: this.orbSize * i + this.orbSize / 2,
                            duration: this.fallSpeed,
                            callbackScope: this,
                            onComplete: function(tween){
                                replenished --;
                                if(replenished == 0){
                                    if(restart){
                                        this.makeOrbsFall();
                                    }
                                    else{
                                        if(this.matchInBoard()){
                                            this.time.delayedCall(250, this.handleMatches());
                                        }
                                        else{
                                                this.canPick = true;
                                                this.selectedOrb = null;
                                        }  
                                    }
                                }
                            }
                        });
                        replenished ++;

                        /*var orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to({
                            y: this.orbSize * i + this.orbSize / 2
                        }, this.fallSpeed, Phaser.Easing.Linear.None, true);
                        replenished ++;  
                        orb2Tween.onComplete.add(function(){
                            replenished --;
                            if(replenished == 0){
                                if(restart){
                                    this.makeOrbsFall();
                                }
                                else{
                                    if(this.matchInBoard()){
                                            this.time.events.add(250, this.handleMatches);
                                    }
                                    else{
                                            this.canPick = true;
                                            this.selectedOrb = null;
                                    }  
                                }
                            }
                        })*/ 
                }
            }
        }
    }

    holesBelow(row, col){
        var result = 0;
        for(var i = row + 1; i < this.fieldSize; i++){
            if(this.gameArray[i][col] == null){
                result ++;          
            }
        }
        return result;
    }

    holesInCol(col){
        var result = 0;
        for(var i = 0; i < this.fieldSize; i++){
            if(this.gameArray[i][col] == null){
                result ++;          
            }
        }
        return result;     
    }

    gameOver(bVictory) {
		// flag to set player is dead
		//this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		/*this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
        }, [], this);*/
        victories[currentScene] = bVictory;
        score[currentScene] = this.score*100;
        currentScene += 1;
        let insScene = this.scene.get('InstructionsScene');
        this.scene.setVisible(true, insScene);  
        bInstructions = true;
        this.music.stop();
        insScene.nextScene();

		this.time.delayedCall(transitionTime, function() {
            this.music.stop();
            this.scene.setVisible(false, insScene);
            this.scene.switch(order[currentScene]);
		}, [], this);

		// reset camera effects
		/*this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);*/
    } 
    
    update(time, delta) {
		if (!this.isPlayerAlive) {
			return;
		}
		this.distance = this.distance + delta;
        if(this.distance > 60000)
        {
            this.isPlayerAlive = false;
            this.gameOver(true);
        }
		this.livesText.setText('STAMINA : '+(60-Math.ceil((this.distance)/1000)));			
	}   

}