import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const Message = (props) => {
    return (
      <>
        {props.user}
        <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={() => props.onLongPress(props.content)}
          style={[styles.messages, props.style]}>
          <Text style={[styles.text,{color:props.textColor}]}>{props.content}</Text>
        </TouchableOpacity>
      </>
    );
};

Message.propTypes = {
    textColor:PropTypes.string.isRequired
  };

const styles = StyleSheet.create({
  messages: { 
    paddingTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    flexDirection: 'column',
    borderRadius: 20,
    maxWidth: 220,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: '#fff'
  }
});

export default Message;

Message.defaultProps = {
  user:{},
  style:{},
  onLongPress:()=>{return null;}
};

Message.propTypes = {
  user: PropTypes.object,
  style: PropTypes.object,
  content:PropTypes.string.isRequired,
  onLongPress:PropTypes.func
};