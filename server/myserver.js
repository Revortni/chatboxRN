const express=require('express');
const app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
var uuid = require('uuid/v4');
const path = require('path');
const port = process.env.PORT || 3000;


var userlist=[];

io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	let id;
	console.log(userlist);
	//when a new user connects
	socket.on('newUser',({username,email})=>{
		id = uuid();
		console.log(`User ${id} connected`)
		userlist.push({userid:id,username:username,email:email});
		socket.emit('userInfo',id);
		socket.emit('receiveMessage',{message:"Hello Stranger\nWelcome to ChatBox"});
		socket.broadcast.emit("inewUser",username);
	});

	//when a old user connects
	socket.on('oldUser',({userid})=>{
		id = userid;
		let user = userlist.filter((x)=>{
			if(x.userid==id){
				return true;
			}
			return false
		});
		let username = user[0].username;
		console.log(`User ${userid} connected`);
		socket.emit('receiveMessage',{message:`Hello ${username}\nWelcome back to ChatBox`});
		socket.broadcast.emit("userConnected",username);
	});
	
	//when user sends a message
	socket.on('sendMessage',function(data){
		console.log(data);
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

http.listen(port,function(){
	console.log('listening on port ',port);
	console.log(userlist);
});

