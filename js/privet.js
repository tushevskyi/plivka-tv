var wsHost = "ws://ws.plivka.tv:8085/ws";
var socket = new WebSocket(wsHost);

var player = document.getElementById('videobg');
var artist = document.getElementById('artist');
var title = document.getElementById('title');
var desc = document.getElementById('description');
var chat = document.getElementsByClassName("comment-box")[0];
var isActive = true;

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
  if (socket) {
    payload = {};
    payload['command'] = command;
    payload = JSON.stringify(payload);
    socket.send(payload);
  }
}

function setupWS() {
    if (socket) {
    socket.onopen = function() {
      sendSock('get_full');
      sendSock('get_messages');
    }
    socket.onmessage = function(msg) {
      parseServerResponse(msg.data);
    }
    socket.onclose = function() {
      showServerResponse("We can't connect to our player right now, please refresh page or try again later. Sorry.");
    }
    socket.onerror = function() {
      console.log('WS error.');
      alert("We've encountered some problems, please reload page :(");
    }
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
    player.src = j.current.url + '#t=' + startTime;
    // Нужно добавить в DOM отображение artist + title + description
    // artist.innerHTML = j.current.artist;
    // title.innerHTML = j.current.title;
    nv_src = j.next.url;
    nv_artist = j.next.artist;
    nv_title = j.next.title;
    nv_desc = j.next.url;
/*
    console.log('Current video: ' + j.current.url + '#t=' + startTime);
    console.log('Next video: ' + j.next.url);
*/
  }

  function updateMessages(j) {
    messages = JSON.parse(j.messages);
    b = document.getElementsByClassName('comment-box')[0];
    n = "";
    for (var i = 0; i < messages.length; i++) {
      l = "<div class='comment'><div class='comment-text'><p>" + messages[i] + "</p></div></div>";
      n += l;
    }
    b.innerHTML = n;
  }

  function setupNext(j) {
  nv_src = j.next.url;
    nv_artist = j.next.artist;
    nv_title = j.next.title;
    nv_description = j.next.description;
// 	    console.log('Next video: ' + j.next.url);
  }

function sendMessage() {
  if (socket) {
    m = document.getElementsByClassName('add-message')[0].value;
    payload = {};
    payload['command'] = 'new_message';
    payload['message'] = {
      'sender':'dolbak',
      'message':m,
    };
    payload = JSON.stringify(payload);
    socket.send(payload);
    document.getElementsByClassName('add-message')[0].value = "";
  }
}
