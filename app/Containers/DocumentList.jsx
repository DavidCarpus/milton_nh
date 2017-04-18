import React from 'react';
import DocumentListUI from '../Components/DocumentList'
 import { connect } from 'react-redux'
 import {fetchGroupDoc, resetGroupDoc} from '../actions/PublicDocuments'

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.PublicRecords.documents,
        group: ownProps.group,
        documentsGroupName: state.PublicRecords.groupName,
        loading: state.OrganizationalUnits.loading,
        title: ownProps.title || 'Documentation',
    };
}
const mapDispatchToProps = (dispatch) => {
  return {
      fetchDocs: (groupName) => {
          dispatch(fetchGroupDoc(groupName))
     },
     resetGroupDoc: (groupName) => {
         dispatch(resetGroupDoc(groupName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListUI);
