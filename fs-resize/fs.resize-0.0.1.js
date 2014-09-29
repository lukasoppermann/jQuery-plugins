// ----------------------------------------------------
// FS_Resize Function
//
// @description: This fn debounces the resize event so it fires every 100ms only,
// because if it fires to often it can cause problems in some browsers.
// ----------------------------------------------------
// define functions 
;(function( $ )
{
	// ----------------------------------------------------
	// debounced resize event (fires once every 100ms)
	$.fn.fs_resize = function( c, t )
	{
		onresize = function(){
			clearTimeout( t );
			t = setTimeout( c, 100)
		};
		return c;
	};	
	// ----------------------------------------------------
// add jquery to scope	
})( jQuery );