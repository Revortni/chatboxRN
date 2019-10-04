import React from 'react';
import { View,  Text, StyleSheet} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import theme from '../config/appConfig';

const TimeStamp = ({last,current})=>{
    let stamp = null;
    let prev = moment(last);
    let now = moment(current);
    let diff = now.diff(prev, 'minutes');
    // alert(`${x} ${y} ${diff}`);
    if (diff > 5) {
      let hdiff = moment().diff(now, 'days');
      if (hdiff > 3) {
        stamp = now.format('D MMM [AT] h:mm A');
      } else if (hdiff > 0) {
        stamp = now.format('ddd [AT] h:mm A');
      } else {
        stamp = now.format('h:mm A');
      }
    }
    
    if (stamp){
      return (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{stamp}</Text>
        </View>
      );
    }
    return null;
};

const styles = StyleSheet.create({
  timestampContainer: {
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 4,
    marginTop: 6
  },
  timestamp: {
    color: theme.TIMESTAMP,
    fontSize: 10.8,
    letterSpacing: 0.6,
    textTransform: 'uppercase'
  },
  msgwrapper: {}
});

TimeStamp.propTypes = {
  last: PropTypes.number.isRequired,
  current:PropTypes.number.isRequired
};

export default TimeStamp;