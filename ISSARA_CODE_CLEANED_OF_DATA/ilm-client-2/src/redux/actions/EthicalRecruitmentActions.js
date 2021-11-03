import HttpService from '../../services/HttpService';
import moment from 'moment';

export const REQUEST_ETHICAL_RECRUITMENT_MEETINGS = 'REQUEST_ETHICAL_RECRUITMENT_MEETINGS'
export const RECEIVE_ETHICAL_RECRUITMENT_MEETINGS = 'RECEIVE_ETHICAL_RECRUITMENT_MEETINGS'
export const CREATE_ETHICAL_RECRUITMENT_MEETING_REQUEST = 'CREATE_ETHICAL_RECRUITMENT_MEETING_REQUEST';
export const CREATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS = 'CREATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS';
export const UPDATE_ETHICAL_RECRUITMENT_MEETING_REQUEST = 'UPDATE_ETHICAL_RECRUITMENT_MEETING_REQUEST';
export const UPDATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS = 'UPDATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS';

export const ETHICAL_RECRUITMENT_ERROR = 'ETHICAL_RECRUITMENT_ERROR';


/***************************************************/
/**************** GET ALL MEETINGS *****************/
/***************************************************/

export const requestEthicalRecruitmentMeetings = () => ({
  type: REQUEST_ETHICAL_RECRUITMENT_MEETINGS
})

export const receiveEthicalRecruitmentMeetings = (meetings) => ({
  type: RECEIVE_ETHICAL_RECRUITMENT_MEETINGS,
  meetings: meetings
})

export const fetchEthicalRecruitmentMeetings = () => dispatch => {
  dispatch(requestEthicalRecruitmentMeetings())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/ethical-recruitment-meetings/`,
    (resp) => {
      dispatch(receiveEthicalRecruitmentMeetings(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}


/***************************************************/
/***************** POST NEW MEETING ****************/
/***************************************************/

export const createEthicalRecruitmentMeetingRequest = () => ({
  type: CREATE_ETHICAL_RECRUITMENT_MEETING_REQUEST,
})

export const createEthicalRecruitmentMeetingSuccess = (meeting) => ({
  type: CREATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS,
  meeting: meeting
})

export function createEthicalRecruitmentMeeting(payload, success, error) {
  return function (dispatch) {
    dispatch(createEthicalRecruitmentMeetingRequest())
    return HttpService.post(`${process.env.REACT_APP_API_URL}/ethical-recruitment-meetings/`, payload,
      (res) => {
        dispatch(createEthicalRecruitmentMeetingSuccess(res))
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: ETHICAL_RECRUITMENT_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        error(err)
      });
  }
}


/***************************************************/
/************** UPDATE EXISTING MEETING ************/
/***************************************************/

export const updateEthicalRecruitmentMeetingRequest = () => ({
  type: UPDATE_ETHICAL_RECRUITMENT_MEETING_REQUEST,
})

export const updateEthicalRecruitmentMeetingSuccess = (meeting) => ({
  type: UPDATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS,
  meeting: meeting
})

export function updateEthicalRecruitmentMeeting(id, payload, success, error) {
  return function (dispatch) {
    dispatch(updateEthicalRecruitmentMeetingRequest());
    return HttpService.put(`${process.env.REACT_APP_API_URL}/ethical-recruitment-meetings/${id}/`, payload,
      (res) => {
        dispatch(updateEthicalRecruitmentMeetingSuccess(res));
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: ETHICAL_RECRUITMENT_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        });
        error(err)
      });
  }
}
