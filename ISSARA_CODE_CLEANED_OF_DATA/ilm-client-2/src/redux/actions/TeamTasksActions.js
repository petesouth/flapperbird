import HttpService from '../../services/HttpService';

export const REQUEST_TEAM_TASKS = 'REQUEST_TEAM_TASKS'
export const RECEIVE_TEAM_TASKS = 'RECEIVE_TEAM_TASKS'

export const UPDATE_TEAM_TASK_REQUEST = 'UPDATE_TEAM_TASK_REQUEST'
export const UPDATE_TEAM_TASK_SUCCESS = 'UPDATE_TEAM_TASK_SUCCESS'
export const UPDATE_TEAM_TASK_FAILURE = 'UPDATE_TEAM_TASK_FAILURE'


/***************************************************/
/***************** GET ALL TEAM TASKS **************/
/***************************************************/

export const requestTeamTasks = () => ({
  type: REQUEST_TEAM_TASKS,
})

export const receiveTeamTasks = (data) => ({
  type: RECEIVE_TEAM_TASKS,
  teamTasks: data,
  receivedAt: new Date()
})

export const fetchTeamTasks = () => dispatch => {
  dispatch(requestTeamTasks())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/user-tasks/`,
    (resp) => {
      dispatch(receiveTeamTasks(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}

/***************************************************/
/*************** UPDATE A TEAM TASK ****************/
/***************************************************/

export const updateTeamTaskRequest = () => ({
  type: UPDATE_TEAM_TASK_REQUEST,
})

export const updateTeamTaskSuccess = (data) => ({
  type: UPDATE_TEAM_TASK_SUCCESS,
  teamTask: data,
})

export const updateTeamTaskFailure = (error) => ({
  type: UPDATE_TEAM_TASK_FAILURE,
  error: error
})

export const updateTeamTask = (id, payload) => dispatch => {
  dispatch(updateTeamTaskRequest())
  return HttpService.patch(`${process.env.REACT_APP_API_URL}/user-tasks/${id}/`, payload,
    (resp) => {
      console.log(resp)
      dispatch(updateTeamTaskSuccess(resp));
    },
    (err) => {
      dispatch(updateTeamTaskFailure(err))
    });
}
