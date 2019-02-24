import React, { Component } from 'react';
import { View } from 'react-native';
import ReactNativeForce from '../ReactNativeForce';

export default class Login extends Component<{
  onSuccess: Function
}> {
  componentDidMount() {
    ReactNativeForce.oauth.authenticate().then(creds => {
      this.props.onSuccess(creds.accessToken, creds.instanceUrl);
    });
  }

  render() {
    return <View />;
  }
}
