import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import theme from '../config/appConfig';

const OfflineSign = props => {
  if (props.connecting) {
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
  );
};

OfflineSign.defaultProps = {
  connecting:false
};
OfflineSign.propTypes = {
  connecting: PropTypes.bool,
  info:PropTypes.string.isRequired
};


class OnlineSign extends Component {
  constructor() {
    super();
    this.state = { show: true };
    this.timeout = '';
  }

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ show: false }), 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    if (this.state.show) {
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
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      status: props.status
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status !== prevState.status) {
      return true;
    } else return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({ status: this.props.status });
    }
  }

  componentDidMount() {
    // NetInfo.fetch().then(state => {
    //     this.setState({isConnected:state.isConnected});
    // });
    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    this.unsubscribe();
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  render() {
    if (!this.state.isConnected) {
      return <OfflineSign info="No internet connection" />;
    } else if (this.state.status == null) {
      return <OfflineSign info="Connecting.." connecting />;
    } else if (!this.state.status) {
      return <OfflineSign info="Disconnected" />;
    }
    return <OnlineSign />;
  }
}
NetworkInfo.defaultProps = {
  status:null
}
;
NetworkInfo.propTypes = {
  status:PropTypes.bool
};

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: theme.NETINFO.notConnected,
    height: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  connecting: {
    backgroundColor: theme.NETINFO.connecting,
    height: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  onlineContainer: {
    backgroundColor: theme.NETINFO.connected,
    height: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  offlineText: {
    color: theme.NETINFO.text
  },
  onlineText: {
    color: theme.NETINFO.text
  }
});


export default NetworkInfo;
