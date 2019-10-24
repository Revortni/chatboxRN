import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Main from './app/pages/Main';
import Settings from './app/pages/Settings';
 
const App = createStackNavigator({
    HomeScreen: {
        screen: Main,
        navigationOptions:{
            
        }
    },
    Settings:{
        screen: Settings,
        navigationOptions: {
            title: 'Settings',
            headerShown:true        
        },
    }
    },{
        initialRouteName: 'HomeScreen',
        defaultNavigationOptions:{
            headerShown:false,
            headerForceInset:true,
            headerMode:'none'
        }
});



export default createAppContainer(App);