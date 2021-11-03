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

const customStyles = {
    ...sweetAlertStyles,
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
        paddingTop: "20px"
    },
    container: {
        ...sweetAlertStyles.container,
        textAlign: "center"
    }

};

const useStyles = makeStyles(customStyles);



export default function ChangePasswordForm(props) {

    const dispatch = useDispatch()
    const classes = useStyles();
    const [alert, setAlert] = React.useState(null);

    
    
    const handleChangePassword = () => {

        LoginActions.changePassword(loginStore.getUserID(), payload.old_password, payload.password, payload.password2,
        (resp)=>{
            console.log("changePassword-----------------Resp", resp);
            successAlert();
        }, (error)=>{
            errorAlert({ message: (error.response && error.response.data ) ? error.message + ":" + JSON.stringify(error.response.data) : error.message } );
        });
    }

    // const googleAuthResponse = (resp) => {
    //   LoginActions.loginGoogle(resp);
    // }

    const [payload, setPayload] = useState({
        old_password: "",
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
                }}
                confirmBtnCssClass={classes.button + " " + classes.success}
                title="Well done!"
            >
                {'Password has been successfully changed.'}
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
                title="Error"
            >
                {error.message}
            </SweetAlert>
        );
    };



    return (
        <div className={classes.container} >
            {alert}
            <GridContainer justify="center">

                <GridItem xs={12} sm={8} md={8}>
                    <form>
                        <Card>
                            <CardHeader>
                               <h3>Change Password</h3>
                            </CardHeader>
                            <CardBody>
                                <CustomInput
                                    labelText="Old Password"
                                    id="password"
                                    value={payload.old_password}
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
                                                old_password: e.target.value
                                            })
                                        }
                                    }}
                                />
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
                                    <Button style={{ width: "100%", padding: "20px" }} className={classes.center} color="primary" onClick={handleChangePassword}>
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
