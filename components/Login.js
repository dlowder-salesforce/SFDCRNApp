import React, { Component } from 'react';
import { View } from 'react-native';
import rnf from '../ReactNativeForce';

export default class Login extends Component<{
  onSuccess: Function
}> {
  componentDidMount() {
    rnf.oauth
      .getAuthCredentials()
      .then(creds => {
        this.props.onSuccess(creds.accessToken, creds.instanceUrl);
      })
      .catch(e1 => {
        rnf.oauth
          .authenticate()
          .then(creds => {
            this.props.onSuccess(creds.accessToken, creds.instanceUrl);
          })
          .catch(e2 => {
            console.log(JSON.stringify(e2));
          });
      });
  }

  render() {
    return <View />;
  }
}
