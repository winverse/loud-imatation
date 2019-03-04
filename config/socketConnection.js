

module.exports = function(io) {
    
    io.on('connection', function(socket){  //connection ->> 접속이 일어날때 실행이 됨
        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? ( session.user ) : "";
  
        socket.on('client message', function(data){ //클라이언트 단에서 보낸 client message에 관한 처리를 한다.
            io.emit(data.input.firstWin + 'message', { 
                message : data.message, 
                displayname : user.name,
            });
        });

        socket.on('image message', function(data){ //클라이언트 단에서 보낸 client message에 관한 처리를 한다.
            console.log(data)
            io.emit(data.input.firstWin + 'message', { 
                
                imageData : data.input,
                displayname : user.name
            });
        });
    } );
};


// var listen = require('socket.io');
// var io = listen(server);  //io 는 전체
// io.on('connection', function(socket){ 
//     socket.on('client message', function(data){  //메시지를 받는건 on '파라미터는  client message (변경 가능)'
//         //console.log('message : ' + data.message) 
//         io.emit('server message', data.message);    //메시지를 보내는 건 emit  (전체에게 쏜다!) , '파라미터는 server message(변경 가능)'
//     });
// });