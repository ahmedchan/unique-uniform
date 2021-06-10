// jQuery.fx.off = true;
jQuery(window).load(function(){

	var $portoSlider = $('#portoSlider');
	cache = [];
	slider_container_height = 0;
	var portfolioConfig = 'adata.json';

	if( 'devicePixelRatio' in window && window.devicePixelRatio >= 2 ){
		portfolioConfig = 'adata-2x.json';
	}

	initSlider = function(selector) {
	
		
		$(selector).responsiveSlides({
			auto: false,             // Boolean: Animate automatically, true or false
			speed: 500,            // Integer: Speed of the transition, in milliseconds
			timeout: 4000,          // Integer: Time between slide transitions, in milliseconds
			pager: true,           // Boolean: Show pager, true or false
			nav: false,             // Boolean: Show navigation, true or false
			random: false,          // Boolean: Randomize the order of the slides, true or false
			pause: false,           // Boolean: Pause on hover, true or false
			pauseControls: true,    // Boolean: Pause when hovering controls, true or false
			prevText: "Previous",   // String: Text for the "previous" button
			nextText: "Next",       // String: Text for the "next" button
			maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
			navContainer: "",       // Selector: Where controls should be appended to, default is after the 'ul'
			manualControls: "",     // Selector: Declare custom pager navigation
			namespace: "rslides",   // String: Change the default namespace used
			before: function(){},   // Function: Before callback
			after: function(){}     // Function: After callback
		});
	}
	
	buildSlider = function(data) {

		var html = false;
	
		  if (data) {
		    html = '<h4 class="album-name text-center">'+data.title+'</h4><div class="clearfix"></div>';
		    
		    // while photos
		    if($(data.photos).size()) {
		      html += '<div class="wrap-slider no-padding col-md-8 col-md-push-4 col-sm-12">';
		      html += '<div class="photos-container">';
		      $.each(data.photos, function(i, photo){
		        html += '<div><img class="replace-2xx" src="'+photo+'" alt=""></div>';
		      });
		      html += '</div></div>';
		    }

		    // Add info about alboms
		    html += '<div class="additional-info col-md-4 col-md-pull-8 col-sm-12">\
		              <div class="text-box">\
		                <div class="heading">'+data.client+'</div>\
		                <div class="description">'+data.description+'</div>\
		              </div>\
		              <div class="link-box">\
		                <div class="link"><a class="btn btn-default" href="'+data.url+'">View online</a></div>\
		              </div>\
		            </div>';  
		  }

		return html;
	}
	
	getNextID = function (current_element_id) {
		var nextAlbomID = false;
		if ((cache.length - 1) != current_element_id) {
			nextAlbomID = cache[current_element_id + 1];
		} else {
			nextAlbomID = cache[0];
		}
		return nextAlbomID;
	}
		
	getPrevID = function (current_element_id) {
		var prevAlbomID = false;
		if (current_element_id != 0) {
			prevAlbomID = cache[current_element_id - 1];
		} else {
			prevAlbomID = cache[cache.length - 1];
		}
		return prevAlbomID;
	}
	
	navigateAlboms = function() {
		
		$portoSlider.find("a.prev").click(function() {
			var albom_id = $(this).data('albomid');
			
			var current_element_id = $.inArray(albom_id, cache);
			var nextAlbomID = getNextID(current_element_id);
			var prevAlbomID = getPrevID(current_element_id);
			
			create(albom_id, nextAlbomID, prevAlbomID);
			return false;
		});
		
		$portoSlider.find("a.next").click(function() {
			var albom_id = $(this).data('albomid');
			
			var current_element_id = $.inArray(albom_id, cache);
			var nextAlbomID = getNextID(current_element_id);
			var prevAlbomID = getPrevID(current_element_id);

			create(albom_id, nextAlbomID, prevAlbomID);
			return false;
		});
		
		$("#closePortoSlider").click(function() {
			$portoSlider.find('.sliders-preloader').removeClass('loaded');
			$portoSlider.find('.container-fluid').removeClass('view-slide');
			$portoSlider.css('max-height', 0);
			$portoSlider.css('height', 0);

			setTimeout(function(){
				$portoSlider.find('.container-fluid').hide();
				destroy('#albom');
			},1000);
			
			return false;
		});
	}
	
	getJsonArray = function (elements, callback_success, callback_error) {
		$.getJSON(portfolioConfig, function(data) {
			
			for (index = 0; index < elements.length; ++index) {
				// buildAlbumSlider(elements[index], data[elements[index]]);
			}
			
			if (callback_success && typeof(callback_success) === "function") {
				callback_success(data);
			}
	    });
	}
	
	getJsonID = function (id, callback_success, callback_error) {
	
	    $.getJSON(portfolioConfig, function(data) {

			var d = data[id];
			if (callback_success && typeof(callback_success) === "function") {
				callback_success(d);
			}
	    });
	}
	
	destroy = function(selector){
		jQuery(selector).html("");
	}
	
	create = function(current_id, next_id, prev_id) {
		
		/* Fix height */

		if ($portoSlider.hasClass('close-box')) {
			setTimeout(function() {
				$portoSlider.css('max-height', slider_container_height);
				$portoSlider.css('height', slider_container_height);
				// $(this).trigger( "click" );
			}, 600);

		}else{
			// setTimeout(function() {
			$portoSlider.css('max-height', slider_container_height);
			$portoSlider.css('height', slider_container_height);
			// }, 1200);
		};


		
		$portoSlider.removeClass('close-box');

		
		$portoSlider.find('.sliders-preloader').removeClass('loaded');
		$portoSlider.find('.container-fluid').removeClass('view-slide');
		
		$portoSlider.find('.container-fluid').fadeOut({
			
			complete: function() {

				getJsonID(current_id, function(data){
					var html = buildSlider(data);

					$portoSlider.find(".container-fluid a.next").data('albomid', next_id);
					$portoSlider.find(".container-fluid a.prev").data('albomid', prev_id);
					
					$("#albom").html(html);
							
					initSlider('.photos-container');
							
					$portoSlider.find('.container-fluid').fadeIn({
						easing: 'swing',
						complete: function() {
							slider_container_height = $portoSlider.find(".container-fluid").height();
							$portoSlider.find('.sliders-preloader').addClass('loaded');
							$portoSlider.find('.container-fluid').addClass('view-slide');
							$('.wrap-isotop .p-scroll').removeClass('start-slide');
						}
					});
				});
			}
		});
	}
	
	$('.element-item').click(function () {
	
		// Select current element ID
		var currentAlbomID = $(this).data('albumid');
		
		// ReInit after click
		cache = [];
		jQuery('.element-item:visible').each(function(index, element) {
		
			var AlbomID = $(element).data('albumid');
			cache.push(AlbomID);
		});

		var current_element_id = $.inArray(currentAlbomID, cache);
		var nextAlbomID = getNextID(current_element_id);
		var prevAlbomID = getPrevID(current_element_id);
		
		
		// Get JSON
		create(currentAlbomID, nextAlbomID, prevAlbomID);

	});
	
	navigateAlboms();

});
