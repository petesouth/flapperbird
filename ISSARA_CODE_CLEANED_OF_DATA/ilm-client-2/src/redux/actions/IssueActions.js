
import HttpService from '../../services/HttpService';
import moment from 'moment';

export const REQUEST_ALL_ISSUES = 'REQUEST_ALL_ISSUES';
export const REQUEST_ISSUES_BY_CALL_ID = 'REQUEST_ISSUES_BY_CALL_ID';
export const RECEIVE_ALL_ISSUES = 'RECEIVE_ALL_ISSUES';
export const RECEIVE_ISSUES_BY_CALL_ID = 'RECEIVE_ISSUES_BY_CALL_ID';
export const UPDATE_ISSUE_REQUEST = 'UPDATE_ISSUE_REQUEST';
export const UPDATE_ISSUE_SUCCESS = 'UPDATE_ISSUE_SUCCESS';
export const CREATE_ISSUE_SUCCESS = 'CREATE_ISSUE_SUCCESS';
export const CREATE_ISSUE_REQUEST = 'CREATE_ISSUE_REQUEST';
export const REQUEST_KPI_LIST = 'REQUEST_KPI_LIST';
export const RECEIVE_KPI_LIST = 'RECEIVE_KPI_LIST';
export const REQUEST_KPI_LEAN_LIST = 'REQUEST_KPI_LEAN_LIST';
export const RECEIVE_KPI_LEAN_LIST = 'RECEIVE_KPI_LEAN_LIST';
export const REQUEST_KPI_CATEGORY_LIST = 'REQUEST_KPI_CATEGORY_LIST';
export const RECEIVE_KPI_CATEGORY_LIST = 'RECEIVE_KPI_CATEGORY_LIST';
export const REQUEST_ISSUE_CATEGORIES = 'REQUEST_ISSUE_CATEGORIES';
export const RECEIVE_ISSUE_CATEGORIES = 'RECEIVE_ISSUE_CATEGORIES';
export const ISSUE_ERROR = 'ISSUE_ERROR';
export const UPDATE_BHR_ISSUE_REQUEST = 'UPDATE_BHR_ISSUE_REQUEST';
export const UPDATE_BHR_ISSUE_SUCCESS = 'UPDATE_BHR_ISSUE_SUCCESS';


export const DELETE_ISSUE_REQUEST = 'DELETE_ISSUE_REQUEST';
export const DELETE_ISSUE_SUCCESS = 'DELETE_ISSUE_SUCCESS';


