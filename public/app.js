var socket = io.connect();
var $messageForm = $('#messageForm');
var $message = $('#message');
var $chat = $('#chat');
var $messageArea = $('#messageArea');
var $userFormArea = $('#userFormArea');
var $userForm = $('#userForm');
var $users = $('#users');
var $username = $('#username');
var $dot = $('#myImg');
var $frame = $('#frame');
var $otherguy = $('#otherguy');

$userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data){
        if(data){
            $userFormArea.hide();
            $messageArea.show();
            $dot.css("background-color", getRandomColor());
            $dot.show();
        }
    });
    $username.val('');
});

socket.on('get users', function(data){
    var html = '';
    for (i=0; i< data.length; i++){
        html += '<li class="list-group-item">'+ data[i] +'</li>' 
    }
    $users.html(html) 
});

socket.on('send coordinates', function(data){
    console.log('this is the data from the server', data);
    $frame.append('<span class="newdot"></span>');
    $('.newdot').css('position', 'absolute');
    $('.newdot').css('top', data.elementY); 
    $('.newdot').css('left', data.elementX);
    $('.newdot').css('z-index', 99999);
    $('.newdot').css("background-color", data.color);
    $('.newdot').css("position", relative);
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
       color += letters[Math.floor(Math.random() * 16)];
    }
    localStorage.setItem('chosencolor', color);
    return color;
}

// Dragging Logic
function draggable(element) {
    var isMouseDown = false;

    // initial mouse X and Y for `mousedown`
    var mouseX;
    var mouseY;

    // element X and Y before and after move
    var elementX = 0;
    var elementY = 0;

    // mouse button down over the element
    element.addEventListener('mousedown', onMouseDown);

    /**
     * Listens to `mousedown` event.
     *
     * @param {Object} event - The event.
     */
    function onMouseDown(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        isMouseDown = true;
    }

    // mouse button released
    
    $('body').mouseup(function() {
      onMouseUp();
    });

    /**
     * Listens to `mouseup` event.
     *
     * @param {Object} event - The event.
     */
    function onMouseUp(event) {
        isMouseDown = false;
        elementX = parseInt(element.style.left) || 0;
        elementY = parseInt(element.style.top) || 0;
        socket.emit('mouse up', {elementX: elementX, elementY: elementY, color: localStorage.getItem('chosencolor')});
    }

    // need to attach to the entire document
    // in order to take full width and height
    // this ensures the element keeps up with the mouse
    document.addEventListener('mousemove', onMouseMove);

    /**
     * Listens to `mousemove` event.
     *
     * @param {Object} event - The event.
     */
    function onMouseMove(event) {
        if (!isMouseDown) return;
        var deltaX = event.clientX - mouseX;
        var deltaY = event.clientY - mouseY;
        element.style.left = elementX + deltaX + 'px';
        element.style.top = elementY + deltaY + 'px';
    }
}

draggable(document.getElementById('myImg'));

//Logic for in-app messaging between players
$messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
});

socket.on('new message', function(data){
    $chat.append('<div class="well"><strong>'+ data.user +'</strong>: '
    + data.msg + '</div>');
});