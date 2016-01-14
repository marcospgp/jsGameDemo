/*
* Game States
*/
define(['goat','pipeManager', 'sfx', 'settings', 'marper'], function(Goat, PipeManager, sfx, settings, marper){
	var gameStates = {

		/* Game state - while game is running */
		inGame: {

			//Initial state of this state (yo)
			state: "stopped",

			//Set the gameState context object
			setContext: function( context ){
				this.context = context;
			},

			//Function called by game object - initializes the game
			init: function( game ){
				//Game object that started this state
				this.parent = game;

				//create background
				this.bg = {};
				this.bg.image = new Image();
				this.bg.image.src = "img/flappybg.png";

			},

			//Function called to start the game - triggers the game loop
			start: function(){

				//change the game state
				this.state = "running";

				//set background position
				this.bg.x = 0;
				this.bg.vx = -200;

				//create goat
				this.goat = new Goat();

				//create pipeManager
				this.pipeManager = new PipeManager();

				//get current time to use as first frame time
				this.previousTime = new Date().getTime();

				//trigger game loop
				this.onFrame();

			},

			stop: function(){
				cancelAnimationFrame(this.onFrame);
				this.state = "stopped";
			},

			//The game loop basically calls this function over and over
			onFrame: function(){

				//game loop
				if(this.state === "running"){

					//calculate deltaTime
					var currentTime = new Date().getTime();
					var deltaTime = currentTime - this.previousTime;
					this.previousTime = currentTime;

					//draw and update
					this.draw(deltaTime);
					this.update(deltaTime);

					//continue looping
					requestAnimationFrame(this.onFrame.bind(this)); //Binding this to keep scope
				}
			},

			update: function(deltaTime){

				//Check if goat is colliding with one of the pipes
				if( this.pipeManager.isColliding(this.goat) ){
					this.onCollision();
				}

				//Check if game should stop
				if( this.goat.isTouchingFloor ){
					this.onGameOver();
				}

				//update the goat
				this.goat.update(deltaTime);
				//update the pipes
				this.pipeManager.update(deltaTime, this.goat);
			},

			draw: function(deltaTime){
				//Clear the canvas
				this.clearCanvas(this.context);

				//Draw the background
				this.bg.x += this.bg.vx * (deltaTime * 0.001);
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
					this.context.drawImage(this.goat.image.flyingGoat, this.goat.x, this.goat.y, this.goat.w, this.goat.h);
				}else{
					this.context.drawImage(this.goat.image.goat, this.goat.x, this.goat.y, this.goat.w, this.goat.h);
				}

				//Draw the pipes
				for(var x in this.pipeManager.pipes){
					this.context.drawImage(this.pipeManager.image, /*sourcex*/165, /*sourcey*/0, /*sourcew*/55, /*sourceh*/320, /*destinationx*/this.pipeManager.pipes[x][0], /*destinationy*/this.pipeManager.pipes[x][1], /*destinationw*/this.pipeManager.w, /*destinationh*/this.pipeManager.h);
					this.context.drawImage(this.pipeManager.image, 110, 0, 55, 320, this.pipeManager.pipes[x][0] + 4, this.pipeManager.pipes[x][1] - this.pipeManager.pipeGap, this.pipeManager.w, this.pipeManager.h);
				}

				//Draw the score
				this.context.fillText(this.pipeManager.score, 50, 70);
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

			onGameOver: function(){
				this.parent.startMenu();
			},

			/*
			* Mouse events
			*/

			onMouseMove: function(){

			},

			onMouseDown: function(){

			},

			onMouseUp: function(){

			},

			clearCanvas: function(canvas){
				canvas.fillStyle = "#CCCC99";
				canvas.fillRect(0,0, W, H);
			}
		},

		/* Game state - while game is running */
		startMenu: {

			//Initial state of this state (yo)
			state: "stopped",

			//Set the gameState context object
			setContext: function( context ){
				this.context = context;
			},

			//Function called by game object - initializes the game
			init: function( game ){
				//Game object that started this gameState
				this.parent = game;

				//create background
				this.bg = {};
				this.bg.image = new Image();
				this.bg.image.src = "img/flappybg.png";

				//create goat image
				this.goat = {};
				this.goat.image = new Image();
				this.goat.image.src = "img/goat.png";

			},

			//Function called to start the game - triggers the game loop
			start: function(){

				//change the game state
				this.state = "running";

				//set background position
				this.bg.x = 0;
				this.bg.vx = -200;

				//get current time to use as first frame time
				this.previousTime = new Date().getTime();

				//trigger game loop
				this.onFrame();

			},

			stop: function(){
				cancelAnimationFrame(this.onFrame);
				this.state = "stopped";
			},

			//The game loop basically calls this function over and over
			onFrame: function(){

				//On key press, start game
				if(key.getPressedKeyCodes().length > 0){
					this.parent.startGame();
				}

				//menu loop
				if(this.state === "running"){

					//calculate deltaTime
					var currentTime = new Date().getTime();
					var deltaTime = currentTime - this.previousTime;
					this.previousTime = currentTime;

					//draw and update
					this.draw(deltaTime);
					this.update(deltaTime);

					//continue looping
					requestAnimationFrame(this.onFrame.bind(this)); //Binding this to keep scope
				}
			},

			update: function(deltaTime){},

			draw: function(deltaTime){
				//Clear the canvas
				this.clearCanvas(this.context);

				//Draw the background
				this.bg.x += this.bg.vx * (deltaTime * 0.001);
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

				//Draw goat logo
				this.context.drawImage(this.goat.image, 400 - this.goat.image.width / 2, 50);

				//Set context font
				this.context.font = "40px Arial";
				this.context.fillStyle = "white";
				//Draw title
				this.context.fillText("Flappy           Goat", 225, 115);
				//Draw menu options
				this.context.fillText("Press any key to start", 200, 340);
			},

			/*
			* Mouse events
			*/

			onMouseMove: function(){

			},

			onMouseDown: function(){

			},

			onMouseUp: function(){

			},

			clearCanvas: function(canvas){
				canvas.fillStyle = "#CCCC99";
				canvas.fillRect(0,0, W, H);
			}
		}

	};
	return gameStates;
});