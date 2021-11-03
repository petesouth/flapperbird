import HttpService from '../../services/HttpService';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

export const REQUEST_DASHBOARDS = 'REQUEST_DASHBOARDS';
export const RECEIVE_DASHBOARDS = 'RECEIVE_DASHBOARDS';




export const requestDashboards = () => ({
  type: REQUEST_DASHBOARDS
})

export const receiveDashboards = (json) => ({
  type: RECEIVE_DASHBOARDS,
  dashboards: json,
  receivedAt: Date.now()
})

export const fetchDashboards = () => dispatch => {
  console.log('fetchDashboards dispatched')
  dispatch(requestDashboards())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/dashboards`,
    (resp) => {
      dispatch(receiveDashboards(resp.dashboards));
    },
    (err) => { console.log(err.message) });
}


export const requestUsers = () => ({
  type: REQUEST_USERS
})

export const receiveUsers = (json) => ({
  type: RECEIVE_USERS,
  users: json,
  receivedAt: Date.now()
})

export const fetchUsers = () => dispatch => {
  console.log('fetchUsers dispatched')
  dispatch(requestUsers())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/users/`,
    (resp) => {
      dispatch(receiveUsers(resp.results));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchUsers = (state) => {
  console.log('shouldFetchUsers', state)
  const { usersReducer } = state;

  const users = usersReducer.items
  if (!users) {
    console.log('shouldFetchUsers returning true 1')
    return true;
  }
  if (users.fetchingUsers) {
    console.log('shouldFetchUsers returning false')
    return false;
  }
  console.log('shouldFetchUsers returning false')
  return false;
}

export const fetchUsersIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchUsers(getState())) {
    return dispatch(fetchUsers())
  }
}
