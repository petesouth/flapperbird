import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";

// @material-ui/core components
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components

import CloseIcon from '@material-ui/icons/Close';

import Button from "components/CustomButtons/Button.js";


import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import loginStore from "../../redux/stores/LoginStore";
import * as LoginActions from "../../redux/actions/LoginActions";
import { useParams } from "react-router";

const customStyles = {
    ...sweetAlertStyles,
    formStyle: {
        minWidth: "400px"
    },
    header: {
        textAlign: 'center'
    },
    subheader: {
        fontWeight: '400',
    },
    datetime: {
        marginTop: '24px'
    },

    buttonCloser: {
        margin: 0,
        scrollbars: "none",
        paddingRight: "10px"
    },
    cardTitle: {
        paddingTop: "20px",
        color: "black"
    },
    container: {
        ...sweetAlertStyles.container,
        textAlign: "center"
    }

};

const useStyles = makeStyles(customStyles);



export default function PasswordResetView(props) {

    const dispatch = useDispatch();
    
    const token = (props.token) ? props.token : null;

    const classes = useStyles();
    const [alert, setAlert] = React.useState(null);
    const [saving, setSaving] = React.useState(false);
    
    const handleResetPassword = () => {
        setSaving(true);

        LoginActions.resetPassword(payload.token, payload.password, payload.password2,
        (resp)=>{
            console.log("resetPassword-----------------Resp", resp);
            successAlert();
        }, (error)=>{
            setSaving(false);
            let errorMessage = error.message + ((error && error.response && error.response.data && error.response.data.password !== undefined) ? (" " + error.response.data.password) : "");
            errorMessage = errorMessage + ((error && error.response && error.response.data && error.response.data.password2 !== undefined) ? (" " + error.response.data.password2) : "");

            errorAlert({ message: errorMessage });
        });
    }

    // const googleAuthResponse = (resp) => {
    //   LoginActions.loginGoogle(resp);
    // }

    const [payload, setPayload] = useState({
        token: (token) ? token : null,
        password: "",
        password2: ""
    })


    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                onConfirm={() => {
                    setAlert(null);
                    if (props.lostFocus) {
                        props.lostFocus();
                    }
                    window.location = `/admin/login-page`;
                }}
                confirmBtnCssClass={classes.button + " " + classes.success}
                title={(<div className={classes.cardTitle}>Well Done!!</div>)}
            >
                 <div className={classes.cardTitle}>{'Your Password has successfully been reset.'}</div>
            </SweetAlert>
        );
    };

    const errorAlert = (error) => {
        console.log('ERRROR', error)
        setAlert(
            <SweetAlert
                danger
                onConfirm={() => setAlert(null)}
                confirmBtnCssClass={classes.button + " " + classes.success}
                title={(<div className={classes.cardTitle}>Error</div>)}
            >
                    <div className={classes.cardTitle}>{error.message}</div>
            </SweetAlert>
        );
    };



    return (
        <div className={classes.container} >
            {alert}
            <GridContainer justify="center">

                <GridItem xs={12} sm={8} md={8}>
                    <form className={classes.formStyle}>
                        <Card>
                            <CardHeader>
                               <h3>Reset Password</h3>
                            </CardHeader>
                            <CardBody>
                               
                                <CustomInput
                                    labelText="New Password"
                                    id="password"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={payload.password}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        type: "password",
                                        autoComplete: "off",
                                        onChange: (e)=> {
                                            setPayload({
                                                ...payload,
                                                password: e.target.value
                                            })
                                        }
                                    }}
                                />
                                <CustomInput
                                    labelText="Re-Enter Password to Verify"
                                    id="password2"
                                    value={payload.password2}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        type: "password",
                                        autoComplete: "off",
                                        onChange: (e)=> {
                                            setPayload({
                                                ...payload,
                                                password2: e.target.value
                                            })
                                        }
                                    }}
                                />
                                <GridItem>
                                    <br />
                                </GridItem>

                                <GridItem xs={12} md={12} lg={12}>
                                    <Button disabled={saving} style={{ width: "100%", padding: "20px" }} className={classes.center} color="primary" onClick={handleResetPassword}>
                                        update
                                    </Button>
                                </GridItem>

                            </CardBody>
                        </Card>
                    </form>
                </GridItem>
            </GridContainer>
        </div>
    );
}
