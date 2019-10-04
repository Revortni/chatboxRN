import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import HomeScreen from './HomeScreen';
import theme from '../config/appConfig';

export default class Main extends Component {
  render() {
    return (
      <>
        <View style={{ marginBottom: 20 }}>
          <StatusBar
            translucent
            backgroundColor={styles.statusBar.backgroundColor}
            barStyle={theme.STATUSBAR.style}
            hidden={false}
          />
        </View>
        <HomeScreen />
      </>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: theme.STATUSBAR.color ,
  }
});
