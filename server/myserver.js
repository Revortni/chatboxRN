const express=require('express');
const app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
var uuid = require('uuid/v4');
const path = require('path');
const port = process.env.PORT || 3000;


var userlist=[];
let totalusers=0;
let onlineusers=0;

io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	var id;
	var username;
	console.log(userlist);
	//server messages
	initialres = ()=>{
		socket.emit('serverInfo',{message:((onlineusers-1)==1)?'A user is online':`${onlineusers-1} users are online`});
		setTimeout(()=>{
			if(onlineusers==1){
				socket.emit('receiveMessage',{message:`It appears you are the only one who is online right now.`});
			} else {
				socket.emit('receiveMessage',{message:`Someone else is online right now. Try saying hi.`});
			}
		},2000)
	}
	//when a new user connects
	socket.on('newUser',({username,email})=>{
		id = uuid();
		totalusers++;
		onlineusers++;
		username = username
		console.log(`User ${id} connected`)
		userlist.push({userid:id,username:username,email:email});
		socket.emit('userInfo',id);
		socket.emit('receiveMessage',{message:"Hello Stranger\nWelcome to ChatBox"});
		setTimeout(()=>initialres(),2000);
		socket.broadcast.emit("serverInfo",{message:`${username} has joined the chat.`});
	});

	//when a old user connects
	socket.on('oldUser',({userid})=>{
		id = userid;
		onlineusers++;
		let user = userlist.filter((x)=>{
			if(x.userid==id){
				return true;
			}
			return false
		});
		username = user[0].username;
		console.log(`User ${userid} connected`);
		socket.emit('receiveMessage',{message:`Hello ${username}\nWelcome back to ChatBox`});
		setTimeout(()=>initialres(),2000);
		socket.broadcast.emit("serverInfo",{message:`${username} has joined the chat.`});
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
		onlineusers--;
		console.log(`User ${id} disconnected`);
		socket.broadcast.emit("serverInfo",{message:`${username} has left the chat.`});
	});
}

http.listen(port,function(){
	console.log('listening on port ',port);
	console.log(userlist);
});

