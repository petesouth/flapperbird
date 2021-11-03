import HttpService from '../../services/HttpService';

export const REQUEST_BUSINESS_RESPONSES = 'REQUEST_BUSINESS_RESPONSES'
export const RECEIVE_BUSINESS_RESPONSES = 'RECEIVE_BUSINESS_RESPONSES'

export const CREATE_BUSINESS_RESPONSE_REQUEST = 'CREATE_BUSINESS_RESPONSE_REQUEST'
export const CREATE_BUSINESS_RESPONSE_SUCCESS = 'CREATE_BUSINESS_RESPONSE_SUCCESS'
export const CREATE_BUSINESS_RESPONSE_FAILURE = 'CREATE_BUSINESS_RESPONSE_FAILURE'

export const UPDATE_BUSINESS_RESPONSE_REQUEST = 'UPDATE_BUSINESS_RESPONSE_REQUEST'
export const UPDATE_BUSINESS_RESPONSE_SUCCESS = 'UPDATE_BUSINESS_RESPONSE_SUCCESS'
export const UPDATE_BUSINESS_RESPONSE_FAILURE = 'UPDATE_BUSINESS_RESPONSE_FAILURE'


/***************************************************/
/************ GET ALL BUSINESS RESPONSES ***********/
/***************************************************/

export const requestBusinessResponses = () => ({
  type: REQUEST_BUSINESS_RESPONSES,
})

export const receiveBusinessResponses = (responses) => ({
  type: RECEIVE_BUSINESS_RESPONSES,
  responses: responses,
})

export const fetchBusinessResponses = () => dispatch => {
  dispatch(requestBusinessResponses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/business-responses/`,
    (resp) => {
      dispatch(receiveBusinessResponses(resp.results));
    },
    (err) => { console.log(err.message) });
}


/***************************************************/
/************ POST NEW BUSINESS RESPONSE ***********/
/***************************************************/

export const createBusinessResponseRequest = () => ({
  type: CREATE_BUSINESS_RESPONSE_REQUEST,
})

export const createBusinessResponseSuccess = (response) => ({
  type: CREATE_BUSINESS_RESPONSE_SUCCESS,
  response: response,
})

export const createBusinessResponseFailure = (error) => ({
  type: CREATE_BUSINESS_RESPONSE_FAILURE,
  error: error
})

export const createBusinessResponse = (payload, success, error) => dispatch => {
  dispatch(createBusinessResponseRequest())
  return HttpService.post(`${process.env.REACT_APP_API_URL}/business-responses/`, payload,
    (resp) => {
      dispatch(createBusinessResponseSuccess(resp));
      success(resp)
    },
    (err) => {
      dispatch(createBusinessResponseFailure(err))
      error(err)
    });
}


/***************************************************/
/********* UPDATE EXISTING BUSINESS RESPONSE *******/
/***************************************************/

export const updateBusinessResponseRequest = () => ({
  type: UPDATE_BUSINESS_RESPONSE_REQUEST,
})

export const updateBusinessResponseSuccess = (response) => ({
  type: UPDATE_BUSINESS_RESPONSE_SUCCESS,
  response: response,
})

export const updateBusinessResponseFailure = (error) => ({
  type: UPDATE_BUSINESS_RESPONSE_FAILURE,
  error: error
})

export const updateBusinessResponse = (id, payload, success, error) => dispatch => {
  dispatch(updateBusinessResponseRequest())
  return HttpService.put(`${process.env.REACT_APP_API_URL}/business-responses/${id}/`, payload,
    (resp) => {
      dispatch(updateBusinessResponseSuccess(resp));
      success(resp)
    },
    (err) => {
      dispatch(updateBusinessResponseFailure(err))
      error(err)
    });
}
