function Entity() {
	this.positionX = 0.0;
	this.positionY = 0.0;
	this.xDest = 0;
	this.yDest = 0;
	this.tempX = 0;
	this.tempY = 0;
	this.dx = 0.0;
	this.dy = 0.0;
	
	// the sides of the tiles surrounding player that are blocked
	this.topLeftBlocked = false;
	this.topRightBlocked = false;
	this.bottomLeftBlocked = false;
	this.bottomRightBlocked = false;
	
	this.acceleration = 0.0;
	this.maxVelocity = 0.0;
	this.tileMap = null;
	this.height = 0;
	this.width = 0;
	this.gravity = 0.2;
	this.terminalVelocity = 1;
	this.texture = null;
	
	// boundaries of the level
	this.xBounds = 0;
	this.yBounds = 0;
	
	this.falling = true;
	this.grounded = false;
	
	this.dead = false;
	
	this.facingRight = true;
	this.currentAnimation = 0;
	this.currentFrame = 0;
	this.animations = [];
}

Entity.prototype.setPosition = function(x, y) {
	this.positionX = x;
	this.positionY = y;
};

Entity.prototype.getX = function() {
	return this.positionX;
};

Entity.prototype.getY = function() {
	return this.positionY;
};

Entity.prototype.getHeight = function() {
	return this.height;
};

Entity.prototype.getWidth = function() {
	return this.width;
};

Entity.prototype.setBounds = function(xBound, yBound) {
	this.xBounds = xBound;
	this.yBounds = yBound;
};

Entity.prototype.setTileMap = function(map) {
	this.tileMap = map;
};

Entity.prototype.clearAnimation = function() {
	this.animations[this.currentAnimation].currentFrame = 0;
	this.animations[this.currentAnimation].time = 0;
	this.animations[this.currentAnimation].timesPlayed = 0;
};

// checks if the player is going to collide with any corners
Entity.prototype.getCorners = function(x, y) {
	var tileLayer = this.tileMap.getTileLayer('Tile Layer 1');
	
	// get tile corners and check collision
	var left = x;
	var right = x + this.width - 1;
	var top = y;
	var bottom = y + this.height - 1;
	
	// get the tiles surrounding the player
	var topLeftTile = tileLayer.getTileType(left, top);
	var topRightTile = tileLayer.getTileType(right, top);
	var bottomLeftTile = tileLayer.getTileType(left, bottom);
	var bottomRightTile = tileLayer.getTileType(right, bottom);
	
	// check if each tile is blocked or not
	this.topLeftBlocked = Tile.BLOCKED == topLeftTile;
	this.topRightBlocked = Tile.BLOCKED == topRightTile;
	this.bottomLeftBlocked = Tile.BLOCKED == bottomLeftTile;
	this.bottomRightBlocked = Tile.BLOCKED == bottomRightTile;
};

Entity.prototype.checkMapCollision = function(dt) {
	this.xDest = this.positionX + this.dx * dt;
	this.yDest = this.positionY + this.dy * dt;
	
	if(this.yDest + this.height >= this.yBounds) {
		this.dead = true;
		return;
	}
	
	this.tempX = this.positionX;
	this.tempY = this.positionY;
	
	var tileLayer = this.tileMap.getTileLayer('Tile Layer 1');
	
	// current row and column (multiples of tile width & height) that the player
	// is in
	var currentColumn = parseInt(this.positionX / tileLayer.tileWidth);
	var currentRow = parseInt(this.positionY / tileLayer.tileHeight);
	
	this.getCorners(this.positionX, this.yDest);
	
	// going down
	if(this.dy > 0) {
		// collision
		if(this.bottomLeftBlocked || this.bottomRightBlocked) {
			currentRow = parseInt((this.yDest + this.height) / tileLayer.tileHeight);
			this.tempY = currentRow * tileLayer.tileHeight - this.height;
			this.dy = 0;
			this.falling = false;
			this.grounded = true;
		}
		else {
			this.tempY += this.dy * dt;
		}
	}
	// going up
	if(this.dy < 0) {
		// collision
		if(this.topLeftBlocked || this.topRightBlocked) {
			this.tempY = (currentRow - 1) * tileLayer.tileHeight + tileLayer.tileHeight;
			this.dy = 0;
			this.falling = true;
		}
		else {
			this.tempY += this.dy * dt;
		}
	}
	this.getCorners(this.xDest, this.positionY);
	// going left; check if there are any blocks to the left of him
	if(this.dx < 0) {
		if(this.topLeftBlocked || this.bottomLeftBlocked) {
			this.tempX = currentColumn * tileLayer.tileWidth;
			this.dx = 0;
		}
		else {
			this.tempX += this.dx * dt;
		}
	}
	// going right; check if there are any blocks to the right of him
	if(this.dx > 0) {
		if(this.topRightBlocked || this.bottomRightBlocked) {
			this.tempX = (currentColumn + 1) * tileLayer.tileWidth - this.width;
			this.dx = 0;
		}
		else {
			this.tempX += this.dx * dt;
		}
	}
	
	// if player is not falling, then check if there are any blocks under him
	if(!this.falling) {
		this.getCorners(this.positionX, this.yDest + 1);
		if(!this.bottomLeftBlocked && !this.bottomRightBlocked) {
			this.falling = true;
		}
	}
};

Entity.prototype.isInsideCamera = function(camera) {
	if(this.positionX + this.width < camera.positionX || this.positionX > 
	   camera.positionX + camera.width || this.positionY + this.height < 
	   camera.positionY || this.positionY > camera.positionY + camera.width)
		return false;
	return true;
};

Enemy.prototype = new Entity();

function Enemy() {
	Entity.call(this);
	this.health = 1;
	this.damage = 1;
	this.maxVelocity = 0.1;
	this.acceleration = 0.025;
}