Projectile.prototype = new Entity();

function Projectile() {
	Entity.call(this);
	this.width = 41;
	this.maxVelocity = 0.55;
	this.sourceX = 0;
}

Projectile.prototype.setDirection = function(originX, dirX, originY, dirY) {
	var distanceX = dirX - originX;
	var distanceY = dirY - originY;
	
	var norm = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
	this.dx = this.maxVelocity * (distanceX / norm);
	this.dy = this.maxVelocity * (distanceY / norm);
	
	if(this.dx < 0)
		this.sourceX = 42;
	
	this.positionX = originX;
	this.positionY = originY;
	console.log(this.positionY);	 
};

Projectile.prototype.update = function(dt) {
	this.checkMapCollision(dt);
	
	// check if bullet hit an enemy or out of bounds
	if(this.bottomLeftBlocked || this.bottomRightBlocked || this.topLeftBlocked ||
	   this.topRightBlocked || this.tempX < 0 || this.tempX + this.width> 
	   this.xBounds || this.tempY < 0 || this.tempY + this.height >
	   this.yBounds)
		this.dead = true;   
	else
		this.setPosition(this.tempX, this.tempY);
	
//	console.log('x: ' + this.positionX + ' y: ' + this.positionY);
};

Projectile.prototype.draw = function(camera) {
	if(this.isInsideCamera(camera)) {
		camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, this.sourceX, 0);
	}
};

Fireball.prototype = new Projectile();

function Fireball() {
	Projectile.call(this);
	this.texture = Game.res.getImage('fireball');
	this.height = 23;
}

Lightning.prototype = new Projectile();

function Lightning() {
	Entity.call(this);
	this.texture = Game.res.getImage('lightning');
	this.height = 15;
}

Lightning.prototype.update = function(dt) {
	Projectile.prototype.update(dt);
	console.log(this.positionY);
};