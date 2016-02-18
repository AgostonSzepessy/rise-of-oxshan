Fireball.prototype = new Entity();

function Fireball() {
	Entity.call(this);
	this.texture = Game.res.getImage('fireball');
	this.height = this.texture.height;
	this.width = this.texture.width;
	this.acceleration = 0.1;
	
	// coordinates for the head of vector
	this.xHead = 0;
	this.yHead = 0;
}

Fireball.prototype.update = function(dt) {
	this.dx += this.acceleration;
	this.dy += this.acceleration;
	
	if(this.dx > this.maxVelocity) {
		this.dx = this.maxVelocity;
	}
	else if(this.dx < -this.maxVelocity) {
		this.dx = -this.maxVelocity;
	}
	if(this.dy > this.maxVelocity) {
		this.dy = this.maxVelocity;
	}
	else if(this.dy < -this.maxVelocity) {
		this.dy = -this.maxVelocity;
	}
	
	this.checkMapCollision(dt);
	
	// check if bullet hit an enemy or out of bounds
	if(this.dx == 0 || this.dy == 0 || this.tempX < 0 || this.tempX +
	  this.width > this.xBounds || this.tempY < 0 || this.tempY + 
	  this.height > this.yBounds)
		this.dead = true;
	else
		this.setPosition(this.tempX, this.tempY);
};

Fireball.prototype.draw = function(camera) {
	if(this.isInsideCamera(camera)) {
		camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, 0, 0);
	}
};