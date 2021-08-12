let gameBackground = {
	canvas: document.createElement("canvas"),
	init: function() {
		this.canvas.width = 700;
		this.canvas.height = 500;
		this.canvas.style.backgroundColor = "black";
		this.canvas.style.zIndex = "0";
		this.context = this.canvas.getContext("2d");
		this.context.fillStyle = "white";
		this.bHeight = 10;
		this.bGap = 5;
		this.context.fillRect(this.bGap, this.bGap, this.canvas.width - (this.bGap * 2), this.bHeight);
		this.context.fillRect(this.bGap, this.canvas.height - this.bGap - this.bHeight, this.canvas.width - (this.bGap * 2), this.bHeight);
		let l_height = 15;
		let l_width = 5;
		let l_gap = 8;
		let l_y = 15 + l_gap;
		while (l_y < (this.canvas.height - 15 - l_gap)) {
			this.context.fillRect((this.canvas.width / 2) - (l_width / 2), l_y, l_width, l_height);
			l_y += (l_height + l_gap);
		}
		document.body.appendChild(this.canvas);
	}
}

let gameArea = {
	canvas: document.createElement("canvas"),
	init: function() {
		this.canvas.width = 700;
		this.canvas.height = 500;
		//this.canvas.style.backgroundColor = "transparent";
		this.canvas.style.zIndex = "1";
		this.context = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		this.interval = setInterval(updateGame, (1/120)*1000);
		gameArea.keys = [];
		window.addEventListener('keydown', function(e) {
			gameArea.keys[e.keyCode] = true;
		})
		window.addEventListener('keyup', function(e) {
			gameArea.keys[e.keyCode] = false;
		})
	},
	stop: function() {
		clearInterval(this.interval);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

let ball = {
	width: 10,
	height: 10,
	color: "white",
	init: function(x, y) {
		this.velocity = 3;
		let max = gameArea.canvas.height - (gameBackground.bHeight + gameBackground.bGap) - this.height;
		let min = (gameBackground.bHeight + gameBackground.bGap);
		let rNum = Math.floor(Math.floor(Math.random() * (max - min)) + min);
		this.x = (gameArea.canvas.width / 2) - (this.width / 2);
		this.y = rNum;
		let velComps = this.findComponents(45);
		this.xComp = velComps[0];
		this.yComp = velComps[1];
		if (rNum % 2 == 0) {
			this.yComp *= -1;
		}
		if (lastScore == "right") {
			this.xComp *= -1;
		}
		serveInt = setInterval(server, (1/120)*1000);
	},
	findComponents: function(angle) {
		let radians = angle * (Math.PI / 180);
		let xComponent = this.velocity * Math.cos(radians);
		let yComponent = this.velocity * Math.sin(radians) * -1;
		return [xComponent, yComponent];
	},
	update: function() {
		this.move();
		let cntxt = gameArea.context;
		cntxt.fillStyle = this.color;
		cntxt.fillRect(this.x, this.y, this.width, this.height);
	},
	borderCollide: function(y) {
		if ((y <= (gameBackground.bHeight + gameBackground.bGap)) || ((y + this.height) >= (gameBackground.canvas.height - (gameBackground.bHeight + gameBackground.bGap)))) {
			return true;
		}
		return false;
	},
	leftCollide: function(x,y) {
		if (((x <= (leftPaddle.x + leftPaddle.width) && (x + this.width) >= (leftPaddle.x)) && (y <= (leftPaddle.y + leftPaddle.height) && (y + this.height) >= (leftPaddle.y)))) {
			return true;
		}
		return false;
	},
	rightCollide: function(x,y) {
		if ((x <= (rightPaddle.x + rightPaddle.width) && (x + this.width) >= (rightPaddle.x)) && (y <= (rightPaddle.y + rightPaddle.height) && (y + this.height) >= (rightPaddle.y))) {
			return true;
		}
		return false;
	},
	move: function() {
		let newAngle;
		let paddleSegment;
		let comps;
		let center = this.y + (this.height / 2);
		if (this.borderCollide(this.y)) {
			this.yComp *= -1;
		}
		if (this.leftCollide(this.x, this.y)) {
			paddleSegment = leftPaddle.height / 6;
			if (center < leftPaddle.y + paddleSegment) {
				newAngle = 75;
			}
			if (center >= leftPaddle.y + paddleSegment) {
				newAngle = 45;
			}
			if (center >= leftPaddle.y + (paddleSegment * 2)) {
				newAngle = 0;
			}
			if (center >= leftPaddle.y + (paddleSegment * 4)) {
				newAngle = 315;
			}
			if (center >= leftPaddle.y + (paddleSegment * 5)) {
				newAngle = 285;
			}
			comps = this.findComponents(newAngle);
			this.xComp = comps[0];
			this.yComp = comps[1];
			this.velocity += 0.1;
			//console.log("velocity components: ", this.xComp, this.yComp);
			//console.log("collision point: ", this.x, this.y);
			//console.log("left paddle position: ", leftPaddle.x, leftPaddle.y);
			//console.log("angle: ", newAngle);
		} else if (this.rightCollide(this.x, this.y)) {
			paddleSegment = rightPaddle.height / 6;
			if (center < rightPaddle.y + paddleSegment) {
				newAngle = 105;
			}
			if (center >= rightPaddle.y + paddleSegment) {
				newAngle = 135;
			}
			if (center >= rightPaddle.y + (paddleSegment * 2)) {
				newAngle = 180;
			}
			if (center >= rightPaddle.y + (paddleSegment * 4)) {
				newAngle = 225;
			}
			if (center >= rightPaddle.y + (paddleSegment * 5)) {
				newAngle = 255;
			}
			comps = this.findComponents(newAngle);
			this.xComp = comps[0];
			this.yComp = comps[1];
			this.velocity += 0.1;
			//console.log("velocity components: ", this.xComp, this.yComp);
			//console.log("collision point: ", this.x, this.y);
			//console.log("right paddle position: ", rightPaddle.x, rightPaddle.y);
			//console.log("angle: ", newAngle);
		}
		this.x += this.xComp;
		this.y += this.yComp;
	}
}

let serveInt;
let serve = 0;
let lastScore = "right";
let leftPaddle;
let rightPaddle;
let leftScore;
let leftScore2;
let rightScore;
let rightScore2;

function paddle(x, y, width, height) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.speed = 0;
	this.color = "white";
	this.update = function() {
		this.y += this.speed;
		let ctxt = gameArea.context;
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x, this.y, this.width, this.height);
	}
	this.topCollide = function() {
		if (this.y <= (gameBackground.bHeight + gameBackground.bGap + 8)) {
			return true;
		}
		return false;
	}
	this.bottomCollide = function() {
		if ((this.y + this.height) >= (gameBackground.canvas.height - (gameBackground.bHeight + gameBackground.bGap + 8))) {
			return true;
		}
		return false;
	}
}

