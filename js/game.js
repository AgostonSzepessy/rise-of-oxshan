/* jshint devel: true */
/* jshint browser: true */

var c = document.getElementById('c');
var ctx = c.getContext('2d');
var FPS = 60;

// dimensions of canvas (16:9)
var canvasWidth = 1024;
var canvasHeight = 576;

c.width = canvasWidth;
c.height = canvasHeight;

var clear = function(strColor) {
    'use strict';
    ctx.fillStyle = strColor;
    // clear the whole surface
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.closePath();
    ctx.fill();
};

// Creates a numeric hash of a string
// taken from
//http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
var hashString = function(string) {
	'use strict';
	var hash = 0;
	if(string.length === 0) {
		return hash;
	}
	for(var i = 0; i < string.length; ++i) {
		var char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		// convert to 32-bit integer
		hash &= hash;
	}
	
	return hash;
};

// GameStateManager - manages the game states. Uses a stack to do this.
function GameStateManager() {
    'use strict';
    this.states = [];
	this.tempState = null;
	this.changingState = false;
	this.poppingState = false;
	this.pushingState = false;
}

// Adds a state to the stack.
GameStateManager.prototype.pushState = function(state) {
    'use strict';
	this.tempState = state;
	this.pushingState = true;
};

// Removes the state at the top of the stack.
GameStateManager.prototype.popState = function() {
    'use strict';
	this.poppingState = true;
};

GameStateManager.prototype.changeState = function(state) {
	this.changingState = true;
	this.tempState = state;
};

// Updates the current state.
GameStateManager.prototype.update = function() {
    'use strict';
	
	if(this.changingState) {
		this.changingState = false;
		this.states.pop();
		this.states.push(this.tempState);
	}
	
	if(this.pushingState) {
		this.pushingState = false;
		this.states.push(this.tempState);
	}
	
	if(this.poppingState) {
		this.poppingState = false;
		this.states.pop();
	}
	
    this.states[this.states.length - 1].update();
};

// Draws the current state
GameStateManager.prototype.draw = function() {
    'use strict';
    this.states[this.states.length - 1].draw();
};

// Key - manages keyboard inputs
var Key = {
    pressed: [],
    prevKeys: [],

    // WASD
    UP: 38,
    LEFT: 37,
    DOWN: 40,
    RIGHT: 39,
    SPACE: 32,
	ENTER: 13,
	W: 87,
	A: 65,
	S: 83,
	D: 68,

	/// Returns true as long as the key is held down(fires continously).
    isDown: function(keyCode) {
        'use strict';
        return this.pressed[keyCode];
    },

    onKeyDown: function(event) {
        'use strict';
        this.pressed[event.keyCode] = true;
    },

    onKeyUp: function(event) {
        'use strict';
        this.pressed[event.keyCode] = false;
    },
    
	/// Backs up the key states
    backupKeys: function() {
        'use strict';
		var i;
        for (i = 0; i < this.pressed.length; ++i) {
			this.prevKeys[i] = this.pressed[i];
		}
    },
	
	/// Allows the keyboard to fire once instead of firing continously.
	isKeyPressed: function(keyCode) {
		'use strict';
		return !this.prevKeys[keyCode] && this.pressed[keyCode];
	}
};

function Resource(resId, res) {
	'use strict';
	this.id = hashString(resId);
	this.resource = res;
}

function ResourceManager() {
	'use strict';
	this.images = [];
}

ResourceManager.prototype.addImage = function(key, resPath) {
	var res = new Image();
	res.src = resPath;
	this.images.push(new Resource(key, res));
};

ResourceManager.prototype.getImage = function(key) {
	var hashedKey = hashString(key);
	for(var i = 0; i < this.images.length; ++i) {
		
		if(hashedKey === this.images[i].id) {
			return this.images[i].resource;
		}
	}
};


var Game = { };

Game.update = function(numTicks) {
    'use strict';
    var i;
    for (i = 0; i < numTicks; ++i) {
        Game.gsm.update();
		Key.backupKeys();
    }
};

Game.draw = function() {
    'use strict';
    Game.gsm.draw();
};

function setInitialState() {
    'use strict';
    Game.gsm = new GameStateManager();
    Game.lastTick = window.performance.now();
    Game.tickLength = 1000 / FPS;
    Game.lastRender = Game.lastTick;
	Game.res = new ResourceManager();
	Game.levelLoaded = false;

    window.addEventListener('keyup', function (event) { Key.onKeyUp(event); }, false);
    window.addEventListener('keydown', function (event) { Key.onKeyDown(event); }, false);
}

