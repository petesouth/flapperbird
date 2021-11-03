import dispatcher from "../dispatcher";
import HttpService from "../../services/HttpService";
import history from "../../history";


export function dispatchLoginResponse(resp, loginForm) {
  console.log("dispatchLoginResponse", resp);
  dispatcher.dispatch({ type: "LOGIN_EVENT", loginUser: resp, loginForm: loginForm });
}

export function login(loginForm) {
  HttpService.post(
    process.env.REACT_APP_API_URL + "/token/",
    loginForm,
    resp => {
      dispatchLoginResponse(resp, loginForm);
    },
    err => {
      console.log(err.message);
    }
  );
}

export function changePassword(id, old_password, password, password2, successHandler, errorHandler) {
  HttpService.put(
    process.env.REACT_APP_API_BASE_URL + "/api-auth-user/change_password/" + id + "/",
    {
      old_password,
      password,
      password2
    },
    resp => {
      successHandler(resp);
    },
    err => {
      errorHandler(err);
    }
  );
}

export function resetPassword(token, password, password2, successHandler, errorHandler) {
  if( password === null || password === undefined || password === "" || password !== password2 ) {
    errorHandler({ message: "Password must not be empty and the new passwords must be the same in both form fields."});
    return;
  } else if( token === null || token === undefined || token == "" ) {
    errorHandler({ message: "token is invalid. please make sure you got to this page through the valid link on your accounts email."});
    return;
  }

  const payload = {password: password, token: token}

  HttpService.post(
    process.env.REACT_APP_API_BASE_URL + "/api-auth-user/password_reset/confirm/",
    payload,
    resp => {
      successHandler(resp);
    },
    err => {
      errorHandler(err);
    }
  );
}


export function requestResetPassword(email, successHandler, errorHandler) {
  if( email === null || email === undefined || email == "" ) {
    errorHandler({ message: "Please make sure email is a valid email"});
    return;
  }

  const payload = {email: email}

  HttpService.post(
    process.env.REACT_APP_API_BASE_URL + "/api-auth-user/password_reset/",
    payload,
    resp => {
      successHandler(resp);
    },
    err => {
      errorHandler(err);
    }
  );
}

// export function loginGoogle(googleAuthResponse) {
//   console.log("LoginActions.loginGoogle", googleAuthResponse);

//   if (
//     googleAuthResponse.error !== undefined ||
//     googleAuthResponse.w3 === undefined ||
//     googleAuthResponse.tokenId === undefined
//   ) {
//     console.log("Error:", googleAuthResponse);
//   } else {
//     const data = {
//       token: googleAuthResponse.tokenId,
//       username: googleAuthResponse.w3.U3
//     };
//     HttpService.post(
//       process.env.REACT_APP_API_URL + "/logingoogle",
//       data,
//       resp => {
//         dispatchLoginResponse(resp);
//       },
//       err => {
//         console.log(err.message);
//       }
//     );
//   }
// }

export function logout() {
  console.log("LoginActions.logout");
  dispatcher.dispatch({ type: "LOGOUT_EVENT" });
}
