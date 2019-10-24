import React, { Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,

} from 'react-native';
import PropTypes from 'prop-types';
import MessageList from './MessageList';


export default class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this._keyboardDidShow()
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  _keyboardDidShow = () => {
    this.scrollView.scrollToEnd({ animated: false });
  };

  render() {
    return (
        <ScrollView
        keyboardShouldPersistTaps="handled"
        ref={ref => (this.scrollView = ref)}
        onContentSizeChange={() => {
          this.scrollView.scrollToEnd({ animated: true });
        }}>
            <KeyboardAvoidingView style={styles.messageContainer}>
                <MessageList messages={this.props.oldmessages} />
                <MessageList messages={[...this.props.messages]} />
            </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    marginTop: 5,
    marginBottom: 10
  }
});

ChatWindow.propTypes = {
  oldmessages: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
};