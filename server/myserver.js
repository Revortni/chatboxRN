const express=require('express');
const app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http,{
	// below are engine.IO options
	pingInterval: 5000,
	pingTimeout: 1000,
  });
const mongoose = require('mongoose');

var uuid = require('uuid/v4');

//Mongodb 
// const userdb = mongoose.connect('mongodb://localhost:27017/users',{useNewUrlParser:true});
// const messagedb = mongoose.connection('mongodb://localhost:27017/messages',{useNewUrlParser:true});

//Socket io 
let onlineusers=[];
let allusers=[];
let usermap = {};
let onlinecount=0;

io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	var id;
	var name;
	onlinecount++;
	if(onlineusers.length>0){
		let users = onlineusers.map(x=>usermap[x]);
		console.log("Users online:");
		console.log(users);
	}
	
	//server messages
	initialres = ()=>{
		socket.emit('serverInfo',{message:((onlinecount-1)==1)?'A user is online':`${onlinecount-1} users are online`});
		setTimeout(()=>{
			if(onlinecount==1){
				socket.emit('receiveMessage',{message:`It appears you are the only one who is online right now.`});
			} else {
				socket.emit('receiveMessage',{message:`Someone else is online right now. Try saying hi.`});
			}
		},2000);
	}

	onlineUserInfo = () => {
		setTimeout(()=>{
			let count = onlinecount-1;
			if(count<4 & count>0){
				let users = onlineusers.filter(x=>x!=id);
				let others =users.map(x=>usermap[x].username);
				let msg = others.reduce((a,x)=>{
					return a+' ,'+x;
				})+(count==1?" is":" are")+" online";
				socket.emit('serverInfo',{message:msg});
			} else {
				socket.emit('serverInfo',{message:(count==0)?'Nobody is online':`${count} users are online`});
			}
		},2000);
	}

	//remove user from onlineuser list
	removeuser = (from,id)=>{
		let index = from.indexOf(id);
		if(index>-1){
			onlineusers.splice(index,1);
		}
	}

	//when user disconnects
	disconnect = () =>{
		socket.on("disconnect",()=>{
			onlinecount--;
			removeuser(onlineusers,id);
			console.log(`User ${id} disconnected`);
			socket.broadcast.emit("serverInfo",{message:`${name} has left the chat.`});
		});
	}
	//when a new user connects
	socket.on('newUser',({username,email})=>{
		id = uuid();
		name = username;
		mail = email;
		console.log(`User ${id} connected`);
		allusers.push(id);
		onlineusers.push(id);
		usermap[id]={username,mail,id};
		socket.emit('userInfo',id);
		socket.emit('receiveMessage',{message:"Hello Stranger\nWelcome to ChatBox"});
		setTimeout(()=>initialres(),2000);
		socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
		disconnect();
	});

	socket.on('reregister',({username,email,userid})=>{
		let msg = "It appears the server restarted. We are registering you again."
    	socket.emit("receiveMessage",{message:msg});
		id = userid;
		name = username;
		mail = email;
		console.log(`User ${id} connected`);
		allusers.push(id);
		onlineusers.push(id);
		usermap[id]={username,mail,id};
		socket.emit('receiveMessage',{message:`Hello ${name}\nYou have been reregistered successfully`});
		socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
		onlineUserInfo();
		disconnect();
	});

	//when a old user connects
	socket.on('oldUser',({userid})=>{
		try{
			id = userid;
			name = usermap[id].username;
			onlineusers.push(id);
			console.log(`User ${userid} connected`);
			socket.emit('receiveMessage',{message:`Hello ${name}\nWelcome back to ChatBox`});
			socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
			onlineUserInfo();
			disconnect();
		} catch {
			socket.emit('reregister');
		}
	});
	
	//when user sends a message
	socket.on('sendMessage',function(data){
		console.log(data);
		if(data.message=="!resetMe"){
			socket.emit("resetMe");
			removeuser(onlineusers,id);
			removeuser(allusers,id);
			console.log('User '+usermap[id].username+' reset');
			delete usermap[id];
			socket.disconnect();
			return;
		}
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

	//ping the device to maintain connection
	socket.on('appOn',()=>{
		if(name){
			console.log(name+" device pinged");
		}
		socket.emit('appOn');
	});
}

app.set( 'port', ( process.env.PORT || 3000 ));

http.listen(app.get( 'port' ),function(){
	console.log('listening on port ',app.get( 'port' ));
	
});

