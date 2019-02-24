export const finishLogin = (accessToken, instanceUrl) => ({
    type: 'FINISH_LOGIN',
    accessToken,
    instanceUrl
  });

export const fetchRecentItems = creds => ({
    type: 'FETCH_RECENT_ITEMS',
    creds
  });

export const receiveRecentItems = recentItems => ({
    type: 'RECEIVE_RECENT_ITEMS',
    recentItems,
    receivedAt: Date.now()
  });

export const fetchRecord = (creds, recordId) => ({
    type: 'FETCH_RECORD',
    creds,
    recordId
  });

export const receiveRecord = (recordId, record) => ({
    type: 'RECEIVE_RECORD',
    recordId,
    record,
    receivedAt: Date.now()
  });

export const clearRecord = () => ({
    type: 'CLEAR_RECORD'
  });

export const deleteRecord = (creds, recordId) => ({
    type: 'DELETE_RECORD',
    creds,
    recordId
  });

export const saveRecord = (creds, recordId, editValues) => ({
    type: 'SAVE_RECORD',
    creds,
    recordId,
    editValues
  });

export const finishedRecordDelete = () => ({
    type: 'FINISHED_RECORD_DELETE'
  });

export const editRecord = () => ({
    type: 'EDIT_RECORD'
  });

export const updateFieldValue = (field, value) => ({
    type: 'UPDATE_FIELD_VALUE',
    field,
    value
  });

export const recordUpdateSuccess = recordData => ({
    type: 'RECORD_UPDATE_SUCCESS',
    recordData
  });

export const fetchPicklist = (creds, url) => ({
    type: 'FETCH_PICKLIST',
    creds,
    url
  });

export const receivePicklist = (url, result) => ({
    type: 'RECEIVE_PICKLIST',
    url,
    result
  });
