import React from 'react';
import { Alert, View, StyleSheet, Text, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import Message from './Message';
import theme from '../config/appConfig';

const MessageFactory = props => {
  let copyToBoard = async (msg) => {
    Alert.alert(
      'Options',
      null,
      [
        {
          text: 'Copy',
          onPress: () => Clipboard.setString(msg)
        }
      ],
      {
        cancelable: true
      }
    );
  };

  let messageStyle = styles.sent;
  let user = null;
  if (props.type == 'sent') {
    messageStyle = styles.sent;
  } else if (props.type == 'rec') {
    messageStyle = styles.rec;
    if (props.username) {
      user = <Text style={styles.username}>{props.username}</Text>;
    }
  } else if (props.type == 'info') {
    let text = <Text style={[styles.infoText, styles.infoTextItalic]}>{props.content}</Text>;
    return <View style={styles.info}>{text}</View>;
  }

  return(
    <Message
      user = {user}
      content = {props.content}
      onLongPress={() => copyToBoard(props.content)}
      style={messageStyle}/>
  );
};

MessageFactory.defaultProps = {
  username:''
};

MessageFactory.propTypes = {
  content:PropTypes.string.isRequired,
  username:PropTypes.string,
  type:PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  sent: {
    backgroundColor: theme.CHAT.sent,
    alignSelf: 'flex-end',
    marginRight: 10
  },
  rec: {
    backgroundColor: theme.CHAT.rec,
    alignSelf: 'flex-start',
    marginLeft: 10
  },
  info: {
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 2
  },
  infoText: {
    fontSize: 13,
    color: theme.CHAT.info
  },
  infoTextItalic: {
    fontStyle: 'italic'
  },
  text: {
    fontSize: 15,
    color: theme.CHAT.text
  },
  username: {
    marginLeft: 15,
    fontSize: 13,
    padding: 2,
    color: theme.CHAT.name
  }
});

export default MessageFactory;
