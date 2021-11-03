import ReactDOM from "react-dom";
import axios from 'axios';
import utils from "services/utils.js";
import * as LoginActions from '../redux/actions/LoginActions';
import config from '../ilm-config.json'
import loginStore from "redux/stores/LoginStore.js"

// Wrapper around axios. Since Axios sends different structured responses
// for error and success, we're sending our own json for both cases in the
// response.data property. This service can swallow the actual response object
// and send only the data we care about to the corresponding action.

// INSTANCE FOR SLACK LOGGING
const instance = axios.create();
//delete instance.defaults.headers.common["Content-Type"]
//delete instance.defaults.headers.common["Authorization"]
const webhook = 'https://hooks.slack.com/services/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'

// AXIOS PARAMETERS
const params = {
	client_version: config.client_version
}


class HttpService {

	get = (url, success, err) => {
		let handleErr = err;
		console.log('HttpService.get()', url)

		axios.get(url, {params: params, headers: loginStore.getAxiosConfigHeaders().headers
		})
		.then(response => {
			success(response.data)
		})
		.catch(errResponse => {
			console.error( "url failed=====> " + url, errResponse, JSON.stringify(errResponse.response)); err(errResponse)
			if (process.env.REACT_APP_ENABLE_SLACK === 'true' && errResponse.response && errResponse.response.status !== 401) {
				const slackMessage = url + ":" + utils.composeSlackBugMessage(errResponse)
				instance.post(webhook, slackMessage)
			}
			if (errResponse && errResponse.response) {
				if (errResponse.response.status === 401) {
					LoginActions.logout();
				}
				else if (errResponse.response.status === 444) {
					const version = errResponse.response.data.client_version_on_server
					const modal = utils.generateClientErrorAlert(version)
					ReactDOM.render(modal, document.getElementById('root'))
				}
			}
		});
	};

	post = (url, data, success, err) => {
		let handleErr = err;
		console.log('HttpService.post()', url)
		axios.post(url, data, {params: params})
		.then(response => {
			success(response.data);
		})
		.catch(errResponse => {
			console.error( "url failed" + url); err(errResponse);
			if (process.env.REACT_APP_ENABLE_SLACK === 'true' && errResponse.response && errResponse.response.status !== 401) {
				const slackMessage = url + ":" + utils.composeSlackBugMessage(errResponse, data)
				instance.post(webhook, slackMessage)
			}
			if (errResponse && errResponse.response) {
				if (errResponse.response.status === 401) {
					LoginActions.logout();
				}
				else if (errResponse.response.status === 444) {
					const version = errResponse.response.data.client_version_on_server
					const modal = utils.generateClientErrorAlert(version)
					ReactDOM.render(modal, document.getElementById('root'))
				}
			}
		});
	};

	put = (url, data, success, err) => {
		console.log('HttpService.put()', url)
		axios.put(url, data, {params: params})
		.then(response => {
			success(response.data)
		})
		.catch(errResponse => {
			console.error( "url failed" + url); err(errResponse)
			if (process.env.REACT_APP_ENABLE_SLACK === 'true' && errResponse.response && errResponse.response.status !== 401) {
				const slackMessage = url + ":" + utils.composeSlackBugMessage(errResponse, data)
				instance.post(webhook, slackMessage)
			}
			if (errResponse && errResponse.response) {
				if (errResponse.response.status === 401) {
					LoginActions.logout();
				}
				else if (errResponse.response.status === 444) {
					const version = errResponse.response.data.client_version_on_server
					const modal = utils.generateClientErrorAlert(version)
					ReactDOM.render(modal, document.getElementById('root'))
				}
			}
		});
	};

	patch = (url, data, success, err) => {
		axios.patch(url, data, {params: params})
		.then(response => {
			success(response.data)
		})
		.catch(errResponse => {
			console.error( "url failed" + url); err(errResponse)
			if (process.env.REACT_APP_ENABLE_SLACK === 'true' && errResponse.response && errResponse.response.status !== 401) {
				const slackMessage = url + ":" + utils.composeSlackBugMessage(errResponse, data)
				instance.post(webhook, slackMessage)
			}
			if (errResponse && errResponse.response) {
				if (errResponse.response.status === 401) {
					LoginActions.logout();
				}
				else if (errResponse.response.status === 444) {
					const version = errResponse.response.data.client_version_on_server
					const modal = utils.generateClientErrorAlert(version)
					ReactDOM.render(modal, document.getElementById('root'))
				}
			}
		});
	};

	//this was not refactored, it will be when I refactor reporting
	//didn't want to break that for now
	delete = (url, success, err) => {
		console.log('HttpService.delete()', url)
		axios.delete(url, {params: params})
		.then(response => {
			success(response.data)
		})
		.catch(errResponse => {
			console.error( "url failed" + url); err(errResponse)
			if (process.env.REACT_APP_ENABLE_SLACK === 'true' && errResponse.response && errResponse.response.status !== 401) {
				const slackMessage = url + ":" + utils.composeSlackBugMessage(errResponse)
				instance.post(webhook, slackMessage)
			}
			if (errResponse && errResponse.response) {
				if (errResponse.response.status === 401) {
					LoginActions.logout();
				}
				else if (errResponse.response.status === 444) {
					const version = errResponse.response.data.client_version_on_server
					const modal = utils.generateClientErrorAlert(version)
					ReactDOM.render(modal, document.getElementById('root'))
				}
			}
		});
	};

}

const httpService = new HttpService();

export default httpService;
