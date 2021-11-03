
import HttpService from '../../services/HttpService';
import moment from 'moment';
import loginStore from '../stores/LoginStore';

export const REQUEST_BHR_CRC_RESPONSES = 'REQUEST_BHR_CRC_RESPONSES'
export const RECEIVE_BHR_CRC_RESPONSES = 'RECEIVE_BHR_CRC_RESPONSES'
export const REQUEST_BHR_RESPONSES = 'REQUEST_BHR_RESPONSES'
export const RECEIVE_BHR_RESPONSES = 'RECEIVE_BHR_RESPONSES'
export const REQUEST_BHR_RESPONSE = 'REQUEST_BHR_RESPONSE'
export const RECEIVE_BHR_RESPONSE = 'RECEIVE_BHR_RESPONSE'


export const UPDATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST = 'UPDATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST';
export const UPDATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS = 'UPDATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS';
export const CREATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST = 'CREATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST';
export const CREATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS = 'CREATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS';


export const UPDATE_BHR_RESPONSE_REQUEST = 'UPDATE_BHR_RESPONSE_REQUEST';
export const UPDATE_BHR_RESPONSE_SUCCESS = 'UPDATE_BHR_RESPONSE_SUCCESS';
export const CREATE_BHR_RESPONSE_REQUEST = 'CREATE_BHR_RESPONSE_REQUEST';
export const CREATE_BHR_RESPONSE_SUCCESS = 'CREATE_BHR_RESPONSE_SUCCESS';
export const DELETE_BHR_RESPONSE_REQUEST = 'DELETE_BHR_RESPONSE_REQUEST';
export const DELETE_BHR_RESPONSE_SUCCESS = 'DELETE_BHR_RESPONSE_SUCCESS';
export const UPDATE_BHR_CRC_RESPONSE_REQUEST = 'UPDATE_BHR_CRC_RESPONSE_REQUEST';
export const UPDATE_BHR_CRC_RESPONSE_SUCCESS = 'UPDATE_BHR_CRC_RESPONSE_SUCCESS';
export const CREATE_BHR_CRC_RESPONSE_REQUEST = 'CREATE_BHR_CRC_RESPONSE_REQUEST';
export const CREATE_BHR_CRC_RESPONSE_SUCCESS = 'CREATE_BHR_CRC_RESPONSE_SUCCESS';
export const DELETE_BHR_CRC_RESPONSE_REQUEST = 'DELETE_BHR_CRC_RESPONSE_REQUEST';
export const DELETE_BHR_CRC_RESPONSE_SUCCESS = 'DELETE_BHR_CRC_RESPONSE_SUCCESS';
export const BHR_RESPONSE_ERROR = 'BHR_RESPONSE_ERROR';
export const CREATE_BHR_CRC_RESPONSE_ERROR = 'CREATE_BHR_CRC_RESPONSE_ERROR';
export const CREATE_BHR_RECRUITER_CRC_RESPONSE_ERROR = 'CREATE_BHR_RECRUITER_CRC_RESPONSE_ERROR';

export const requestBhrResponses = (bhr_id, supplier_id) => ({
  type: REQUEST_BHR_RESPONSES,
  bhr_id: bhr_id,
  supplier_id: supplier_id
})

export const receiveBhrResponses = (bhr_id, responses) => ({
  type: RECEIVE_BHR_RESPONSES,
  bhr_id: bhr_id,
  responses:responses,
  receivedAt: Date.now()
})

export const requestBhrCRCResponses = (bhr_id, supplier_id) => ({
  type: REQUEST_BHR_CRC_RESPONSES,
  bhr_id: bhr_id,
  supplier_id: supplier_id
})

export const receiveBhrCRCResponses = (bhr_id, responses) => ({
  type: RECEIVE_BHR_CRC_RESPONSES,
  bhr_id: bhr_id,
  crcresponses:responses,
  receivedAt: Date.now()
})


export const fetchBhrCRCResponses = (bhr_id, supplier_id) => dispatch => {
  console.log('fetchBhrResponses dispatched')
  dispatch(requestBhrCRCResponses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/${supplier_id}/issues/${bhr_id}/bhrCRCResponses`,
    (resp) => {
      dispatch(receiveBhrCRCResponses(bhr_id, resp.responses));
    },
    (err) => { console.log(err.message) });
}


export const fetchBhrResponsesAll = () => dispatch => {
  console.log('fetchBhrResponses dispatched')
  dispatch(requestBhrResponses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/bhrResponses`,
    (resp) => {
      dispatch(receiveBhrResponses(null, resp.responses));
    },
    (err) => { console.log(err.message) });
}


export const fetchBhrResponses = (bhr_id, supplier_id) => dispatch => {
  console.log('fetchBhrResponses dispatched')
  dispatch(requestBhrResponses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/${supplier_id}/issues/${bhr_id}/bhrResponses`,
    (resp) => {
      dispatch(receiveBhrResponses(bhr_id, resp.responses));
    },
    (err) => { console.log(err.message) });
}

export const requestBhrResponse = (response_id) => ({
  type: REQUEST_BHR_RESPONSE,
  response_id: response_id
})

export const receiveBhrResponse = (response_id, response) => ({
  type: RECEIVE_BHR_RESPONSE,
  response_id: response_id,
  response:response,
  receivedAt: Date.now()
})

export const fetchBhrResponse = (response_id) => dispatch => {
  console.log('fetchBhrResponse dispatched')
  dispatch(requestBhrResponse())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/bhrResponses/${response_id}`,
    (resp) => {
      dispatch(receiveBhrResponse(response_id, resp.response[0]));
    },
    (err) => { console.log(err.message) });
}