export function createIssue(issue) {
  return function (dispatch) {
    dispatch(createIssueRequest())
    return HttpService.post(`${process.env.REACT_APP_API_URL}/issues`, issue,
      (res) => {
        dispatch({ type: CREATE_ISSUE_SUCCESS,
                   issue: res.issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
      },
      (err) => {
        dispatch({ type: ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}


export function deleteIssue(id, issue) {
  return function (dispatch) {
    dispatch(deleteIssueRequest(id))
    return HttpService.delete(`${process.env.REACT_APP_API_URL}/issues/${id}`,
      (res) => {
        dispatch({ type: DELETE_ISSUE_SUCCESS,
                   issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}

export const deleteIssueRequest = (id) => ({
  type: DELETE_ISSUE_REQUEST,
  id: id
})



export function updateIssue(id, issue) {
  return function (dispatch) {
    dispatch(updateIssueRequest(id))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/issues/${id}`, issue,
      (res) => {
        dispatch({ type: UPDATE_ISSUE_SUCCESS,
                   issue: res.issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}

export const updateIssueRequest = (id) => ({
  type: UPDATE_ISSUE_REQUEST,
  id: id
})

export const createIssueRequest = () => ({
  type: CREATE_ISSUE_REQUEST
})


export const requestIssuesByCallId = (id) => ({
  type: REQUEST_ISSUES_BY_CALL_ID,
  id: id
})

export const receiveIssuesByCallId = (json) => ({
  type: RECEIVE_ISSUES_BY_CALL_ID,
  issues: json,
  receivedAt: Date.now()
})

export const requestAllIssues = () => ({
  type: REQUEST_ALL_ISSUES
})

export const receiveAllIssues = (json) => ({
  type: RECEIVE_ALL_ISSUES,
  issues: json,
  receivedAt: Date.now()
})

export const fetchIssues = (id) => dispatch => {
  console.log('fetchIssues dispatched')
  dispatch(requestIssuesByCallId(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/calls/${id}/issues`,
    (resp) => {
      dispatch(receiveIssuesByCallId(resp.issues));
    },
    (err) => { console.log(err.message) });
}

export const fetchAllIssues = (id) => dispatch => {
  console.log('fetchIssues dispatched')
  dispatch(requestAllIssues())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/issues`,
    (resp) => {
      dispatch(receiveAllIssues(resp.issues));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchIssues = (id, state) => {
  console.log('shouldFetchIssues', id, state.issuesReducer)
  //for now, we'll just grab them all the time.
  return true;

}

const shouldFetchAllIssues = (state) => {
  console.log('shouldFetchAllIssues', state.issuesReducer)
  //for now, we'll just grab them all the time.
  return true;

}

export const fetchIssuesIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchIssues(id, getState())) {
    return dispatch(fetchIssues(id))
  }
}


export const fetchAllIssuesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchAllIssues(getState())) {
    return dispatch(fetchAllIssues())
  }
}

export const requestKPIList = () => ({
  type: REQUEST_KPI_LIST
})

export const receiveKPIList = (json) => ({
  type: RECEIVE_KPI_LIST,
  kpis: json,
  receivedAt: Date.now()
})

export const fetchKPIList = () => dispatch => {
  console.log('fetchKPIList dispatched')
  dispatch(requestKPIList())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/kpis/`,
    (resp) => {
      dispatch(receiveKPIList(resp.results));
    },
    (err) => { console.log(err.message) });
}

export const requestKPILeanList = () => ({
  type: REQUEST_KPI_LEAN_LIST
})

export const receiveKPILeanList = (json) => ({
  type: RECEIVE_KPI_LEAN_LIST,
  kpis: json,
  receivedAt: Date.now()
})

export const fetchKPILeanList = () => dispatch => {
  console.log('fetchKPIList dispatched')
  dispatch(requestKPILeanList())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/kpis_list_lean`,
    (resp) => {
      dispatch(receiveKPILeanList(resp)); // the the Custom Beware.. It's the straight list from server in this case.
    },
    (err) => { console.log(err.message) });
}


export const requestKPICategoryList = () => ({
  type: REQUEST_KPI_CATEGORY_LIST
})

export const receiveKPICategoryList = (json) => ({
  type: RECEIVE_KPI_CATEGORY_LIST,
  kpicategories: json,
  receivedAt: Date.now()
})

export const fetchKPICategoryList = () => dispatch => {
  console.log('fetchKPIList dispatched')
  dispatch(requestKPICategoryList())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/kpicategories/`,
    (resp) => {
      dispatch(receiveKPICategoryList(resp.results));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchKPList = (state) => {
  console.log('shouldFetchKPList', state.kpisReducer)
  const { kpisReducer } = state;


  const kpis = kpisReducer.items
  if (!kpis) {
    console.log('shouldFetchKPList returning true 1')
    return true
  }
  if (kpis.fetchingKPIs) {
    console.log('shouldFetchKPList returning false')
    return false
  }
  console.log('shouldFetchKPList returning false')
  return false;
}

export const fetchKPIListIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchKPList(getState())) {
    return dispatch(fetchKPIList())
  }
}



export const requestIssueCategories = () => ({
  type: REQUEST_ISSUE_CATEGORIES
})

export const receiveIssueCategories = (json) => ({
  type: RECEIVE_ISSUE_CATEGORIES,
  categories: json,
  receivedAt: Date.now()
})

export const fetchIssueCategories = () => dispatch => {
  console.log('fetchIssueCategories dispatched')
  dispatch(requestIssueCategories())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/issuecategories/`,
    (resp) => {
      dispatch(receiveIssueCategories(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchIssueCategories = (state) => {
  console.log('shouldFetchIssueCategories', state.issueCategoriesReducer)
  const { issueCategoriesReducer } = state;

  const issueCategories = issueCategoriesReducer.items
  if (!issueCategories) {
    console.log('shouldFetchIssueCategories returning true 1')
    return true
  }
  if (issueCategories.fetchingCategories) {
    console.log('shouldFetchIssueCategories returning false')
    return false
  }
  console.log('shouldFetchIssueCategories returning false')
  return false;
}

export const fetchIssueCategoriesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchIssueCategories(getState())) {
    return dispatch(fetchIssueCategories())
  }
}

export const updateBhrIssueRequest = (id) => ({
  type: UPDATE_BHR_ISSUE_REQUEST,
  id: id
})

export function updateBhrIssue(id, issue) {
  return function (dispatch) {
    dispatch(updateBhrIssueRequest(id))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/bhrIssues/${id}`, issue,
      (res) => {
        dispatch({ type: UPDATE_BHR_ISSUE_SUCCESS,
                   issue: res.issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}
