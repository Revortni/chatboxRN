import React ,{ Component, PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OfflineSign = (props) => {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{props.info}</Text>
    </View>
  );
}


class OnlineSign extends Component {
  constructor(){
    super();
    this.state = {show:true};
    this.timeout = "";
  }

  componentDidMount(){
   this.timeout = setTimeout(()=>this.setState({show:false}),5000);
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  render() {
    if(this.state.show){
      return (
      <View style={styles.onlineContainer}>
        <Text style={styles.onlineText}>You are online</Text>
      </View>
      );
    }
    return null;
  }
}

class NetworkInfo extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      isConnected: true,
      serverConnection:props.status
    };
  }

  componentDidMount() {
    // NetInfo.fetch().then(state => {
    //     this.setState({isConnected:state.isConnected});
    // });
    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    this.unsubscribe = NetInfo.addEventListener(state => {
        this.setState({isConnected:state.isConnected});
      });
    }

  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.unsubscribe();
    }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  }

  render() {
    if(!this.state.isConnected){
        return <OfflineSign info={"No internet connection"}/>;
    }else if(!this.state.serverConnection){
        return <OfflineSign info={"Disconnected from server"}/>
    }
    return <OnlineSign/>;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#B52424',
    height: 25,
    flexDirection: 'row',
    alignSelf:"stretch",
    justifyContent:"center"
  },
  onlineContainer: {
    backgroundColor: '#7FFFD4',
    height: 25,
    flexDirection: 'row',
    alignSelf:"stretch",
    justifyContent:"center"
  },
  offlineText:{
    color:"#fff",
  },
  onlineText:{
    color:"#000",
  },
});

export default NetworkInfo;