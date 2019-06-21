    import React, {Component} from 'react';
import { StyleSheet,ScrollView,KeyboardAvoidingView,Keyboard} from 'react-native';
import Message from './Message';

export default class MessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages:props.messages
        };
        this.scrollView = React.createRef();
    }
    
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',()=>this._keyboardDidShow());
    }
      
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
    }
    
    _keyboardDidShow = ()=>{
        this.scrollView.scrollToEnd({ animated: false });
    }
    
    static getDerivedStateFromProps(nextProps,prevState){
        if (prevState.messages.length !== nextProps.messages.length) {
            return({
            messages: nextProps.messages
            });
        }
        return null;
    }

    render() {
        var lastsender = "";
        return (
            <ScrollView 
                    keyboardShouldPersistTaps="handled"
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }
                }>
                    <KeyboardAvoidingView style={styles.messageContainer}>
                        {this.state.messages.map((x,i)=>{
                            if(x.username!=lastsender){
                                lastsender=x.username
                                return(<Message type={x.action} content={x.message} username={x.username} key={i} italic={x.italic}/>);
                            }                            
                            return(<Message type={x.action} content={x.message} key={i}/>)
                        })}
                    </KeyboardAvoidingView>
            </ScrollView>
            );
        }
    }

    const styles = StyleSheet.create({
        messageContainer:{
            marginTop:5,
            marginBottom:10,
        }
    });