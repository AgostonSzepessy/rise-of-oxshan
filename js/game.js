// GameState - base class for each state of the game (menu, playing, etc)
function GameState() {'use strict'; }

GameState.prototype.update = function(dt) {'use strict'; };
GameState.prototype.draw = function() {'use strict'; };

// create game states
function MenuState() {
    'use strict';
    GameState.call();
	
	// menu options
	this.PLAY = 0;
	this.HELP = 1;
	this.numOptions = 2;
	
	this.selectedOption = 0;
	this.selectorImgHeight = 12;
	this.selectorImgWidth = 12;
	console.log(Game.res.getImage('grey_dot'));
	this.selectorImg = Game.res.getImage('grey_dot');
	
	this.textWidth = 40;
	this.textHeight = 21;
	this.menuTextImg = Game.res.getImage('menu_text');
}

function PlayState() {
    'use strict';
    GameState.call();
	
	clear('#7873fd');
	this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
	this.camera.setHeight(canvasHeight);
	this.camera.setWidth(canvasWidth);
		
	this.tileMap = new TileMap();
	this.player = new Player();
	
	this.levelPath = '/rise-of-oxshan/res/maps/level-';
	this.currentLevel = 1;
	this.loadNextLevel = false;
	this.finishedLoadingLevel = false;
	this.numLevels = 3;
	
	var that = this;
	
	this.tileMap.loadFile(this.levelPath + this.currentLevel + '.json', function() {
		that.continueLoadingLevel();
	});
	
	this.enemies = [];
	this.projectiles = [];
	
	this.mountains = new Background('mountains');
}


// MenuState - the main menu
MenuState.prototype = new GameState();

MenuState.prototype.update = function(dt) {
    'use strict';
    
	this.handleInput();
};

MenuState.prototype.draw = function() {
    'use strict';
	var i;
	
    clear('#51C6ED');
	
	ctx.beginPath();
    
	for(i = 0; i < 2; ++i) {
		ctx.drawImage(this.menuTextImg, i * this.textWidth, 0, this.textWidth, this.textHeight,
						canvasWidth / 2 - this.textWidth, canvasHeight / 2 + 30 * i, 
					  this.textWidth, this.textHeight);
		if(i === this.selectedOption) {
			ctx.drawImage(this.selectorImg, 0, 0, this.selectorImgWidth, this.selectorImgHeight,
						 canvasWidth / 2 - this.textWidth - this.selectorImgWidth, canvasHeight / 2 + 30 * i,
						 this.selectorImgWidth, this.selectorImgHeight);
		}
	}    
    
	ctx.closePath();
    
    
};

// Handles the input for this state and switches states based on it
MenuState.prototype.handleInput = function() {
	'use strict';
	if(Key.isKeyPressed(Key.S) || Key.isKeyPressed(Key.DOWN)) {
		this.selectedOption++;
		if(this.selectedOption >= this.numOptions) {
			this.selectedOption = 0;
		}
	}
	if(Key.isKeyPressed(Key.W) || Key.isKeyPressed(Key.UP)) {
		this.selectedOption--;
		if(this.selectedOption < 0) {
			this.selectedOption = this.numOptions - 1;
		}
	}
	
	if((Key.isKeyPressed(Key.SPACE) || Key.isKeyPressed(Key.ENTER)) &&
	   this.selectedOption === this.PLAY) {
        Game.gsm.changeState(new PlayState());
	}
};
	


// PlayState - the state where the player actually plays the game
PlayState.prototype = new GameState();

PlayState.prototype.continueLoadingLevel = function() {
	console.log('continue loading level');
	
	// setup camera bounds and position
	this.camera.setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height *
						 this.tileMap.mapLayers[0].tileHeight);
	this.camera.setPosition(0, this.tileMap.mapLayers[0].height * 
							this.tileMap.mapLayers[0].tileHeight - canvasHeight);
	
	this.player.setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height * 
						  this.tileMap.mapLayers[0].tileHeight);
	this.player.setPosition(this.tileMap.getObjectLayer('player').objects[0].positionX,
							this.tileMap.getObjectLayer('player').objects[0].positionY);
	this.player.setTileMap(this.tileMap);
	this.player.dead = false;
	this.player.outOfYBounds = false;
	
	var enemyLayer = this.tileMap.getObjectLayer('enemies');
	this.enemies.length = 0;
	for(var i = 0; i < enemyLayer.objects.length; ++i) {
		this.enemies[i] = new Wizard();
		this.enemies[i].positionX = enemyLayer.objects[i].positionX;
		this.enemies[i].positionY = enemyLayer.objects[i].positionY;
		this.enemies[i].setTileMap(this.tileMap);
		this.enemies[i].setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height * 
						  this.tileMap.mapLayers[0].tileHeight);
	}
	
	this.finishedLoadingLevel = true;
	
	this.projectiles.splice(0, this.projectiles.length);
	
	this.mountains.positionX = 0;
