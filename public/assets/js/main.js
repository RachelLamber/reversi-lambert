function getIRIParameterValue(requestedKey){
    let pageIRI= window.location.search.substring(1);
    let pageIRIVariables = pageIRI.split('&');
    for(i=0; i<pageIRIVariables.length; i++){
        let data = pageIRIVariables[i].split('=');
        let key = data[0];
        let value = data[1];
        if(key === requestedKey){
            return value;
        }
    }
    return null;
}

let username = decodeURI(getIRIParameterValue('username'));
if((typeof username == 'undefined') || (username === null) || (username === 'null')){
    username = "Anonymous_"+Math.floor(Math.random()*1000);
}

/*$('#messages').prepend('<b>'+username+' :</b>');*/

/*let chatRoom = 'Lobby';*/
let chatRoom = decodeURI(getIRIParameterValue('game_id'));
if((typeof chatRoom == 'undefined') || (chatRoom === null) || (chatRoom === 'null')){
    chatRoom = "Lobby";
}

let socket = io();
socket.on('log', function(array){
    console.log.apply(console,array);
});

socket.on('join_room_response',(payload)=> {
    if((typeof payload == 'undefined') || (payload === null)){
        console.log('server did not send a payload');
        return;
    }
    if(payload.result === 'fail'){
        console.log(payload.message);
        return;
    }
    let newString = '<p class=\'join_room_response\'>'+payload.username+' joined the '+payload.room+'. (There are '+payload.count+' users in this room)</p>';
    $('#messages').prepend(newString);
})

function sendChatMessage(){
    let request = {};
    request.room = chatRoom;
    request.username = username;
    request.message = $('#chatMessage').val();
    console.log('**** Client log message, sending \'send_chat_message\' command: '+JSON.stringify(request));
    socket.emit('send_chat_message',request);
}
socket.on('send_chat_message_response',(payload)=> {
    if((typeof payload == 'undefined') || (payload === null)){
        console.log('server did not send a payload');
        return;
    }
    if(payload.result === 'fail'){
        console.log(payload.message);
        return;
    }
    let newString = '<p class=\'chat_message\'><b>'+payload.username+'</b>: '+payload.message+'</p>';
    $('#messages').prepend(newString);
})

/*request to join the chatroom */

$( () => {
    let request = {};
    request.room = chatRoom;
    request.username = username;
    console.log('**** Client log message, sending \'join_room\' command: '+JSON.stringify(request));
    socket.emit('join_room',request);

    $('#lobbyTitle').html(username+"'s Lobby");
    
    $('#chatMessage').keypress( function (e){
        let key = e.which;
        if (key == 13){
          $('button[id = chatButton]').click();
          return false;
        }
      })
});