/**
 * Promise-based wrappers around async functions
 * @flow
 */

import { net as rawNet, oauth as rawOAuth } from 'react-native-force';

function _promisify(inputFunc) {
  return (...args: any) =>
    new Promise((resolve, reject) => {
      args.push(resolve, reject);
      inputFunc.apply(this, args);
    });
}

export default {
  net: {
    query: _promisify(rawNet.query),
    describeGlobal: _promisify(rawNet.describeGlobal),
    sendRequest: _promisify(rawNet.sendRequest),
    setApiVersion: rawNet.setApiVersion
  },
  oauth: {
    authenticate: _promisify(rawOAuth.authenticate),
    getAuthCredentials: _promisify(rawOAuth.getAuthCredentials)
  }
};
