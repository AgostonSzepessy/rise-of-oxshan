Player.prototype = new Entity();

function Player() {
	Entity.call(this);
	
	this.PLAYER_STANDING_RIGHT = 0;
	this.PLAYER_WALKING_RIGHT = 1;
	this.PLAYER_ATTACKING_RIGHT = 2;
	this.PLAYER_DYING_RIGHT = 3;
	this.PLAYER_STANDING_LEFT = 4;
	this.PLAYER_WALKING_LEFT = 5;
	this.PLAYER_ATTACKING_LEFT = 6;
	this.PLAYER_DYING_LEFT = 7;
	this.PLAYER_FALLING_RIGHT = 8;
	this.PLAYER_FALLING_LEFT = 9;
	
	this.texture = Game.res.getImage('player');
	this.acceleration = 0.025;
	this.maxVelocity = 0.25;
	this.maxFastVelocity = 0.50;
	
	this.jumpSpeed = 2.5;
	this.doubleJumpSpeed = 2;
	this.jumping = false;
	this.doubleJumping = false;
	this.mayJump = false;
	this.mayJumpAgain = false;
	this.playJumpAnimation = false;
	
	this.movingRight = false;
	this.movingLeft = false;
	this.shiftPressed = false;
	
	this.reachedLvlEndl = false;
	this.dead = false;
	
	// specify where each frame is located on the spritesheet	
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
	
	var playerFalling = new Array(1);
	playerFalling[0] = new AnimationFrame();
	playerFalling[0].positionX = 218;
	playerFalling[0].positionY = 82;
	playerFalling[0].width = 60;
	playerFalling[0].height = 57;
	
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
	
	// left facing frames
	var playerStandingLeft = new Array(1);
	playerStandingLeft[0] = new AnimationFrame();
	playerStandingLeft[0].positionX = 750;
	playerStandingLeft[0].positionY = 11;
	playerStandingLeft[0].width = 46;
	playerStandingLeft[0].height = 57;
	
	var playerWalkingLeft = new Array(7);
	for(i = 0; i < playerWalking.length; ++i) {
		playerWalkingLeft[i] = new AnimationFrame();
	}
	
	playerWalkingLeft[0].positionX = 705;
	playerWalkingLeft[0].positionY = 11;
	playerWalkingLeft[0].width = 38;
	playerWalkingLeft[0].height = 56;
	
	playerWalkingLeft[1].positionX = 657;
	playerWalkingLeft[1].positionY = 10;
	playerWalkingLeft[1].width = 36;
	playerWalkingLeft[1].height = 57;
	
	playerWalkingLeft[2].positionX = 607;
	playerWalkingLeft[2].positionY = 9;
	playerWalkingLeft[2].width = 34;
	playerWalkingLeft[2].height = 58;
	
	playerWalkingLeft[3].positionX = 558;
	playerWalkingLeft[3].positionY = 10;
	playerWalkingLeft[3].width = 34;
	playerWalkingLeft[3].height = 58;
	
	playerWalkingLeft[4].positionX = 505;
	playerWalkingLeft[4].positionY = 12;
	playerWalkingLeft[4].width = 43;
	playerWalkingLeft[4].height = 56;
	
	playerWalkingLeft[5].positionX = 462;
	playerWalkingLeft[5].positionY = 11;
	playerWalkingLeft[5].width = 36;
	playerWalkingLeft[5].height = 57;
	
	playerWalkingLeft[6].positionX = 414;
	playerWalkingLeft[6].positionY = 10;
	playerWalkingLeft[6].width = 36;
	playerWalkingLeft[6].height = 58;
	
	var playerFallingLeft = new Array(1);
	playerFallingLeft[0] = new AnimationFrame();
	playerFallingLeft[0].positionX = 522;
	playerFallingLeft[0].positionY = 82;
	playerFallingLeft[0].width = 60;
	playerFallingLeft[0].height = 57;
	
	var playerAttackingLeft = new Array(3);
	for(i = 0; i  < playerAttacking.length; ++i) {
		playerAttackingLeft[i] = new AnimationFrame();
	}
	
	playerAttackingLeft[0].positionX = 730;
	playerAttackingLeft[0].positionY = 255;
	playerAttackingLeft[0].width = 64;
	playerAttackingLeft[0].height = 71;
	
	playerAttackingLeft[1].positionX = 635;
	playerAttackingLeft[1].positionY = 275;
	playerAttackingLeft[1].width = 80;
	playerAttackingLeft[1].height = 51;
	
	playerAttackingLeft[2].positionX = 555;
	playerAttackingLeft[2].positionY = 275;
	playerAttackingLeft[2].width = 63;
	playerAttackingLeft[2].height = 51;
	
	var playerDyingLeft = new Array(5);
	for(i = 0; i < playerDying.length; ++i) {
		playerDyingLeft[i] = new AnimationFrame();
	}
	
	playerDyingLeft[0].positionX = 734;
	playerDyingLeft[0].positionY = 143;
	playerDyingLeft[0].width = 55;
	playerDyingLeft[0].height = 50;
	
	playerDyingLeft[1].positionX = 657;
	playerDyingLeft[1].positionY = 155;
	playerDyingLeft[1].width = 53;
	playerDyingLeft[1].height = 42;
	
	playerDyingLeft[2].positionX = 571;
	playerDyingLeft[2].positionY = 152;
	playerDyingLeft[2].width = 68;
	playerDyingLeft[2].height = 44;
	
	playerDyingLeft[3].positionX = 487;
	playerDyingLeft[3].positionY = 155;
	playerDyingLeft[3].width = 67;
	playerDyingLeft[3].height = 42;
	
	playerDyingLeft[4].positionX = 402;
	playerDyingLeft[4].positionY = 178;
	playerDyingLeft[4].width = 77;
	playerDyingLeft[4].height = 21;
	
	// setup animations and delay between frames for each animation
	this.animations = new Array(10);
	
	this.animations[this.PLAYER_STANDING_RIGHT] = new Animation(playerStanding);
	this.animations[this.PLAYER_STANDING_RIGHT].delay = -1;
	
	this.animations[this.PLAYER_WALKING_RIGHT] = new Animation(playerWalking);
	this.animations[this.PLAYER_WALKING_RIGHT].delay = 110;
	
	this.animations[this.PLAYER_FALLING_RIGHT] = new Animation(playerFalling);
	this.animations[this.PLAYER_FALLING_RIGHT].delay = -1;
	
	this.animations[this.PLAYER_ATTACKING_RIGHT] = new Animation(playerAttacking);
	
	this.animations[this.PLAYER_DYING_RIGHT] = new Animation(playerDying);
	
	this.animations[this.PLAYER_STANDING_LEFT] = new Animation(playerStandingLeft);
	this.animations[this.PLAYER_STANDING_LEFT].delay = -1;
	
	this.animations[this.PLAYER_WALKING_LEFT] = new Animation(playerWalkingLeft);
	this.animations[this.PLAYER_WALKING_LEFT].delay = 110;
	
	this.animations[this.PLAYER_ATTACKING_LEFT] = new Animation(playerAttackingLeft);
	this.animations[this.PLAYER_DYING_LEFT] = new Animation(playerDyingLeft);
	
	this.animations[this.PLAYER_FALLING_LEFT] = new Animation(playerFallingLeft);
	this.animations[this.PLAYER_FALLING_LEFT].delay = -1;
	
	this.width = this.animations[this.currentAnimation].frames[0].width;
	this.height = this.animations[this.currentAnimation].frames[0].height;
	
}

