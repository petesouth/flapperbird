import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';


const customStyles = {
  paper: {
    backgroundColor: 'white',
    padding: 20,
    overflow: "auto",
    webkitBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    mozBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    boxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
  },
  modal: {
    display: 'block',
    overflowY: 'auto !important',
    width: '80%',
    height: '90%',
  },
  spanLabel: {
    fontWeight: 500,
  },
  button: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px'
  }
};

const useStyles = makeStyles(customStyles);


export default function KpiLegalViolationModal(props) {
  const classes = useStyles();

  const kpiLegalViolations = useSelector(state => state.kpiLegalViolationTypesReducer.items);
  const kpiLegalViolation = kpiLegalViolations.find(kpi => {return kpi.id === props.value})

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        className={classes.modal + ' modal'}
      >
        <div className={classes.paper}>
          <h3 style={{ marginTop: 0 }}> {`Legal Violation #${props.value}`} </h3>
          <Button
            simple
            color="danger"
            className={classes.button}
            onClick={() => props.onClose()}
          >
            <CloseIcon />
          </Button>
          {kpiLegalViolation &&
            <div>
              <Divider />
              <h5> General: </h5>
              <p> <span className={classes.spanLabel}> Id: </span> {kpiLegalViolation.id || '-'} </p>
              <p> <span className={classes.spanLabel}> Name: </span> {kpiLegalViolation.name || '-'} </p>
              <p> <span className={classes.spanLabel}> Description: </span> {kpiLegalViolation.description || '-'} </p>
            </div>      
         }
        </div>
      </Modal>
    </div>
  );
}
