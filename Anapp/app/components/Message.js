import React from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity, Clipboard } from 'react-native';
import theme from '../config/appConfig';

const Message = props => {
  copyToBoard = async msg => {
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
  if (props.type == 'sent') {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onLongPress={() => this.copyToBoard(props.content)}
        style={[styles.messages, styles.sent]}>
        <Text style={styles.text}>{props.content}</Text>
      </TouchableOpacity>
    );
  } else if (props.type == 'rec') {
    let content = null;
    if (props.username) {
      content = <Text style={styles.username}>{props.username}</Text>;
    }
    return (
      <View style={{ maxWidth: 220 }}>
        {content}
        <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={() => this.copyToBoard(props.content)}
          style={[styles.messages, styles.rec]}>
          <Text style={styles.text}>{props.content}</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (props.type == 'info') {
    let text = <Text style={[styles.infoText, styles.infoTextItalic]}>{props.content}</Text>;
    return <View style={styles.info}>{text}</View>;
  }
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
    marginBottom: 2
  },
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

export default Message;
