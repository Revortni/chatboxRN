import React from 'react';
import {Alert, View, BackHandler, Button, StyleSheet, Text, TouchableOpacity, Vibration} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import Input from '../components/Input';
import MessageList from '../components/MessageList';
import NetworkInfo from '../components/NetworkInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../config/appConfig';

const INFO = '@userInfo';

const {localhost,heroku,rltheroku} = require('../config/config.json');


class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            oldmessages:[],
            userid:null,
            username:this.props.username,
            email:this.props.email,
            title:'Gospel',
            connected:null,
            text:"",
            typing:false,
            vibrate:true
            };
        this.pushMsg = this.pushMsg.bind(this);
        this.pingTimer = null;
        this.sendTimer = null;  
        this.recTimer = null;  
        this.typer = [];
        this.socket = null;         
    }

    componentDidMount(){        
        this.socket = SocketIOClient(rltheroku);
        this.socket.emit('appOn');
        this.interval = setInterval(()=>{
            this.socket.emit('appOn');
            this.pingTimer = setTimeout(()=>{
                this.setState({connected:false});                
            },2000);
        },10000);

        this.socket.on('connect',()=>this._getInfo());
        this.socket.on('receiveMessage',(data)=>this.receiveMessage(data));
        this.socket.on('serverInfo',(data)=>this.serverInfo(data));  
        this.socket.on('appOn',()=>this.isConnected());
        this.socket.on('disconnect',()=>{
            this.serverInfo({message:"You have disconnected."});
            this.setState({connected:false});
        });
        this.socket.on('oldMessages',(data)=>{
            let messages = data.map(({username,userid,message,createdAt})=>{
                if(userid==this.state.userid){
                    return {username,message,action:"sent",createdAt};
                } else {
                    return {username,message,action:"rec",createdAt};
                }
            });
            this.setState({oldmessages:messages});
        });
        this.socket.on('resetMe',()=>{
            this.reset();
        });
        this.socket.on('typing',({username,typing})=>{
            let users;
            try{
            if(typing && !this.typer.includes(username)){
                this.typer.push(username);
            }else if(!typing){
                this.typer.splice(this.typer.indexOf(username),1);
            }
            users = this.typer.length==1? username:this.typer.reduce((a,x)=>{
                 return a+', '+x;
                });
            }catch{
                users=username;
            }
            clearTimeout(this.recTimer);
            let msgs = this.state.messages;
            if (!this.state.typing){
                let isare = (this.typer.length>1)?" are":" is";
                msgs.push({message:users+isare+" typing . . .",action:'info',italic:true});
            }
            this.setState({typing:true,messages:msgs});
            this.recTimer = setTimeout(()=>{
                if(this.state.typing){
                let message = this.state.messages;
                message.pop();
                this.setState({typing:false,messages:message});}
            },500);
        });
    }

    componentWillUnmount(){
        this.socket.disconnect();
        clearInterval(this.interval);
        clearTimeout(this.sendTimer);
        clearTimeout(this.recTimer);
        clearTimeout(this.pingTimer);
    }

    isConnected(){
        this.setState({connected:true});
        clearTimeout(this.pingTimer);
    }

    reset = () =>{
        Alert.alert(
            'Rename your account',
            'Are you sure?', [{
                text: 'No',
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => {
                    this.socket.emit("acceptRename");
                    AsyncStorage.setItem('registered',"false");
                    Alert.alert("The app will now close to reset.Closing app..");
                    setTimeout(()=>BackHandler.exitApp(),3000);
                }
            }, ], {
                cancelable: false
            }
         )
        return;
    }

    _getInfo = async()=>{
        try{
            const userInfo = await AsyncStorage.getItem(INFO);
            if (userInfo==null) {
                this.socket.emit('newUser',{username:this.state.username,email:this.state.email});
                this.socket.on('userInfo', (userid) => {
                    data = JSON.stringify({userid:userid,username:this.state.username,email:this.state.email});
                    AsyncStorage.setItem(INFO, data);
                    this.setState({ userid });
                });
            }
            else{
                let info = JSON.parse(userInfo);
                if(this.state.username && this.state.username!=info.username){
                    info.username = this.state.username;
                }
                let data = JSON.stringify(info);
                AsyncStorage.setItem(INFO,data);
                this.socket.emit('oldUser', info);
                this.setState(info);
            }
        } catch(e){
            alert(e);
        }
    }

    pushMsg = (data)=>{
        let msgs = this.state.messages;
        if(!this.state.typing){
            msgs.push(data);
            this.setState({
                messages:msgs
            });
        } else {
            let typing = msgs.pop();
            msgs.push(data);
            msgs.push(typing);
            this.setState({
                messages:msgs
            });
        }
    }

    sendMessage = () => {
        if(this.state.text){
            let msg = this.state.text.trim();
            let timestamp = new Date();
            this.socket.emit("sendMessage",{message:msg,userid:this.state.userid});
            this.pushMsg({message:msg,action:'sent',createdAt:timestamp.toISOString()});
            this.setState({text:""})
        }
    }
    
    receiveMessage=({message,username=0,createdAt})=>{
        this.pushMsg({message:message,action:'rec',username:username,createdAt});
        // alert(this.state.messages[this.state.messages.length-1].message);
        if(this.state.vibrate){
            Vibration.vibrate([0,300,200,300]);
        }
    }


    serverInfo({message}){
        this.pushMsg({message:message,action:'info'});
    }

    _keyPress = () =>{
        clearTimeout(this.timer);
        this.socket.emit('typing',{userid:this.state.userid,typing:true});
        this.sendTimer = setTimeout(
            ()=>this.socket.emit("typing",{
                userid:this.userid,typing:false
            }),500);
    }

    toggleVibrate(){
        if(!this.state.vibrate){
            Vibration.vibrate(800);
        }else{
            Vibration.vibrate(300);
        }
        this.setState({
            vibrate:!this.state.vibrate
        });
    }

    render() {
        return(
            <View style = {styles.container}>
                <TouchableOpacity activeOpacity={0.6} onLongPress={()=>this.toggleVibrate()}>
                    <View style={styles.headbar}>        
                        <Text style={styles.headTitle}>{this.state.title}</Text>
                    </View>
                </TouchableOpacity>
                <NetworkInfo status={this.state.connected}/>
                <MessageList messages ={this.state.messages} oldmessages = {this.state.oldmessages}/>
                <View style = {styles.inputArea}>      
                    <Input
                        placeholder="Aa"
                        placeholderTextColor={theme.HOLDERTEXT}
                        onChangeText={
                            text=>{
                                this.setState({text});
                                this._keyPress();
                            }
                        }
                        style={styles.messageInput}
                        value={this.state.text}
                        multiline={true}
                    />
                    <TouchableOpacity 
                        style={styles.send}
                        onPress={()=>this.sendMessage()}
                    >
                        <Icon name='send' size={25} color={styles.button.color}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headbar:{
        top:0,
        height:55,
        backgroundColor:theme.PRIMARY,
        justifyContent:'center',
    },
    container:{
        flex:1,
        backgroundColor:theme.BACKGROUND
    },
    messageInput:{
        padding:6,
        paddingLeft:15,
        backgroundColor: theme.INPUT,
        color:theme.TEXT,
        borderRadius:20,
        width:295,
        fontSize:15,
        marginLeft:20,
        marginRight:5,
    },
    headTitle:{
        alignSelf:'center',
        fontSize:40,
        width:100,
        color: theme.CHAT.title,
        fontFamily:"Always"
    },
    inputArea:{
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:theme.SECONDARY,
        padding:10,
        paddingBottom:10,
        alignItems:"center"
    },
    typing:{
        flex:1,
        justifyContent:'center',
        marginBottom:10,
        paddingTop:5
    },
    send:{
        marginLeft:5,
        marginRight:20
    },
    button:{
        color:theme.BUTTON
    }
});

export default ChatRoom;