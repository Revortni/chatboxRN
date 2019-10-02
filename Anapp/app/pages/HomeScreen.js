import React, { Component } from 'react';
import {
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import Input from '../components/Input';
import ChatRoom from './ChatRoom';
import theme from '../config/appConfig';

// const {user} = require("../config/user.json")

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      registered: false,
      username: '',
      email: '',
      first: false,
      loaded: false
    };
    this.emailInput = React.createRef();
  }

  handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp()
        }
      ],
      {
        cancelable: false
      }
    );
    return true;
  };

  componentDidMount() {
    this.checkFirstUse();
    this.checkRegistration();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    clearTimeout(this.loader);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  checkFirstUse = async () => {
    try {
      const first = await AsyncStorage.getItem('firstUse');
      if (first == 'no') {
        let data = await AsyncStorage.getItem('@userInfo');
        let content = JSON.parse(data);
        this.setState({ email: content.email });
      } else {
        if (first == null) {
          this.setState({ first: true });
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  checkRegistration = async () => {
    try {
      const registered = await AsyncStorage.getItem('registered');
      if (registered == null) {
        await AsyncStorage.setItem('registered', 'false');
      } else {
        if (registered == 'true') {
          this.setState({ registered: true });
        }
      }
      this.loader = setTimeout(() => this.setState({ loaded: true }), 3000);
    } catch (e) {
      alert(e);
    }
  };

  register = async () => {
    const pattern = /^[\w\.-]+@[\w\.-]+$/i;
    let email = this.state.email;
    if (NetInfo.isConnected) {
      if (this.state.username.length > 0) {
        if (pattern.test(email)) {
          await AsyncStorage.setItem('registered', 'true');
          await AsyncStorage.setItem('firstUse', 'no');
          this.setState({ registered: true });
        } else {
          alert('Please enter a proper email addresss');
        }
      } else {
        alert('Please enter a username');
      }
    } else {
      alert('Sorry. You are not connected to the internet');
    }
  };

  render() {
    if (this.state.loaded) {
      if (this.state.registered) {
        return <ChatRoom username={this.state.username} email={this.state.email} />;
      } else {
        return (
          <View style={styles.container}>
            <Input
              placeholder="Enter a username"
              onChangeText={username => this.setState({ username })}
              style={styles.input}
              onSubmitEditing={() => this.emailInput.current.focus()}
              multiline={false}
              returnKeyType="next"
              blurOnSubmit={false}
              autoFocus
            />
            <Input
              placeholder="Enter your Email"
              onChangeText={email => this.setState({ email })}
              style={styles.input}
              multiline={false}
              returnKeyType="go"
              ref={this.emailInput}
              blurOnSubmit={false}
              onSubmitEditing={() => this.register()}
              value={this.state.email}
              editable={this.state.first}
            />
            <TouchableOpacity onPress={() => this.register()} style={styles.register}>
              <Icon name="send" size={45} color="#87CEFA" />
            </TouchableOpacity>
          </View>
        );
      }
    }
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTitle}>
          <Text style={styles.loadingTitleText}>ChatRoom</Text>
          <View style={styles.spinner}>
            <ActivityIndicator size={40} color="#ECEDEC" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    backgroundColor: theme.BACKGROUND
  },
  input: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 20,
    backgroundColor: theme.SECONDARY,
    margin: 10,
    padding: 20
  },
  spinner: {
    marginTop: 50
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.PRIMARY
  },
  loadingTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingTitleText: {
    fontFamily: 'Julietta-Messie',
    color: theme.TITLE,
    fontSize: 60,
    letterSpacing: 5,
    fontWeight: '300'
  },
  register: {
    marginTop: 20
  }
});
