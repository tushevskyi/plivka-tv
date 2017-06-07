$(function() {

  'use strict';
  // var wsHost = "ws://localhost:8085/ws";

  const wsHost        = "ws://ws.plivka.tv:8085/ws",
        player        = document.getElementById('videobg'),
        artist        = document.getElementById('artist'),
        title         = document.getElementById('title'),
        desc          = document.getElementById('description'),
        isActive      = true,
        $add_message  = $('.add-message'),
        comment_box   = $('.comment-box'),
        chanel_name   = "main";

  let   socket         = new WebSocket(wsHost),
        nv_src         = '',
        nv_artist      = '',
        nv_title       = '',
        nv_desc        = '',
        quality_string = 480;

  $add_message
    .on('enterKey', sendMessage)
    .on('keyup', keyupEvent);

  function keyupEvent(e) {
    if(e.keyCode === 13) {
      $(this).trigger('enterKey');
    }
  }

  if (!( "WebSocket" in window )) {
    alert("Your browser does not support web sockets");
  } else {
    setupWS();
  }

  player.onended = function(){
    player.src = nv_src;
    // artist.innerHTML = nv_artist;
    // title.innerHTML =  nv_title;
    nv_src = '';
    request_next();
  }

  function sendSock(command) {
    let payload = {};

    payload.command = command;
    payload.layer = chanel_name;
    payload = JSON.stringify(payload);
    socket.send(payload);
  }

  function setupWS() {
    if (socket) {
      socket.onopen = function() {
        sendSock('get_full');
        sendSock('get_messages');
      };
      socket.onmessage = function(msg) {
        parseServerResponse(msg.data);
      };
      socket.onclose = function() {
        showServerResponse("We can't connect to our player right now, please refresh page or try again later. Sorry.");
      };
      socket.onerror = function() {
        console.log('WS error.');
        alert("We've encountered some problems, please reload page :(");
      };
    } else {
      console.log("invalid socket");
    }
  }

  function request_next() {
      socket.send('get_next');
  }

  function showServerResponse(txt) {
      console.log(txt);
  }

  function parseServerResponse(txt) {
    var j = JSON.parse(txt);
    console.log(j);

    if (j.type == 'video_full') {
      setupVideo(j);
    } else if (j.type == 'video_next') {
      setupNext(j);
    } else if (j.type == 'message_list') {
      updateMessages(j);
    } else {
      alert('Error parsing server response :(');
      alert(j);
    }
  }

  let chanel_holder      = $('.chanel__holder'),
      current_chanel_img = $('.current-chanel img');

  chanel_holder.on('click', changeChanel);

  function changeChanel(e) {
    let ukho    = 'js_ukho',
        sxtn    = 'js_16',
        main    = 'js_main',
        payload = {};

    switch(e.target.className) {
      case ukho:
        current_chanel_img[0].src = e.target.src;
        payload.layer = "ukho";
        payload.command = "get_full";
        payload = JSON.stringify(payload);
        socket.send(payload);
        break;
      case sxtn:
        current_chanel_img[0].src = e.target.src;
        payload.layer = "onesix";
        payload.command = "get_full";
        payload = JSON.stringify(payload);
        socket.send(payload);
        break;
      case main:   
        current_chanel_img[0].src = e.target.src;
        payload.layer = "main";
        payload.command = "get_full";
        payload = JSON.stringify(payload);
        socket.send(payload);
        break;
      }    
  };     


  player.volume = 0;          
  $(player).one('play', function() {
    // let _volumeInterval = setInterval(volumeUp, 350),
    //     volume          = 0;
      
    // function volumeUp() {
    //   volume += 0.05;
    //   if(volume > 1) {
    //     clearInterval(_volumeInterval);
    //   }
    //   player.volume = volume.toFixed(2);
    // }

  });      

  function setupVideo(j) {

    let quality_holder      = $('.quality__holder'),
        current_quality_img = $('.current-quality img'),
        sd_img_src          = 'images/icons/SD_icon.svg',
        hd_img_src          = 'images/icons/HD_icon.svg',
        fhd_img_src         = 'images/icons/HD_plus_icon.svg';
    
    quality_holder.on('click', changeQuality);    

    function changeQuality(e) {

      switch(e.target.className) {
        case 'js_sd': 
          quality_string = 480;
          fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;
          player.src = fullUrl + '#t=' + player.currentTime;
          current_quality_img.attr('src', sd_img_src);
          break;
        case 'js_hd':
          quality_string = 720;
          fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;
          player.src = fullUrl + '#t=' + player.currentTime;
          current_quality_img.attr('src', hd_img_src);
          break;
        case 'js_fhd':
          quality_string = 1080;
          fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;
          player.src = fullUrl + '#t=' + player.currentTime;
          current_quality_img.attr('src', fhd_img_src);
          break;
      }

      let quality_img_src   = current_quality_img.attr('src');

      let checkIcon = src => {
        if(quality_img_src === src) {
          current_quality_img.css({
            'width':'30px',
            'height': '30px',
            'margin-right': '-8px',
            'margin-top': '-3px',
            'margin-bottom': '-3px'
          });
        } else {
          current_quality_img.css({
            'width':'24px',
            'height': '24px',
            'margin-right': '0',
            'margin-top': '0',
            'margin-bottom': '0'
          });
        }
      }

      checkIcon(fhd_img_src);

    };


    var startTime = j.current.start_time;
    var fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;
    player.src = fullUrl + '#t=' + startTime;

    if (window.location.pathname === '/index.html') {
      player.src = fullUrl + '#t=' + startTime;
    } else {
      setSharedUrl('/shared.html');
    }

    // Нужно добавить в DOM отображение artist + title + description
    // artist.innerHTML = j.current.artist;
    // title.innerHTML = j.current.title;
    nv_src = "http://cdn.plivka.tv/" + quality_string + "/" + j.next.url,
    nv_artist = j.next.artist,
    nv_title = j.next.title,
    nv_desc = j.next.url;

    /*
      console.log('Current video: ' + j.current.url + '#t=' + startTime);
      console.log('Next video: ' + j.next.url);
    */    

    let main_share_btn = $('.navigation .button_share');
    main_share_btn.on('click', fbShare);

    function fbShare() {
      FB.ui({
          display: 'popup',
          method: 'share',
          description: "plivka tv",
          title: j.current.title,
          link: '',
          picture: '',
          href: 'http://plivka.tv/shared.html?v=' + j.current.url
      }, function(response){});
    }
  };


  function setSharedUrl(shared_path) {
    let url_pathname   = window.location.pathname,
        video_pathname = window.location.search,
        video_name;

    if (url_pathname === shared_path) {
      video_name = video_pathname.substring(3);
      player.src = "http://cdn.plivka.tv/" + quality_string + "/" + video_name;
    }
  }



  function updateMessages(j) {
    let messages = JSON.parse(j.messages),
        n = "";

    for (var i = 0; i < messages.length; i++) {
      let l = "<div class='comment'><div class='comment-text'><p> " + messages[i] + "</p></div></div>";
      n += l;
    }

    comment_box.animate({ scrollTop: comment_box.height() }, 1100);
    comment_box[0].innerHTML = n;

    let last_comment = comment_box[0].childNodes[comment_box[0].childNodes.length-1];
    //comment this line to remove error from console, come back soon ^-^
    // last_comment.className += ' last-comment';

  }

  function setupNext(j) {
      nv_src = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;
      nv_artist = j.next.artist;
      nv_title = j.next.title;
      nv_description = j.next.description;
	    console.log('Next video: ' + j.next.url);
  }

  function sendMessage() {
    if (socket) {
      let message_text = document.getElementsByClassName('add-message')[0],
          payload = {};

      payload.command = 'new_message';
      payload.message = {
        'sender':'',
        'text':message_text.value,
      };
      payload = JSON.stringify(payload);
      socket.send(payload);
      message_text.value = "";
    }
  }

});
