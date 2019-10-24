/* eslint-disable react/no-array-index-key */
import React, { Component} from 'react';
import {  View } from 'react-native';
import PropTypes from 'prop-types';
import TimeStamp from './Timestamp';
import MessageFactory from './MessageFactory';

export default class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages
    };
    this.lastsender = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.messages.length !== nextProps.messages.length) {
      return {
        messages: nextProps.messages
      };
    }
    return null;
  }

  render() {
    let last = 0;
    if (!this.state.messages) {
      return null;
    }
    return this.state.messages.map((x, i) => {
      let content = null;
      if (x.action == 'sent' || x.action == 'rec') {
        content = <TimeStamp last = {last} current = {x.createdAt} />;
        last = x.createdAt;
      };

    if(this.lastsender != x.username){
        this.lastsender = x.username;
    }else{
        x.username = null;
    }

    return (
        <View key={i}>
          {content}
          <MessageFactory type={x.action} content={x.message} username={x.username} key={i} />
        </View>
      );
    });
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
};