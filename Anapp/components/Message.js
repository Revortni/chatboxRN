import React from 'react';
import { View,StyleSheet, Text } from 'react-native';


const Message = (props) =>{
    if(props.type=="sent"){
      return(
        <View style={styles.sent}>
          <Text style={styles.text}>{props.content}</Text>
        </View>
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
          <View style={styles.rec}>
            <Text style={styles.text}>{props.content}</Text>
          </View>
        </View>
      );
    } 
    else {
      return(
        <View style={styles.info}>
          <Text style={styles.infoText}>{props.content}</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  sent:{
    backgroundColor:'#87CEFA',
    color:'#010101',
    paddingTop:8,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:8,
    alignSelf:'flex-end',
    flexDirection:'column',
    marginRight:10,
    borderRadius:20,
    maxWidth:220,
    marginBottom:2
  },
  rec:{
    backgroundColor:'#98fb98',
    color:'#010101',
    paddingTop:8,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:8,
    alignSelf:'flex-start',
    flexDirection:'column',
    marginLeft:10,
    borderRadius:20,
    maxWidth:220,
    marginBottom:2
  },
  info:{
    padding:10,
    alignSelf:'center',
    flexDirection:'column',
    marginBottom:2
  },
  infoText:{
    fontSize:12,
    color:'#87cefa'
  },
  text:{
    fontSize:15,
    color:'#2a2a2a'
  },
  username:{
    marginLeft:15,
    fontSize:13,
    padding:2
  }
});

export default Message;