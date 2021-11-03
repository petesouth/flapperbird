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

// redux
import * as LoginActions from "../../redux/actions/LoginActions";

import loginStore from "../../redux/stores/LoginStore";


const useStyles = makeStyles(styles);

export default function EnterCodePage() {

  const clientID = process.env.REACT_APP_ILM_CLIENT_ID

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
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
                {/*<div className={classes.socialLine}>
                  <GoogleLogin
                    clientId={clientID}
                    fetchBasicProfile="true"
                    render={renderProps => (
                      <Button
                        color="transparent"
                        className={classes.customButtonClass}
                        onClick={renderProps.onClick}

                      >
                        <i className="fab fa-google-plus" />
                        Google
                      </Button>
                    )}
                    onSuccess={googleAuthResponse}
                    onFailure={googleAuthResponse}
                  />
                </div>
                */}

              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="2Factor Code (Check your Email)..."
                  id="code"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    onChange: handleChangeCode
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" simple size="lg" block onClick={handleSend2FactorCode}>
                Log in
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
