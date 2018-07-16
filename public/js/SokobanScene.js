class SokobanScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'SokobanScene'
		});	
		this.current = Phaser.NONE;
		this.EMPTY = 0;
		this.WALL = 1;
		this.SPOT = 2;
		this.CRATE = 3;
		this.PLAYERSPOT = 4;	
		this.level = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
			[1,1,4,2,1,3,0,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		this.gameOptions = {
			tileSize: 80,
			gameWidth: 320,
			gameHeight: 320,
			gameSpeed: 100
		}
        this.livesText;    
		this.lives = 3; 				
	}

	preload() {
		console.log("CAR");		
        this.load.spritesheet("tilesSokoban", "assets/sokotiles.png", {
            frameWidth: this.gameOptions.tileSize,
            frameHeight: this.gameOptions.tileSize
        });		
	}

	create() {
        this.crates = [];
        this.drawLevel();
        this.input.on("pointerup", this.endSwipe, this);	
		this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);	
		this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);		
		this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);		
		this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		this.bLeftKeyDown = false;
		this.bRightKeyDown = false;
		this.bUpKeyDown = false;
		this.bDownKeyDown = false;
		this.bRKeyDown = false;
		this.livesText = this.add.text(0, 48, 'TRIES : '+this.lives, { fontFamily: "Nintendo NES Font", fontSize: 32, color: "#ff0000" });
		this.livesText.setStroke('#0000ff', 8);				
	}
	
    drawLevel(){
        this.crates.length = 0;
        for(var i = 0; i < this.level.length; i++){
            this.crates[i] = [];
            for(var j = 0; j < this.level[i].length; j++){
                this.crates[i][j] = null;
                switch(this.level[i][j]){
                    case this.PLAYERSPOT:
                    case this.PLAYERSPOT + this.SPOT:
                        this.player = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j]);
                        this.player.posX = j;
                        this.player.posY = i;
                        this.player.depth = 1
                        this.player.setOrigin(0);
                        var tile = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j] - this.PLAYERSPOT);
                        tile.setOrigin(0);
                        tile.depth = 0;
                        break;
                    case this.CRATE:
                    case this.CRATE + this.SPOT:
                        this.crates[i][j] = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j]);
                        this.crates[i][j].setOrigin(0);
                        this.crates[i][j].depth = 1
                        var tile = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j] - this.CRATE);
                        tile.setOrigin(0);
                        break;
                    default:
                        var tile = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j]);
                        tile.setOrigin(0);
                }
            }
        }
    }

	endSwipe(e) {
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if(swipeNormal.x > 0.8) {
                this.checkMove(1, 0);
            }
            if(swipeNormal.x < -0.8) {
                this.checkMove(-1, 0);
            }
            if(swipeNormal.y > 0.8) {
                this.checkMove(0, 1);
            }
            if(swipeNormal.y < -0.8) {
                this.checkMove(0, -1);
            }
        }
    }
	
    checkMove(deltaX, deltaY){
        if(this.isWalkable(this.player.posX + deltaX, this.player.posY + deltaY)){
            this.movePlayer(deltaX, deltaY);
            return;
        }
        if(this.isCrate(this.player.posX + deltaX, this.player.posY + deltaY)){
            if(this.isWalkable(this.player.posX + 2 * deltaX, this.player.posY + 2 * deltaY)){
                this.moveCrate(deltaX, deltaY);
                this.movePlayer(deltaX, deltaY);
                return;
            }
        }
    }
	
    isWalkable(posX, posY){
       return this.level[posY][posX] == this.EMPTY || this.level[posY][posX] == this.SPOT;
    }
	
    isCrate(posX, posY){
        return this.level[posY][posX] == this.CRATE || this.level[posY][posX] == this.CRATE + this.SPOT;
    }
	
    movePlayer(deltaX, deltaY){
        var playerTween = this.tweens.add({
            targets: this.player,
            x: this.player.x + deltaX * this.gameOptions.tileSize,
            y: this.player.y + deltaY * this.gameOptions.tileSize,
            duration: this.gameOptions.gameSpeed,
            onComplete: function(tween, target, player,level){
                player.setFrame(level[player.posY][player.posX]);
            },
            onCompleteParams: [this.player,this.level]
        });
        this.level[this.player.posY][this.player.posX] -= this.PLAYERSPOT;
        this.player.posX += deltaX;
        this.player.posY += deltaY;
        this.level[this.player.posY][this.player.posX] += this.PLAYERSPOT;
	}
	
	gameOver() {
		// flag to set player is dead
		//this.isPlayerAlive = false;

		// shake the camera
		this.cameras.main.shake(500);

		// fade camera
		this.time.delayedCall(250, function() {
			this.cameras.main.fade(250);
		}, [], this);

		// restart game
		this.time.delayedCall(500, function() {
			this.scene.switch('FrogerScene');
			//this.registry.set('restartScene', true);
		}, [], this);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);
	}		
	
    moveCrate(deltaX, deltaY){
	    var crateTween = this.tweens.add({
            targets: this.crates[this.player.posY + deltaY][this.player.posX + deltaX],
            x: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].x + deltaX * this.gameOptions.tileSize,
            y: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].y + deltaY * this.gameOptions.tileSize,
            duration: this.gameOptions.gameSpeed,
            onComplete: function(tween, target, crate, player,level){
                crate.setFrame(level[player.posY + deltaY][player.posX + deltaX]);
            },
            onCompleteParams: [this.crates[this.player.posY + deltaY][this.player.posX + deltaX], this.player, this.level]
        })
	    this.crates[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] = this.crates[this.player.posY + deltaY][this.player.posX + deltaX];
        this.crates[this.player.posY + deltaY][this.player.posX + deltaX] = null;
        this.level[this.player.posY + deltaY][this.player.posX + deltaX] -= this.CRATE;
        this.level[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] += this.CRATE;
		if(this.level[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] == (this.CRATE+this.SPOT))
			this.gameOver();
	}	
	
	reset()
	{
		this.cameras.main.shake(500);

		// reset camera effects
		this.time.delayedCall(600, function() {
			this.cameras.main.resetFX();
		}, [], this);		
		this.lives = this.lives - 1;
		this.livesText.setText('TRIES : '+this.lives)
		if(this.lives==0)
			this.gameOver();
		else
		{
			for(var i = 0; i < this.level.length; i++){
				for(var j = 0; j < this.level[i].length; j++){
					switch(this.level[i][j]){
						case this.CRATE:
						case this.CRATE + this.SPOT:
							this.crates[i][j].destroy();
							this.level[i][j] = 0;
							break;
					}
				}
			}

			this.level[4][5] = 3;
			for(var i = 0; i < this.level.length; i++){
				for(var j = 0; j < this.level[i].length; j++){
					switch(this.level[i][j]){
						case this.CRATE:
						case this.CRATE + this.SPOT:
							this.crates[i][j] = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j]);
							this.crates[i][j].setOrigin(0);
							this.crates[i][j].depth = 1
							var tile = this.add.sprite(this.gameOptions.tileSize * j, this.gameOptions.tileSize * i, "tilesSokoban", this.level[i][j] - this.CRATE);
							tile.setOrigin(0);
							break;
					}
				}
			}
		}	
	}

	update(time, delta) {
		
		
		if(!this.bRKeyDown)
		{
			if (this.resetKey.isDown) {
				this.reset();
				this.bRKeyDown = true;
			}
		}	
		else
		{
			if(this.resetKey.isUp)
			{ 
				this.bRKeyDown = false;
			}
		}		
	
		if (!this.bLeftKeyDown)
		{
			if(this.leftKey.isDown)
			{ 
				this.bLeftKeyDown = true;
				this.checkMove(-1, 0);
				console.log("LEFT");
			}			
		}
		else
		{
			if(this.leftKey.isUp)
			{ 
				this.bLeftKeyDown = false;
			}
		}
		
		
		
		if (!this.bRightKeyDown)
		{
			if(this.rightKey.isDown)
			{ 
				this.bRightKeyDown = true;
				this.checkMove(1, 0);
				console.log("RIGHT");
			}			
		}
		else
		{
			if(this.rightKey.isUp)
			{ 
				this.bRightKeyDown = false;
			}
		}
		
		
		if (!this.bUpKeyDown)
		{
			if(this.upKey.isDown)
			{ 
				this.bUpKeyDown = true;
				this.checkMove(0, -1);
				console.log("UP");
			}			
		}
		else
		{
			if(this.upKey.isUp)
			{ 
				this.bUpKeyDown = false;
			}
		}	


		if (!this.bDownKeyDown)
		{
			if(this.downKey.isDown)
			{ 
				this.bDownKeyDown = true;
				this.checkMove(0, 1);
				console.log("DOWN");
			}			
		}
		else
		{
			if(this.downKey.isUp)
			{ 
				this.bDownKeyDown = false;
			}
		}		
	}
}