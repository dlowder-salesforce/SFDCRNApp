import React from 'react';
import PropTypes from 'prop-types';

// Component that kicks off an asynchronous
// fetch for recent items.
class RecentItemListUpdater extends React.Component {
  componentDidMount() {
    this.props.onFetchRecentItems(this.props.creds);
  }

  render() {
    return null;
  }
}

RecentItemListUpdater.propTypes = {
  creds: PropTypes.object.isRequired,
  onFetchRecentItems: PropTypes.func.isRequired
};

export default RecentItemListUpdater;
