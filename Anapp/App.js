import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import HomeScreen from './app/pages/HomeScreen';

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <View style={{ marginBottom: 20 }}>
          <StatusBar
            translucent
            backgroundColor={styles.statusBar.backgroundColor}
            barStyle="light-content"
            hidden={false}
          />
        </View>
        <HomeScreen />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#000'
  }
});
