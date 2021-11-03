import HttpService from '../../services/HttpService';
import moment from 'moment';

import utils from "../../services/utils.js";


//export const NEW_CALL = 'NEW_CALL'
export const REQUEST_CALLS = 'REQUEST_CALLS';
export const RECEIVE_CALLS = 'RECEIVE_CALLS';
export const REQUEST_CALL_DATA = 'REQUEST_CALL_DATA';
export const RECEIVE_CALL_DATA = 'RECEIVE_CALL_DATA';
export const UPDATE_CALL_REQUEST = 'UPDATE_CALL_REQUEST';
export const UPDATE_CALL_SUCCESS = 'UPDATE_CALL_SUCCESS';
export const CREATE_CALL_SUCCESS = 'CREATE_CALL_SUCCESS';
export const CREATE_CALL_REQUEST = 'CREATE_CALL_REQUEST';
export const REQUEST_CALL_TYPES = 'REQUEST_CALL_TYPES';
export const RECEIVE_CALL_TYPES = 'RECEIVE_CALL_TYPES';
export const REQUEST_CALL_CHANNELS = 'REQUEST_CALL_CHANNELS';
export const RECEIVE_CALL_CHANNELS = 'RECEIVE_CALL_CHANNELS';
export const REQUEST_CALL_REASONS = 'REQUEST_CALL_REASONS';
export const RECEIVE_CALL_REASONS = 'RECEIVE_CALL_REASONS';

export const REQUEST_HOW_HEAR_ISSARA = 'REQUEST_HOW_HEAR_ISSARA';
export const RECEIVE_HOW_HEAR_ISSARA = 'RECEIVE_HOW_HEAR_ISSARA';
export const CALL_ERROR = 'CALL_ERROR';

export function createCall(call, successMethod, errorMethod) {
  return function (dispatch) {
    dispatch(createCallRequest(call))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/cases_deep/`, call,
      (res) => {
        receiveCallById(res);
        if (successMethod) {
          successMethod(res);
        }
      },
      (err) => {
        dispatch({
          type: CALL_ERROR,
          message: err.message,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });

        if (errorMethod) {
          errorMethod(JSON.stringify(err.message));
        }
      });
  }
}

export function updateCall(call, successMethod, errorMethod) {
  return function (dispatch) {
    dispatch(updateCallRequest(call))
    return HttpService.put(`${process.env.REACT_APP_API_URL}/cases_deep/${call.id}/`, call,
      (res) => {
        receiveCallById(call);

        if (successMethod) {
          successMethod(res);
        }
      },
      (err) => {
        console.log('CALL_ERROR', err)
        dispatch({
          type: CALL_ERROR,
          message: err.message,
          receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })

        if (errorMethod) {
          errorMethod(JSON.stringify(err.message));
        }
      }
    );
  }
}





export const requestCalls = () => ({
  type: REQUEST_CALLS
})


export const receiveCalls = (json) => ({
  type: RECEIVE_CALLS,
  calls: json,
  receivedAt: Date.now()
})

export const requestCallById = (id) => ({
  type: REQUEST_CALL_DATA,
  id: id
})

export const receiveCallById = (json) => ({
  type: RECEIVE_CALL_DATA,
  call: json,
  receivedAt: Date.now()
})

export const updateCallRequest = (json) => ({
  type: UPDATE_CALL_REQUEST,
  call: json,
  receivedAt: Date.now()
})

export const createCallRequest = (json) => ({
  type: CREATE_CALL_REQUEST,
  call: json,
  receivedAt: Date.now()
})


export const fetchCallById = (id) => dispatch => {
  dispatch(requestCallById(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/cases_deep/${id}/`,
    (resp) => {
      console.log('fethcCalls got back data', resp)
      dispatch(receiveCallById(resp));
    },
    (err) => {
      //console.log('fethcCalls got back error', err)
      dispatch({
        type: CALL_ERROR,
        message: err.message,
        receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
      });
    }
  );
}


export const fetchAllCalls = () => dispatch => {
  dispatch(requestCalls())
  let getUrl = `${process.env.REACT_APP_API_URL}/cases_lean?getAll=true`;

  return HttpService.get( getUrl,
    (resp) => {
      console.log('fethcCalls got back data', resp)
      dispatch(receiveCalls(resp));
    },
    (err) => {
      //console.log('fethcCalls got back error', err)
      dispatch({
        type: CALL_ERROR,
        message: err.message,
        receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
      });
    }
  );
}

