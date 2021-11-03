import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import GridContainer from "components/Grid/GridContainer.js";

import GridItem from "components/Grid/GridItem.js";

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

 


  const recruiters = useSelector(state => state.recruitersReducer.items)
  const recruiterCRCList = useSelector(state => state.recruiterCRCReducer.items);
  
  const getRecruiter = (id) => {
    return recruiters.find(recruiter => {
      return recruiter.id === parseInt(id)
    })
  }

  const getRecruiterCRC = (id) => {
    return recruiterCRCList.find(recruiterCrc => {
      return recruiterCrc.id === parseInt(id)
    })
  }

  let recruiterCRC = getRecruiterCRC(props.value);
  if( ! recruiterCRC ) {
    recruiterCRC = {};
  }

  let recruiter = getRecruiter(recruiterCRC.recruiter);
  if( ! recruiter ) {
    recruiter = {};
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> Recruiter CRC: {`${recruiterCRC && recruiterCRC.id || '-'}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <GridContainer>
          <GridItem>
            <br />
          </GridItem>

          <GridContainer>

            <GridItem xs={12} sm={12} lg={12}>
              <h4> General: </h4>
              <p> <span className={classes.spanLabel}> Recruiter: </span> {recruiter && recruiter.name || '-'} </p>
              <p> <span className={classes.spanLabel}> created_at: </span> {recruiterCRC && recruiterCRC.created_at || '-'} </p>
            </GridItem>
            
          </GridContainer>
          
          <GridContainer>
            <GridItem xs={12} sm={12} lg={12}>
              <h4> Scores: </h4>
              <p> <span className={classes.spanLabel}> Avg Worker Response Feedback: </span> {recruiterCRC && recruiterCRC.avg_worker_response_feedback || '-'} </p>
              <p> <span className={classes.spanLabel}> Avg Worker Recruitment Mngmt Feedback: </span> {recruiterCRC && recruiterCRC.avg_worker_recruitment_mngmt_feedback || '-'} </p>
              <p> <span className={classes.spanLabel}> Issara Tech Assessment Rresponse Quality hr: </span> {recruiterCRC && recruiterCRC.issara_tech_assessment_response_quality_hr || '-'} </p>
              <p> <span className={classes.spanLabel}> Issara Tech Assessment Response Quality Production: </span> {recruiterCRC && recruiterCRC.issara_tech_assessment_response_quality_production || '-'} </p>
              <p> <span className={classes.spanLabel}> Duration of Time_taken to Respond: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Duration of Time_taken to Revert On Action Plan: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Duration of Time_taken to Resolve Issues: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Site Cooperation With Ethicall Distribution: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Business Attitude Toward Suggested Remedies: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Business Attitude Toward Capacity and Risks: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Business Attitude Toward Promoting Worker Voice: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Business Attitude Toward Worker Treatment: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
              <p> <span className={classes.spanLabel}> Business Attitude Toward Issara: </span> {recruiterCRC && recruiterCRC.duration_of_time_taken_to_respond || '-'} </p>
            </GridItem>
            <GridItem xs={12} sm={12} lg={12}>
              <h4> Comments: </h4>
            
              <p> <span className={classes.spanLabel}> Response Quality Comments: </span> {recruiterCRC && recruiterCRC.response_quality_comments || '-'} </p>
              <p> <span className={classes.spanLabel}> Response Timeliness Comments: </span> {recruiterCRC && recruiterCRC.response_timeliness_comments || '-'} </p>
              <p> <span className={classes.spanLabel}> Response Openness Comments: </span> {recruiterCRC && recruiterCRC.response_openness_comments || '-'} </p>
            </GridItem>

          </GridContainer>

        </GridContainer>
      </div>
    </Modal>
  );
}
