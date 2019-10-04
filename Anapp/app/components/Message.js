import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../config/appConfig';

const Message = (props) => {
    return (
      <>
        {props.user}
        <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={() => props.onLongPress(props.content)}
          style={[styles.messages, props.style]}>
          <Text style={styles.text}>{props.content}</Text>
        </TouchableOpacity>
      </>
    );
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
    color: theme.CHAT.text
  }
});

export default Message;

Message.defaultProps = {
  user:null,
  onLongPress:null,
};

Message.propTypes = {
  user: PropTypes.string,
  style: PropTypes.instanceOf(StyleSheet).isRequired,
  onLongPress:PropTypes.func,
  content:PropTypes.string.isRequired
};