//	this.mountains.positionY = parseInt(this.tileMap.getObjectLayer('background').objects[0].positionY / 
//								this.tileMap.mapLayers[0].tileHeight) * this.tileMap.mapLayers[0].tileHeight - 
//								this.mountains.height;
    
    this.mountains.positionY = parseInt(this.tileMap.mapLayers[0].height * this.tileMap.mapLayers[0].tileHeight) - this.mountains.height;

};

PlayState.prototype.update = function(dt) {
		
	if(this.loadNextLevel) {
		if(++this.currentLevel <= this.numLevels) {
			console.log('loading next level: ' + this.currentLevel);
			this.tileMap = new TileMap();
			
			// back up player info
			var prevPlayer = this.player;
			this.player = new Player();
			this.player.health = prevPlayer.health;
			this.player.lives = prevPlayer.lives;
			
			// load next level
			var that = this;
			this.loadNextLevel = false;
			this.finishedLoadingLevel = false;
			this.tileMap.loadFile(this.levelPath + this.currentLevel + '.json', function() {
				that.continueLoadingLevel();
			});
		}
	}
	
	if(this.finishedLoadingLevel) {
		
		if(this.player.positionY + this.player.dy * dt + this.player.height >= 
		   this.player.yBounds) {
			this.player.health = 5;
		   this.player.lives--;
		   this.player.hit = false;
			this.continueLoadingLevel();
		}
		
		// player attacking: add a new fireball
		if(Key.isKeyPressed(Key.SPACE)) {
			this.player.attacking = true;
			this.projectiles.push(new Fireball());
			var index = this.projectiles.length - 1;
			this.projectiles[index].tileMap = this.tileMap;
			this.projectiles[index].positionX = this.player.positionX + 
				this.player.width;
			this.projectiles[index].positionY = this.player.positionY / 2;
			this.projectiles[index].setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height * 
						  this.tileMap.mapLayers[0].tileHeight);
			
			// set the fireball's direction in front of the player
			if(this.player.facingRight) {
				this.projectiles[index].setDirection(parseInt(this.player.positionX + this.player.width), 
													 parseInt(this.player.positionX + this.player.width + 1), 
													 parseInt(this.player.positionY + this.player.height / 4), 
													 parseInt(this.player.positionY + this.player.height / 4));
			}
			else {
				this.projectiles[index].setDirection(parseInt(this.player.positionX), 
													 parseInt(this.player.positionX - 1), 
													 parseInt(this.player.positionY + this.player.height / 4), 
													 parseInt(this.player.positionY + this.player.height / 4));
			}
		}
		
		
		if(Key.isKeyPressed(Key.W)) {
			this.player.setJumping(true);
		}

		if(Key.isDown(Key.D)) this.player.movingRight = true;
		else this.player.movingRight = false;

		if(Key.isDown(Key.A)) this.player.movingLeft = true;
		else this.player.movingLeft = false;

		if(Key.isDown(Key.SHIFT)) this.player.shiftPressed = true;
		else this.player.shiftPressed = false;

		this.player.update(dt, this.camera);
		this.camera.checkBounds();

		if(this.player.reachedLvlEndl) {
			this.loadNextLevel = true;
		}
		
		// update enemies
		for(var i = 0; i < this.enemies.length; ++i) {
			this.enemies[i].update(dt, this.player);
			
			if(this.enemies[i].readyToFire) {
				this.projectiles.push(new Lightning());
				this.projectiles[this.projectiles.length - 1].tileMap = this.tileMap;
				this.projectiles[this.projectiles.length - 1].positionX = this.enemies[i].positionX;
				this.projectiles[this.projectiles.length - 1].positionY = this.enemies[i].positionY;
				this.projectiles[this.projectiles.length - 1].setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height * 
						  this.tileMap.mapLayers[0].tileHeight);
				if(this.enemies[i].facingRight) {
					this.projectiles[this.projectiles.length - 1].setDirection(this.enemies[i].positionX + 
																			   this.enemies[i].width,
																			  this.player.positionX,
																			  this.enemies[i].positionY + 
																			   this.enemies[i].height / 4,
																			  this.player.positionY);
				}
				else {
					this.projectiles[this.projectiles.length - 1].setDirection(this.enemies[i].positionX,
																			  this.player.positionX,
																			  this.enemies[i].positionY + 
																			   this.enemies[i].height / 4,
																			  this.player.positionY);
				}
				
			}
		}
		// update projectiles	
		for(i = 0; i < this.projectiles.length; ++i) {
			this.projectiles[i].update(dt);
			if(this.projectiles[i].dead) {
				this.projectiles.splice(i, 1);
			}
		}
		
		// check for collision between projectiles and enemies
		for(i = 0; i < this.enemies.length; ++i) {
			for(var j = 0; j < this.projectiles.length; ++j) {
				if(this.projectiles[j] instanceof Lightning) {
					if(this.projectiles[j].intersects(this.player)) {
						this.player.hit = true;
						this.player.flashCounter = 0;
						this.player.flashTimer = 0;
					}
				}
				
				if(this.projectiles[j] instanceof Fireball) {
					if(this.projectiles[j].intersects(this.enemies[i])) {
						this.projectiles.splice(j, 1);
						this.enemies.splice(i, 1);
					}
				}
			}
		}
		
		// if player's life is depleted and the dying animation finished, load
		// new level
		if(this.player.dead) {
			if(this.player.currentAnimation == this.player.PLAYER_DYING_RIGHT || 
			   this.player.PLAYER_DYING_LEFT) { 
				   if(this.player.animations[this.player.currentAnimation].timesPlayed > 0) {
					   this.player.health = 5;
					   this.player.lives--;
					   this.player.hit = false;
					   this.continueLoadingLevel();
				}
			}
		}
	}
	
};

