
import HttpService from '../../services/HttpService';
import moment from 'moment';

export const REQUEST_BHR_ISSUE = 'REQUEST_BHR_ISSUE'
export const RECEIVE_BHR_ISSUE = 'RECEIVE_BHR_ISSUE'
export const UPDATE_BHR_ISSUE_REQUEST = 'UPDATE_BHR_ISSUE_REQUEST';
export const UPDATE_BHR_ISSUE_SUCCESS = 'UPDATE_BHR_ISSUE_SUCCESS';
export const BHR_ISSUE_ERROR = 'BHR_ISSUE_ERROR';

export const requestBhrIssue = () => ({
  type: REQUEST_BHR_ISSUE
})

export const receiveBhrIssue = (issue) => ({
  type: RECEIVE_BHR_ISSUE,
  issue:issue,
  receivedAt: Date.now()
})

export const fetchBhrIssue = (id) => dispatch => {
  console.log('fetchBhrIssue dispatched')
  dispatch(requestBhrIssue())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/bhrIssues/${id}`,
    (resp) => {
      dispatch(receiveBhrIssue(resp.bhr_issue[0]));
    },
    (err) => { console.log(err.message) });
}

export const updateBhrIssueRequest = (id) => ({
  type: UPDATE_BHR_ISSUE_REQUEST,
  id: id
})

export function updateBhrIssue(id, issue) {
  return function (dispatch) {
    dispatch(updateBhrIssueRequest(id, issue))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/bhrIssues/${id}`, issue,
      (res) => {
        dispatch({ type: UPDATE_BHR_ISSUE_SUCCESS,
                   id: id,
                   issue: res.issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: BHR_ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}
