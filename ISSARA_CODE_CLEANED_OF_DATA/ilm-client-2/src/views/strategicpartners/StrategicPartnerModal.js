import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';


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
    overflowY: 'auto !important',
    maxWidth: '700px',
    height: '100%',
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

export default function StrategicPartnerModal(props) {
  const classes = useStyles();

  const countries = useSelector(state => state.countriesReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)

  const getStrategicPartner = (id) => {
    return strategicPartners.find(strategicPartner => {
      return strategicPartner.id === parseInt(id)
    })
  }

  const getCountryName = (id) => {
    const country = countries.find((country) => {
      return country.id === id
    });
    return country? country.name : '-'
  }

  const strategicPartner = getStrategicPartner(props.value)

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{marginTop: 0}}> {`${strategicPartner && strategicPartner.name || '-'}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon/>
        </Button>
        <p> <span className={classes.spanLabel}> Email Notify: </span> {"" + (strategicPartner && strategicPartner.email_notify || '-')} </p>
        <p> <span className={classes.spanLabel}> Country: </span> {strategicPartner && getCountryName(strategicPartner.country)} </p>
        <p> <span className={classes.spanLabel}> Address: </span> {strategicPartner && strategicPartner.address || '-'} </p>
        <p> <span className={classes.spanLabel}> Zipcode: </span> {strategicPartner && strategicPartner.zipcode || '-'} </p>
        <p> <span className={classes.spanLabel}> Focal Point Name: </span> {strategicPartner && strategicPartner.focal_point_name || '-'} </p>
        <p> <span className={classes.spanLabel}> Focal Point Title: </span> {strategicPartner && strategicPartner.focal_point_title || '-'} </p>
        <p> <span className={classes.spanLabel}> Focal Point Email: </span> {strategicPartner && strategicPartner.focal_point_email || '-'} </p>
        <p> <span className={classes.spanLabel}> Focal Phone Number: </span> {strategicPartner && strategicPartner.focal_point_phone_number || '-'} </p>
        <div> <span className={classes.spanLabel}> Products Sourced: </span><pre>{strategicPartner && strategicPartner.products_sourced || '-'}</pre></div>
        <p> <span className={classes.spanLabel}> Contract Start Date: </span> {strategicPartner && strategicPartner.contract_start_date && new Date(strategicPartner.contract_start_date).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}> Contract End Date: </span> {strategicPartner && strategicPartner.contract_end_date && new Date(strategicPartner.contract_end_date).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}> Payment Amount: </span> {strategicPartner && strategicPartner.payment_amount || '-'} </p>
        <p> <span className={classes.spanLabel}> Payment Receipt Date: </span> {strategicPartner && strategicPartner.payment_receipt_date && new Date(strategicPartner.payment_receipt_date).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}> Last Annual Risk Report: </span> {strategicPartner && strategicPartner.date_last_annual_risk_report && new Date(strategicPartner.date_last_annual_risk_report).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}> Last Call Meeting Visit: </span> {strategicPartner && strategicPartner.date_last_call_meeting_visit && new Date(strategicPartner.date_last_call_meeting_visit).toDateString() || '-'} </p>
      </div>
    </Modal>
  );
}
