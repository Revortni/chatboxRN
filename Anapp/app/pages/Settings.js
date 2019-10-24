import React,{useState, useContext} from 'react';
import {TouchableOpacity,View,Text, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ThemeContext} from '../context/ThemeContext';
import themeStyleDark from '../theme/theme.style.dark';
import themeStyleLight from '../theme/theme.style.light';
import themeStyleElegant from '../theme/theme.style.elegant';

const themes ={
    light:themeStyleLight,
    dark:themeStyleDark,
    elegant:themeStyleElegant
};

const RadioButtons = (props)=>{
    const {theme,setTheme} = useContext(ThemeContext);
    const [checked,setChecked] = useState(theme.name,'dark');
    const styles = {
        settings:{
            flex:1,
            backgroundColor:theme.BACKGROUND,
            padding:20 
        },
        containerHeader:{},
        container:{
            marginTop:10
        },
        header:{
            fontSize:22,
            marginBottom:20,
            paddingTop:0,
            alignContent:'flex-start',
            color:theme.TEXT,
            fontWeight:'bold'
        },
        radioContainer:{
    
        },
        containerRow:{
            flex:1,
            flexDirection:'row'
        },
        heading:{
            fontSize:18,
            marginBottom:20,
            paddingTop:0,
            alignContent:'flex-start',
            color:theme.TEXT,
            fontWeight:'bold'
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
            borderColor: theme.TEXT,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkedCircle: {
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: theme.TEXT,
        }
    };

    async function setKey(key){
        setChecked(key);
        await AsyncStorage.setItem('themeName',key);
        setTheme(themes[key]);
    }

    const options = props.options.map(item => {
        return (
            <TouchableOpacity activeOpacity={.9} key={item.key} style={styles.buttonContainer} onPress={() => setKey(item.key)}>
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

const Settings = (props) =>{
    const [vibrate,setVibrate] = useState(0);
    const {theme} = useContext(ThemeContext); 
    const styles = {
        settings:{
            flex:1,
            backgroundColor:theme.SECONDARY,
            padding:20 
        },
        containerHeader:{},
        container:{
            marginTop:10
        },
        header:{
            fontSize:22,
            marginBottom:20,
            paddingTop:0,
            alignContent:'flex-start',
            color:theme.TEXT,
            fontWeight:'bold'
        },
        radioContainer:{
    
        },
        containerRow:{
            flex:1,
            flexDirection:'row'
        },
        heading:{
            fontSize:18,
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
    };
    
    const options = {
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
    function toggleVibrate(){
        setVibrate(vibrate?0:1);
        props.setVibrate(vibrate);
    }

    return(
            <View style= {styles.settings}>
                <View style={styles.containerHeader}>
                    <Text style={styles.header}>Settings</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>Themes</Text>
                    <RadioButtons options={options.theme}/>
                </View> 
                <View style={[styles.container,styles.containerRow]}>
                    <Text style={styles.heading}>Vibrate</Text>
                    <View style= {styles.toggleButton}>
                        <Switch trackColor={{false:'#555',true:'#6FA9CD'}} thumbColor="#87CEFA" onValueChange={toggleVibrate} value={vibrate?true:false}/>
                    </View>
                </View> 
            </View>   
        );
};

export default Settings;