// The camera that follows the player around. It helps draw objects in the
// proper place. It's origin is in the upper left corner.
function Camera(camX, camY, camWidth, camHeight) {
	this.positionX = camX;
	this.positionY = camY;
	this.xBounds = 0;
	this.yBounds = 0;
	this.width = camWidth;
	this.height = camHeight;
}
// Set the properties of the camera such as position, width & height,
// and boundaries.
// camX - starting x coordinate
// camY - starting y coordinate
// camWidth - the width of the camera viewport
// camHeight - the height of the camera viewport

Camera.prototype.setBounds = function(camXBounds, camYBounds) {
	this.xBounds = camXBounds;
	this.yBounds = camYBounds;
};

Camera.prototype.setHeight = function(height) {
	this.height = height;
};

Camera.prototype.setWidth = function(width) {
	this.width = width;
};

// Draws the image on the screen. The images that show up are the ones that
// are supposed to be in the camera viewing port.
// img - the image to draw
// x - the actual x position of the object in the game world
// y - the actual y position of the object in the game world
// width - the width of the object
// height - the height of the object
// sourceX - the x location of the object on the image
// sourceY - the y location of the object on the image
Camera.prototype.draw = function(img, x, y, width, height, sourceX, sourceY) {
	ctx.beginPath();
	ctx.drawImage(img, sourceX, sourceY, width, height, x - this.positionX, 
				  y - this.positionY, width, height);
	ctx.closePath();
};

// Only use this function to set x & y so that it's easier to see where the
// position is set.
Camera.prototype.setPosition = function(x, y) {
	this.positionX = x;
	this.positionY = y;
};

Camera.prototype.checkBounds = function() {
	// if it goes past right border of map, put it to the edge
	if(this.positionX + canvasWidth > this.xBounds) {
		this.positionX = this.xBounds - canvasWidth;
	}
	// if it goes past the left border of map, put it to the edge
	if(this.positionX < 0) {
		this.positionX = 0;
	}
	
	// if it goes past the bottom border of map, put it to the edge
	if(this.positionY + canvasWidth > this.yBounds) {
		this.positionY = this.yBounds - canvasHeight;
	}
	// if it goes past the upper border of map, put it to the edge
	if(this.positionY < 0) {
		this.positionY = 0;
	}
};

function Tile(tileWidth, tileHeight, tileType, tileImgXPosition, tileImgYPosition) {
	this.width = tileWidth;
	this.height = tileHeight;
	this.type = tileType;
	this.imgXPosition = tileImgXPosition;
	this.imgYPosition = tileImgYPosition;
}

// tile types
Tile.UNBLOCKED = 0;
Tile.BLOCKED = 1;

// TileMapLayer - A layer composed of tiles for the TileMap.
// layerName - name of the layer
// mapWidth - width of map in tiles
// mapHeight - height of map in tiles
// layerName - the name of the layer
// tileSetWidth - the number of tiles across the tileset
// tileSetHeight - the number of tiles high the tileset is
// tileData - the arrangement of tiles in xml format
function TileMapLayer(mapWidth, mapHeight, tileWidth, tileHeight, layerName, 
					   tileSetWidth, tileSetHeight, tileCount, tileData) {
	'use strict';
	this.name = layerName;
	this.width = mapWidth;
	this.height = mapHeight;
	
	console.log(tileWidth);
	
	// there are only two types of tiles and 1 has to be added b/c blank tiles
	// aren't part of the tileset
	this.tiles = [];
	this.data = tileData;
	this.tileHeight = tileHeight;
	this.tileWidth = tileWidth;
	
	// The tileset that makes up the tilemap
	this.tileSet = Game.res.getImage('tileSet');
	
	
	// An array of integers used to figure out whether there is a tile in the
	// player's position
	this.map = [];
	
	for(var count = 0; count < tileData.length; ++count) {
		this.map.push(tileData[count]);
	}
	
	// initialize tile types
	for(var j = 0; j < tileSetHeight / tileHeight; ++j) {
		for(var i = 0; i < tileSetWidth / tileWidth; ++i) {
			this.tiles.push(new Tile(this.tileWidth, this.tileHeight,
									Tile.BLOCKED, i * this.tileWidth,
									j * this.tileHeight));
		}
	}
	
	this.tiles.splice(0, 0, new Tile(this.tileWidth, this.tileHeight, Tile.UNBLOCKED, 0, 0));	
	
}

TileMapLayer.prototype.getTile = function(x, y) {
	return this.tiles[this.map[y / this.tileHeight][x / this.tileWidth]];
};

