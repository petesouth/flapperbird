






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



export default function ForgotPasswordView(props) {

    const dispatch = useDispatch();
    
    const token = useParams();
    const classes = useStyles();
    const [alert, setAlert] = React.useState(null);

    const [saving, setSaving] = React.useState(false);
    
    const handleResetPassword = () => {
        if(payload.email === null || payload.email === undefined || payload.email === "" ) {
          errorAlert( { message: "You must type in a username before trying to get a password reset link."});
          return;
        } 

        setSaving(true);


        LoginActions.requestResetPassword(payload.email,
        (resp)=>{
            console.log("resetPassword-----------------Resp", resp);
            successAlert();
        }, (error, resp)=>{
            setSaving(false);
            let errorMessage = error.message + ((error && error.response && error.response.data && error.response.data.email !== undefined) ? (" " + error.response.data.email) : "");

            errorAlert({ message: errorMessage });
        });
    }

    // const googleAuthResponse = (resp) => {
    //   LoginActions.loginGoogle(resp);
    // }

    const [payload, setPayload] = useState({
        email: ""
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
                 <div className={classes.cardTitle}>{'A reset link has been sent to your email'}</div>
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
                                    labelText="User Name"
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={payload.email}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        type: "text",
                                        autoComplete: "off",
                                        onChange: (e)=> {
                                            setPayload({
                                                ...payload,
                                                email: e.target.value
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

/*
// import built-in modules
import React, { useState } from "react";
import PropTypes from 'prop-types';

// Imoprt third-party modules
import axios from 'axios';
import { Button, Modal, Form, Input, message } from 'antd';

// Import styles
import styles from './ForgotPasswordModal.module.css';


export default function ForgotPasswordModal(props, context) {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onFinish = (values) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API_BASE_URLL}/api-auth-user/password-reset/`, values).then(res => {
      props.onCancel();
      message.success(context.t(`Password reset link was successfully sent to {email}. Please check your inbox.`, {email: values.email}), 10)
    })
    .catch(error => {
      if (error.response) {
        setError(error.response.data.email[0])
      } else if (error.request) {
        setError(error.request)
      } else {
        setError(error.message)
      }
    }).finally(() => {
      setLoading(false)
      setTimeout(() => setError(null), 6000)
    })
  };

  return (
    <Modal
      title={context.t('Reset your password')}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
        name="register"
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item
          name="email"
          label={context.t('Email')}
          initialValue={props.prepopulatedEmail}
          rules={[
            {
              type: 'email',
              message: context.t('The input is not valid Email'),
            },
            {
              required: true,
              message: context.t('Please input your Email'),
            },
          ]}
          {...error && {
              help: error,
              validateStatus: 'error',
          }}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item style={{marginBottom: '0.5rem'}}>
          <Button
            type="primary"
            htmlType="submit"
            style={{width: '100%', marginTop: '0.5rem'}}
            loading={loading}
          >
            {context.t('Send reset link')}
          </Button>
        </Form.Item>
        <p className={styles.helpText}>
          {context.t('We will send password reset link to this email address, please change your password within 24 hours.')}
        </p>
      </Form>
    </Modal>
  )
}

ForgotPasswordModal.contextTypes = {
  t: PropTypes.func.isRequired
}
*/