import React from 'react';
import { View, BackHandler, StyleSheet,Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import Input from './Input';
import MessageList from './MessageList';
import Icon from 'react-native-vector-icons/FontAwesome';

const INFO = '@userInfo';

const {localhost,heroku} = require('./config.json');

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            userid:null,
            username:this.props.username,
            email:this.props.email,
            title:'Gospel',
            connected:false,
            text:"",
            };
        // this.timeout = "";
        this.socket = SocketIOClient(heroku);
        this.socket.on('connect',()=>this._getInfo());
        this.socket.on('receiveMessage',(data)=>this.receiveMessage(data));      
        this.socket.on('userInfo',(userid)=>{this.setState({userid})});
        this.socket.on('serverInfo',(data)=>this.serverInfo(data));  
        this.socket.on('appOn',()=>{});
        this.socket.on('disconnect',()=>this.serverInfo({message:"You have disconnected."}));
        this.socket.on('reregister',()=>{
            this.setState({messages:[]});
            this.socket.emit('reregister',{
                username:this.state.username,
                email:this.state.email,
                userid:this.state.userid
            });
        });
        this.socket.on('resetMe',()=>{
            AsyncStorage.clear();
            alert("The app will now close to reset.Closing app..");
            setTimeout(()=>BackHandler.exitApp(),5000);
        });
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            this.socket.emit('appOn',{userid:this.state.userid,username:this.state.username});
            // this.timeout = setTimeout(()=>{
            //     this.setState({connected:false});                
            // },2000);
        },25000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    _getInfo = async()=>{
        // this.setState({connected:true});
        try{
            const userInfo = await AsyncStorage.getItem(INFO);
            if (userInfo==null) {
                if(this.state.userid){
                    this.socket.emit('newUser',{username:this.state.username,email:this.state.email,userid:this.state.userid});
                }else{
                    this.socket.emit('newUser',{username:this.state.username,email:this.state.email});
                }
                this.socket.on('userInfo', (userid) => {
                data = JSON.stringify({userid:userid,username:this.state.username});
                AsyncStorage.setItem(INFO, data);
                this.setState({ userid });
            });
            }
            else {
                info = JSON.parse(userInfo);
                this.socket.emit('oldUser', info);
                this.setState(info);
            }
        } catch(e){
            alert(e);
        }
    }

    sendMessage = () =>{
        let msgs = this.state.messages;
        if(this.state.text){
            msg = this.state.text.trim();
            this.socket.emit("sendMessage",{message:msg,userid:this.state.userid,username:this.state.username});
            msgs.push({message:msg,action:'sent'});
            this.setState({messages:msgs,text:''});
        }
    }
    
    receiveMessage({message,username=0}){
        let msgs = this.state.messages;
        msgs.push({message:message,action:'rec',username:username});
        this.setState({
            messages:msgs
        });
    }

    serverInfo(data){
        let msgs = this.state.messages;
        msgs.push({message:data.message,action:'info'});
        this.setState({
            message:msgs
        });
    }

    render() {
        return(
            <View style = {styles.container}>
                <View style={styles.headbar}>
                    <Text style={styles.headTitle}>{this.state.title}</Text>
                </View>
                <MessageList messages ={this.state.messages}/>
                <View style = {styles.inputArea}>      
                <Input
                    placeholder="Aa"
                    onChangeText={text=>this.setState({text})}
                    style={styles.sendMsg}
                    value={this.state.text}
                    multiline={true}
                />
                <Icon.Button 
                    name="send" 
                    onPress={()=>this.sendMessage()}
                    backgroundColor='#87cefa'
                    size={24}
                    style={{padding:13,paddingTop:8,paddingLeft:8}}
                    borderRadius={400}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headbar:{
        top:0,
        height:50,
        backgroundColor:'#87CEFA',
        justifyContent:'center',
    },
    container:{
        flex:1,
    },
    sendMsg:{
        padding:6,
        paddingLeft:15,
        backgroundColor:'#ffffff',
        borderRadius:20,
        width:295,
        fontSize:15,
        marginLeft:20,
        marginRight:5,
    },
    headTitle:{
        alignSelf:'center',
        fontSize:20,
        color:'#2a2a2a'
    },
    inputArea:{
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:'#87CEFA',
        padding:10,
        paddingBottom:5
    },
    messageContainer:{
        marginTop:5,
        marginBottom:10,
    }
});

export default ChatRoom;