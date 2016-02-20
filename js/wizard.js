function Wizard() {
	Enemy.call(this);
	this.texture = Game.res.getImage('wizard');
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.acceleration = 0.010;
	
	this.STANDING_RIGHT = 0;
	this.STANDING_LEFT = 1;
	this.WALKING_RIGHT = 2;
	this.WALKING_LEFT = 3;
	this.DYING_RIGHT = 4;
	this.DYING_LEFT = 5;
	
	var standingRight = new Array(1);
	standingRight[0] = new AnimationFrame();
	standingRight[0].positionX = 0;
	standingRight[0].positionY = 0;
	standingRight[0].width = 50;
	standingRight[0].height = 50;
	
	var walkingRight = new Array(8);
	// walking is 50x50 frames
	for(var i = 0; i < walkingRight.length; ++i) {
		walkingRight[i] = new AnimationFrame();
		walkingRight[i].positionX = i * 50;
		walkingRight[i].positionY = 50;
		walkingRight[i].width = 50;
		walkingRight[i].height = 50;
	}
	
	var dyingRight = new Array(10);
	for(i = 0; i < 8; ++i) {
		dyingRight[i] = new AnimationFrame();
		dyingRight[i].positionX = i * 50;
		dyingRight[i].positionY = 100;
		dyingRight[i].width = 50;
		dyingRight[i].height = 55;
	}
	
	for(i = 0; i < 2; ++i) {
		dyingRight[i] = new AnimationFrame();
		dyingRight[i].positionX = i * 50;
		dyingRight[i].positionY = 155;
		dyingRight[i].width = 50;
		dyingRight[i].height = 55;
	}
	
	var standingLeft = new Array(1);
	standingLeft[0] = new AnimationFrame();
	standingLeft[0].positionX = 750;
	standingLeft[0].positionY = 0;
	standingLeft[0].width = 33;
	standingLeft[0].height = 50;
	
	var walkingLeft = new Array(8);
	// walking is 50x50 frames
	for(i = 0; i < walkingRight.length; ++i) {
		walkingLeft[i] = new AnimationFrame();
		walkingLeft[i].positionX = 750 - (i * 50);
		walkingLeft[i].positionY = 50;
		walkingLeft[i].width = 50;
		walkingLeft[i].height = 50;
	}
	
	var dyingLeft = new Array(10);
	for(i = 0; i < 8; ++i) {
		dyingLeft[i] = new AnimationFrame();
		dyingLeft[i].positionX = 750 - (i * 50);
		dyingLeft[i].positionY = 100;
		dyingLeft[i].width = 50;
		dyingLeft[i].height = 55;
	}
	
	for(i = 0; i < 2; ++i) {
		dyingLeft[i] = new AnimationFrame();
		dyingLeft[i].positionX = 750 - (i * 50);
		dyingLeft[i].positionY = 155;
		dyingLeft[i].width = 50;
		dyingLeft[i].height = 55;
	}
	
	this.animations = new Array(6);
	
	this.animations[this.STANDING_RIGHT] = new Animation(standingRight);
	this.animations[this.STANDING_RIGHT].delay = -1;
	
	this.animations[this.STANDING_LEFT] = new Animation(standingLeft);
	this.animations[this.STANDING_LEFT].delay = -1;
	
	this.animations[this.WALKING_RIGHT] = new Animation(walkingRight);
	this.animations[this.WALKING_RIGHT].delay = 110;
	
	this.animations[this.WALKING_LEFT] = new Animation(walkingLeft);
	this.animations[this.WALKING_LEFT].delay = 110;
	
	this.animations[this.DYING_RIGHT] = new Animation(dyingRight);
	this.animations[this.DYING_RIGHT].delay = 90;
	
	this.animations[this.DYING_LEFT] = new Animation(dyingLeft);
	this.animations[this.DYING_LEFT].delay = 90;
	
	this.currentAnimation = this.STANDING_RIGHT;
	
	this.width = this.animations[this.currentAnimation].frames[0].width;
	this.height = this.animations[this.currentAnimation].frames[0].width;
	
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

Wizard.prototype.updateAnimation = function(dt) {
	
};