import React from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity, Clipboard } from 'react-native';


const Message = (props) =>{
    copyToBoard = async(msg) => {
    Alert.alert("Options",null,[{
        text:"Copy",
        onPress:()=> Clipboard.setString(msg)
    }],
    {
        cancelable:true
    });
    }
    if(props.type=="sent"){
      return(
        <TouchableOpacity activeOpacity={0.6} onLongPress = {()=>this.copyToBoard(props.content)} style = {[styles.messages,styles.sent]}>
            <Text style={styles.text}>{props.content}</Text>
        </TouchableOpacity>
        
      );
    }
    else if (props.type=="rec"){
      let content = null;
      if(props.username){
        content = <Text style={styles.username}>{props.username}</Text>;
      }
      return(
        <View style={{maxWidth:220}}>
          {content}
          <TouchableOpacity activeOpacity={0.6} onLongPress = {()=>this.copyToBoard(props.content)} style = {[styles.messages,styles.rec]}>
            <Text style={styles.text}>{props.content}</Text>        
          </TouchableOpacity>
        </View>
      );
    } 
    else if (props.type=="info") {  
      let text =<Text style={styles.infoTextItalic}>{props.content}</Text>
      return(
        <View style = {styles.info}>
          {text}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  messages:{
    paddingTop:8,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:8,
    flexDirection:'column',
    marginRight:10,
    borderRadius:20,
    maxWidth:220,
    marginBottom:2
  },
  sent:{
    backgroundColor:'#718D93',
    alignSelf:'flex-end',
  },
  rec:{
    backgroundColor:'#5DA392e',
    alignSelf:'flex-start'
  },
  info:{
    padding:10,
    alignSelf:'center',
    flexDirection:'column',
    marginBottom:2
  },
  infoText:{
    fontSize:13,
    color:'#744774',
  },
  infoTextItalic:{
    fontSize:13,
    color:'#744774',
    fontStyle:"italic"
  },
  text:{
    fontSize:15,
    color:'#ffffff',
  },
  username:{
    marginLeft:15,
    fontSize:13,
    padding:2
  }
});

export default Message;