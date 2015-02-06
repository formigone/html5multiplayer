var socket = new WebSocket('ws://localhost:2667');
var btn = document.createElement('button');
btn.textContent = 'Click';
btn.disabled = true;
btn.addEventListener('click', function(event){
    sendMsg('hello ' + Math.random() * 9999);
});

var sendMsg = function(msg){
    socket.send(msg);
};

document.body.appendChild(btn);

socket.onopen = function(event){
    btn.disabled = false;
};

socket.onmessage = function(event){
    var e = document.createElement('p');
    e.textContent = event.data;
    console.log(event);

    document.body.appendChild(e);
};
