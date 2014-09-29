// ----------------------------------------------------
// Slideshow Class
//
// dependencies:
//
// TODO:
// - add possibility to include different effects
// - add previous and next via click on right / left half
// - add animation for caption
// ----------------------------------------------------
// define functions 
;(function( $, window, document )
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
				// add click event for move
				_this.on({
					click: function()
					{
						methods.next(_this);
						// reset time
						methods.reset(_this);
						// save start time
						_this.data('slideshow').start = new Date();
					},
					mouseenter: function()
					{
						methods.pause(_this);
					},
					mouseleave: function()
					{
						methods.resume(_this);
					}
				});
				// on load events
				$(document).ready(function()
				{
					// set sizes
					methods.refresh(_this);
					_this.height(_this.data('slideshow').opts.min_height);
					// start loading images
					methods.load(_this, _this.data('slideshow').first);
					// start autoplay
					methods.autoplay(_this);
				});
				// add refresh to resize event
				$(window).on('resize', function(){
					clearTimeout( _this.data('slideshow').resize_fn );
					_this.data('slideshow').resize_fn = setTimeout( function(){
						methods.refresh(_this)
					}, 100);
				});
			});
		},
		refresh: function(_this)
		{
			// get size variables
			var parent_width 	= _this.parent().width();
			var max_width 		= _this.data('slideshow').opts.max_width;
			if( max_width == 0 ){ _this.data('slideshow').opts.max_width = parent_width; }
			// check image size
			var image					= _this.data('slideshow').images.first().find('img');
			if( image[0].naturalWidth != undefined && image[0].naturalWidth != 0 )
			{
				// set image width
				var img_width 		= image.width();
			}
			// width
			if( (_this.data('slideshow').opts.width == 0 
					&& parent_width >= _this.data('slideshow').opts.max_width )
					|| 
					(_this.data('slideshow').opts.width >= _this.data('slideshow').opts.max_width 
					&& parent_width >= _this.data('slideshow').opts.max_width)
					|| 
					( parent_width > _this.data('slideshow').opts.max_width && _this.data('slideshow').opts.width < _this.data('slideshow').opts.max_width) 
			)
			{
				_this.data('slideshow').opts.width = _this.data('slideshow').opts.max_width;
			}
			else if( parent_width <= _this.data('slideshow').opts.max_width )
			{
				_this.data('slideshow').opts.width = parent_width;
			}
			// set image width
			_this.data('slideshow').images.width(_this.data('slideshow').opts.width);
			// set slidehow container width
			_this.css({'width':_this.data('slideshow').opts.width, 'height':'auto'});
			// set width of wrapper element
			_this.data('slideshow').wrap.width(_this.data('slideshow').images.length*_this.data('slideshow').opts.width);
			// set first active
			methods.first(_this);
		},
		load: function(_this, image )
		{
			// cache img selection
			var _img = image.find('img');
			//
			if( !_img.attr('src') && _img.attr('src') != _img.attr('data-src') )
			{
				// load image
				_img.attr('src', _img.data('src')).load(function()
				{
					// once image is loaded
					image.addClass('loaded');
					// check if not refreshed yet
					if( _this.data('slideshow').refreshed !== true )
					{
						_this.data('slideshow').refreshed = true;
						methods.refresh(_this);
					}
					// load next image
					methods.load(_this, image.next(_this.data('slideshow').image));
				});
			}
		},
		// adding autoplay
		autoplay: function(_this)
		{
			// save start time
			_this.data('slideshow').start = new Date();
			// start slideshow
			methods.resume(_this);
		},
		// stop autoplay
		pause: function(_this)
		{
			// remove autoplay
			window.clearInterval(_this.data('slideshow').autoplay);
			// save remaining time
			_this.data('slideshow').remaining -= new Date() - _this.data('slideshow').start;
		},
		// reset autoplay duration
		reset: function(_this)
		{
			// reset remaining time
			_this.data('slideshow').remaining = _this.data('slideshow').opts.speed;
			// remove autoplay
			window.clearInterval(_this.data('slideshow').autoplay);
			// add autoplay with reset time
			_this.data('slideshow').autoplay = window.setInterval(function(){
				methods.next(_this)
			}, _this.data('slideshow').remaining);
		},
		// resume autoplay
		resume: function(_this)
		{
			// remove autoplay
			window.clearInterval(_this.data('slideshow').autoplay);
			// resume autoplay
			_this.data('slideshow').autoplay = window.setInterval(function()
			{
				// move to next slide
				methods.next(_this);
				// reset time
				methods.reset(_this);
				// save start time
				_this.data('slideshow').start = new Date();
				//
			}, _this.data('slideshow').remaining);
		},
		// move to next element
		next: function(_this)
		{
			// set current and next item
			var _current = _this.find('.'+_this.data('slideshow').opts.active);
			var _next 	= _current.next(_this.data('slideshow').opts.image);
			//
			if( _next.length > 0 )
			{
				// anmiate forward
				_this.data('slideshow').wrap.animate({'left':'-='+_this.data('slideshow').opts.width});
				// change active
				_current.removeClass(_this.data('slideshow').opts.active);
				// set next to active
				_next.addClass(_this.data('slideshow').opts.active);
			}
			else
			{
				// anmiate to first
				_this.data('slideshow').wrap.animate({'left':'0'});
				// change active
				_current.removeClass(_this.data('slideshow').opts.active);
				_this.data('slideshow').first.addClass(_this.data('slideshow').opts.active);
			}
		},
		// set first active
		first: function(_this)
		{
			// set current item
			_this.data('slideshow').current = _this.find('.'+_this.data('slideshow').opts.active);
			// anmiate to first
			_this.data('slideshow').wrap.animate({'left':'0'});
			// change active
			if( _this.data('slideshow').current != undefined )
			{
				_this.data('slideshow').current.removeClass(_this.data('slideshow').opts.active);
			}
			// set first active
			_this.data('slideshow').first.addClass(_this.data('slideshow').opts.active);
		},
		// move to previous element
		previous: function( _this )
		{
			// // set current and previous item
			// _current = _this.find('.'+methods.settings.active);
			// _next 	= _current.prev(methods.settings.image);
			// //
			// _wrap.animate({'left':'+='+methods.settings.width});
			// _this.find('.'+methods.settings.active).removeClass(methods.settings.active).prev(methods.settings.image).addClass(methods.settings.active);
		},
		// destory
		destroy: function()
		{
			$(this).each(function(){
				$(this).off("click, mouseenter, mouseleave");
				methods.pause($(this));
			});
		}
	}
	//-------------------------------------------
	// default options		
	$.fn.fs_slides = function( method )
	{
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.fs_slides' );
		}
	}
	//-------------------------------------------
	// default options
	$.fn.fs_slides.defaults = {
		fx: 					'slide',
		loaded: 			'loaded',
		active: 			'active',
		wrap: 				'.image-wrap',
		image: 				'.slide',
		width: 				0,
		height: 			0,
		max_width: 		0,
		min_height:   0,
		speed: 				5000,
		easing: 			'swing'
	};
})( jQuery, window, document);