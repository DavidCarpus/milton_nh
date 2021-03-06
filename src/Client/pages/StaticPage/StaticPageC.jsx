// import React from 'react';
import StaticPage from './StaticPage'
 import { connect } from 'react-redux'
 import { fetchStaticPage } from '../../actions/StaticPages'

const mapStateToProps = (state, ownProps) => {
    return {
        pageName: ownProps.location.pathname,
        pageData: state.StaticPage.StaticPage.html,
        title: state.StaticPage.StaticPage.recorddesc,
    };
}
const mapDispatchToProps = (dispatch) => {
  return {
      fetchData: (pageURL) => {
        dispatch(fetchStaticPage(pageURL))
     }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticPage);
