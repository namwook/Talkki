///<reference path="../../node_modules/@types/socket.io-client/index.d.ts"/>


$(function () {
    function setNickname(name) {
        $('#print_users_msg').append($('<li>').text(`nickname changed :: ${name}`));
    }

    const socket = io('http://localhost:3000');
    // Is 'io' async or sync?

    let id = "someone";

    $('#nickname').submit(function () {
        id = $('#nicknameInput').val() as string;
        socket.emit('set nickname', id);
        return false;
    });

    $('#input_msg').keydown(function () {
        socket.emit('showKeyStatus', id);
    });

    $('#input_user_msg').submit(function () {
        socket.emit('chat message', $('#input_msg').val());
        $('#input_msg').val('');
        return false;
    });

    $('#input_private_msg').submit(function () {
        socket.emit('say to someone', $('#private_user_nickname').val(), $('#private_input_msg').val());
        $('#private_input_msg').val('');
        return false;
    });

    socket.on('set nickname', setNickname);


    socket.on('my message', function (user_name, private_msg) {
        let private_flag = '(귓): ';
        console.log(`(client) ${private_msg} : 메세지 내용`);
        console.log(`${user_name}, ${id}`);
        if (user_name == id) {
            $('#print_users_msg').append($('<li>').text(private_flag + private_msg));
        }
    });

    socket.on('showKeyStatus', function (msg) {
        console.log(`client status: ${msg}`);
    });

    socket.on('connect', function () {
        id = socket.id;
        $('#print_users_msg').append($('<li>').text(`${id} is connected.`));
    });

    socket.on('disconnect', function () {
        $('#print_users_msg').append($('<li>').text('a user is disconnected.'));
    });

    socket.on('chat message', function (msg) {
        console.log(`${socket.id} chat msg on client side.`);
        // if (msg.id != id) {
        // }
        $('#print_users_msg').append($('<li>').text(msg.id + ': ' + msg.msg));
    });

    socket.on('onlineObject', function (online) {
        console.log(online);
    });
});