import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import axios from 'axios';

import HttpService from "../../services/HttpService";
import { deleteCookie } from '../../lib/Utils';
import history from "../../history";
import Utils from "../../services/utils";

/*

Existing login states
Not adim (null) (Assumed general user)
'admin'  (Assumed super user/admin power over whole app)
'global_buyer_author' (Allows author access in global_buyers)

Note to users... Please don't access the user directly...
Im keeping it here so I can make global changes to login stuff
without having to chase down code dong the same thing in many places.

that way I can more easily.. Control how the login works without effecting so many files.

*/
class LoginStore extends EventEmitter {
  constructor() {
    super();

    this.loginUser = { user: null, token: null, pre_token: null, code: null, userLogoutData: null };
   
    let storedVersion = localStorage.getItem("loginUser");

    if (storedVersion !== null && storedVersion !== undefined) {
      this.loginUser = { ...(JSON.parse(storedVersion)) };
      this.setAuthorizationHeaders(this.loginUser.token);
    }

  }

  getLoginUser = () => {
    return (this.loginUser.user);
  }

  loginUserGroups = () => {
    return (this.loginUser.user && this.loginUser.user.groups !== undefined && this.loginUser !== null) ? this.loginUser.user.groups : "";
  }

  isLoggedIn = () => {
    if (this.loginUser.token && [null,undefined].includes(this.loginUser.user) === false && this.loginUser.user.is_active === true) {
      this.setAuthorizationHeaders(this.loginUser.token);
      return true;
    } else {
      return false;
    }
  }

  // global_buyer_author



  isActivityUser = () => {
    const returnVal = (this.loginUser.user !== undefined &&
      this.loginUser.user !== null &&
      this.loginUser.user.groups !== undefined &&
      this.loginUser.user.groups !== null &&
      this.loginUser.user.groups.includes !== undefined &&
      this.loginUser.user.groups.includes !== null &&
      this.loginUser.user.groups.includes("activity_user") === true);
    return returnVal;
  }


  isIssaraManagement = () => {
    const returnVal = (this.loginUser.user !== undefined &&
      this.loginUser.user !== null &&
      this.loginUser.user.groups !== undefined &&
      this.loginUser.user.groups !== null &&
      this.loginUser.user.groups.includes !== undefined &&
      this.loginUser.user.groups.includes !== null &&
      this.loginUser.user.groups.includes("Issara Management") === true);
    return returnVal;
  }

  isDirectors = () => {
    const returnVal = (this.loginUser.user !== undefined &&
      this.loginUser.user !== null &&
      this.loginUser.user.groups !== undefined &&
      this.loginUser.user.groups !== null &&
      this.loginUser.user.groups.includes !== undefined &&
      this.loginUser.user.groups.includes !== null &&
      this.loginUser.user.groups.includes("directors") === true);
    return returnVal;
  }

  isGlobalPartnerObj = (tloginUser) => {
    const returnVal = (tloginUser.user !== undefined &&
      tloginUser.user !== null &&
      tloginUser.user.groups !== undefined &&
      tloginUser.user.groups !== null &&
      tloginUser.user.groups.includes !== undefined &&
      tloginUser.user.groups.includes !== null &&
      tloginUser.user.groups.includes("global_partner") === true);
    return returnVal;
  }

  isGlobalPartner = () => {
    return this.isGlobalPartnerObj(this.loginUser);
  }


  isAdmin = () => {
    const returnVal = (this.loginUser.user !== undefined &&
      this.loginUser.user !== null &&
      this.loginUser.user.groups !== undefined &&
      this.loginUser.user.groups !== null &&
      this.loginUser.user.groups.includes !== undefined &&
      this.loginUser.user.groups.includes !== null &&
      this.loginUser.user.groups.includes("admin") === true);
    return returnVal;
  }

  isDeveloper = () => (
    this.loginUser.user
    && this.loginUser.user.groups
    && this.loginUser.user.groups.includes("Developer")
  )

  checkUser = () => {
    if (this.isLoggedIn()) {
      this.setAuthorizationHeaders(this.loginUser.token);
    }
  }

