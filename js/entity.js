/* jshint devel: true */
/* jshint browser: true */

function AnimationFrame() {
	this.positionX = 0;
	this.positionY = 0;
	this.width = 0;
	this.height = 0;
}

function Entity() {
	this.positionX = 0.0;
	this.positionY = 0.0;
	this.xDest = 0;
	this.yDest = 0;
	this.tempX = 0;
	this.tempY = 0;
	this.dx = 0.0;
	this.dy = 0.0;
	
	this.topLeftBlocked = false;
	this.topRightBlocked = false;
	this.bottomLeftBlocked = false;
	this.bottomRightBlocked = false;
	
	this.acceleration = 0.0;
	this.maxVelocity = 0.0;
	this.tileMap = null;
	this.animationPositions = [];
	this.height = 0;
	this.width = 0;
	this.gravity = 0.3;
	this.terminalVelocity = 1;
	this.texture = null;
	this.xBounds = 0;
	this.yBounds = 0;
	this.falling = true;
	this.grounded = false;
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

// checks if the player is going to collide with any corners
Entity.prototype.getCorners = function(x, y) {
	var tileLayer = this.tileMap.getTileLayer('Tile Layer 1');
	
	// get tile corners and check collision
	var left = x;
	var right = x + this.width - 1;
	var top = y;
	var bottom = y + this.height - 1;
	
	var topLeftTile = tileLayer.getTileType(left, top);
	var topRightTile = tileLayer.getTileType(right , top);
	var bottomLeftTile = tileLayer.getTileType(left, bottom);
	var bottomRightTile = tileLayer.getTileType(right, bottom);
	
	this.topLeftBlocked = Tile.BLOCKED == topLeftTile;
	this.topRightBlocked = Tile.BLOCKED == topRightTile;
	this.bottomLeftBlocked = Tile.BLOCKED == bottomLeftTile;
	this.bottomRightBlocked = Tile.BLOCKED == bottomRightTile;
};

Entity.prototype.checkMapCollision = function(dt) {
	this.xDest = this.positionX + this.dx * dt;
	this.yDest = this.positionY + this.dy * dt;
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
		if(this.bottomLeftBlocked || this.bottomRightBlocked) {
			this.tempY = (currentRow + 1) * tileLayer.tileHeight - this.height;
			this.dy = 0;
			this.grounded = true;
		}
		else {
			this.tempY += this.dy * dt;
		}
	}
	// going up
	if(this.dy < 0) {
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
	// going left
	if(this.dx < 0) {
		if(this.topLeftBlocked || this.bottomLeftBlocked) {
			this.tempX = currentColumn * tileLayer.tileWidth;
			this.dx = 0;
		}
		else {
			this.tempX += this.dx * dt;
		}
	}
	if(this.dx > 0) {
		if(this.topRightBlocked || this.bottomRightBlocked) {
			this.tempX = (currentColumn + 1) * tileLayer.tileWidth - this.width;
			this.dx = 0;
		}
		else {
			this.tempX += this.dx * dt;
		}
	}
};

Player.prototype = new Entity();

function Player() {
	this.texture = Game.res.getImage('player');
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.acceleration = 0.025;
	this.maxVelocity = 0.25;
	this.maxFastVelocity = 0.75;
	
	this.jumpSpeed = 3;
	this.doubleJumpSpeed = 2;
	this.amountJumped = 0;
	this.maxJumpHeight = 3.0;
	this.jumping = false;
	this.doubleJumping = false;
	this.mayJump = false;
	this.mayJumpAgain = false;
}

Player.prototype.setJumping = function(jumping) {
	if(this.mayJump) {
		this.jumping = jumping;
		this.mayJump = true;
	}
	if(this.mayJumpAgain) {
		this.doubleJumping = true;
	}
};

Player.prototype.update = function(dt, camera) {	
	if(Key.isDown(Key.D)) {
		this.dx += this.acceleration;
		if(Key.isDown(Key.SHIFT)) {
			if(this.dx > this.maxFastVelocity) this.dx = this.maxFastVelocity;
		}
		if(!Key.isDown(Key.SHIFT) && this.dx > this.maxVelocity) {
			this.dx = this.maxVelocity;
		}
	}
	
	else if(Key.isDown(Key.A)) {
		this.dx -= this.acceleration;
		if(Key.isDown(Key.SHIFT)) {
			if(this.dx < -this.maxFastVelocity) this.dx = -this.maxFastVelocity;
		}
		else if(!Key.isDown(Key.SHIFT) && this.dx < -this.maxVelocity) {
			this.dx = -this.maxVelocity;
		}
	}
	
	else {
		this.dx *= 0.1;
		if(this.dx < 0.0001 && this.dx > -0.0001) {
			this.dx = 0;
		}
	}
	
	if(this.jumping) {
		this.dy -= this.jumpSpeed;
		this.mayJump = false;
		this.jumping = false;
		this.mayJumpAgain = true;
	}
	
	if(this.doubleJumping) {
		this.dy -= this.doubleJumpSpeed;
		this.doubleJumping = false;
		this.mayJumpAgain = false;
	}
	
	if(this.falling && !this.jumping) {
		if(this.dy < this.terminalVelocity) {
			this.dy += this.gravity;
			if(this.dy > this.terminalVelocity) this.dy = this.terminalVelocity;
		}
	}
	
	
	this.checkMapCollision(dt);
	
	if(this.grounded) {
		this.mayJump = true;
		this.mayJumpAgain = false;
	}
	
	if(this.falling) {
		this.grounded = false;
	}
	
	this.setPosition(this.tempX, this.tempY);
	
	if(this.positionX < 0) {
		this.positionX = 0;
	}
	
	if(this.positionX > this.xBounds) {
		this.positionX = this.xBounds - this.width;
	}
	
	camera.setPositionX(this.positionX - camera.width / 2);
};

Player.prototype.draw = function(camera) {
	camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, 0, 0);
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillText('Player dx is ' + this.dx, 0, 10);
	ctx.fillText('this.falling = ' + this.falling, 0, 30);
	ctx.fillText('Game.currentFps = ' + Game.currentFps, 0, 40);
	ctx.closePath();
};