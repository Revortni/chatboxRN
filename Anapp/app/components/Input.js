import React from 'react';
import { View, TextInput } from 'react-native';

//forwardref to pass ref for onSubmitEditing
const Input = React.forwardRef((props, ref) => (
  <View>
    <TextInput
      underlineColorAndroid="transparent"
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor}
      keyboardType={props.keyboardType}
      onChangeText={props.onChangeText}
      returnKeyType={props.returnKeyType}
      numberOfLines={props.numberOfLines}
      multiline={props.multiline}
      onSubmitEditing={props.onSubmitEditing}
      style={props.style}
      blurOnSubmit={false}
      value={props.value}
      ref={ref}
      editable={props.editable}
      onKeyPress={props.onKeyPress}
    />
  </View>
));

export default Input;
