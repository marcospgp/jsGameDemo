//Creating requestAnimationFrame to avoid crashing the browser
var requestAnimatonFrame = (function(){
	return  window.requestAnimationFrame   || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Defining vars
var W = 800, 
	H = 600,
	LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

//Object for sounds
var sfx = {
	willhelm: new Audio("sound/willhelm.wav")
};

//Game object - doesn't have to be a class
game = {

	state: "stopped", //initial state of the game
		
	//Function called by the html page - initializes the game
	init: function(){

		//get canvas context object
		var canvas = document.getElementById("canvas");
		this.context = canvas.getContext("2d");
  		this.context.font = "bold 32px Arial";

		//create background
		this.bg = {};
		this.bg.image = new Image();
		this.bg.image.src = "img/flappybg.png";

		//start game
		this.start(this.context);
	},

	//Function called to start the game - triggers the game loop
	start: function(canvas){

		//change the game state
		this.state = "running";

		//set background position
		this.bg.x = 0;

		//create goat
		this.goat = new Goat();

		//create pipeManager
		this.pipeManager = new PipeManager();

		//get current time to use as first frame time
		this.previousTime = new Date().getTime();

		//trigger game loop
		requestAnimationFrame(this.onFrame);
	},

	stop: function(){
		this.state = "stopped";
	},

	//The game loop basically calls this function over and over
	onFrame: function(){
		//game loop
		if(game.state === "running"){

			//calculate deltaTime
			var currentTime = new Date().getTime();
			var deltaTime = currentTime - game.previousTime;
			game.previousTime = currentTime;

			//draw and update
			game.draw(deltaTime);
			game.update(deltaTime);

			//continue looping
			requestAnimationFrame(game.onFrame);
		}
	},

	update: function(deltaTime){
		//update the goat
		this.goat.update(deltaTime);
		//update the pipes
		this.pipeManager.update(deltaTime);
	},

	draw: function(deltaTime){
		//Clear the canvas
		this.clearCanvas(game.context);

		//Draw the background
		this.bg.x -= 200 * (deltaTime * 0.001);
		this.context.drawImage(this.bg.image, this.bg.x, 0, 350, H);
		// Draw another image at the right edge of the first image
		this.context.drawImage(this.bg.image, this.bg.x  + 350 , 0, 350, H);
		//and another
		this.context.drawImage(this.bg.image, this.bg.x  + 700 , 0, 350, H);
		//and a last one (damn you bg-repeat, where did you go)
		this.context.drawImage(this.bg.image, this.bg.x  + 1050 , 0, 350, H);
		// If the image scrolled off the screen, reset
		if (this.bg.x <= -350){
			this.bg.x += 350;
		}

		//Draw the goat
		this.goat.draw();
		//Draw the pipes
		this.pipeManager.draw();
		//Draw the score
		this.context.fillText(this.pipeManager.score, 50, 70);
	},

	onCollision: function(){
		sfx.willhelm.play();
		//Stop the pipes (so the goat appears to stop)
		this.pipeManager.vx = 0;
		//Disable the goat from jumping
		this.goat.isDead = true;
	},

	clearCanvas: function(canvas){
		canvas.fillStyle = "#CCCC99";
		canvas.fillRect(0,0, W, H);
	}
}

//Goat class
function Goat(){

	//Create image object and cache sprites
	this.image = {};
	this.image.goat = new Image();
	this.image.flyingGoat = new Image();
	this.image.goat.src = "img/goat.png";
	this.image.flyingGoat.src = "img/flyinggoat.png";

	//destination size
	this.w = 67.2;
	this.h = 80;
	//position
	this.x = 100;
	this.y = (H - 150) / 2;
	//speed - pixels per second
	this.vx = 0;
	this.vy = 0;
	//acceleration - pixels per second per second
	this.ax = 0;
	this.ay = 1000;
	//Used to calculate wether the goat should be allowed to jump at a given moment
	this.allowJump = true;
	//Used to change sprite based on goat status
	this.isJumping = false;
	//Isalive
	this.isDead = false;

	this.update = function(deltaTime){

		//Update timeSinceLastJump
		this.timeSinceLastJump += deltaTime;

		/*
		*  Decide if the goat should jump or not:
		*  - This if/elseif scheme allows frequent jumping
		*    by intermitently pressing a key, but not by holding the key down
		*/
		if( !this.isDead && this.allowJump == true && key.getPressedKeyCodes().length > 0 ){
			//change sprite
			this.isJumping = true;
			//jump
			this.vy = -380;
			//refuse to jump until user lets key go
			this.allowJump = false;

		}else if( !this.isDead && key.getPressedKeyCodes().length <= 0 ){
			//change sprite
			this.isJumping = false;

			//allow to jump on the next frame because no key
			//was pressed on this one
			this.allowJump = true;
		}

		//Kill goat if it touches the floor :(
		if(this.y >= H - this.h){
			game.stop();
			game.start();
		}

		//If goat is way out of bounds, disable jumping
		if(this.y < -50){
			this.allowJump = false;
		}

		//apply acceleration
		this.vx += this.ax * (deltaTime * 0.001);
		this.vy += this.ay * (deltaTime * 0.001);

		//move the goat every frame
		this.x += this.vx * (deltaTime * 0.001);
		this.y += this.vy * (deltaTime * 0.001);
	};

	this.draw = function(){
		//Draw the goat
		if(this.isJumping){
			game.context.drawImage(this.image.flyingGoat, this.x, this.y, this.w, this.h);
		}else{
			game.context.drawImage(this.image.goat, this.x, this.y, this.w, this.h);
		}
	};
}

//Enemy class
function PipeManager(){
	//sprite
	this.image = new Image();
	this.image.src = "img/pipes.png";
	//destination size
	this.w = 80;
	this.h = 420;
	//speed - pps
	this.vx = -200;
	//time since last pipe was spawned
	this.timeSinceLastPipe = 0;
	//interval between pipe spawn
	this.pipeInterval = 1500;
	//Size of the height gap between upper and lower pipes
	this.pipeGap = 580;
	//pipes array
	//contains x coordinate of pipe and pipe height on each slot
	this.pipes = [[1000, 280]];
	//Goat score - counts how long since last pipe and when it
	//reaches the pipe interval, adds one to the score
	this.scoreInterval = -3500;
	this.score = 0;

	this.update = function(deltaTime){
		this.scoreInterval += deltaTime;

		if(this.scoreInterval >= this.pipeInterval && !game.goat.isDead){
			this.score++;
			this.scoreInterval = 0;
		}

		//Vars for collisions
		var pipeW = this.w - 20,
			pipeH = this.h,
			goatX = game.goat.x + 5,
			goatY = game.goat.y,
			goatW = game.goat.w - 10,
			goatH = game.goat.h;

		//Check for collisions
		for(var pipe in this.pipes){

			var pipeX = this.pipes[pipe][0] + 10,
				pipeY = this.pipes[pipe][1],
				topPipeY = this.pipes[pipe][1] - 600;


			if (pipeX < goatX + goatW
				&& pipeX + pipeW  > goatX
				&& pipeY < goatY + goatH
				&& pipeY + pipeH > goatY
				||
				pipeX < goatX + goatW
				&& pipeX + pipeW  > goatX
				&& topPipeY < goatY + goatH
				&& topPipeY + pipeH > goatY
			){
				// Collision!
				game.onCollision();
			}
		}

		//update timeSinceLastPipe
		this.timeSinceLastPipe += deltaTime;

		//check wether a pipe should be spawned or not
		if(this.timeSinceLastPipe > this.pipeInterval){
			//Add a pipe with random Y position. Min value for Y (higuest pipe) is 200 - Max is 550 (lowest pipe)
			this.pipes.push([1000, getRandomInt(200, 550)]);
			//remove first pipe from array
			if(this.pipes.length > 4){ this.pipes.shift(); };
			this.timeSinceLastPipe = 0;
		}

		//apply velocity to pipes
		for(var x in this.pipes){
			this.pipes[x][0] += this.vx * (deltaTime * 0.001);
		}
	};

	this.draw = function(){
		//draw pipes
		for(var x in this.pipes){
			game.context.drawImage(this.image, /*sourcex*/165, /*sourcey*/0, /*sourcew*/55, /*sourceh*/320, /*destinationx*/this.pipes[x][0], /*destinationy*/this.pipes[x][1], /*destinationw*/this.w, /*destinationh*/this.h);
			game.context.drawImage(this.image, 110, 0, 55, 320, this.pipes[x][0] + 4, this.pipes[x][1] - this.pipeGap, this.w, this.h);

		}
	};

}