export const updateBhrResponseRequest = (response_id, response) => ({
  type: UPDATE_BHR_RESPONSE_REQUEST,
  response_id: response_id,
  response: response
})

export function updateBhrResponse(response_id, response) {
  if( response.created_by_user_id === undefined || response.created_by_user_id === null ) {
     response.created_by_user_id = loginStore.getUserID();
  }

  return function (dispatch) {
    dispatch(updateBhrResponseRequest(response_id, response))
    return HttpService.put(`${process.env.REACT_APP_API_URL}/bhrResponses/${response_id}`, response,
      (res) => {
        dispatch({ type: UPDATE_BHR_RESPONSE_SUCCESS,
                   response_id: response_id,
                   response: response,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: BHR_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}

//assuming we're including the bhr_issue_id in the post data
export const createBhrResponseRequest = (response) => ({
  type: CREATE_BHR_RESPONSE_REQUEST,
  response: response
})

export function createBhrResponse(response) {

  if(response !== undefined && response !== null ) {
    response.created_by_user_id = loginStore.getUserID();
  }

  return function (dispatch) {
    dispatch(createBhrResponseRequest(response))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/bhrResponses`, response,
      (res) => {
        dispatch({ type: CREATE_BHR_RESPONSE_SUCCESS,
                   response_id:res.response.id,
                   response_ids:res.response.ids,
                   response: res.response,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
      },
      (err) => { console.log(err)
        dispatch({ type: BHR_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}


export const deleteBhrCRCResponseRequest = (response_id) => ({
  type: DELETE_BHR_CRC_RESPONSE_REQUEST,
  response_id: response_id
})



export function deleteBhrCRCResponse(response_id) {
  return function (dispatch) {
    dispatch(deleteBhrCRCResponseRequest(response_id))
    return HttpService.delete(`${process.env.REACT_APP_API_URL}/bhrResponses/crcresponse/crc/${response_id}`,
      (res) => {
        dispatch({ type: DELETE_BHR_CRC_RESPONSE_SUCCESS,
                   response_id: response_id,
                   YreceivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: BHR_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}


export const updateBhrCRCResponseRequest = (response_id, response) => ({
  type: UPDATE_BHR_CRC_RESPONSE_REQUEST,
  response_id: response_id,
  response: response
})


export function updateBhrCRCResponse(response_id, response, onSuccess, onError) {
  return function (dispatch) {
    dispatch(updateBhrCRCResponseRequest(response_id, response))
    return HttpService.put(`${process.env.REACT_APP_API_URL}/supplier-crc-scores/${response_id}/`, response,
    (res) => {
      dispatch({
        type: UPDATE_BHR_CRC_RESPONSE_SUCCESS,
        response_id: response_id,
        response: res.results,
      });
      onSuccess()
    },
    (err) => {
      dispatch({
        type: CREATE_BHR_CRC_RESPONSE_ERROR,
      })
      onError(err)
    });
  }
}


export const createBhrCRCResponseRequest = () => ({
  type: CREATE_BHR_CRC_RESPONSE_REQUEST,
})

export function createBhrCRCResponse(payload, onSuccess, onError) {
  return function (dispatch) {
    dispatch(createBhrResponseRequest())
    return HttpService.post(`${process.env.REACT_APP_API_URL}/supplier-crc-scores/`, payload,
      (res) => {
        dispatch({
          type: CREATE_BHR_CRC_RESPONSE_SUCCESS,
          response: res,
        });
        onSuccess()
      },
      (err) => {
        dispatch({
          type: CREATE_BHR_CRC_RESPONSE_ERROR,
        })
        onError(err)
      });
  }
}


export const updateBhrRecruiterCRCResponseRequest = (response_id, response) => ({
  type: UPDATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST,
  response_id: response_id,
  response: response
})


export function updateBhrRecruiterCRCResponse(response_id, response, onSuccess, onError) {
  return function (dispatch) {
    dispatch(updateBhrRecruiterCRCResponseRequest(response_id, response))
    return HttpService.put(`${process.env.REACT_APP_API_URL}/recruiter-crc-scores/${response_id}/`, response,
    (res) => {
      dispatch({
        type: UPDATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS,
        response_id: response_id,
        response: res.results,
      });
      onSuccess()
    },
    (err) => {
      dispatch({
        type: CREATE_BHR_RECRUITER_CRC_RESPONSE_ERROR,
      })
      onError(err)
    });
  }
}


export const createBhrRecruiterCRCResponseRequest = () => ({
  type: CREATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST,
})

export function createBhrRecruiterCRCResponse(payload, onSuccess, onError) {
  return function (dispatch) {
    dispatch(createBhrRecruiterCRCResponseRequest())
    return HttpService.post(`${process.env.REACT_APP_API_URL}/recruiter-crc-scores/`, payload,
      (res) => {
        dispatch({
          type: CREATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS,
          response: res,
        });
        onSuccess()
      },
      (err) => {
        dispatch({
          type: CREATE_BHR_RECRUITER_CRC_RESPONSE_ERROR,
        })
        onError(err)
      });
  }
}



export const deleteBhrResponseRequest = (response_id) => ({
  type: DELETE_BHR_RESPONSE_REQUEST,
  response_id: response_id
})

export function deleteBhrResponse(response_id) {
  return function (dispatch) {
    dispatch(deleteBhrResponseRequest(response_id))
    return HttpService.delete(`${process.env.REACT_APP_API_URL}/bhrResponses/${response_id}`,
      (res) => {
        dispatch({ type: DELETE_BHR_RESPONSE_SUCCESS,
                   response_id: response_id,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: BHR_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}
