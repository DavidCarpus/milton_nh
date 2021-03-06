// import React from 'react';
import TownNewslettersUI from './TownNewsletters'
 import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
    // console.log(ownProps);
    var newsletters = ownProps.group.newsletters || []
    return {
        newsletters: newsletters,
        title: ownProps.title || 'Town Newsletter',
        id: ''
    };
}

const mapDispatchToProps = (dispatch) => {
  return {
     fetchDocs: () => { console.log('Test') }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TownNewslettersUI);