export const fetchCalls = (after, before, supplierIds, srcRecruiterIds, destRecruiterIds, issaraStaffId, nextStepsIssaraStaffId) => dispatch => {
  dispatch(requestCalls())
  let afterStr = ((after !== undefined && after.getTime !== undefined) ? after.getTime() : "");
  let beforeStr = ((before !== undefined && before.getTime !== undefined) ? before.getTime() : "");
  let getUrl = `${process.env.REACT_APP_API_URL}/cases_lean?after=` + 
                afterStr + "&before=" + 
                beforeStr + "&supplier_ids=" + utils.arrayIdsToSqlParamString(supplierIds) + 
                "&issara_staff_id=" + ((issaraStaffId === undefined || issaraStaffId === null ) ? "" : issaraStaffId) + 
                "&next_steps_issara_staff_id=" + ((nextStepsIssaraStaffId === undefined || nextStepsIssaraStaffId === null ) ? "" : nextStepsIssaraStaffId) + 
                "&src_recruiter_ids=" + utils.arrayIdsToSqlParamString(srcRecruiterIds) + 
                "&dest_recruiter_ids=" + utils.arrayIdsToSqlParamString(destRecruiterIds);

  return HttpService.get( getUrl,
    (resp) => {
      //console.log('fethcCalls got back data', resp)
      dispatch(receiveCalls(resp));
    },
    (err) => {
      //console.log('fethcCalls got back error', err)
      dispatch({
        type: CALL_ERROR,
        message: err.message,
        receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
      });
    }
  );
}


//currently unused
// export const fetchCallById = (id) => dispatch => {
//   console.log('fetchCallById dispatched')
//   dispatch(requestCallById(id))
//   return HttpService.get(`${process.env.REACT_APP_API_URL}/calls/${id}`,
//     (resp) => {
//       console.log('got call data back', resp.data[0])
//       dispatch({type: RECEIVE_CALL_DATA, call: resp.data[0]});
//     },
//     (err) => { console.log(err.message) });
// }


export const requestCallTypes = () => ({
  type: REQUEST_CALL_TYPES
})

export const receiveCallTypes = (json) => ({
  type: RECEIVE_CALL_TYPES,
  callTypes: json,
  receivedAt: Date.now()
})

export const fetchCallTypes = () => dispatch => {
  console.log('fetchCallTypes dispatched')
  dispatch(requestCallTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/interactionchannels/`,
    (resp) => {
      dispatch(receiveCallTypes(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchCallTypes = (state) => {

  const { allCallTypes } = state;

  console.log('shouldFetchCallTypes', allCallTypes.items)

  const callTypes = allCallTypes.items
  if (!callTypes) {
    console.log('shouldFetchCallTypes returning true 1')
    return true
  }
  if (callTypes.fetchingCallTypes) {
    console.log('shouldFetchCalls returning false')
    return false
  }
  console.log('shouldFetchCallTypes returning false')
  return false;
}

export const fetchCallTypesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchCallTypes(getState())) {
    return dispatch(fetchCallTypes())
  }
}

export const requestChannels = () => ({
  type: REQUEST_CALL_CHANNELS
})

export const receiveChannels = (json) => ({
  type: RECEIVE_CALL_CHANNELS,
  callChannels: json,
  receivedAt: Date.now()
})

export const fetchChannels = () => dispatch => {
  console.log('fetchChannels dispatched')
  dispatch(requestChannels())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/interactionchannels/`,
    (resp) => {
      dispatch(receiveChannels(resp.results));
    },
    (err) => { console.log(err.message) });
}

export const requestReasons = () => ({
  type: REQUEST_CALL_REASONS
})

export const receiveReasons = (json) => ({
  type: RECEIVE_CALL_REASONS,
  callReasons: json,
  receivedAt: Date.now()
})

export const fetchReasons = () => dispatch => {
  console.log('fetchReasons dispatched')
  dispatch(requestReasons())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/interactionreasons/`,
    (resp) => {
      dispatch(receiveReasons(resp.results));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchChannels = (state) => {
  console.log('shouldFetchChannels', state)
  const channels = state.callChannels.items
  if (!channels) {
    console.log('shouldFetchCallTypes returning true 1')
    return true
  }
  if (channels.fetchingChannels) {
    console.log('shouldFetchChannels returning false')
    return false
  }
  console.log('shouldFetchChannels returning true')
  return true;
}

export const fetchChannelsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchChannels(getState())) {
    return dispatch(fetchChannels())
  }
}

export const requestCallHHI = () => ({
  type: REQUEST_HOW_HEAR_ISSARA
})

export const receiveCallHHI = (json) => ({
  type: RECEIVE_HOW_HEAR_ISSARA,
  callHHI: json,
  receivedAt: Date.now()
})

export const fetchCallHHI = () => dispatch => {
  console.log('fetchHHI dispatched')
  dispatch(requestCallHHI())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/howhearissara/`,
    (resp) => {
      dispatch(receiveCallHHI(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchCallHHI = (state) => {
  console.log('shouldFetchCallHHI', state.callHHI)
  const { callHHI } = state;
  const hhi = callHHI.items;
  if (!hhi) {
    console.log('shouldFetchCallHHI returning true 1')
    return true
  }
  if (hhi.fetchingCallHHI) {
    console.log('shouldFetchCallHHI returning false')
    return false
  }
  console.log('shouldFetchCallHHI returning false')
  return false;
}

export const fetchCallHHIIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchCallHHI(getState())) {
    return dispatch(fetchCallHHI())
  }
}