TileMapLayer.prototype.draw = function(camera) {
//	ctx.drawImage(this.tileSet, canvasWidth / 2, canvasHeight / 2);
	// where to start drawing the tiles. Draw 1 more on each side to cover up
	// all empty places
	var startX = (camera.positionX / this.tileWidth - 1);
	
	if(startX < 0) startX = 0;
	
//	console.log(startX);
	
	var endX = ((camera.positionX + camera.width) / this.tileWidth + 1);
	if(endX > this.width) endX = this.width;

	var startY = (camera.positionY / this.tileHeight - 1);
	if(startY < 0) startY = 0;
	
	var endY = ((camera.positionY + camera.height) / this.tileHeight + 1);
	
	ctx.beginPath();
	for(var row = 0; row < this.height; ++row) {
		for(var col = 0; col < this.width; ++col) {
			var tileId = this.map[this.width * row + col];
			if(tileId != 0) {
				var t = this.tiles[tileId];
				camera.draw(this.tileSet, col * this.tileWidth, row * this.tileHeight,
					   this.tileWidth, this.tileHeight, t.imgXPosition, t.imgYPosition);
			}
		}
	}
	
//	camera.draw(this.tileSet, canvasWidth / 2, canvasHeight / 2, 320, 192, 0, 0);
	ctx.closePath();
};

function TileMapObject() {
	'use strict';
	
}

function TileMapObjectLayer() {
	'use strict';
}

function TileMap() {
	'use strict';
	this.mapLayers = [];
}

TileMap.prototype.loadFile = function(pathToFile, callback) {
	'use strict';
	var xhr = new XMLHttpRequest();
	var that = this;
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			console.log('reading file in');
			
			var levelData = JSON.parse(xhr.responseText);
			
			var lvlHeight = levelData.height;
			var lvlWidth = levelData.width;
			
			var tilesets = levelData.tilesets;
			var tilesetWidth = tilesets[0].imagewidth;
			var tilesetHeight = tilesets[0].imageheight;
			var tileWidth = levelData.tilesets[0].tilewidth;
			var tileHeight = levelData.tilesets[0].tileheight;
			var tileCount = levelData.tilesets[0].tilecount;
			
			
			Game.res.addImage('tileSet', '/platformer/res/maps/' + tilesets[0].image);
			
			var layers = levelData.layers;
			
//			for(var j = 0; j < levelData.layers[0].data.length; ++j) {
//				console.log(levelData.layers[0].data[j]);
//			}
			
			for(var i = 0; i < layers.length; ++i) {
				that.mapLayers.push(new TileMapLayer(lvlWidth, lvlHeight,
													tileWidth, tileHeight, 
													layers[i].name, tilesetWidth,
													tilesetHeight, tileCount, layers[i].data));
			}
			
//			console.log(layers[0].height);
			
			Game.levelLoaded = true;
			
			console.log('finished parsing tilemap. calling callback');
			
			callback();
			
		}
	};
	xhr.overrideMimeType("application/json");
	xhr.open('GET', pathToFile, true);
	xhr.send(null);
};

TileMap.prototype.draw = function(camera) {
	for(var i = 0, j = this.mapLayers.length; i < j; ++i) {
		this.mapLayers[i].draw(camera);
	}
};

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
	this.selectorImg = new Image(this.selectorImgWidth, this.selectorImgHeight);
	this.selectorImg.src = '/platformer/res/grey_dot.png';
	
	this.textWidth = 40;
	this.textHeight = 21;
	this.menuTextImg = new Image(this.textWidth, this.textHeight);
	this.menuTextImg.src = '/platformer/res/menu-text.png';
}

function PlayState() {
    'use strict';
    GameState.call();
	
	clear('#ffffff');
	this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
	this.camera.setHeight(canvasHeight);
	this.camera.setWidth(canvasWidth);
	console.log(this.camera);
	
	this.tileMap = new TileMap();
	
	this.tileMap = new TileMap();
	var that = this;
	this.tileMap.loadFile('/platformer/res/maps/level-1.json', function() {
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
	this.camera.setBounds(this.tileMap.mapLayers[0].width * 
						  this.tileMap.mapLayers[0].tileWidth,
						  this.tileMap.mapLayers[0].height *
						 this.tileMap.mapLayers[0].tileHeight);
	this.camera.setPosition(0, this.tileMap.mapLayers[0].height * 
							this.tileMap.mapLayers[0].tileHeight - this.tileMap.mapLayers[0].height);
};

PlayState.prototype.update = function () {
    'use strict';
	
    if (Key.isKeyPressed(Key.SPACE)) {
        Game.gsm.changeState(new MenuState());
    }
	
	if(Game.levelLoaded) {
			this.camera.checkBounds();
	}
	
};

PlayState.prototype.draw = function () {
    'use strict';
    clear('#655541');
//	console.log('drawing tilemap');
	this.tileMap.draw(this.camera);
//	this.camera.draw(this.tileMap.mapLayers[0].tileSet, 40, 40, 
//					 this.tileMap.mapLayers[0].tiles[2].width, this.tileMap.mapLayers[0].tiles[2].height,
//					this.tileMap.mapLayers[0].tiles[2].imgXPosition,
//					this.tileMap.mapLayers[0].tiles[2].imgYPosition);
};


// start the game
(function () {
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
    Game.gsm.pushState(new MenuState());
    main(window.performance.now());
})();