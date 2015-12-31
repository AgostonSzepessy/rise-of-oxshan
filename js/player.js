Player.prototype = new Entity();

function Player() {
	this.texture = Game.res.getImage('player_2');
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.acceleration = 0.025;
	this.maxVelocity = 0.25;
	this.maxFastVelocity = 0.75;
	
	this.jumpSpeed = 3;
	this.doubleJumpSpeed = 2;
	this.amountJumped = 0;
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
		this.falling = true;
	}
	
	if(this.doubleJumping) {
		console.log('double jumping');
		this.dy -= this.doubleJumpSpeed;
		this.doubleJumping = false;
		this.mayJumpAgain = false;
		this.falling = true;
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
	
	if(this.positionX < 0) this.positionX = 0;
	
	if(this.positionX + this.width > this.xBounds) {
		this.positionX = this.xBounds - this.width;
	}
	
	if(this.positionY <= 0) this.positionY = 0;
	if(this.positionY >= this.yBounds) {
		this.positionY = this.yBounds - this.height;
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
	ctx.fillText('this.grounded = ' + this.grounded, 0, 40);
	ctx.closePath();
};