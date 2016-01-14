/*
* Game object
*/

define(['gameStates', 'goat','pipeManager','sfx', 'settings', 'marper'], function(gameStates, Goat, PipeManager, sfx, settings, marper){

	var game = {

		//Game.mouse holds mouse status
		mouse: {
	        x: 0,
	        y: 0,
	        clicked: false, //true when user clicks, then false onmove, even if down
	        down: false //true when user clicks, and while down even if moving
	    },

		state: "stopped", //initial state of the game
			
		//Function called by the html page - initializes the game
		init: function(){

			var that = this;

			//get canvas context object
			this.canvas = document.getElementById("canvas");
			this.context = canvas.getContext("2d");
	  		this.context.font = "bold 32px Arial";

			//create background
			this.bg = {};
			this.bg.image = new Image();
			this.bg.image.src = "img/flappybg.png";

			//Listen for mouse events
			this.canvas.addEventListener("mousemove", function(e) {
				//Update mouse status
		        that.mouse.x = e.offsetX;
		        that.mouse.y = e.offsetY;
		        that.mouse.clicked = (e.which == 1 && !that.mouse.down);
		        that.mouse.down = (e.which == 1);

		        //Trigger event
		        that.onMouseMove();
		    });

		    this.canvas.addEventListener("mousedown", function(e) {
				//Update mouse status					
		        that.mouse.clicked = !that.mouse.down;
		        that.mouse.down = true;

		        //Trigger event
		        that.onMouseDown();
		    });

		    this.canvas.addEventListener("mouseup", function(e) {
				//Update mouse status	
		        that.mouse.down = false;
		        that.mouse.clicked = false;

		        //Trigger event
		        that.onMouseUp();
		    });

			//start game
			this.start();
		},

		//Function called to start the game - triggers the game loop
		start: function(){

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
			marper.requestAnimationFrame(this.onFrame);
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

			//Check if goat is colliding with one of the pipes
			if( this.pipeManager.isColliding(this.goat) ){
				game.onCollision();
			}

			//Check if game should be restarted
			if( this.goat.isTouchingFloor ){
				game.stop();
				game.start();
			}

			//update the goat
			this.goat.update(deltaTime);
			//update the pipes
			this.pipeManager.update(deltaTime, this.goat);
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
			if(this.goat.isJumping){
				game.context.drawImage(this.goat.image.flyingGoat, this.goat.x, this.goat.y, this.goat.w, this.goat.h);
			}else{
				game.context.drawImage(this.goat.image.goat, this.goat.x, this.goat.y, this.goat.w, this.goat.h);
			}

			//Draw the pipes
			for(var x in this.pipeManager.pipes){
				game.context.drawImage(this.pipeManager.image, /*sourcex*/165, /*sourcey*/0, /*sourcew*/55, /*sourceh*/320, /*destinationx*/this.pipeManager.pipes[x][0], /*destinationy*/this.pipeManager.pipes[x][1], /*destinationw*/this.pipeManager.w, /*destinationh*/this.pipeManager.h);
				game.context.drawImage(this.pipeManager.image, 110, 0, 55, 320, this.pipeManager.pipes[x][0] + 4, this.pipeManager.pipes[x][1] - this.pipeManager.pipeGap, this.pipeManager.w, this.pipeManager.h);

			}

			//Draw the score
			this.context.fillText(this.pipeManager.score + " Mouse: x - " + this.mouse.x + " y - " + this.mouse.y + " clicked - " + this.mouse.clicked + " down - " + this.mouse.down, 50, 70);
		},

		onCollision: function(){
			//Play collision sound
			if(settings.playSound) sfx.willhelm.play();
			//Stop the goat (vertically)
			this.goat.vy = 0;
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

	//Return module
	return game;
});