  setAuthorizationHeaders = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
  }

  getAxiosConfigHeaders = () => {
    if (this.loginUser === undefined || this.loginUser.token === undefined) {
      return {};
    }

    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + this.loginUser.token,
      }
    };

    return axiosConfig;
  }

  getName = () => {

    if (this.loginUser.user) {
      return this.loginUser.user.username;
    }
    return null;
  }

  getUserID = () => {
    if (this.loginUser.user) {
      return this.loginUser.user.id;
    }

    return null;
  }

  do2FactorSendCode = (code) => {

    let theThis = this;

    HttpService.post(
      process.env.REACT_APP_API_BASE_URL + "/two_factor_auth/auth/",
      {
        code_token: theThis.loginUser.code_token,
        code: code
      },
      resp => {
        theThis.loginUser.code = code;
        theThis.loginUser.token = theThis.loginUser.pre_token;
        localStorage.setItem('loginUser', JSON.stringify(theThis.loginUser));
        this.postUserLoginEvent(); // This should only happen for partners

        history.push('/');
      },
      err => {
        console.log(err.message);
      }
    );
  }

  do2FactorLogin = (user, loginForm) => {

    let theThis = this;

    HttpService.post(
      process.env.REACT_APP_API_BASE_URL + "/two_factor_auth/get-code/",
      loginForm,
      resp => {
        theThis.loginUser.code_token = (resp && resp.token) ? resp.token : "";
        history.push('/auth/enter_code');
      },
      err => {
        console.log(err.message);
      }
    );
  }

  doLogin = (user, loginForm) => {
    this.loginUser = user;
    this.setAuthorizationHeaders(this.loginUser.token)


    return ((loggedInUser) => {

      return HttpService.get(`${process.env.REACT_APP_API_URL}/me`,
        (resp) => {
          loggedInUser.user = { ...resp };

          if (this.isGlobalPartnerObj({ user: { ...resp } }) === false) {
            localStorage.setItem("loginUser", JSON.stringify(loggedInUser));
            history.push('/');
          } else {
            loggedInUser.pre_token = loggedInUser.token;
            loggedInUser.token = null;

            this.do2FactorLogin(loggedInUser.user, { ...loginForm });
          }

        },
        (err) => {
          console.log(err.message)
        });

    })(this.loginUser);
  }

  doLogout = () => {
    this.postUserLogoutEvent();
    this.loginUser = { user: null, token: null, pre_token: null, code: null };
    
    this.setAuthorizationHeaders(false)
    localStorage.removeItem('loginUser');

    if (Boolean.valueOf(process.env.REACT_APP_USE_GOOGLE_AUTH) === true) {
      document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + window.location.origin + "/login";
    } else {
      this.emit('loginRequired');
    }

    history.push('/');
  }

  handleActions = (action) => {
    console.log("LoginStore", action);
    switch (action.type) {
      case "LOGIN_EVENT": {
        this.doLogin(action.loginUser, action.loginForm);
        break;
      }

      case 'LOGOUT_EVENT': {
        this.doLogout();
        break;
      }

      default: {
        console.log('no ACTION received in loginStore.js')
        break;
      }
    }
  }

  postUserLoginEvent = () => {
    let theThis = this;

    HttpService.post(
      process.env.REACT_APP_API_URL + "/userpartnerlogins/",
      {
        user: this.getUserID()
      },
      resp => {
        console.log("userlogin", resp)
        if(this.loginUser) {
          this.loginUser.userLogoutData = { ...resp };
          localStorage.setItem('loginUser', JSON.stringify(this.loginUser));
        
        }
      },
      err => {
        console.error("Error userLogin", err, err.message);
      }
    );

  }

  postUserLogoutEvent = () => {
    let theThis = this;

    if (this.loginUser && this.loginUser.userLogoutData) {

      let userData = { ...this.loginUser.userLogoutData, loggedout_at: (new Date()).toISOString() };
      this.loginUser.userLogoutData = null;

      HttpService.put(`${process.env.REACT_APP_API_URL}/userpartnerlogins/${userData.id}/`,
        userData,
        resp => {
          console.log("userlogout", resp)
        },
        err => {
          console.error("Error loggout", err, err.message);
        }
      );

    }

  }

}

const loginStore = new LoginStore();

dispatcher.register(loginStore.handleActions.bind(loginStore));

export default loginStore;
