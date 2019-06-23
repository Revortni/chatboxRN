import React ,{ Component, PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OfflineSign = (props) => {
  if(props.connecting){
    return (
      <View style={styles.connecting}>
        <Text style={styles.onlineText}>{props.info}</Text>
      </View>
    );
  }
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{props.info}</Text>
    </View>
  )
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

class NetworkInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            isConnected: true,
            status:props.status
        };
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.status!==prevState.status){
            return true
        }
        else return null;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.status!==this.props.status){
            this.setState({status: this.props.status});
        }
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
            return <OfflineSign info={"No internet connection"}/>
        }else if(this.state.status==null){
          return <OfflineSign info={"Connecting.."} connecting={true}/>
        }
        else if(!this.state.status){
            return <OfflineSign info={"Disconnected"}/>
        }
        return <OnlineSign/>;
    }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#CD5C5C',
    height: 20,
    flexDirection: 'row',
    alignSelf:"stretch",
    justifyContent:"center",
  },
  connecting: {
    backgroundColor: '#FFEE93',
    height: 20,
    flexDirection: 'row',
    alignSelf:"stretch",
    justifyContent:"center",
  },
  onlineContainer: {
    backgroundColor: '#71F79F',
    height: 20,
    flexDirection: 'row',
    alignSelf:"stretch",
    justifyContent:"center"
  },
  offlineText:{
    color:"#fff",
  },
  onlineText:{
    color:"#4F1373",
  },
});

export default NetworkInfo;