Player.prototype.setJumping = function(jumping) {
	if(this.mayJump) {
		this.jumping = true;
		this.playJumpAnimation = true;
	}
	if(this.mayJumpAgain) {
		this.doubleJumping = true;
	}
};

Player.prototype.update = function(dt, camera) {		
	if(this.movingRight) {
		if(this.dx > 0) this.facingRight = true;
		
		this.dx += this.acceleration;
		if(this.shiftPressed) {
			if(this.dx > this.maxFastVelocity) this.dx = this.maxFastVelocity;
		}
		if(!this.shiftPressed && this.dx > this.maxVelocity) {
			this.dx = this.maxVelocity;
		}
	}
	
	else if(this.movingLeft) {
		if(this.dx < 0) this.facingRight = false;
		
		this.dx -= this.acceleration;
		if(this.shiftPressed) {
			if(this.dx < -this.maxFastVelocity) this.dx = -this.maxFastVelocity;
		}
		else if(!this.shiftPressed && this.dx < -this.maxVelocity) {
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
		this.reachedLvlEndl = true;
		return;
	}
	
	if(this.positionY <= 0) this.positionY = 0;
	if(this.positionY + this.height >= this.yBounds) {
		this.positionY = this.yBounds - this.height;
	}
	
	camera.setPositionX(this.positionX - camera.width / 2);
};

Player.prototype.draw = function(camera) {	
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
	if(this.facingRight) {
		if(this.dy > 0) {
			if(this.currentAnimation != this.PLAYER_FALLING_RIGHT) {
				this.clearAnimation();
				this.currentAnimation = this.PLAYER_FALLING_RIGHT;
			}
		}

		else if(this.movingRight) {
			if(this.currentAnimation != this.PLAYER_WALKING_RIGHT) {
				this.clearAnimation();
				this.currentAnimation = this.PLAYER_WALKING_RIGHT;
			}
		}

		else if(!this.movingRight) {
			this.clearAnimation();
			this.currentAnimation = this.PLAYER_STANDING_RIGHT;
		}
	}
	
	if(!this.facingRight) {
		if(this.dy > 0) {
			if(this.currentAnimation != this.PLAYER_FALLING_LEFT) {
				this.clearAnimation();
				this.currentAnimation = this.PLAYER_FALLING_LEFT;
			}
		}
		
		else if(this.movingLeft) {
			if(this.currentAnimation != this.PLAYER_WALKING_LEFT) {
				this.clearAnimation();
				this.currentAnimation = this.PLAYER_WALKING_LEFT;
			}
		}
		else if(!this.movingLeft) {
			this.clearAnimation();
			this.currentAnimation = this.PLAYER_STANDING_LEFT;
		}
	}
	
	this.animations[this.currentAnimation].update(dt);
	
	this.currentFrame = this.animations[this.currentAnimation].currentFrame;
	
	var prevHeight = this.height;
	var prevWidth = this.width;
	
	this.width = this.animations[this.currentAnimation].frames[this.currentFrame].width;
	this.height = this.animations[this.currentAnimation].frames[this.currentFrame].height;
	
	// adjust height of player because some frames are larger than others
	// the previous height is compared to the height of the current frame and 
	// the necessary adjustments are made
	if(this.currentAnimation != this.PLAYER_JUMPING_RIGHT || this.currentAnimation != 
	   this.PLAYER_FALLING_RIGHT || this.currentAnimation != this.PLAYER_JUMPING_LEFT ||
	  this.currentAnimation != this.PLAYER_FALLING_LEFT) {
		if(this.height > prevHeight && !this.falling)
			this.tempY -= this.height - prevHeight;
		else if(this.height < prevHeight)
			this.tempY += prevHeight - this.height;
	}
	
	
};