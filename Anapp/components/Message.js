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
    return(
    <View style={styles.rec}>
      <Text style={styles.text}>{props.content}</Text>
    </View>
    );
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
  text:{
    fontSize:15,
    color:'#2a2a2a'
  }
});

export default Message;