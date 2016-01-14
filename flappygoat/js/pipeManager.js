define( ["marper"], function( marper) {

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
		//contains x coordinate of pipe [0] and pipe height [1] on each slot
		this.pipes = [[1000, 280]];
		//Goat score - counts how long since last pipe and when it
		//reaches the pipe interval, adds one to the score
		this.scoreInterval = -3500;
		this.score = 0;

		this.isColliding = function(goat){
			if( goat.isDead === true ){
				return false;
			}

			/* Check for collisions
			*
			*[pipe][0] -> pipeX
			*[pipe][1] -> pipeY
			*/

			for(var pipe in this.pipes){

				//Vars for collision checking
					//pipe
				var pipeW = this.w - 20,
					pipeH = this.h,
					pipeX = this.pipes[pipe][0] + 10,
					pipeY = this.pipes[pipe][1],
					topPipeY = this.pipes[pipe][1] - this.pipeGap + this.h,
					//goat
					goatX = goat.x,
					goatY = goat.y,
					goatW = goat.w,
					goatH = goat.h;

				if (goatX + goatW > pipeX && goatX < pipeX + pipeW //Goat is on pipe's X domain
					&& (
						goatY + goatH > pipeY || //Collision on bottom
						goatY < topPipeY ) //Collision on top
				){
					// Collision!
					return true;
				}else{
					// No Collision!
					return false;
				}

			}
		},

		this.update = function(deltaTime, goat){
			this.scoreInterval += deltaTime;

			if(this.scoreInterval >= this.pipeInterval && !goat.isDead){
				this.score++;
				this.scoreInterval = 0;
			}

			//update timeSinceLastPipe
			this.timeSinceLastPipe += deltaTime;

			//check if pipe should be deleted 
			if(this.pipes[0][0] < -this.w) this.pipes.shift();

			//check wether a pipe should be spawned or not
			if(this.timeSinceLastPipe > this.pipeInterval){
				//Add a pipe with random Y position. Min value for Y (higuest pipe) is 200 - Max is 550 (lowest pipe)
				this.pipes.push([1000, marper.getRandomInt(200, 550)]);
				//Restore timeSinceLastPipe
				this.timeSinceLastPipe = 0;
			}

			//apply velocity to pipes
			for(var x in this.pipes){
				this.pipes[x][0] += this.vx * (deltaTime * 0.001);
			}
		};

	}

	//Return module
	return PipeManager;
});