import HttpService from '../../services/HttpService';
import moment from 'moment';

export const REQUEST_RECRUITERS = 'REQUEST_RECRUITERS'
export const RECEIVE_RECRUITERS = 'RECEIVE_RECRUITERS'

export const REQUEST_RECRUITERS_BHR = 'REQUEST_RECRUITERS_BHR'
export const RECEIVE_RECRUITERS_BHR = 'RECEIVE_RECRUITERS_BHR'

export const REQUEST_RECRUITER = 'REQUEST_RECRUITER'
export const RECEIVE_RECRUITER = 'RECEIVE_RECRUITER'

export const UPDATE_RECRUITER_REQUEST = 'UPDATE_RECRUITER_REQUEST';
export const UPDATE_RECRUITER_SUCCESS = 'UPDATE_RECRUITER_SUCCESS';
export const RECRUITER_ERROR = 'RECRUITER_ERROR';

export const MERGE_RECRUITER_DUPLICATES_START = 'MERGE_RECRUITER_DUPLICATES_START';
export const MERGE_RECRUITER_DUPLICATES_SUCCESS = 'MERGE_RECRUITER_DUPLICATES_SUCCESS';
export const MERGE_RECRUITER_DUPLICATES_FAILURE = 'MERGE_RECRUITER_DUPLICATES_FAILURE';

export const REQUEST_RECRUITER_CRCS = 'REQUEST_RECRUITER_CRCS';
export const RECEIVE_RECRUITER_CRCS = 'RECEIVE_RECRUITER_CRCS';




export const requestRecruiterCRCs = () => ({
  type: REQUEST_RECRUITER_CRCS
})

export const receiveRecruiterCRCs = (json) => ({
  type: RECEIVE_RECRUITER_CRCS,
  recruitercrcs: json,
  receivedAt: Date.now()
})

export const fetchRecruiterCRCs = () => dispatch => {
  console.log('fetchRecruiterCRCs dispatched')
  dispatch(requestRecruiterCRCs())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/recruiter-crc-scores/`,
    (resp) => {
      dispatch(receiveRecruiterCRCs(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const updateRecruiterRequest = (id) => ({
  type: UPDATE_RECRUITER_REQUEST,
  id: id,
})

export function updateRecruiter(id, recruiter, success, error) {
  console.log('updateRecruiter, got', id, recruiter)
  return function (dispatch) {
    dispatch(updateRecruiterRequest(id))
    return HttpService.put(`${process.env.REACT_APP_API_URL}/recruiters/${id}/`, recruiter,
      (res) => {
        dispatch({
          type: UPDATE_RECRUITER_SUCCESS,
          id: id,
          recruiter: recruiter,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        success(res);
      },
      (err) => {
        console.log(err)
        dispatch({
          type: RECRUITER_ERROR,
          message: err.message,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err);
      });
  }
}

export function createRecruiter(recruiter, success, error) {
  console.log('createRecruiter, got', recruiter)
  return function (dispatch) {
    return HttpService.post(`${process.env.REACT_APP_API_URL}/recruiters/`, recruiter,
      (res) => {
        dispatch({
          type: UPDATE_RECRUITER_SUCCESS,
          recruiter: recruiter,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        success(res);
      },
      (err) => {
        console.log(err)
        dispatch({
          type: RECRUITER_ERROR,
          message: err.message,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        error(err);
      });
  }
}

export const requestRecruiters = () => ({
  type: REQUEST_RECRUITERS
})

export const receiveRecruiters = (json) => ({
  type: RECEIVE_RECRUITERS,
  recruiters: json,
  receivedAt: Date.now()
})

export const requestRecruitersBhr = () => ({
  type: REQUEST_RECRUITERS_BHR
})

export const receiveRecruitersBhr = (json) => ({
  type: RECEIVE_RECRUITERS_BHR,
  recruiters: json,
  receivedAt: Date.now()
})


export const requestRecruiter = () => ({
  type: REQUEST_RECRUITER
})

export const receiveRecruiter = (json) => ({
  type: RECEIVE_RECRUITER,
  recruiter: json.recruiters[0],
  receivedAt: Date.now()
})

export const fetchRecruiters = () => dispatch => {
  console.log('fetchRecruiters dispatched')
  dispatch(requestRecruiters())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/recruiters/`,
    (resp) => {
      dispatch(receiveRecruiters(resp.results));
    },
    (err) => { console.log(err.message) });
}

export const fetchRecruitersBhr = () => dispatch => {
  console.log('fetchRecruitersBhr dispatched')
  dispatch(requestRecruitersBhr())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/recruiters/bhrlist`,
    (resp) => {
      dispatch(receiveRecruitersBhr(resp.recruiters));
    },
    (err) => { console.log(err.message) });
}

export const fetchRecruiter = (id) => dispatch => {
  console.log('fetchRecruiters dispatched')
  dispatch(requestRecruiter(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/recruiters/` + id,
    (resp) => {
      dispatch(receiveRecruiter(resp));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchRecruiters = (state) => {
  console.log('shouldFetchRecruiters', state)
  const { recruitersReducer } = state;

  const recruiters = recruitersReducer.items
  if (!recruiters) {
    console.log('shouldFetchRecruiters returning true 1')
    return true;
  }
  if (recruiters.fetchingRecruiters) {
    console.log('shouldFetchRecruiters returning false')
    return false;
  }
  console.log('shouldFetchRecruiters returning false')
  return false;
}

const shouldFetchRecruitersBhr = (state) => {
  console.log('shouldFetchRecruitersBhr', state)
  return true;
}

const shouldFetchRecruiter = (id, state) => {
  console.log('shouldFetchRecruiters', id, state)
  return true;
}

export const fetchRecruitersIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchRecruiters(getState())) {
    return dispatch(fetchRecruiters())
  }
}

export const fetchRecruitersBhrIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchRecruitersBhr(getState())) {
    return dispatch(fetchRecruitersBhr())
  }
}

export const fetchRecruiterIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchRecruiter(id, getState())) {
    return dispatch(fetchRecruiter(id));
  }
}


export const mergeRecruiterDuplicatesStart = () => ({
  type: MERGE_RECRUITER_DUPLICATES_START,
})

export const mergeRecruiterDuplicatesSuccess = () => ({
  type: MERGE_RECRUITER_DUPLICATES_SUCCESS,
})

export const mergeRecruiterDuplicatesFailure = () => ({
  type: MERGE_RECRUITER_DUPLICATES_FAILURE,
})

export const mergeRecruiterDuplicates = (duplicates, success, error) => dispatch => {
  dispatch(mergeRecruiterDuplicatesStart())
  return HttpService.post(`${process.env.REACT_APP_API_URL}/merge-recruiter-duplicates`, duplicates,
    (resp) => {
      dispatch(mergeRecruiterDuplicatesSuccess());
      dispatch(fetchRecruiters()) // Refetch recruiters after successful merge
      success(resp)
    },
    (err) => {
      dispatch(mergeRecruiterDuplicatesFailure())
      error(err)
    });
}
