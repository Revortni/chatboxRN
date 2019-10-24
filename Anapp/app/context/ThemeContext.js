import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import themeStyleDark from '../theme/theme.style.dark';
import themeStyleLight from '../theme/theme.style.light';
import themeStyleElegant from '../theme/theme.style.elegant';

const themes ={
    light:themeStyleLight,
    dark:themeStyleDark,
    elegant:themeStyleElegant
};

export const ThemeContext = createContext();

export const ThemeProvider = (props)=>{
    const [theme, setTheme] = useState(themes['light']);
    useEffect(() => {
        (async () => {
            const themeName = await AsyncStorage.getItem('themeName');
            if (themeName) setTheme(themes[themeName]);
            else setTheme(themes['elegant']);
        })();
    }, []);

    return(
        <ThemeContext.Provider value={{theme,setTheme}}>
            {props.children}
        </ThemeContext.Provider>
    );
};

// export class ThemeProvider extends Component{
//     constructor(){
//         super();
//         this.state = {
//             theme:themes.dark,
//             themeName:'dark'
//         };
//     }
    
//     toggleTheme(themeName){
//         let theme = this.state.themeName;
//         if (theme==themeName){
//             return;
//         } else {
//             this.setState({
//                 themeName,
//                 theme:themes['themeName']
//             });
//         }
//     }
//     render(){
        
//         return(
//         <ThemeContext.Provider value={{theme:this.state.theme,toggleTheme:this.toggleTheme}}>
//             {this.props.children}
//         </ThemeContext.Provider>
//     );}
// };

export const ThemeConsumer = ThemeContext.Consumer;