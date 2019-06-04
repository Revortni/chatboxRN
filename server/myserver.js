var express=require('express');//function handler
var app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
var uuid = require('uuid/v4');


var userCount=0;
var userlist={};

io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	//when user connects
	let id = uuid();
	console.log(`User ${id} connected`)
	socket.emit('userInfo',id);
	socket.emit('receiveMessage',{message:"Hello\nWelcome to ChatBox"});
	
	
	//when user sends a message
	socket.on('sendMessage',function(data){
		socket.broadcast.emit('receiveMessage',data);
	});

	// //when user starts to type into the input panel
	// socket.on("typing",(val)=>{
	// 	var data={
	// 		show:val,// show or hide typing
	// 		id:userlist[socket.id],
	// 	};
	// 	socket.broadcast.emit("typing",data)
	// });

	//when user disconnects from server
	socket.on("disconnect",()=>{
		console.log(`User ${id} disconnected`);
	});
}

http.listen(3000,function(){
	console.log('listening on port 3000');
});

