import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

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


export default function KpiReferenceModal(props) {
  const classes = useStyles();

  const kpis = useSelector(state => state.kpisReducer.kpiitems);
  const kpi = kpis.find(kpi => {return kpi.id === props.value})

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        className={classes.modal + ' modal'}
      >
        <div className={classes.paper}>
          <h3 style={{ marginTop: 0 }}> {`Kpi #${props.value}`} </h3>
          <Button
            simple
            color="danger"
            className={classes.button}
            onClick={() => props.onClose()}
          >
            <CloseIcon />
          </Button>
          {kpi &&
            <div>
              <Divider />
              <h5> General: </h5>
              <p> <span className={classes.spanLabel}> Category: </span> {kpi.kpi_category && kpi.kpi_category.name || '-'} </p>
              <p> <span className={classes.spanLabel}> Description: </span> {kpi.description || '-'} </p>
              <p> <span className={classes.spanLabel}> Level: </span> {kpi.level || '-'} </p>
              <p> <span className={classes.spanLabel}> Goal: </span> {kpi.goal || '-'} </p>
              <Divider />
              <h5> ETI: </h5>
              <p> <span className={classes.spanLabel}> Code: </span> {kpi.eti_base_code && kpi.eti_base_code.name || '-'} </p>
              <p> <span className={classes.spanLabel}> Description: </span> {kpi.eti_base_code && kpi.eti_base_code.sub_description || '-'} </p>
            </div>
          }
        </div>
      </Modal>
    </div>
  );
}
