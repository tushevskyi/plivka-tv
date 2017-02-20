$(function() {

	'use strict';



	const	btn_about = $('.button__about'),
			video = $('#videobg'),
			videoVrap = document.getElementById('video-wrap'),
			about = $('.about_pop-up'),
			navigation = $('.navigation'),
			main_logo = $('.main-logo'),
			btn_mute_on = $('.button__mute-on'),
			btn_mute_off = $('.button__mute-off'),
			btn_close_about = $('.button_close'),
			stopPropagationDonateBLock = $('.button__open-share-donate'),
			open_share_donate_block = $('.button__open-share-donate img'),
			share_donate_block = $('.share-donate-block'),
			fullscreen = $('.button__fullscreen'),
			$document = $(document),
			show_comments = $('.show_comments'),
			comment_form = $('.comment-form'),
			comment_box = $('.comment-box');	

	btn_about.on('click', aboutEvent);
	btn_mute_on.on('click', muteEvent);
	btn_mute_off.on('click', muteOffEvent);
	btn_close_about.on('click',closeAboutEvent);
	fullscreen.on('click', fullscreenEvent);
	open_share_donate_block.on('click', openShareDonateEvent);
	stopPropagationDonateBLock.on('click', stopPropagationEvent);
	$document.on('click', documentClickEvent);
	show_comments.on('click', showComments);

	function aboutEvent() {
		about.css('display','block');
		navigation.css('display','none');
		main_logo.css('display','none');
	}

	function muteEvent() {
		btn_mute_on.css('display','none');
		btn_mute_off.css('display','block')
		video.prop('muted',1);
	}

	function muteOffEvent() {
		btn_mute_off.css('display','none');
		btn_mute_on.css('display','block');
		video.prop('muted',0);
	}

	video.prop('muted',1); // muted for testing

	function closeAboutEvent() {
		about.css('display','none');
		navigation.css('display','block');
		main_logo.css('display','block');
	}

	function fullscreenEvent() {
		if (screenfull.enabled) {
        	screenfull.request(videoVrap);
    	}
	}

	function openShareDonateEvent() {
		if (share_donate_block.hasClass('fadeInRight')) {
			share_donate_block
				.removeClass('animated fadeInRight')
				.css('display','none');
		} else {
			share_donate_block
				.css('display','block')
				.addClass('animated fadeInRight');
		}
	}

	function stopPropagationEvent(e) {
		e.stopPropagation();
	}

	function documentClickEvent() {
		if (share_donate_block.hasClass('fadeInRight')) {
			share_donate_block
				.css('display','none')
				.removeClass('animated fadeInRight');
		}
	}

	function showComments() {
		show_comments.fadeOut('400', function() {
			comment_form.fadeIn(800, function() {
				$(this).find('.add-message').focus();
			});	
		});
	}


	let timedelay = 0,
		_delay = setInterval(delayCheck, 1000),
	 	add_message = $('.add-message'),
		fosuc_check = true;

	$document.on('mousemove', showAllEvent);

	add_message.on('focus', onFocusEvent);
	add_message.on('blur', onBlurEvent);

	function onFocusEvent() {
		fosuc_check = false;
		comment_box.animate({ scrollTop: comment_box.height() }, 1000);
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
			$('.main-logo').appendTo('.wrap');
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
