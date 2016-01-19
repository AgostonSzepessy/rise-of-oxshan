function Wizard() {
	Enemy.call(this);
	this.texture = Game.res.getImage('wizard');
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.acceleration = 0.010;
}

Wizard.prototype = Object.create(Enemy.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function(dt) {
	if(!this.falling) {
		this.getCorners(this.positionX, this.yDest + 1);
		if(!this.bottomLeftBlocked || !this.bottomRightBlocked) {
			this.facingRight = !this.facingRight;
			this.dx = -this.dx;
		}
	}
	
	
	if(this.leftBlocked || this.positionX === 0) {
		this.facingRight = true;
	}
	else if(this.rightBlocked || this.positionX + this.width === this.xBounds) {
		this.facingRight = false;
	}
	
	if(this.facingRight) {
		this.dx += this.acceleration;
		if(this.dx > this.maxVelocity) {
			this.dx = this.maxVelocity;
		}
	}
	else {
		this.dx -= this.acceleration;
		if(this.dx < -this.maxVelocity) {
			this.dx = -this.maxVelocity;
		}
	}
	
	if(this.falling) {
		this.dy += this.gravity;
		if(this.dy > this.terminalVelocity) {
			this.dy = this.terminalVelocity;
		}
	}
	
	this.checkMapCollision(dt);
	
	this.setPosition(this.tempX, this.tempY);
	
	if(this.positionX < 0) this.positionX = 0;
	
	if(this.positionX + this.width > this.xBounds) {
		this.positionX = this.xBounds - this.width;
	}
	
	if(this.positionY <= 0) this.positionY = 0;
	if(this.positionY >= this.yBounds) {
		this.positionY = this.yBounds - this.height;
	}
};

Wizard.prototype.draw = function(camera) {
	if(this.isInsideCamera(camera)) {
		camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, 0, 0);
	}
};