function score(x, y, width) {
	this.x = x;
	this.y = y;
	this.value = -1;
	this.cellWidth = width / 4;
	this.cellLength = width;
	this.cells = [
		{x:this.x, y:this.y, width:this.cellLength, height:this.cellWidth, color:"white"}, //top
		{x:this.x, y:this.y, width:this.cellWidth, height:this.cellLength, color:"white"}, //top left
		{x:(this.x + this.cellLength - this.cellWidth), y:this.y, width:this.cellWidth, height:this.cellLength, color:"white"}, //top right
		{x:this.x, y:(this.y + this.cellLength - (this.cellWidth / 2)), width:this.cellLength, height:this.cellWidth, color:"white"}, //middle
		{x:this.x, y:(this.y + this.cellLength), width:this.cellWidth, height:this.cellLength, color:"white"}, //bottom left
		{x:(this.x + this.cellLength - this.cellWidth), y:(this.y + this.cellLength), width:this.cellWidth, height:this.cellLength, color:"white"}, //bottom right
		{x:this.x, y:(this.y + (this.cellLength * 2) - this.cellWidth), width:this.cellLength, height:this.cellWidth, color:"white"}, //bottom
	];
	this.update = function() {
		if (this.value > 9) {
			this.value = 0;
		}
		
		let cellValue;
		switch (this.value) {
			case 0:
				cellValue = [1,1,1,0,1,1,1];
				break;
			case 1:
				cellValue = [0,0,1,0,0,1,0];
				break;
			case 2:
				cellValue = [1,0,1,1,1,0,1];
				break;
			case 3:
				cellValue = [1,0,1,1,0,1,1];
				break;
			case 4:
				cellValue = [0,1,1,1,0,1,0];
				break;
			case 5:
				cellValue = [1,1,0,1,0,1,1];
				break;
			case 6:
				cellValue = [0,1,0,1,1,1,1];
				break;
			case 7:
				cellValue = [1,0,1,0,0,1,0];
				break;
			case 8:
				cellValue = [1,1,1,1,1,1,1];
				break;
			case 9:
				cellValue = [1,1,1,1,0,1,0];
				break;
			default:
				cellValue = [0,0,0,0,0,0,0];
		}
		
		for (let j=0; j < 7; j++) {
			switch (cellValue[j]) {
				case 0:
					this.cells[j].color = "transparent";
					break;
				case 1:
					this.cells[j].color = "white";
					break;
				default:
					this.cells[j].color = "transparent";
			}
		}
	}
	this.draw = function() {
		let ctext = gameArea.context;
		for (let i=0; i < 7; i++) {
			ctext.fillStyle = this.cells[i].color;
			ctext.fillRect(this.cells[i].x, this.cells[i].y, this.cells[i].width, this.cells[i].height);
		}
	}
}

