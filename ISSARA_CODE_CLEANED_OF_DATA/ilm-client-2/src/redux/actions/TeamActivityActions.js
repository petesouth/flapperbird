import HttpService from '../../services/HttpService';

export const REQUEST_FIELDWORK_TYPES = 'REQUEST_FIELDWORK_TYPES'
export const RECEIVE_FIELDWORK_TYPES = 'RECEIVE_FIELDWORK_TYPES'

export const REQUEST_FIELDWORK_PRIMARY_FOCUSES = 'REQUEST_FIELDWORK_PRIMARY_FOCUSES'
export const RECEIVE_FIELDWORK_PRIMARY_FOCUSES = 'RECEIVE_FIELDWORK_PRIMARY_FOCUSES'

export const REQUEST_FIELDWORK_ACTIVITIES = 'REQUEST_FIELDWORK_ACTIVITIES'
export const RECEIVE_FIELDWORK_ACTIVITIES = 'RECEIVE_FIELDWORK_ACTIVITIES'

export const CREATE_FIELDWORK_ACTIVITY_REQUEST = 'CREATE_FIELDWORK_ACTIVITY_REQUEST'
export const CREATE_FIELDWORK_ACTIVITY_SUCCESS = 'CREATE_FIELDWORK_ACTIVITY_SUCCESS'
export const CREATE_FIELDWORK_ACTIVITY_FAILURE = 'CREATE_FIELDWORK_ACTIVITY_FAILURE'

export const UPDATE_FIELDWORK_ACTIVITY_REQUEST = 'UPDATE_FIELDWORK_ACTIVITY_REQUEST'
export const UPDATE_FIELDWORK_ACTIVITY_SUCCESS = 'UPDATE_FIELDWORK_ACTIVITY_SUCCESS'
export const UPDATE_FIELDWORK_ACTIVITY_FAILURE = 'UPDATE_FIELDWORK_ACTIVITY_FAILURE'

export const CREATE_MONTHLY_WORKER_VOICE_REQUEST = 'CREATE_MONTHLY_WORKER_VOICE_REQUEST'
export const CREATE_MONTHLY_WORKER_VOICE_SUCCESS = 'CREATE_MONTHLY_WORKER_VOICE_SUCCESS'
export const CREATE_MONTHLY_WORKER_VOICE_FAILURE = 'CREATE_MONTHLY_WORKER_VOICE_FAILURE'

/***************************************************/
/************** GET ALL FIELDWORK TYPES ************/
/***************************************************/

export const requestFieldworkTypes = () => ({
  type: REQUEST_FIELDWORK_TYPES,
})

export const receiveFieldworkTypes = (data) => ({
  type: RECEIVE_FIELDWORK_TYPES,
  fieldworkTypes: data,
})

export const fetchFieldworkTypes = () => dispatch => {
  dispatch(requestFieldworkTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/fieldwork-types/`,
    (resp) => {
      dispatch(receiveFieldworkTypes(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}


/***************************************************/
/******** GET ALL FIELDWORK PRIMARY FOCUSES ********/
/***************************************************/

export const requestFieldworkPrimaryFocuses = () => ({
  type: REQUEST_FIELDWORK_PRIMARY_FOCUSES,
})

export const receiveFieldworkPrimaryFocuses = (data) => ({
  type: RECEIVE_FIELDWORK_PRIMARY_FOCUSES,
  fieldworkPrimaryFocuses: data,
})

export const fetchFieldworkPrimaryFocuses = () => dispatch => {
  dispatch(requestFieldworkPrimaryFocuses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/fieldwork-primary-focuses/`,
    (resp) => {
      dispatch(receiveFieldworkPrimaryFocuses(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}


/***************************************************/
/*********** GET ALL FIELDWORK ACTIVITIES **********/
/***************************************************/

export const requestFieldworkActivities = () => ({
  type: REQUEST_FIELDWORK_ACTIVITIES,
})

export const receiveFieldworkActivities = (data) => ({
  type: RECEIVE_FIELDWORK_ACTIVITIES,
  fieldworkActivities: data,
})

export const fetchFieldworkActivities = () => dispatch => {
  dispatch(requestFieldworkActivities())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/fieldwork-activities/`,
    (resp) => {
      dispatch(receiveFieldworkActivities(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}

export const fetchFieldworkActivitiy = (id) => dispatch => {
  dispatch(requestFieldworkActivities())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/fieldwork-activities/${id}/`,
    (resp) => {
      dispatch(receiveFieldworkActivities([resp]));
    },
    (err) => {
      console.log(err.message)
    });
}

/*****************UPDATE*********/
export const updateFieldworkActivityRequest = () => ({
  type: UPDATE_FIELDWORK_ACTIVITY_REQUEST,
})

export const updateFieldworkActivitySuccess = (data) => ({
  type: UPDATE_FIELDWORK_ACTIVITY_SUCCESS,
  fieldworkActivity: data,
})

export const updateFieldworkActivityFailure = (error) => ({
  type: UPDATE_FIELDWORK_ACTIVITY_FAILURE,
  error: error
})

export const updateFieldworkActivity = (id, payload, success, error) => dispatch => {
  dispatch(updateFieldworkActivityRequest())
  return HttpService.put(`${process.env.REACT_APP_API_URL}/fieldwork-activities/${id}/`, payload,
    (resp) => {
      dispatch(updateFieldworkActivitySuccess(resp));
      success(resp)
    },
    (err) => {
      dispatch(updateFieldworkActivityFailure(err))
      error(err)
    });
}


/***************************************************/
/*********** POST NEW FIELDWORK ACTIVITY ***********/
/***************************************************/

export const createFieldworkActivityRequest = () => ({
  type: CREATE_FIELDWORK_ACTIVITY_REQUEST,
})

export const createFieldworkActivitySuccess = (data) => ({
  type: CREATE_FIELDWORK_ACTIVITY_SUCCESS,
  fieldworkActivity: data,
})

export const createFieldworkActivityFailure = (error) => ({
  type: CREATE_FIELDWORK_ACTIVITY_FAILURE,
  error: error
})

export const createFieldworkActivity = (payload, success, error) => dispatch => {
  dispatch(createFieldworkActivityRequest())
  return HttpService.post(`${process.env.REACT_APP_API_URL}/fieldwork-activities/`, payload,
    (resp) => {
      dispatch(createFieldworkActivitySuccess(resp));
      success(resp)
    },
    (err) => {
      dispatch(createFieldworkActivityFailure(err))
      error(err)
    });
}


/***************************************************/
/****** POST NEW MONTHLY WORKER VOICE METRICS ******/
/***************************************************/

export const createMonthlyWorkerVoiceRequest = () => ({
  type: CREATE_MONTHLY_WORKER_VOICE_REQUEST,
})

export const createMonthlyWorkerVoiceSuccess = (data) => ({
  type: CREATE_MONTHLY_WORKER_VOICE_SUCCESS,
  monthlyWorkerVoice: data,
})

export const createMonthlyWorkerVoiceFailure = (error) => ({
  type: CREATE_MONTHLY_WORKER_VOICE_FAILURE,
  error: error
})

export const createMonthlyWorkerVoice = (payload, success, error) => dispatch => {
  dispatch(createMonthlyWorkerVoiceRequest())
  return HttpService.post(`${process.env.REACT_APP_API_URL}/monthly-worker-voice/`, payload,
    (resp) => {
      console.log(resp)
      dispatch(createMonthlyWorkerVoiceSuccess(resp));
      success(resp)
    },
    (err) => {
      console.log(err)
      dispatch(createMonthlyWorkerVoiceFailure(err))
      error(err)
    });
}
