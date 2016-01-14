/*	Small library for personal use by Marcos Pereira - marcos97pereira@gmail.com
*
*	           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
*                   Version 2, December 2004
*
*			Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
*
*		Everyone is permitted to copy and distribute verbatim or modified
*		copies of this license document, and changing it is allowed as long
*		as the name is changed.
*
*           	DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
*  		TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
*
* 				0. You just DO WHAT THE FUCK YOU WANT TO.
*/

var marper = {

	//Returns a random integer between min and max
	getRandomInt: function(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	//Creating requestAnimationFrame to avoid crashing the browser
	// requestAnimatonFrame: (function(){
	// 	return  window.requestAnimationFrame   || 
	// 	        window.webkitRequestAnimationFrame || 
	// 	        window.mozRequestAnimationFrame    || 
	// 	        window.oRequestAnimationFrame      || 
	// 	        window.msRequestAnimationFrame     || 
	// 	        function(/* function */ callback, /* DOMElement */ element){
	// 	            window.setTimeout(callback, 1000 / 60);
	//        		};
	// })();

	//Automatically makes window.requestAnimationFrame and
	//window.cancelAnimationFrame usable functions for any browser
	autoSetReqAnimFrame: (function() {
	    var lastTime = 0;
	    var vendors = ['webkit', 'moz'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame =
	          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame){
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }else{}

	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());
	
};


/*
* Make the library compatible with require.js
*/
if ( typeof define === "function" && define.amd ) {
    define( function() {
        return marper;
    });
}