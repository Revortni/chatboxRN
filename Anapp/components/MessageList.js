import React, {Component} from 'react';
import {Alert, StyleSheet,ScrollView,KeyboardAvoidingView,Keyboard, View, Text, TouchableOpacity, Clipboard} from 'react-native';
import Message from './Message';
import moment from "moment";

export default class MessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages:props.messages,
            clipboardContent:null
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

    getTimeStamp = (x,y)=>{
        last = moment(x);
        now = moment(y);
        diff = now.diff(last,"minutes");
        // alert(`${x} ${y} ${diff}`);
        if (diff > 5){ 
            let hdiff = moment().diff(now,"days");
            if(hdiff>3){
                return now.format("D MMM [AT] h:mm A");
            }else if (hdiff>0){
                return now.format("ddd [AT] h:mm A");
            }
            return now.format("h:mm A");
        }
        return null;
    }

    render() {
        var lastsender = "";
        var last = 0;
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
                            let timestamp = null;
                            let content = null;
                            if(x.action =="sent" || x.action == "rec"){
                                // alert(`${x.createdAt}`);
                                timestamp = this.getTimeStamp(last,x.createdAt);
                                last = x.createdAt;
                                if(timestamp){
                                    content = <View style = {styles.timestampContainer}><Text style = {styles.timestamp}>{timestamp}</Text></View>;
                                }
                            }
                            if(x.username!=lastsender){
                                lastsender=x.username;
                            }else{
                                x.username=null;
                            }
                            return(
                                <View style = {styles.msgwrapper} key={i}>
                                    {content}
                                    <Message type={x.action} content={x.message} username={x.username} key={i}/>
                                </View>
                            );
                            
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
        },
        timestampContainer:{
            padding:10,
            alignSelf:'center',
            flexDirection:'column',
            marginBottom:4,
            marginTop:6
        },
        timestamp:{
            color:"#696969",
            fontSize:10.8,
            fontFamily:"Roboto",
            letterSpacing:.6,
            textTransform:'uppercase'
        },
        msgwrapper:{

        }
    });