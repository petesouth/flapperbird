import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";


import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import QualityOfResponseForm from "../suppliers/crc/QualityOfResponseForm.js";
import TimelinessOfResponseForm from "../suppliers/crc/TimelinessOfResponseForm.js";
import OpennessToReformForm from "../suppliers/crc/OpennessToReformForm.js";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { createBhrRecruiterCRCResponse, updateBhrRecruiterCRCResponse } from "../../redux/actions/BhrResponseActions";


import { fetchRecruiterCRCs } from "../../redux/actions/RecruiterActions";
import Utils from "services/utils";

const customStyles = {
  ...sweetAlertStyles,
};

const useStyles = makeStyles(customStyles);


export default function RecruiterCRCResponseForm(props) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const recruiterCRCList = useSelector(state => state.recruiterCRCReducer.items);
  const fetchingRecruiterCRCS = useSelector(state => state.recruitersReducer.fetchingRecruiterCRCS)

  const id = (props.location) ? new URLSearchParams(props.location.search).get('id') : null; // id from query string of edited strategic partner


  const [recruiter, setRecruiter] = useState(null);
  const [alert, setAlert] = useState(null)

  const [preLoadedItem, setPreloadedItem] = useState(null);

  const handleConfirmSuccessAlert = () => {

    props.history.push('/admin/recruitercrclist')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Recruiter was updated' : 'Recruiter has been successfully created'}
      </SweetAlert>
    );

  };

  const errorAlert = (error) => {
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

  const handleSubmit = (allData) => {

    // Calculate average value to assign N/A
    const qualityOfResponse = Object.values(allData.qualityofresponse).filter(item => { return item > 0 })
    let qualityOfResponseNaValue = Math.round(qualityOfResponse.reduce((a, b) => a + b, 0) / qualityOfResponse.length)
    qualityOfResponseNaValue = qualityOfResponseNaValue ? qualityOfResponseNaValue : null

    const timelinessOfResponse = Object.values(allData.timelinessofresponse).filter(item => { return item > 0 })
    let timelinessOfResponseNaValue = Math.round(timelinessOfResponse.reduce((a, b) => a + b, 0) / timelinessOfResponse.length)
    timelinessOfResponseNaValue = timelinessOfResponseNaValue ? timelinessOfResponseNaValue : null

    const opennessToReform = Object.values(allData.opennesstoreform).filter(item => { return item > 0 })
    let opennessToReformNaValue = Math.round(opennessToReform.reduce((a, b) => a + b, 0) / opennessToReform.length)
    opennessToReformNaValue = opennessToReformNaValue ? opennessToReformNaValue : null

    const payload = {
      recruiter: recruiter,
      avg_worker_response_feedback: allData.qualityofresponse.avg_worker_response_feedback > 0 ? allData.qualityofresponse.avg_worker_response_feedback : qualityOfResponseNaValue,
      avg_worker_recruitment_mngmt_feedback: allData.qualityofresponse.avg_worker_recruitment_mngmt_feedback > 0 ? allData.qualityofresponse.avg_worker_recruitment_mngmt_feedback : qualityOfResponseNaValue,
      issara_tech_assessment_response_quality_hr: allData.qualityofresponse.issara_tech_assessment_response_quality_hr > 0 ? allData.qualityofresponse.issara_tech_assessment_response_quality_hr : qualityOfResponseNaValue,
      issara_tech_assessment_response_quality_production: allData.qualityofresponse.issara_tech_assessment_response_quality_production > 0 ? allData.qualityofresponse.issara_tech_assessment_response_quality_production : qualityOfResponseNaValue,
      issara_tech_assessment_response_quality_sr_mngmt: allData.qualityofresponse.issara_tech_assessment_response_quality_sr_mngmt > 0 ? allData.qualityofresponse.issara_tech_assessment_response_quality_sr_mngmt : qualityOfResponseNaValue,
      response_quality_comments: allData.qualityofresponse.response_quality_comments,

      duration_of_time_taken_to_respond: allData.timelinessofresponse.duration_of_time_taken_to_respond > 0 ? allData.timelinessofresponse.duration_of_time_taken_to_respond : timelinessOfResponseNaValue,
      duration_of_time_taken_to_revert_on_action_plan: allData.timelinessofresponse.duration_of_time_taken_to_revert_on_action_plan > 0 ? allData.timelinessofresponse.duration_of_time_taken_to_revert_on_action_plan : timelinessOfResponseNaValue,
      duration_of_time_taken_to_resolve_issues: allData.timelinessofresponse.duration_of_time_taken_to_resolve_issues > 0 ? allData.timelinessofresponse.duration_of_time_taken_to_resolve_issues : timelinessOfResponseNaValue,
      response_timeliness_comments: allData.timelinessofresponse.response_timeliness_comments,

      site_cooperation_with_ethicall_distribution: allData.opennesstoreform.site_cooperation_with_ethicall_distribution > 0 ? allData.opennesstoreform.site_cooperation_with_ethicall_distribution : opennessToReformNaValue,
      business_attitude_toward_suggested_remedies: allData.opennesstoreform.business_attitude_toward_suggested_remedies > 0 ? allData.opennesstoreform.business_attitude_toward_suggested_remedies : opennessToReformNaValue,
      business_attitude_toward_capacity_and_risks: allData.opennesstoreform.business_attitude_toward_capacity_and_risks > 0 ? allData.opennesstoreform.business_attitude_toward_capacity_and_risks : opennessToReformNaValue,
      business_attitude_toward_promoting_worker_voice: allData.opennesstoreform.business_attitude_toward_promoting_worker_voice > 0 ? allData.opennesstoreform.business_attitude_toward_promoting_worker_voice : opennessToReformNaValue,
      business_attitude_toward_worker_treatment: allData.opennesstoreform.business_attitude_toward_worker_treatment > 0 ? allData.opennesstoreform.business_attitude_toward_worker_treatment : opennessToReformNaValue,
      business_attitude_toward_issara: allData.opennesstoreform.business_attitude_toward_issara > 0 ? allData.opennesstoreform.business_attitude_toward_issara : opennessToReformNaValue,
      response_openness_comments: allData.opennesstoreform.response_openness_comments,
    }

    if( preLoadedItem !== null && preLoadedItem.id ) {
      payload.id = preLoadedItem.id;
      dispatch(updateBhrRecruiterCRCResponse(preLoadedItem.id, payload, successAlert, errorAlert));
      
    } else {
      dispatch(createBhrRecruiterCRCResponse(payload, successAlert, errorAlert));
    }
    
  }


  useEffect(() => {
    // Fetch strategic partners
    dispatch(fetchRecruiterCRCs())
  }, []);

  useEffect(() => {

    if (recruiterCRCList && recruiterCRCList.length > 0 && id) {
      const recruiterCRC = recruiterCRCList.filter(item => { return item.id == id })[0]

      if (recruiterCRC) {
        setPreloadedItem(recruiterCRC);
        setRecruiter(recruiterCRC.recruiter);
      }
    }
  }, [recruiterCRCList]);

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>{"Edit/Add CRC: " + ((preLoadedItem && preLoadedItem.id) ? preLoadedItem.id : "")}</h4>
          </CardHeader>
          <CardBody>
            <GridItem>
              <RecruitersDropdown value={recruiter} onSelect={(recruiter) => setRecruiter(recruiter)} />
            </GridItem>
            <GridItem>
              <Wizard
                key={Utils.giveMeGuid()}
                validate
                steps={[
                  { stepName: "Quality Of Response", stepComponent: QualityOfResponseForm, stepId: "qualityofresponse", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null},
                  { stepName: "Timeliness Of Response", stepComponent: TimelinessOfResponseForm, stepId: "timelinessofresponse", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null },
                  { stepName: "Openness To Reform", stepComponent: OpennessToReformForm, stepId: "opennesstoreform", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null }

                ]}
                title=""
                subtitle=""
                //style={{width: "100%"}}
                finishButtonEnabled={true}
                finishButtonClick={allData => handleSubmit(allData)}
              />
            </GridItem>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
