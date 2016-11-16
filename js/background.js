function Background(name) {
	this.texture = Game.res.getImage(name);
	this.width = this.texture.width;
	this.height = this.texture.height;
	this.positionX = 0;
	this.positionY = 0;
}

Background.prototype.update = function(dt) {
	
};

Background.prototype.draw = function(camera) {
	camera.draw(this.texture, this.positionX, this.positionY, this.width,
			   this.height, 0, 0);
    camera.draw(this.texture, this.positionX + this.width, this.positionY, this.width, this.height, 0, 0);
    
    
};