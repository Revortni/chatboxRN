const express=require('express');
const app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http,{
	// below are engine.IO options
	pingInterval: 15000,
	pingTimeout: 1000,
  });
var uuid = require('uuid/v4');

app.set( 'port', ( process.env.PORT || 3000 ));

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
	console.log(`Online user count: ${onlinecount}`);
	
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

	//remove user from onlineuser list
	removeuser = (id)=>{
		let index = onlineusers.indexOf(id);
		if(index>-1){
			onlineusers.splice(index,1);
		}
	}

	//when user disconnects
	disconnect = () =>{
		socket.on("disconnect",()=>{
			onlinecount--;
			removeuser(id);
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
		socket.emit('receiveMessage',{message:`Hello ${name}\nYou have been reregisterd successfully`});
		setTimeout(()=>{
			socket.emit('serverInfo',{message:((onlinecount-1)==1)?'A user is online':`${onlinecount-1} users are online`});
		},2000);
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
			setTimeout(()=>{
				socket.emit('serverInfo',{message:((onlinecount-1)==1)?'A user is online':`${onlinecount-1} users are online`});
			},2000);
			socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
			disconnect();
		} catch {
			socket.emit('reregister');
		}
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

	//ping the device to maintain connection
	socket.on('appOn',(data)=>{
		if(name){
			console.log(name+" device pinged");
		}
	});
}

http.listen(app.get( 'port' ),function(){
	console.log('listening on port ',app.get( 'port' ));
	if(onlineusers.length>0){
		let users = onlineusers.map(x=>usermap[x]);
		console.log(users);
	}
});

