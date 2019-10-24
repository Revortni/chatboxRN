import React,{useState, useContext, Component} from 'react';
import {TouchableOpacity,View,StyleSheet,Text, Switch ,BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation} from 'react-navigation';
import theme from '../config/appConfig';


const RadioButtons = (props)=>{
    const [checked,setChecked] = useState(props.checked);

    async function setTheme(key){
        setChecked(key);
        await AsyncStorage.setItem('themeName',key);
    }

    const options = props.options.map(item => {
        return (
            <TouchableOpacity activeOpacity={.9} key={item.key} style={styles.buttonContainer} onPress={() => setTheme(item.key)}>
                <Text style={styles.buttonText}>{item.text}</Text>
                <View style={styles.circle}>
                { checked === item.key && (<View style={styles.checkedCircle} />) } 
                </View>       
            </TouchableOpacity>
        )
    ;}
    );
    return(options);
};

class Settings extends Component{
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            vibrate:props.navigation.getParam('vibrate',false),
        };
        this.options = {
            theme:[
            {
                key: 'light',
                text: 'Light',
            },
            {
                key: 'dark',
                text: 'Dark',
            },
            {
                key: 'elegant',
                text: 'Elegant',
            }
        ]
        };
    }

    static navigationOptions = {
        title: 'Home',
        headerStyle: {
          backgroundColor: theme.PRIMARY,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      };

    onToggle = () =>{
        this.setState((state)=>{
           return {vibrate:!state.vibrate};
        });
        AsyncStorage.setItem('vibrate',1 && this.state.vibrate);
    };

    render(){
        return(
            <View style= {styles.settings}>
            <View style={styles.container}>
                <Text style={styles.heading}>Themes</Text>
                <RadioButtons options={this.options.theme} checked={this.navigation.getParam('theme', 'light')}/>
            </View> 
            <View style={[styles.container,styles.container1]}>
                <Text style={styles.heading}>Vibrate</Text>
                <View style= {styles.toggleButton}>
                    <Switch trackColor={{false:'#555',true:'#6FA9CD'}} thumbColor="#87CEFA" onValueChange={this.onToggle} value={this.state.vibrate}   />
                </View>
            </View> 
            </View>   
        );
    }
};

const styles = StyleSheet.create({
    settings:{
        flex:1,
        backgroundColor:theme.BACKGROUND,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginLeft:5,
    },
    buttonText:{
        fontSize:16,
        color:theme.TEXT
    },
    circle: {
        height: 18,
        width: 18,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#91D2FA',
    },
    container:{
        padding:20,
        paddingBottom:0,
    },
    container1:{
        flex:1,
        flexDirection:'row',
        paddingRight:5
    },
    heading:{
        fontSize:20,
        marginBottom:20,
        paddingTop:0,
        alignContent:'flex-start',
        color:theme.TEXT,
        fontWeight:'bold'
    },
    toggleButton:{
        flex:1,
        alignContent:'flex-end',
        paddingRight:0,
    }
});

export default withNavigation(Settings);