import React from "react";

//import { GoogleLogin } from 'react-google-login';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import PasswordResetView from "../users/PasswordResetView";
import ForgotPasswordView from "../users/ForgotPasswordView";

import { useParams } from "react-router";

// redux
import * as LoginActions from "../../redux/actions/LoginActions";

import loginStore from "../../redux/stores/LoginStore";

import { withRouter } from "react-router";


const useStyles = makeStyles(styles);

function PasswordResetPage(props) {

  const clientID = process.env.REACT_APP_ILM_CLIENT_ID
  const token = (new URLSearchParams(window.location.search)).get("token");

    
    
  const [code, setCode] = React.useState("");
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

  setTimeout(function () {
    setCardAnimation("");
  }, 700);

  const handleChangeCode = (e) => {
    setCode(e.target.value);
  }

  
  const handleSend2FactorCode = () => {
    loginStore.do2FactorSendCode(code);
  }

  // const googleAuthResponse = (resp) => {
  //   LoginActions.loginGoogle(resp);
  // }

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
            {(token !== undefined && token !== null && token !== "") ? (<PasswordResetView token={token}/>) : (<ForgotPasswordView />)  }
              
        </GridItem>
      </GridContainer>
    </div>
  );
}


export default withRouter(PasswordResetPage)