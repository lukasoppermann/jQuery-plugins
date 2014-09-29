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
						data 	= _this.data('tabs'),
						opts 	= $.extend({}, $.fn.fs_tabs.defaults, settings);
				// check if it needs to be initializes
				if( !data )
				{
					_this.data('tabs', {
						target: 		_this,
						content: 		_this.find(opts.content),
						tabs: 			_this.find(opts.tab),
						opts: 			opts
					});
				}
				// add click event for move
				_this.on('click', _this.data('tabs').opts.tab, function()
				{
					methods.switch_tab(_this, $(this));
				});
			});
		},
		// switch to new tab
		switch_tab: function( _this, tab )
		{
			// check if clicked tab is not active yet
			if( !tab.hasClass('active') || !_this.find(_this.data('tabs').opts.content+"[data-tab='"+tab.data('tab')+"']").hasClass('active') )
			{
				// add active to tab
				_this.data('tabs').tabs.removeClass('active');
					tab.addClass('active');
				//
				_this.data('tabs').content.removeClass('active').animate({'opacity':0}, _this.data('tabs').opts.speed, _this.data('tabs').opts.ease, function(){
					$(this).hide();
					_this.find(_this.data('tabs').opts.content+"[data-tab='"+tab.data('tab')+"']").css({'display':'block', 'opacity': 0}).animate({'opacity':1},_this.data('tabs').opts.speed, _this.data('tabs').opts.ease).addClass('active');
				});
			}
		},
		// destory
		destroy: function()
		{
			$(this).each(function(){
				$(this).off("click");
			});
		}
	}
	//-------------------------------------------
	// default options		
	$.fn.fs_tabs = function( method )
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.fs_tabs' );
		}
	}
	//-------------------------------------------
	// default options
	$.fn.fs_tabs.defaults = {
		tab: 					'.tab',
		content: 			'.tab-content',
		speed: 				200,
		easing: 			'swing'
	};
})( jQuery, window, document);