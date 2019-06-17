const express=require('express');
const app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http,{
	// below are engine.IO options
	pingInterval: 5000,
	pingTimeout: 2000,
});

var pinger = require("axios");
setInterval(function() {
	console.log("Pinged server")
    pinger.get("https://guarded-fjord-84140.herokuapp.com").then().catch((err)=>console.log(err));
}, 30*60*1000); // every 30mins


var uuid = require('uuid/v4');

//MongoDB variables
let userdb = require('./database/UserDatabase');
let msgdb = require('./database/MsgDatabase');

//SocketIO variables
let onlineusers=[];
let allusers=[];
let usermap = {}; // maps userid to username
let onlinecount=0;
let messages = []

//MongoDB
runDatabase = async()=>{
	try{
		allusers =  await userdb.connect();
		let data = await msgdb.connect();
		if(allusers.length>0){
			allusers.map(({userid,username})=>{
				usermap[userid] = username;
			});
		}
		messages = data.map(({userid,message})=>{
			return {username:usermap[userid],message,userid}
		});		
		return Promise.resolve();
	} catch(err){
        return Promise.reject(err);
    }
}

getMessages = async()=>{
	try{
		messages = await msgdb.fetchMessages();
		return Promise.resolve();
	} catch(err){
        return Promise.reject(err);
    }
}


//SocketIO
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
		},500);
	}

	onlineUserInfo = () => {
		setTimeout(()=>{
			try{
				let count = onlineusers.length-1;
				if(count<4 & count>0){
					let users = onlineusers.filter(x=>x!=id);
					let others =users.map(x=>usermap[x]);
					let msg = others.reduce((a,x)=>{
						return a+' ,'+x;
					})+(count==1?" is":" are")+" online";
					socket.emit('serverInfo',{message:msg});
				} else {
					socket.emit('serverInfo',{message:(count==0)?'Nobody is online':`${count} users are online`});
				}
			}catch(err){
				return null;
			}
		},1000);
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
			console.log(`User ${name} disconnected`);
			socket.broadcast.emit("serverInfo",{message:`${name} has left the chat.`});
		});
	}

	//when a new user connects
	socket.on('newUser',({username,email})=>{
		id = uuid();
		name = username;
		mail = email;
		console.log(`User ${name} connected`);
		allusers.push(id);
		onlineusers.push(id);
		usermap[id]=username;
		userdb.addUser({username:name,userid:id,mail:email});
		socket.emit('userInfo',id);
		socket.emit('receiveMessage',{message:"Hello Stranger\nWelcome to ChatBox"});
		setTimeout(()=>initialres(),1000);
		socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
		disconnect();
	});

	//when a old user connects
	socket.on('oldUser',({userid,username})=>{
		try{
			id = userid;
			if(usermap[id]!=username){
				usermap[id]=username;
			}
			name = usermap[id];
			onlineusers.push(id);
			console.log(`User ${name} connected`);
			socket.emit("oldMessages",messages);
			socket.broadcast.emit("serverInfo",{message:`${name} has joined the chat.`});
			onlineUserInfo();
			disconnect();
		} catch(err){
			console.log(err);
		}
	});
	
	//when user sends a message
	socket.on('sendMessage',async function(data){
		console.log(data);
		if(data.message=="!resetMe"){
			socket.emit("resetMe");
			removeuser(onlineusers,id);
			removeuser(allusers,id);
			console.log('User '+usermap[id]+' reset');
			delete usermap[id];
			socket.disconnect();
			return;
		}
		let temp = {username:usermap[data.userid],message:data.message,userid:data.userid};
		messages.push(temp);
		socket.broadcast.emit('receiveMessage',temp);
		msgdb.addMessage(data).catch((err)=>console.error(err));		
	});

	//when user starts to type into the input panel
	socket.on("typing",({userid,typing})=>{
		socket.broadcast.emit("typing",{username:usermap[userid],typing})
	});

	//response for when the device pings to maintain connection
	socket.on('appOn',()=>{
		if(name){
			console.log(name+"'s device pinged");
		}
		socket.emit('appOn');
	});
}

app.set( 'port', ( process.env.PORT || 3000 ));

app.get('/',function(req,res){
	res.send("Server's up.");
});

http.listen(app.get( 'port' ),async function(){
	await runDatabase();
	console.log('listening on port ',app.get( 'port' ));
});

