import { call, put } from 'redux-saga/effects';

import { receiveRecentItems } from '../actions';

export default function* recentItemsFetcher(action) {
  const mruUrl = `${action.creds.instanceUrl}/services/data/v41.0/recent`;
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${action.creds.accessToken}`
    }
  };

  try {
    const response = yield call(fetch, mruUrl, req);
    const responseJson = yield response.json();
    yield put(receiveRecentItems(responseJson));
  } catch (err) {
    console.error(`MRU fetch error: ${JSON.stringify(err)}`);
  }
}
