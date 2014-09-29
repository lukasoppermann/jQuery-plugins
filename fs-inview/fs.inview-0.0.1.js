// ----------------------------------------------------
// FS_Inview Function
//
// @description: This fn checks if an element is in view (inside viewport)
// ----------------------------------------------------
// define functions 
;(function( $ )
{
	// ----------------------------------------------------
	// checks if element is in view
	$.fn.fs_inview = function( settings )
	{
		// methods
		var methods = {
			// initialize gallery class
			init: function( settings ) 
			{ 
				return $(this).each(function(){
					// set variables
					var _this = $(this),
							data 	= _this.data('slideshow'),
							opts 	= $.extend({}, $.fn.fs_slides.defaults, settings);
					// check if it needs to be initializes
					if( !data )
					{
						_this.data('slideshow', {
							target: 		_this,
							opts: 			opts,
							remaining: 	opts.speed,
							images: 		_this.find(opts.image),
							first: 			_this.find(opts.image).first(),
							wrap: 			_this.find(opts.wrap),
							refreshed:  false
						});
					}
				});
			},
			destroy: function()
			{
				
			}
		};
	};
	//
	$.fn.fs_inview = function( method ){
		// fetch arguments
		var settings = arguments;
		// Method calling logic
		if ( methods[method] ) 
		{
			return $(this).each(function(){
				 methods[ method ].apply( this, Array.prototype.slice.call( settings, 1 ));
			});
		} 
		else if ( typeof method === 'object' || ! method ) 
		{
			return $(this).each(function(){
				methods.init.apply( this, settings );
			});
		}
		else
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.fs_inview' );
		}
	}
	//-------------------------------------------
	// default options
	$.fn.fs_inview.defaults = {
		fx: 								'slide',
		add_offset: 				10,
		speed: 							500,
		easing: 						'swing',
		add_top_link: 			false,
		active_class:				'fixed',
		scroll_active_fn: 	function(){},
		scroll_deactive_fn: function(){},
	};
	// ----------------------------------------------------
// add jquery to scope	
})( jQuery );