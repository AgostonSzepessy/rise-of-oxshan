/* jshint devel: true */
/* jshint browser: true */

// GameState - base class for each state of the game (menu, playing, etc)
function GameState() {'use strict'; }

GameState.prototype.update = function() {'use strict'; };
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
	
	clear('#ffffff');
	this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
	this.camera.setHeight(canvasHeight);
	this.camera.setWidth(canvasWidth);
	
	var that = this;
	
	this.tileMap = new TileMap();
	this.player = new Player();
	
	this.tileMap = new TileMap();
	
	this.tileMap.loadFile('/rise-of-oxshan/res/maps/level-1.json', function() {
		that.continueLoadingLevel();
	});
	
	
}


// MenuState - the main menu
MenuState.prototype = new GameState();

MenuState.prototype.update = function () {
    'use strict';
    
	this.handleInput();
};

MenuState.prototype.draw = function () {
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
	
	if((Key.isKeyPressed(Key.SPACE) || Key.isKeyPressed(Key.ENTER)) 
	   && this.selectedOption === this.PLAY) {
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
	
	console.log('setup player');
	this.player.setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height * 
						  this.tileMap.mapLayers[0].tileHeight);
	this.player.setPosition(this.tileMap.getLayer('player').objects[0].positionX,
							this.tileMap.getLayer('player').objects[0].positionY);
//							704);
	console.log(this.tileMap.getLayer('player').objects[0].positionY);
	console.log(this.camera.positionY);
	
//	console.log(this.tileMap.mapLayers[0].height * 
//							this.tileMap.mapLayers[0].tileHeight);
//	console.log(this.tileMap.mapLayers[0].height);
	
};

PlayState.prototype.update = function () {
    'use strict';
	
    if (Key.isKeyPressed(Key.SPACE)) {
        Game.gsm.changeState(new MenuState());
    }
	
	if(Game.levelLoaded) {
		this.player.update(this.camera);
		this.camera.checkBounds();
	}
	
};

PlayState.prototype.draw = function () {
    'use strict';
    clear('#655541');
	this.tileMap.draw(this.camera);
	this.player.draw(this.camera);
};


window.onload = function() {
	var sources = {
		grey_dot: '/rise-of-oxshan/res/grey_dot.png',
		menu_text: '/rise-of-oxshan/res/menu-text.png',
		player: '/rise-of-oxshan/res/player.png'
	};
	
	loadImages(sources, startGame);
};

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
    Game.lastTick = window.performance.now();
    Game.tickLength = 1000 / FPS;
    Game.lastRender = Game.lastTick;
	Game.res = new ResourceManager();
	Game.levelLoaded = false;
	Game.time = 0;
	Game.numFrames = 0;

    window.addEventListener('keyup', function (event) { Key.onKeyUp(event); }, false);
    window.addEventListener('keydown', function (event) { Key.onKeyDown(event); }, false);
}

// start the game
function startGame(images) {
    'use strict';
	
    function main(tFrame) {
        Game.stopMain = window.requestAnimationFrame(main);
        var nextTick = Game.lastTick + Game.tickLength,
        numTicks = 0;

        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - Game.lastTick;
            numTicks = Math.floor(timeSinceTick / Game.tickLength);
        }

        Game.update(numTicks);
        Game.draw();
        Game.lastRender = tFrame;
    }

    setInitialState();
	storeImages(images);
	
    Game.gsm.pushState(new MenuState());
    main(window.performance.now());
}