function pauseGame() {
    gameArea.keys[27] = false;
    alert("Game is paused");
}

function gameEnd(winner) {
    let message = winner + " wins!"
    let victor = document.getElementById("winner");
    victor.innerHTML = message;
    victor.style.display = "block";
    let btn = document.getElementById("button");
    btn.innerHTML = "Play Again";
    btn.style.display = "inline-block";
    btn.onclick = function() {
        this.style.display = "none";
        document.getElementById("winner").style.display = "none";
        restart();
    }
    gameArea.stop();
}

function updateGame() {
	gameArea.clear();
	let paddle_speed = 5;
	leftPaddle.speed = 0;
	rightPaddle.speed = 0;
    if (gameArea.keys && gameArea.keys[27]) {pauseGame();}
	if (gameArea.keys && gameArea.keys[87] && !leftPaddle.topCollide()) {leftPaddle.speed -= paddle_speed;}
	if (gameArea.keys && gameArea.keys[83] && !leftPaddle.bottomCollide()) {leftPaddle.speed += paddle_speed;}
	if (gameArea.keys && gameArea.keys[38] && !rightPaddle.topCollide()) {rightPaddle.speed -= paddle_speed;}
	if (gameArea.keys && gameArea.keys[40] && !rightPaddle.bottomCollide()) {rightPaddle.speed += paddle_speed;}
	leftPaddle.update();
	rightPaddle.update();
	ball.update();
	if ((ball.x + ball.width) < 0 && !serve) {
		serve = 2;
	} else if (ball.x > gameArea.canvas.width && !serve) {
		serve = 1;
	}
	leftScore.draw();
	leftScore2.draw();
	rightScore.draw();
	rightScore2.draw();
    if (leftScore.value == 9) {
        gameEnd("Player 1");
    } else if (rightScore.value == 9) {
        gameEnd("Player 2");
    }
}

function server() {
	if (serve > 0) {
		if (serve == 1) {
			leftScore.value += 1;
			leftScore.update();
			lastScore = "left";
		} else if (serve == 2) {
			rightScore.value += 1;
			rightScore.update();
			lastScore = "right";
		}
		clearInterval(serveInt);
        if (leftScore.value < 9 && rightScore.value < 9) {
            setTimeout(function() {ball.init(); serve = 0;}, 1000);
        }
	}
}

function play() {
    let btn = document.getElementById("button");
    btn.style.display = "none";
    ball.init();
}

function gameStart() {
	gameBackground.init();
	gameArea.init();
	let paddle_dist_from_wall = 60;
	let paddle_dist_from_top = 215;
	let paddle_width = 8;
	let paddle_height = 54;
	let score_width = 35;
	leftPaddle = new paddle(paddle_dist_from_wall, paddle_dist_from_top, paddle_width, paddle_height);
	rightPaddle = new paddle(gameArea.canvas.width - paddle_dist_from_wall - paddle_width, paddle_dist_from_top, paddle_width, paddle_height);
	leftScore = new score((gameArea.canvas.width / 2) - score_width - 50, (gameBackground.bGap * 2) + gameBackground.bHeight + 15, score_width);
	leftScore2 = new score(leftScore.x - score_width - 10, leftScore.y, score_width);
	rightScore = new score((gameArea.canvas.width / 2) + (score_width * 2) + 60, leftScore.y, score_width);
	rightScore2 = new score(rightScore.x - score_width - 10, rightScore.y, score_width);
	leftScore.value = rightScore.value = 0;
	leftScore.update();
	leftScore2.update();
	rightScore.update();
	rightScore2.update();
    let par = document.createElement("p");
    par.id = "winner";
    par.style.display = "none";
    par.style.position = "absolute";
    par.style.top = "150px";
    par.style.left = "800px";
    let btn = document.createElement("Button");
    btn.innerHTML = "Start";
    btn.id = "button";
    btn.onclick = function() {play();}
    btn.style.position = "absolute";
    btn.style.top = "200px";
    btn.style.left = "800px";
    btn.style.zIndex = 5;
    document.body.appendChild(par);
    document.body.appendChild(btn);
}

function restart() {
	gameBackground.init();
	gameArea.init();
    serve = 0;
	let paddle_dist_from_wall = 60;
	let paddle_dist_from_top = 215;
    let paddle_width = 8;
	let paddle_height = 54;
    leftPaddle.x = paddle_dist_from_wall;
    leftPaddle.y = paddle_dist_from_top;
	rightPaddle.x = gameArea.canvas.width - paddle_dist_from_wall - paddle_width;
    rightPaddle.y = paddle_dist_from_top;
    leftScore.value = rightScore.value = 0;
	leftScore.update();
	leftScore2.update();
	rightScore.update();
	rightScore2.update();
	ball.init();
}