PlayState.prototype.draw = function() {
    'use strict';
    clear('#51C6ED');
    
	this.mountains.draw(this.camera);
	
	this.tileMap.draw(this.camera);
	
	for(var i = 0; i < this.enemies.length; ++i) {
		this.enemies[i].draw(this.camera);
	}
	
	for(i = 0; i < this.projectiles.length; ++i) {
		this.projectiles[i].draw(this.camera);
	}
	
	this.player.draw(this.camera);
	
//	ctx.beginPath();
//	ctx.fillText(Game.elapsed, 10, 20);
//	ctx.closePath();
};

// list of all the resources needed
window.onload = function() {
	var sources = {
		grey_dot: '/rise-of-oxshan/res/grey_dot.png',
		menu_text: '/rise-of-oxshan/res/menu-text.png',
		player: '/rise-of-oxshan/res/player-final.png',
		wizard: '/rise-of-oxshan/res/wizard-spritesheet.png',
		fireball: '/rise-of-oxshan/res/fireball.png',
		lightning: '/rise-of-oxshan/res/lightning.png',
		heart: '/rise-of-oxshan/res/heart.png',
		mountains: '/rise-of-oxshan/res/mountains.png'
	};
	
	loadImages(sources, startGame);
};

// loads all the resources needed
function loadImages(imgSources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	
	for(var src in imgSources) {
		numImages++;
	}
	
	for(src in imgSources) {
		images[src] = new Image();
		images[src].src = imgSources[src];
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
				console.log('images loaded');
				callback(images);
			}
		};
	}
}

function storeImages(images) {
	for(var src in images) {
		console.log(images[src]);
		Game.res.addImage(src, images[src]);
	}
}

function setInitialState() {
    'use strict';
    Game.gsm = new GameStateManager();
	Game.res = new ResourceManager();
	Game.time = 0;
	Game.elapsed = 0;
	Game.totalFps = 0;
	Game.startTime = window.performance.now();
	Game.elapsedTime = 0;
	Game.numFrames = 0;
	Game.then = window.performance.now();

    window.addEventListener('keyup', function (event) { Key.onKeyUp(event); }, false);
    window.addEventListener('keydown', function (event) { Key.onKeyDown(event); }, false);
}

// start the game
function startGame(images) {
    'use strict';
	var time;
	
    function main(tFrame) {
		window.requestAnimationFrame(main);
		var now = window.performance.now();
		var dt = now - (time || now);
		Game.elapsed = 1 / dt * 1000;
		Game.totalFps += Game.elapsed;
		Game.numFrames++;
		Game.elapsedTime = now - Game.startTime;
		
		if(Game.elapsedTime > 1000) {
			Game.startTime = window.performance.now();
		}
		
		time = now;

        Game.update(dt);
        Game.draw();
    }

    setInitialState();
	storeImages(images);
	
    Game.gsm.pushState(new MenuState());
    main(window.performance.now());
}