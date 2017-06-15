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
        comment_box   = $('.comment-box');

  let   socket         = new WebSocket(wsHost),
        nv_src         = '',
        nv_artist      = '',
        nv_title       = '',
        nv_desc        = '',
        videoObj,
        messageObj;


  $add_message
    .on('keyup', keyupEvent)
    .on('enterKey', sendMessage);

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



  let chanel_name = "main";

  function sendSock(command,chanel_name) {
    let payload = {};

    payload.command = command;
    payload.layer = chanel_name;
    payload = JSON.stringify(payload);
    socket.send(payload);
  }

  function setupWS() {
    if (socket) {

      socket.onopen = function() {
        sendSock('get_full',chanel_name);
        sendSock('get_messages',chanel_name);
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
    let receivedDataObj = JSON.parse(txt);

    if (receivedDataObj.type === 'video_full') {
      videoObj = receivedDataObj;
      setupVideo(videoObj);
    } else if (receivedDataObj.type === 'video_next') {
      setupNext(receivedDataObj);
    } else if (receivedDataObj.type === 'message_list') {
      messageObj = receivedDataObj;
      console.log(messageObj);
      updateMessages(messageObj);
    } else {
      console.log('Error parsing server response :(');
      console.log(receivedDataObj);
    }
  }


  //change chanel
  let chanel_holder      = $('.chanel__holder'),
      current_chanel_img = $('.current-chanel img'),
      img_chanel_holder  = $('.img_chanel__holder'),
      img_chanel         = $('.img_chanel__holder img');

  chanel_holder.on('click', changeChanel);

  function changeChanel(e) {

    let ukho    = 'js_ukho',
        sxtn    = 'js_16',
        main    = 'js_main',
        payload = {};

    hideBttnChoosedElement(e,img_chanel_holder);    

    switch(e.target.className) {
      case ukho:
        chanel_name = 'ukho';
        current_chanel_img[0].src = e.target.src;
        player.pause();
        sendSock("get_full", chanel_name);
        sendSock('get_messages', chanel_name);
        break;
      case sxtn:
        chanel_name = "onesix";
        current_chanel_img[0].src = e.target.src;
        player.pause();
        sendSock("get_full",chanel_name);
        sendSock('get_messages',chanel_name);
        break;
      case main:   
        chanel_name = "main";
        current_chanel_img[0].src = e.target.src;
        player.pause();
        sendSock("get_full",chanel_name);
        sendSock('get_messages',chanel_name);
        break;
      }    
  };     

  player.volume = 0;          
  $(player).one('play', soundFadeOut);

  function soundFadeOut() {
    // let _volumeInterval = setInterval(volumeUp, 350),
    //     volume          = 0;
      
    // function volumeUp() {
    //   volume += 0.05;
    //   if(volume > 1) {
    //     clearInterval(_volumeInterval);
    //   }
    //   player.volume = volume.toFixed(2);
    // }

  }

  let quality_holder      = $('.quality__holder'),
      current_quality_img = $('.current-quality img'),
      sd_img_src          = 'images/icons/SD_icon.svg',
      hd_img_src          = 'images/icons/HD_icon.svg',
      fhd_img_src         = 'images/icons/HD_plus_icon.svg',
      img_quality_holder  = $('.img_quality-holder'),
      img_quality         = $('.img_quality-holder img'),
      quality_string      = 720;

  quality_holder.on('click', changeQuality);

  function changeQuality(e) {
    console.log(videoObj);
    console.log("player: " + player.currentTime);

    // hideBttnChoosedElement(e,img_quality_holder);

    let video_currentTime = player.currentTime || videoObj.current.start_time,
        fullUrl           = "";

    switch(e.target.className) {
      case 'js_sd': 
        quality_string = 480;
        fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + videoObj.current.url;
        player.src = fullUrl + '#t=' + video_currentTime;
        current_quality_img.attr('src', sd_img_src);
        break;
      case 'js_hd':
        quality_string = 720;
        fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + videoObj.current.url;
        player.src = fullUrl + '#t=' + video_currentTime;
        current_quality_img.attr('src', hd_img_src);
        break;
      case 'js_fhd':
        quality_string = 1080;
        fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + videoObj.current.url;
        player.src = fullUrl + '#t=' + video_currentTime;
        current_quality_img.attr('src', fhd_img_src);
        break;
    }

    let quality_img_src = current_quality_img.attr('src');

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

  }

  // hideDefaultBtn(img_quality,current_quality_img);
  hideDefaultBtn(img_chanel,current_chanel_img);    

  function hideDefaultBtn(btn_img,current_img) {
    for(let i=0;i<btn_img.length;i++) {
      if(current_img.attr('src') === btn_img[i].getAttribute('src')) {
        $(btn_img[i]).parent().fadeOut();
      }
    }
  }

  function hideBttnChoosedElement(e,holder) {
    if(e.target !== holder.parent()[0]) {
      $(e.target).parent().fadeOut();
      setTimeout(() => {
        holder.not($(e.target).parent()).fadeIn();
      },500);
    }    
  }          

  function setupVideo(videoObj) {
    console.log(videoObj);
    var startTime = videoObj.current.start_time;
    var fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + videoObj.current.url;
    // player.src = fullUrl + '#t=' + startTime;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // player.src = null;
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    if (window.location.pathname !== '/shared.html') {
      player.src = fullUrl + '#t=' + startTime;
    } else {
      setSharedUrl('/shared.html');  
    }

    // Нужно добавить в DOM отображение artist + title + description
    // artist.innerHTML = receivedDataObj.current.artist;
    // title.innerHTML = receivedDataObj.current.title;
    nv_src = "http://cdn.plivka.tv/" + quality_string + "/" + videoObj.next.url,
    nv_artist = videoObj.next.artist,
    nv_title = videoObj.next.title,
    nv_desc = videoObj.next.url;

    /*
      console.log('Current video: ' + videoObj.current.url + '#t=' + startTime);
      console.log('Next video: ' + videoObj.next.url);
    */ 


    // let video = videoObj.next.url;
    // let next_vid_url = `http://cdn.plivka.tv/1080/${video}#t=0`;

    // let req = new XMLHttpRequest();
    // req.open('GET', "http://cdn.plivka.tv/480/6FQTX5ZYNL.mp4", true);
    // req.responseType = 'blob';

    // req.onload = function() {
    //    // Onload is triggered even on 404
    //    // so we need to check the status code
    //    if (this.status === 200) {
    //       var videoBlob = this.response;
    //       var vid = URL.createObjectURL(videoBlob); // IE10+
    //       // Video is now downloaded
    //       // and we can set it as source on the video element
    //       player.src = vid;
    //    }
    //    console.log(req.statusText);
    // }

    // req.onprogress = function () {
    //   console.log('LOADING', req.status);
    // };

    // req.onerror = function() {
    //    // Error
    // }

    // req.send();

  }

  function setupNext(receivedDataObj) {
      nv_src = "http://cdn.plivka.tv/" + quality_string + "/" + receivedDataObj.next.url;
      nv_artist = receivedDataObj.next.artist;
      nv_title = receivedDataObj.next.title;
      nv_description = receivedDataObj.next.description;
      console.log('Next video: ' + receivedDataObj.next.url);
  }


  let main_share_btn = $('.navigation .button_share');
  main_share_btn.on('click', fbShare);

  //videoObj

  function fbShare() {
    FB.ui({
        display: 'popup',
        method: 'share',
        description: "plivka tv",
        title: videoObj.current.title,
        link: '',
        picture: 'http://plivka.tv/images/plivka-log-fb.png',
        href: 'http://plivka.tv/shared.html?v=' + videoObj.current.url
    }, function(response){});
  }


  function setSharedUrl(shared_path) {
    let video_pathname = window.location.search,
        stateObj       = { foo: "bar" },
        video_name;

    video_name = video_pathname.substring(3);
    player.src = "http://cdn.plivka.tv/" + 720 + "/" + video_name;  
    history.pushState(stateObj, null, "/");
  }


  function updateMessages(messageObj) {
    let messages = JSON.parse(messageObj.messages),
        n = "";    

    for (var i = 0; i < messages.length; i++) {
      let l = "<div class='comment'><div class='comment-text'><p> " + messages[i] + "</p></div></div>";
      n += l;
    }

    comment_box.animate({ scrollTop: comment_box.height() }, 1100);
    comment_box[0].innerHTML = n;

    let last_comment = comment_box[0].childNodes[comment_box[0].childNodes.length-1];

    if(last_comment) {
      last_comment.className += ' last-comment';
    }

  }

  function sendMessage() {
    let message_text = document.getElementsByClassName('add-message')[0],
        payload = {};

    payload.command = 'new_message';
    payload.layer = chanel_name;
    payload.message = {
      'sender':'',
      'text':message_text.value,
    };
    
    payload = JSON.stringify(payload);
    socket.send(payload);

    message_text.value = "";
  }

});
