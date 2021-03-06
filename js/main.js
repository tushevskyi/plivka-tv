$(function() {

	'use strict';



	const	btn_about 			= $('.button__about'),
			video 				= $('#videobg'),
			player              = document.getElementById('videobg'),
			videoWrap 			= document.getElementById('video-wrap'),
			about 				= $('.about_pop-up'),
			navigation 			= $('.navigation'),
			logo_video_desc 	= $('.logo_video-description'),
			btn_mute_on 		= $('.button__mute-on'),
			btn_mute_off 		= $('.button__mute-off'),
			btn_mute_on_img 	= $('.button__mute-on img'),
			btn_mute_off_img 	= $('.button__mute-off img'),
			btn_close_about 	= $('.button_close'),
			share_donate_button = $('.button__open-share-donate'),
			open_share_donate 	= $('.button__open-share-donate img'),
			current_quality 	= $('.current-quality'),
			current_chanel      = $('.current-chanel'),
			current_quality_img = $('.current-quality img'),
			quality_holder      = $('.quality__holder'),
			chanel_holder       = $('.chanel__holder'),
			share_donate_holder = $('.share-donate__holder'),
			fullscreen 			= $('.button__fullscreen img'),
			$document 			= $(document),
			show_comments 		= $('.show_comments'),
			comment_form 		= $('.comment-form'),
			comment_box 		= $('.comment-box'),
			artist        		= $('.artist'),
        	title         		= $('.title'),
        	video_description	= $('.video-description'),
        	main_logo 			= $('.main-logo'),
        	mobile_sound_btn	= $('.mobile_sound');
    

	btn_about.on('click', aboutEvent);
	btn_mute_on_img.on('click', muteEvent);
	btn_mute_off_img.on('click', muteOffEvent);
	btn_close_about.on('click',closeAboutEvent);
	fullscreen.on('click', fullscreenEvent);
	open_share_donate.on('click', openShareDonateEvent);
	current_quality.on('click', openChangeQuality);
	current_chanel.on('click', openChangeChanel);
	$document.on('click', documentClickEvent);
	show_comments.on('click', showComments);

	main_logo.hover(showVideoDescription);

	$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', fullScreenEvent);

	function fullScreenEvent() {

		switch(logo_video_desc.hasClass('fullscreen')) {
			case false:
				logo_video_desc
					.addClass('fullscreen')
					.css('top','90px');
				break;		
			case true:
				logo_video_desc
					.removeClass('fullscreen')
					.css('top','45px');
				break;
		};
	}

	{
    	const w = window.innerWidth;

	    if(w <= 765) {
	    	mobile_sound_btn.on('click', mobileMuteOffEvent);
	    	btn_mute_on.css('display','none');
	    }

  	}

	function aboutEvent() {
		about.css('display','block');
		navigation.css('opacity','none');
		logo_video_desc.css({'opacity':'0','visibility':'hidden'});
	}

	function closeAboutEvent() {
		about.css('display','none');
		navigation.css('display','block');
		logo_video_desc.css({'opacity':'1','visibility':'visible'});
	}

	function muteEvent() {
		btn_mute_on.css('display','none');
		btn_mute_off.css('display','block');
		video.prop('muted',1);
	}

	function mobileMuteOffEvent() {
		mobile_sound_btn.css('display', 'none');
		video.prop('muted',0);
		player.removeAttribute('muted'); 
		btn_mute_on.css('display','block');
	}

	function muteOffEvent() {
		btn_mute_off.css('display','none');
		btn_mute_on.css('display','block');
		video.prop('muted',0);
	}

	function fullscreenEvent() {
		if (screenfull.enabled) {
        	screenfull.request(videoWrap);
    	}
	}

	function animationInOut(element) {
		if (element.hasClass('fadeInLeft')) {
			element
				.removeClass('fadeInLeft')
				.addClass('fadeOutRight');
		} else {
			element
				.removeClass('fadeOutRight')
				.css('display','block')
				.addClass('fadeInLeft');
		}	
	}

	function closeMenuItem(item) {
		if (item.hasClass('fadeInLeft')) {
			item
				.removeClass('fadeInLeft')
				.addClass('fadeOutRight');
		}
	}

	function openShareDonateEvent(e) {
		e.stopPropagation();
		animationInOut(share_donate_holder);
		closeMenuItem(quality_holder);
		closeMenuItem(chanel_holder);
	}

	function openChangeQuality(e) {
		e.stopPropagation();	
		animationInOut(quality_holder);
		closeMenuItem(share_donate_holder);
		closeMenuItem(chanel_holder);
	}

	function openChangeChanel(e) {
		e.stopPropagation();	
		animationInOut(chanel_holder);
		closeMenuItem(share_donate_holder);
		closeMenuItem(quality_holder);	
	}

	function documentClickEvent() {
		if (share_donate_holder.hasClass('fadeInLeft')) {
			share_donate_holder
				.removeClass('fadeInLeft')
				.addClass('fadeOutRight');
		} else if (quality_holder.hasClass('fadeInLeft')) {
			quality_holder
				.removeClass('fadeInLeft')
				.addClass('fadeOutRight');
		} else if (chanel_holder.hasClass('fadeInLeft')) {
			chanel_holder
				.removeClass('fadeInLeft')
				.addClass('fadeOutRight');
		}
	}

	function showComments() {
		show_comments.fadeOut('400', function() {
			comment_form.fadeIn(800, function() {
				$(this).find('.add-message').focus();
			});	
		});
	}

	function showVideoDescription() {

		switch(video_description.hasClass('fadeIn')) {
			case false:
				video_description.fadeIn(300).addClass('fadeIn');
				break;
			case true:
				video_description.fadeOut(300).removeClass('fadeIn');
				break;
		};
	}

	let timedelay 	= 0,
		_delay 		= setInterval(delayCheck, 1000),
	 	add_message = $('.add-message'),
		fosuc_check = true;

	$document.on('mousemove touchstart', showAllEvent);

	add_message.on('focus', onFocusEvent);
	add_message.on('blur', onBlurEvent);

	function onFocusEvent() {
		fosuc_check = false;
		comment_box.animate({ scrollTop: comment_box.height() }, 1000);
		$(this).attr({
			maxlength: '49'
		});
	}

	function onBlurEvent() {
		fosuc_check = true;
		comment_form.fadeOut('800', function() {
			show_comments.fadeIn('400');
		});
	}

	function delayCheck() {
		if (timedelay === 5 && fosuc_check) {
			navigation.removeClass('showNavigation');
			clearInterval(_delay);
			timedelay = 0;
		}
		timedelay += 1;
	}

	function showAllEvent() {
		navigation.addClass('showNavigation');
		timedelay = 0;
		clearInterval(_delay);
		_delay = setInterval(delayCheck, 1000);
	}
	
});
