import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, Text, View } from 'react-native';

import Styles from '../Styles';

// Component that displays a button at the top of a record.
const RecordButton = ({ onClick, label }) => (
  <TouchableHighlight onPress={onClick}>
    <View>
      <Text style={Styles.button}>{label}</Text>
    </View>
  </TouchableHighlight>
  );

RecordButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default RecordButton;
