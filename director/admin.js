var ws = null;
var current_player = null;
// var server = "ws://ws.plivka.tv:8085/ws";
var server = "ws://localhost:8085/ws";
var player = "main"

var nextUpdate = null;

function sendCommand(command) {
  if ("WebSocket" in window) {
    command = JSON.stringify(command)
    ws.send(command)
  }
}

function fetchTapped() {
    setServer()
    setPlayer()
    getData()
}

function setServer() {
    var srvInput = document.getElementById("serverInput")
    var srv = srvInput.value
    if (srv != "") {
        server = srv
    } else {
        srvInput.value = server
    }
}

function setPlayer() {
    var playerInput = document.getElementById("playerInput")
    var plr = playerInput.value
    if (plr != "") {
        player = plr
    } else {
        playerInput.value = player
    }
}

function requestCurrent() {
    var cmd = {
        "command": "get_full",
        "token":"ASS",
        "layer": player
    }
    current_player = player
    sendCommand(cmd)
    console.log("Current player: " + current_player)
}

function getData() {
  if ("WebSocket" in window) {
      console.log(current_player)
    //  alert("WebSocket is supported by your Browser!");

    // Let us open a web socket

    //  var ws = new WebSocket("ws://localhost:8085/ws");
    if (ws == null) {
        ws = new WebSocket(server);
    } else if (ws.url != server) {
        ws.close()
        ws = new WebSocket(server);
    } else if (current_player != player) {
        setPlayer()
        console.log(current_player)
        requestCurrent()
        return
    } else {
        requestCurrent()
        return
    }

    ws.onopen = function() {
      // Web Socket is connected, send data using send()
      requestCurrent()
      console.log("Message was sent...");
    };

    ws.onmessage = function(evt) {
      var received_msg = evt.data
      console.log(received_msg)
      var msg = JSON.parse(received_msg);
      if (msg.type != null) {
          processMessage(msg)
      } else {
          alert("no type for message")
          alert(msg)
      }
    };

    ws.onclose = function() {
      // websocket is closed.
      console.log("Connection is closed...");
    };
  } else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}

function showPlaylist() {
    var playerInput = document.getElementById("playerInput").value
    var cmd = {
            "command": "admin_playlist_print",
            "token": "ASS",
            "layer": playerInput
        }
    sendCommand(cmd)
}

function forcePushNextUrl() {
    var newUrl = document.getElementById("forceVideoUrl").value
    if (newUrl == "") {
        alert("Next video URL can't be empty!")
        return
    }
    cmd = {
        "command": "admin_force_play_next",
        "token": "ASS",
        "layer": player,
        "video_url": newUrl
    }
    sendCommand(cmd)
}

function reloadPlaylist() {
    var playerInput = document.getElementById("playerInput").value
    var cmd = {
            "command": "admin_playlist_reload",
            "token": "ASS",
            "layer": playerInput
        }
    sendCommand(cmd)
}

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

function customCommandPayload() {
    var command = document.getElementById("customCommandPayload").value
    if (command == "") {
        alert("Payload can't be empty!")
        return
    }
    cmd = JSON.parse(command)
    sendCommand(cmd)
}

function processMessage(msg) {
    switch (msg.type) {
        case "video_full":
            $("#cur_url").text(msg["current"]["url"])
            $("#cur_artist").text(msg["current"]["artist"])
            $("#cur_title").text(msg["current"]["title"])
            $("#cur_desc").text(msg["current"]["desc"])
            var c_time = fmtMSS(Math.floor(msg["current"]["start_time"]))
            var c_dur = fmtMSS(Math.floor(msg["current"]["duration"]))
            $("#cur_time").text(c_time)
            $("#cur_time_ttl").text(c_dur)

            $("#next_url").text(msg["next"]["url"])
            $("#next_artist").text(msg["next"]["artist"]);
            $("#next_title").text(msg["next"]["title"]);
            $("#next_desc").text(msg["next"]["desc"]);
            var n_dur = fmtMSS(Math.floor(msg["next"]["duration"]))
            $("#next_time_ttl").text(n_dur)
            var diff = msg["current"]["duration"] - msg["current"]["start_time"]
            nextUpdate = setTimeout(() => {
                getData()
            }, (diff + 2) * 1000);
            break
        case "players_list":
            var pls = JSON.parse(msg.players)
            $("#players-live").text(pls)
            break
        case "video_next":
            $("#next_url").text(msg["next"]["url"])
            $("#next_artist").text(msg["next"]["artist"]);
            $("#next_title").text(msg["next"]["title"]);
            $("#next_desc").text(msg["next"]["desc"]);
            $("#next_time_ttl").text(msg["next"]["duration"])
            break
        case "result":
            var result = msg.status
            alert(result)
        case "admin_playlist":
            var x = msg.playlist.join("\n")
            alert(x)
            
    }
}

function getPlayers() {
    setTimeout(() => {
        cmd = {"command":"list_players", "layer":"main"}
        sendCommand(cmd)
    }, 500);
}
setServer()
setPlayer()
getData()
getPlayers()
