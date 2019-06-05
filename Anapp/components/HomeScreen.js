import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';


export default class App extends Component {
  render() {
    return (
      <ChatRoom/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
