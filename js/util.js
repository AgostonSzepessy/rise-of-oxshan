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
GameStateManager.prototype.update = function(dt) {
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
	
    this.states[this.states.length - 1].update(dt);
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
	SHIFT: 16,
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

// Keeps track of resources. Each resource is stored with a key.
function ResourceManager() {
	'use strict';
	this.images = [];
}

ResourceManager.prototype.addImageFromPath = function(key, resPath) {
	var res = new Image();
	res.src = resPath;
	this.images.push(new Resource(key, res));
};

ResourceManager.prototype.addImage = function(key, img) {
	this.images.push(new Resource(key, img));
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

Game.update = function(dt) {
    'use strict';
	Game.gsm.update(dt);
	Key.backupKeys();
};

Game.draw = function() {
    'use strict';
    Game.gsm.draw();
};

// The camera that follows the player around. It helps draw objects in the
// proper place. It's origin is in the upper left corner.
// camX - starting x coordinate
// camY - starting y coordinate
// camWidth - the width of the camera viewport
// camHeight - the height of the camera viewport
function Camera(camX, camY, camWidth, camHeight) {
	this.positionX = camX;
	this.positionY = camY;
	this.xBounds = 0;
	this.yBounds = 0;
	this.width = camWidth;
	this.height = camHeight;
}

// Sets the boundaries of the camera. It cannot go past these bounds. It is
// assumed that (0, 0) is the boundary from the left side.
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

Camera.prototype.setPositionX = function(x) {
	this.positionX = x;
};

Camera.prototype.setPositionY = function(y) {
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

function AnimationFrame() {
	this.positionX = 0;
	this.positionY = 0;
	this.width = 0;
	this.height = 0;
}

function Animation(frames) {
	this.frames = frames;
	this.delay = 0;
	this.time = 0;
	this.currentFrame = 0;
	this.timesPlayed = 0;
}

Animation.prototype.update = function(dt) {
	if(this.delay < 0) return;
	
	this.time += dt;
	
	if(this.time > this.delay) {
		this.time = 0;
		this.currentFrame++;
		this.timesPlayed++;
	}
	if(this.currentFrame >= this.frames.length) {
		this.currentFrame = 0;
	}
};