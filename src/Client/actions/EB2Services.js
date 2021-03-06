import {EB2ServicesConstants} from '../../constants'
import axios from 'axios';
var Config = require('../config'),
configuration = new Config();

const ROOT_URL = configuration.ui.ROOT_URL
//========================================
export function fetchEB2ServicesData(groupName) {
    const request = axios({
      method: 'get',
      url: `${ROOT_URL}EB2Services/`+ groupName,
    });

    return dispatch => {
        dispatch({type: EB2ServicesConstants.FETCH_DATA, groupName: groupName});
        request.then( response => dispatch(fetchEB2ServicesDataSuccess(groupName, response.data)) )
        .catch( reason => dispatch(fetchEB2ServicesDataFailure(reason)) )
    }
}
//========================================
const fetchEB2ServicesDataSuccess = (groupName, meetingDocs)  => ({
        type: EB2ServicesConstants.FETCH_DATA_SUCCESS,
        payload: meetingDocs,
        groupName: groupName
    })
//========================================
const fetchEB2ServicesDataFailure = (error)  => ({
    type: EB2ServicesConstants.FETCH_DATA_FAILURE,
    payload: error
})
