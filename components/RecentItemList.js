import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import ReactNativeForce from '../ReactNativeForce';
import RecentItem from './RecentItem';
import Styles from '../Styles';

const _logout = () => {
  ReactNativeForce.oauth.logout();
};

// Component that displays a list of recent items and supports a hook for handling a click
// on one of them.
const RecentItemList = ({ creds, onClick, recentItems }) => (
  <View style={Styles.container}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={Styles.title}>Recent Items</Text>
      <TouchableOpacity onPress={() => _logout()}>
        <Text style={[Styles.title, { color: 'blue' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
    {recentItems.recentItems.map((recentItem, index) => (
      <RecentItem
        creds={creds}
        index={index}
        key={`RecentItem${recentItem.Id}`}
        onClick={() => onClick(creds, recentItem.Id)}
        item={recentItem}
      />
    ))}
  </View>
);

RecentItemList.propTypes = {
  creds: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  recentItems: PropTypes.object.isRequired
};

export default RecentItemList;
