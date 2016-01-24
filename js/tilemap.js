function Tile(tileWidth, tileHeight, tileType, tileImgXPosition, tileImgYPosition) {
	this.width = tileWidth;
	this.height = tileHeight;
	this.type = tileType;
	this.imgXPosition = tileImgXPosition;
	this.imgYPosition = tileImgYPosition;
	this.positionX = 0;
	this.positionY = 0;
}

// tile types
Tile.UNBLOCKED = 0;
Tile.BLOCKED = 1;

// TileMapLayer - A layer composed of tiles for the TileMap.
// layerName - name of the layer
// mapWidth - width of map in tiles
// mapHeight - height of map in tiles
// layerName - the name of the layer
// tileSetWidth - the number of tiles across the tileset
// tileSetHeight - the number of tiles high the tileset is
// tileData - the arrangement of tiles in xml format
function TileMapLayer(mapWidth, mapHeight, tileWidth, tileHeight, layerName, 
					   tileSetWidth, tileSetHeight, tileCount, tileData) {
	'use strict';
	this.name = layerName;
	this.width = mapWidth;
	this.height = mapHeight;
	
	this.tiles = [];
	this.data = tileData;
	this.tileHeight = tileHeight;
	this.tileWidth = tileWidth;
	
	// The tileset that makes up the tilemap
	this.tileSet = Game.res.getImage('tileSet');
	
	// An array of integers used to figure out whether there is a tile where the
	// player is
	this.map = [];
	
	// copy data into the map
	for(var count = 0; count < tileData.length; ++count) {
		this.map.push(tileData[count]);
	}
	
	// initialize tile types
	for(var j = 0; j < tileSetHeight / tileHeight; ++j) {
		for(var i = 0; i < tileSetWidth / tileWidth; ++i) {
			this.tiles.push(new Tile(this.tileWidth, this.tileHeight,
									Tile.BLOCKED, i * this.tileWidth,
									j * this.tileHeight));
		}
	}
	
	// add a blank tile to the beginning because 0 means no tile is drawn
	this.tiles.splice(0, 0, new Tile(this.tileWidth, this.tileHeight, Tile.UNBLOCKED, 0, 0));	
	
}

TileMapLayer.prototype.getTileType = function(x, y) {
	var tempY = parseInt(y / this.tileHeight);
	var tempX = parseInt(x / this.tileWidth);
	
	return this.tiles[this.map[this.width * tempY + tempX]].type;
};

TileMapLayer.prototype.draw = function(camera) {
	// where to start drawing the tiles. Draw 1 more on each side to cover up
	// all empty places
	var startX = (camera.positionX / this.tileWidth - 1);
	
	if(startX < 0) startX = 0;
	
	
	var endX = ((camera.positionX + camera.width) / this.tileWidth + 1);
	if(endX > this.width) endX = this.width;

	var startY = (camera.positionY / this.tileHeight - 1);
	if(startY < 0) startY = 0;
	
	var endY = ((camera.positionY + camera.height) / this.tileHeight + 1);
	
	ctx.beginPath();
	for(var row = 0; row < this.height; ++row) {
		for(var col = 0; col < this.width; ++col) {
			var tileId = this.map[this.width * row + col];
			if(tileId !== 0) {
				var t = this.tiles[tileId];
				camera.draw(this.tileSet, col * this.tileWidth, row * this.tileHeight,
					   this.tileWidth, this.tileHeight, t.imgXPosition, t.imgYPosition);
			}
		}
	}
	
	ctx.closePath();
};

// A TileMapObject can be anything on the tilemap. For example, it could be
// coins, or enemies.
function TileMapObject(positionX, positionY, objId) {
	'use strict';
	this.positionX = positionX;
	this.positionY = positionY;
	this.id = objId;
}

function TileMapObjectLayer(layerName) {
	'use strict';
	this.name = layerName;
	this.objects = [];
	
}

TileMapObjectLayer.prototype.addObject = function(tileObj) {
	this.objects.push(tileObj);
};


function TileMap() {
	'use strict';
	this.mapLayers = [];
	this.objectLayers = [];
}
	
TileMap.prototype.getObjectLayer = function(layerName) {
	for(var i = 0; i < this.objectLayers.length; ++i) {
		if(this.objectLayers[i].name === layerName) {
			return this.objectLayers[i];
		}
	}
};

TileMap.prototype.getTileLayer = function(layerName) {
	for(var i = 0; i < this.objectLayers.length; ++i) {
		if(this.mapLayers[i].name === layerName) {
			return this.mapLayers[i];
		}
	}
};

// Loads the level file. The file is a JSON file created by Tiled.
TileMap.prototype.loadFile = function(pathToFile, callback) {
	'use strict';	
	var xhr = new XMLHttpRequest();
	var that = this;
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			console.log('reading file in');
			
			var levelData = JSON.parse(xhr.responseText);
			
			var lvlHeight = levelData.height;
			var lvlWidth = levelData.width;
			console.log(pathToFile);
			
			// tilemap tile data
			var tilesets = levelData.tilesets;
			var tilesetWidth = tilesets[0].imagewidth;
			var tilesetHeight = tilesets[0].imageheight;
			var tileWidth = levelData.tilesets[0].tilewidth;
			var tileHeight = levelData.tilesets[0].tileheight;
			var tileCount = levelData.tilesets[0].tilecount;
			
			Game.res.addImageFromPath('tileSet', '/rise-of-oxshan/res/maps/' + tilesets[0].image);
			
			var layers = levelData.layers;
			
			for(var i = 0; i < layers.length; ++i) {
				// check whether the layer is a tile layer or object layer
				if(layers[i].type === 'tilelayer') {
					that.mapLayers.push(new TileMapLayer(lvlWidth, lvlHeight,
														tileWidth, tileHeight,
														layers[i].name, tilesetWidth,
														tilesetHeight, 
														 tileCount, layers[i].data));
				}
				else if(layers[i].type === 'objectgroup') {
					var layerName = layers[i].name;
					var objects = layers[i].objects;
					that.objectLayers.push(new TileMapObjectLayer(layerName));
					for(var obj = 0; obj < objects.length; ++obj) {
						// get object's x and y position, and it's id
						that.objectLayers[that.objectLayers.length - 1].addObject(
														new TileMapObject(
														objects[obj].x,
														objects[obj].y,
														objects[obj].id));
					}
				}
			}
			
			console.log('finished parsing tilemap. calling callback');
			
			callback();
			
		}
	};
	xhr.overrideMimeType("application/json");
	xhr.open('GET', pathToFile, true);
	xhr.send(null);
};

TileMap.prototype.draw = function(camera) {
	for(var i = 0, j = this.mapLayers.length; i < j; ++i) {
		this.mapLayers[i].draw(camera);
	}
};