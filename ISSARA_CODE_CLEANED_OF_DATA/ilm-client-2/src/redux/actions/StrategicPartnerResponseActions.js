
import HttpService from '../../services/HttpService';
import moment from 'moment';


export const REQUEST_STRATEGIC_PARTNER_RESPONSES = 'REQUEST_STRATEGIC_PARTNER_RESPONSES'
export const RECEIVE_STRATEGIC_PARTNER_RESPONSES = 'RECEIVE_STRATEGIC_PARTNER_RESPONSES'
export const REQUEST_STRATEGIC_PARTNER_RESPONSE = 'REQUEST_STRATEGIC_PARTNER_RESPONSE'
export const RECEIVE_STRATEGIC_PARTNER_RESPONSE = 'RECEIVE_STRATEGIC_PARTNER_RESPONSE'
export const UPDATE_STRATEGIC_PARTNER_RESPONSE_REQUEST = 'UPDATE_STRATEGIC_PARTNER_RESPONSE_REQUEST';
export const UPDATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS = 'UPDATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS';
export const CREATE_STRATEGIC_PARTNER_RESPONSE_REQUEST = 'CREATE_STRATEGIC_PARTNER_RESPONSE_REQUEST';
export const CREATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS = 'CREATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS';
export const DELETE_STRATEGIC_PARTNER_RESPONSE_REQUEST = 'DELETE_STRATEGIC_PARTNER_RESPONSE_REQUEST';
export const DELETE_STRATEGIC_PARTNER_RESPONSE_SUCCESS = 'DELETE_STRATEGIC_PARTNER_RESPONSE_SUCCESS';
export const STRATEGIC_PARTNER_RESPONSE_ERROR = 'STRATEGIC_PARTNER_RESPONSE_ERROR';


export const requestStrategicPartnerResponses = () => ({
  type: REQUEST_STRATEGIC_PARTNER_RESPONSES
})

export const receiveStrategicPartnerResponses = (responses) => ({
  type: RECEIVE_STRATEGIC_PARTNER_RESPONSES,
  responses:responses,
  receivedAt: Date.now()
})



export const fetchStrategicPartnerResponses = () => dispatch => {
  console.log('fetchStrategicPartnerResponses dispatched')
  dispatch(requestStrategicPartnerResponses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/strategic-partner-responses/`,
    (resp) => {
      dispatch(receiveStrategicPartnerResponses(resp.results));
    },
    (err) => { console.log(err.message) });
}

export const requestStrategicPartnerResponse = (response_id) => ({
  type: REQUEST_STRATEGIC_PARTNER_RESPONSE,
  response_id: response_id
})

export const receiveStrategicPartnerResponse = (response_id, response) => ({
  type: RECEIVE_STRATEGIC_PARTNER_RESPONSE,
  response_id: response_id,
  response:response,
  receivedAt: Date.now()
})

export const fetchStrategicPartnerResponse = (response_id) => dispatch => {
  console.log('fetchStrategicPartnerResponse dispatched')
  dispatch(requestStrategicPartnerResponse())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/strategicpartners/strategicpartnerresponses/${response_id}`,
    (resp) => {
      dispatch(receiveStrategicPartnerResponse(response_id, resp.response[0]));
    },
    (err) => { console.log(err.message) });
}


export const updateStrategicPartnerResponseRequest = () => ({
  type: UPDATE_STRATEGIC_PARTNER_RESPONSE_REQUEST,
})

export function updateStrategicPartnerResponse(id, payload, success, error) {
  return function (dispatch) {
    dispatch(updateStrategicPartnerResponseRequest())
    return HttpService.put(`${process.env.REACT_APP_API_URL}/strategic-partner-responses/${id}/`, payload,
      (res) => {
        dispatch({ type: UPDATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
                   response: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        error(err)
      });
  }
}

export const createStrategicPartnerResponseRequest = () => ({
  type: CREATE_STRATEGIC_PARTNER_RESPONSE_REQUEST,
})

export function createStrategicPartnerResponse(payload, success, error) {
  return function (dispatch) {
    dispatch(createStrategicPartnerResponseRequest())
    return HttpService.post(`${process.env.REACT_APP_API_URL}/strategic-partner-responses/`, payload,
      (res) => {
        dispatch({ type: CREATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
                   response: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_RESPONSE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        error(err)
      });
  }
}



export const deleteStrategicPartnerResponseRequest = (response_id) => ({
  type: DELETE_STRATEGIC_PARTNER_RESPONSE_REQUEST,
  response_id: response_id
})

export function deleteStrategicPartnerResponse(response_id) {
  return function (dispatch) {
    dispatch(deleteStrategicPartnerResponseRequest(response_id))
    return HttpService.delete(`${process.env.REACT_APP_API_URL}/strategicpartners/strategicpartnerresponses/${response_id}`,
      (res) => {
        dispatch({ type: DELETE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
                   response_id: response_id,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_RESPONSE_ERROR,
           message: err.message,
           response_id: response_id,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}
