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

  let socket = new WebSocket(wsHost);
  var quality_string = '1080'

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
    artist.innerHTML = nv_artist;
    title.innerHTML =  nv_title;
    nv_src = '';
    request_next();
  }

  function sendSock(command) {
    let payload = {};

    payload.command = command;
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
      alert(txt);
  }

  function parseServerResponse(txt) {
    var j = JSON.parse(txt);

    if (j.type == 'video_full') {
      setupVideo(j);
    } else if (j.type == 'video_next') {
      setupNext(j);
    } else if (j.type == 'video_next') {
      setupNext(j);
    } else if (j.type == 'message_list') {
      updateMessages(j);
    } else {
      alert('Error parsing server response :(');
      alert(j);
    }
  }

  function setupVideo(j) {
    var startTime = j.current.start_time;

    var fullUrl = "http://cdn.plivka.tv/" + quality_string + "/" + j.current.url;

    player.src = fullUrl + '#t=' + startTime;
    // Нужно добавить в DOM отображение artist + title + description
    // artist.innerHTML = j.current.artist;
    // title.innerHTML = j.current.title;
    let nv_src = j.next.url,
        nv_artist = j.next.artist,
        nv_title = j.next.title,
        nv_desc = j.next.url;
/*
    console.log('Current video: ' + j.current.url + '#t=' + startTime);
    console.log('Next video: ' + j.next.url);
*/
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
    last_comment.className += ' last-comment';

  }

  function setupNext(j) {
  let nv_src = j.next.url,
      nv_artist = j.next.artist,
      nv_title = j.next.title,
      nv_description = j.next.description;
	    // console.log('Next video: ' + j.next.url);
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
