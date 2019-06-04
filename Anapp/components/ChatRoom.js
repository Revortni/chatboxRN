import React from 'react';
import { View, StyleSheet,Text,AsyncStorage} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import Input from './Input';
import MessageList from './MessageList';
import Icon from 'react-native-vector-icons/FontAwesome';
import uuid from 'uuid';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            sender:'Rev',
            userid:null,
            title:'Gospel'
            };
        this.socket = SocketIOClient('http://192.168.1.3:3000');
        this.socket.on('receiveMessage',(data)=>this.receiveMessage(data));
        this.socket.on('userInfo',(id)=>this.setState({userid:id,title:id}));        
    }

    onChangeText = (text)=>{
        this.setState({text:text});
    }

    sendMessage = () =>{
        let msgs = this.state.messages;
        if(this.state.text){
            msg = this.state.text.trim();
            this.socket.emit("sendMessage",{message:msg,userid:this.state.userid});
            msgs.push({message:msg,action:'sent'});
            this.setState({messages:msgs,text:''});
        }
    }
    
    receiveMessage(data){
        let msgs = this.state.messages;
        msgs.push({message:data.message,action:'rec'});
        this.setState({
            messages:msgs
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
            onChangeText={text=>this.onChangeText(text)}
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