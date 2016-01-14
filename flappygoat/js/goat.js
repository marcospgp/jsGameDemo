define(['keymaster'], function(keymaster) {

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
		//Istouchingfloor
		this.isTouchingFloor = false;

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
				this.isTouchingFloor = true;
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

	}

	//Return module
	return Goat;
});