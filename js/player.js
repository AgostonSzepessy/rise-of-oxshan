Player.prototype = new Entity();

function Player() {
	Entity.call(this);
	
	this.PLAYER_STANDING = 0;
	this.PLAYER_WALKING = 1;
	this.PLAYER_JUMPING = 2;
	this.PLAYER_ATTACKING = 3;
	this.PLAYER_DYING = 4;
	this.currentAnimation = 0;
	this.currentFrame = 0;
	
	this.texture = Game.res.getImage('player');
	this.acceleration = 0.025;
	this.maxVelocity = 0.25;
	this.maxFastVelocity = 0.75;
	
	this.jumpSpeed = 3;
	this.doubleJumpSpeed = 2;
	this.jumping = false;
	this.doubleJumping = false;
	this.mayJump = false;
	this.mayJumpAgain = false;
	
	var playerStanding = new Array(1);
	playerStanding[0] = new AnimationFrame();
	playerStanding[0].positionX = 4;
	playerStanding[0].positionY = 11;
	playerStanding[0].width = 46;
	playerStanding[0].height = 57;
	
	var playerWalking = new Array(7);
	for(var i = 0; i < playerWalking.length; ++i) {
		playerWalking[i] = new AnimationFrame();
	}
	
	playerWalking[0].positionX = 57;
	playerWalking[0].positionY = 11;
	playerWalking[0].width = 38;
	playerWalking[0].height = 56;
	
	playerWalking[1].positionX = 107;
	playerWalking[1].positionY = 10;
	playerWalking[1].width = 36;
	playerWalking[1].height = 57;
	
	playerWalking[2].positionX = 159;
	playerWalking[2].positionY = 9;
	playerWalking[2].width = 34;
	playerWalking[2].height = 58;
	
	playerWalking[3].positionX = 208;
	playerWalking[3].positionY = 10;
	playerWalking[3].width = 34;
	playerWalking[3].height = 58;
	
	playerWalking[4].positionX = 252;
	playerWalking[4].positionY = 12;
	playerWalking[4].width = 43;
	playerWalking[4].height = 56;
	
	playerWalking[5].positionX = 302;
	playerWalking[5].positionY = 11;
	playerWalking[5].width = 36;
	playerWalking[5].height = 57;
	
	playerWalking[6].positionX = 350;
	playerWalking[6].positionY = 10;
	playerWalking[6].width = 36;
	playerWalking[6].height = 58;
	
	var playerJumping = new Array(4);
	for(i = 0; i < playerJumping.length; ++i) {
		playerJumping[i] = new AnimationFrame();
	}
	
	playerJumping[0].positionX = 9;
	playerJumping[0].positionY = 82;
	playerJumping[0].width = 56;
	playerJumping[0].height = 48;
	
	playerJumping[1].positionX = 91;
	playerJumping[1].positionY = 79;
	playerJumping[1].width = 52;
	playerJumping[1].height = 65;
	
	playerJumping[2].positionX = 161;
	playerJumping[2].positionY = 82;
	playerJumping[2].width = 53;
	playerJumping[2].height = 57;
	
	playerJumping[3].positionX = 218;
	playerJumping[3].positionY = 82;
	playerJumping[3].width = 60;
	playerJumping[3].height = 57;
	
	var playerAttacking = new Array(3);
	for(i = 0; i  < playerAttacking.length; ++i) {
		playerAttacking[i] = new AnimationFrame();
	}
	
	playerAttacking[0].positionX = 6;
	playerAttacking[0].positionY = 255;
	playerAttacking[0].width = 64;
	playerAttacking[0].height = 71;
	
	playerAttacking[1].positionX = 85;
	playerAttacking[1].positionY = 275;
	playerAttacking[1].width = 80;
	playerAttacking[1].height = 51;
	
	playerAttacking[2].positionX = 182;
	playerAttacking[2].positionY = 275;
	playerAttacking[2].width = 63;
	playerAttacking[2].height = 51;
	
	var playerDying = new Array(5);
	for(i = 0; i < playerDying.length; ++i) {
		playerDying[i] = new AnimationFrame();
	}
	
	playerDying[0].positionX = 11;
	playerDying[0].positionY = 143;
	playerDying[0].width = 55;
	playerDying[0].height = 50;
	
	playerDying[1].positionX = 90;
	playerDying[1].positionY = 155;
	playerDying[1].width = 53;
	playerDying[1].height = 42;
	
	playerDying[2].positionX = 161;
	playerDying[2].positionY = 152;
	playerDying[2].width = 68;
	playerDying[2].height = 44;
	
	playerDying[3].positionX = 246;
	playerDying[3].positionY = 155;
	playerDying[3].width = 67;
	playerDying[3].height = 42;
	
	playerDying[4].positionX = 321;
	playerDying[4].positionY = 178;
	playerDying[4].width = 77;
	playerDying[4].height = 21;
	
	this.animations= new Array(5);
	
	this.animations[this.PLAYER_STANDING] = new Animation(playerStanding);
	this.animations[this.PLAYER_STANDING].delay = -1;
	
	this.animations[this.PLAYER_WALKING] = new Animation(playerWalking);
	this.animations[this.PLAYER_JUMPING] = new Animation(playerJumping);
	this.animations[this.PLAYER_ATTACKING] = new Animation(playerAttacking);
	this.animations[this.PLAYER_DYING] = new Animation(playerDying);
	
	this.width = this.animations[this.currentAnimation].frames[0].width;
	this.height = this.animations[this.currentAnimation].frames[0].height;
	
}

Player.prototype.setJumping = function(jumping) {
	if(this.mayJump) {
		this.jumping = true;
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
		this.falling = true;
		this.jumping = false;
		this.mayJump = false;
		this.grounded = false;
		this.mayJumpAgain = true;
	}
	
	if(this.doubleJumping) {
		this.dy -= this.doubleJumpSpeed;
		this.doubleJumping = false;
		this.mayJumpAgain = false;
		this.falling = true;
		this.grounded = false;
	}
	
	if(this.grounded) {
		this.mayJump = true;
		this.mayJumpAgain = false;
		this.jumping = false;
	}
	
	if(!this.falling) {
		this.grounded = true;
	}
	
	if(this.falling && !this.jumping) {
			this.dy += this.gravity;
			if(this.dy > this.terminalVelocity) this.dy = this.terminalVelocity;
	}

	this.checkMapCollision(dt);
	this.updateAnimation(dt);
	
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
//	camera.draw(this.texture, this.positionX, this.positionY, this.width,
//			   	this.height, 0, 0);
	
	camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   	this.height, 
				this.animations[this.currentAnimation].frames[this.currentFrame].positionX,
			   this.animations[this.currentAnimation].frames[this.currentFrame].positionY);
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillText('Player dx is ' + this.dx, 0, 10);
	ctx.fillText('this.falling = ' + this.falling, 0, 30);
	ctx.fillText('this.grounded = ' + this.grounded, 0, 40);
	ctx.closePath();
};

Player.prototype.updateAnimation = function(dt) {
	// TODO: use which way player is moving to update animation
	this.animations[this.currentAnimation].update(dt);
	
	this.currentFrame = this.animations[this.currentAnimation].currentFrame;
	this.width = this.animations[this.currentAnimation].frames[this.currentFrame].width;
	
	this.height = this.animations[this.currentAnimation].frames[this.currentFrame].height;
};