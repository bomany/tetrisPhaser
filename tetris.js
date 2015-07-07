var game = new Phaser.Game(320, 640, Phaser.CANVAS, 'gameContainer', { preload: preload, create: create, update: update, render: render});
var map
var gridSize = 64;
var movement = true;
var movementDown = true;
piece = [];
stack = [];  

function createMap(cols, lines) {
	map = [];
	for(var l = 0; l < lines; l++ ) {
		map[l] = [];
		for(var c = 0; c < cols; c++) {
			map[l][c] = null;
		}
	}
	return map
}
function getMapIndex(obj){
	for(var l = 0; l < map.length; l++){
	    c = map[l].indexOf(obj);
	    if (c > -1){
	        return [l, c];
	    }
	}
}

function MaptoCoords(index) {
	return index*gridSize;
}

/*function updateWithMap() { //Old function
	for(var l = 0; l < map.length; l++) {
		for(var c = 0; c < map[l].length; c++) {
			if(map[l][c]) {
				map[l][c].block.x = MaptoCoords(c);
				map[l][c].block.y = MaptoCoords(l);
			}
		}
	}
}*/

function updateWithMap() {
	for(var i = 0; i <= piece.length-1; i++){
		map[piece[i].mapL][piece[i].mapC] = piece[i];
		piece[i].block.x = MaptoCoords(piece[i].mapC);
		piece[i].block.y = MaptoCoords(piece[i].mapL);
	}
}

function checkCollision(direction){
	for(var i = 0; i <= piece.length-1; i++) {
		if (direction == "left") {
			if (!(piece[i].mapC > 0)) {
				console.log("left collision with wall returned true ", i);
				return true;
			} else if ( !(map[piece[i].mapL][piece[i].mapC-1] == null) && (map[piece[i].mapL][piece[i].mapC-1].active == false)) {
				console.log("left collision with block returned true ", i);
				return true;
			}

		} else if (direction == "right") {
			if (!(piece[i].mapC < map[piece[i].mapL].length-1)) {
				console.log("right collision with wall returned true ", i);
				return true;
			} else if ( !(map[piece[i].mapL][piece[i].mapC+1] == null) && (map[piece[i].mapL][piece[i].mapC+1].active == false)) {
				console.log("right collision with block returned true ", i);
				return true;
			}
		} else if (direction == "down") {
			if (!(piece[i].mapL < map.length-1)) {
				return true;
			}
		}

	}
	console.log("all collisions returned false");
	return false;
}

function moveWithMap(direction) {

	if (!(checkCollision(direction))) {
		if (direction == "left") {

			for(var i = 0; i <= piece.length-1; i++) {
				map[piece[i].mapL][piece[i].mapC] = null;
				piece[i].mapC -= 1;
			}

		} else if (direction == "right") {
			for(var i = 0; i <= piece.length-1; i++) {
				map[piece[i].mapL][piece[i].mapC] = null;
				piece[i].mapC += 1;
			}
		} else if (direction == "down") {
			for(var i = 0; i <= piece.length-1; i++) {
				map[piece[i].mapL][piece[i].mapC] = null;
				piece[i].mapL += 1;
			}
		}
		updateWithMap();
	}
	
}



Block = function (mapL, mapC) {
	this.mapL = mapL;
	this.mapC = mapC;
	this.active = true;
	
	this.x = MaptoCoords(mapC);
	this.y = MaptoCoords(mapL);
	this.block = game.add.sprite(this.x, this.y, 'square');
	// piece.add(this.block);
	map[mapL][mapC] = this;
}


function preload() {
	game.load.image('square', 'assets/square.png');  
}

function create() {
	// var size = 64;
	map = createMap(320/gridSize,640/gridSize);
	piece.push(new Block(0,2));
	
	piece.push(new Block(1,2));
	piece.push(new Block(0,3));
	// piece.push(new Block(1,3));

	// stack.push(new Block(1,0));
	stack.push(new Block(1,4));
	for(var i = 0; i <= stack.length-1; i++) {
		stack[i].active = false;
	}
	console.log(stack);

	for (var i = 0; i < map.length; i++){
		console.log("Line ", i ,": ", map[i]);
	}
	cursors = this.input.keyboard.createCursorKeys();

	timer = game.time.create(true);

    // timer.add(1, moveTimer);
    timer.loop(1000, movePieceDown, this);
    timer.start();
    console.log(getMapIndex(map[0][2]));
    console.log(map);
}

function moveTimer() {

    movement = true;
}

function movePieceDown() {
	moveWithMap("down");
}

function update() {

	if ((cursors.left.isDown) && (movement)) {
		moveWithMap("left");
		movement = false;
		timer.add(500, moveTimer);

	} else if ((cursors.right.isDown) && (movement)) {
		moveWithMap("right");
		movement = false;
		timer.add(500, moveTimer);
	}

	// switch (move) {
	// 	case cursors.left.isDown
	// }

/*	if (movementDown) {
		moveWithMap("down");
		movementDown = false;
		timer.add(2000, movePieceDown);
	}*/

	


	if ((cursors.up.isDown) && (movement)) {
		for (var i = 0; i < map.length; i++){
			console.log("Line ", i ,": ", map[i]);
		}
		movement = false;
		timer.add(500, moveTimer);
	}

	if ((cursors.down.isDown) && (movement)) {
		for (var i = 0; i < stack.length; i++){
			console.log("Line ", i ,": ", map[i]);
		}
		movement = false;
		timer.add(500, moveTimer);
	}

}

function render() {
	game.debug.text("Time until event: " + timer.duration.toFixed(0), 10, 20);
	for(var i = 0; i < piece.length; i++){
		game.debug.text(i, piece[i].block.x+32, (piece[i].block.y+32));
	}
}