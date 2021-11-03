import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import GridContainer from "components/Grid/GridContainer.js";

import GridItem from "components/Grid/GridItem.js";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';

import RecruiterList from "./RecruiterList";

const customStyles = {
  paper: {
    backgroundColor: 'white',
    padding: 30,
    webkitBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    mozBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    boxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
  },
  modal: {
    display: 'block',
    maxWidth: '70%',
    height: '100%',
    overflowWrap: "break-word",
    overflowY: "auto;",
    overflowX: "none;",
    paddingBottom: "20px"
  },
  spanLabel: {
    fontWeight: 500,
  },
  button: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px',
    scrollbars: "none"
  }
};

const useStyles = makeStyles(customStyles);

export default function (props) {
  const classes = useStyles();


  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> Existing Recruiters </h3>
       <RecruiterList inlinePanel={true} />
      </div>
    </Modal>
  );
}
