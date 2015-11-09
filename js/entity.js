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
	this.dx = 0.0;
	this.dy = 0.0;
	this.acceleration = 0.0;
	this.maxVelocity = 0.0;
	this.tileMap = null;
	this.animationPositions = [];
	this.height = 0;
	this.width = 0;
	this.gravity = 9.81;
	this.texture = null;
	this.xBounds = 0;
	this.yBounds = 0;
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

Player.prototype = new Entity();

function Player() {
	this.texture = Game.res.getImage('player');
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.acceleration = 0.025;
	this.maxVelocity = 0.25;
	this.maxFastVelocity = 0.75;
}

Player.prototype.update = function(dt) {	
	if(Key.isDown(Key.D)) {
		this.dx += this.acceleration;
		if(Key.isDown(Key.SHIFT)) {
			if(this.dx > this.maxFastVelocity) this.dx = this.maxFastVelocity;
		}
		else if(!Key.isDown(Key.SHIFT) && this.dx > this.maxVelocity) {
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
		this.dx = 0;
	}
	
	this.positionX += this.dx * dt;
	
	if(this.positionX < 0) {
		this.positionX = 0;
	}
	
	if(this.positionX > this.xBounds) {
		this.positionX = this.xBounds - this.width;
	}
};

Player.prototype.draw = function(camera) {
	camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, 0, 0);
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillText('Player dx is ' + this.dx, 0, 10);
	ctx.closePath();
};