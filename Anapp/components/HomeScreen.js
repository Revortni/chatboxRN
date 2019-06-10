import React, {Component} from 'react';
import { StyleSheet,BackHandler, Alert, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Input from './Input';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatRoom from './ChatRoom';

export default class HomeScreen extends Component {

  constructor(){
    super();
    this.state = {
      registered : false,
      username: '',
      email:'',
      first:false
    };  
    // AsyncStorage.clear();
    this.checkFirstUse();
    this.checkRegistration();
    this.emailInput = React.createRef();
    
  }

  handleBackPress= () => {
    Alert.alert(
        'Exit App',
        'Are you sure you want to exit?', [{
            text: 'Cancel',
            style: 'cancel'
        }, {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
        }, ], {
            cancelable: false
        }
     )
     return true;
   } 

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  checkFirstUse = async()=> {
    try{
      const first = await AsyncStorage.getItem("firstUse");
      if(first=="no"){
        let data = await AsyncStorage.getItem('@userInfo');
        let content = JSON.parse(data);
        this.setState({email:content.email});
      }else{
        if(first==null){
          this.setState({first:true});
        }
      }
    } catch(e){
      alert(e);
    }
  }

  checkRegistration = async()=>{
    try{
      const registered = await AsyncStorage.getItem("registered");
      if (registered==null) {
        AsyncStorage.setItem("registered","false");
      }else{
        if(registered=="true"){
          this.setState({registered:true});
        }
      }
    } catch(e){
      alert(e);
    }
  }

  register = () => {
    const pattern = /^[\w\.-]+@[\w\.-]+$/i
    let email = this.state.email;
    if(this.state.username.length>0){
      if(pattern.test(email)){
        AsyncStorage.setItem("registered","true");
        AsyncStorage.setItem("firstUse","no");
        this.setState({registered:true});
      } else {
        alert("Please enter a proper email addresss");
      }
    } else {
      alert("Please enter a username");
    }
  }

  render() {
    if (this.state.registered) {
      return (
        <ChatRoom username = {this.state.username} email = {this.state.email} />
      );
    }
    else {
      return(
        <View style = {styles.container}>
          <Input
              placeholder="Enter a username"
              onChangeText={username=>this.setState({username})}
              style={styles.input}
              blurOnSubmit = {true}
              onSubmitEditing={()=>this.emailInput.current.focus()}
              multiline={false}
              returnKeyType='next'
              blurOnSubmit={false}
              autoFocus={true}
          />
          <Input
              placeholder="Enter your Email"
              onChangeText={email=>this.setState({email})}
              style={styles.input}
              blurOnSubmit = {true}
              multiline={false}
              returnKeyType='go'
              ref={this.emailInput}
              blurOnSubmit={false}
              onSubmitEditing={()=>this.register()}
              value={this.state.email}
              editable={this.state.first}
          />
          <Icon.Button 
              name="send" 
              onPress={()=>this.register()}
              backgroundColor="#F5FCFF"
              color='#87cefa'
              size={45}
              style={{padding:13}}
              borderRadius={400}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'space-between',
    backgroundColor: '#F5FCFF',
  },
  input:{
    textAlign:'center',
    fontSize:20,
    borderRadius:20,
    backgroundColor:'#F0FaFa',
    margin:10,
    padding:20,
  }
});
