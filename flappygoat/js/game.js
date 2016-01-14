/*
* Game object
*/

define(['gameStates'], function(gameStates){

	var game = {

		//Game.mouse holds mouse status
		mouse: {
	        x: 0,
	        y: 0,
	        clicked: false, //true when user clicks, then false onmove, even if down
	        down: false //true when user clicks, and while down even if moving
	    },

		currentState: gameStates.startMenu, //initial state of the game
			
		//Function called by the html page - initializes the game
		init: function(){

			var that = this;

			//get canvas context object
			this.canvas = document.getElementById("canvas");
			this.context = canvas.getContext("2d");
	  		this.context.font = "bold 32px Arial";

			//Listen for mouse events
			this.canvas.addEventListener("mousemove", function(e) {
				//Update mouse status
		        that.mouse.x = e.offsetX;
		        that.mouse.y = e.offsetY;
		        that.mouse.clicked = (e.which == 1 && !that.mouse.down);
		        that.mouse.down = (e.which == 1);

		        //Trigger event
		        that.currentState.onMouseMove();
		    });

		    this.canvas.addEventListener("mousedown", function(e) {
				//Update mouse status					
		        that.mouse.clicked = !that.mouse.down;
		        that.mouse.down = true;

		        //Trigger event
		    	that.currentState.onMouseDown();
		    });

		    this.canvas.addEventListener("mouseup", function(e) {
				//Update mouse status	
		        that.mouse.down = false;
		        that.mouse.clicked = false;

		        //Trigger event
		    	that.currentState.onMouseUp();
		    });

			//start game
			this.start();
		},

		//Function called to start the game - triggers the game loop
		start: function(){
			this.currentState.setContext(this.context);
			this.currentState.init( this );
			this.currentState.start();
		},

		stop: function(){
			this.currentState.stop();
		},

		startMenu: function(){
			//Stop game state and start menu
			this.stop();
			this.currentState = gameStates.startMenu;
			this.start();
		},

		startGame: function(){
			//Stop menu state and start game
			this.stop();
			this.currentState = gameStates.inGame;
			this.start();
		},

		clearCanvas: function(canvas){
			canvas.fillStyle = "#CCCC99";
			canvas.fillRect(0,0, W, H);
		}
	}

	//Return module
	return game;
});