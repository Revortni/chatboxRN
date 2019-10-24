import React from 'react';
import { View, StatusBar} from 'react-native';
import HomeScreen from './HomeScreen';
import { ThemeProvider ,ThemeContext} from '../context/ThemeContext';

const Main = ()=>{
    
    return(
        <ThemeProvider>
            <ThemeContext.Consumer>{({theme})=>(
                <>
                    <StatusBar
                        backgroundColor={theme.STATUSBAR.color}
                        barStyle={theme.STATUSBAR.style}
                        hidden={false}
                        animated
                    />
                    <HomeScreen/>
                </>
            )}
            </ThemeContext.Consumer>
        </ThemeProvider>
    );
};


export default Main;