import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import GridContainer from "components/Grid/GridContainer.js";

import GridItem from "components/Grid/GridItem.js";


import Tooltip from '@material-ui/core/Tooltip';

import KpiSelector from "components/ilmdb/KpiSelector.js";


// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';
import { fetchCallById } from "redux/actions/CallActions.js";
import { idText } from "typescript";


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
  },
  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    scroll: "none",
    width: "100%"
  }
};

const useStyles = makeStyles(customStyles);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);



export default function InteractionCallModal(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const dataItem = useSelector((state) => state.workerVoiceCaseCallsReducer.call_item);

  useEffect(() => {
    if (props.open) {
      dispatch(fetchCallById(props.value))
    }
  }, [props]);

  /*
  {
       created: "2020-05-07"
description: "Sending workers to SCC↵A Kyi Lay, TUS Burmese translator, informed that TUS is planning to move 200 workers, both Thai and Myanmar (not sure about Cambodian workers), to SCC PERMANENTLY. He heard it from an internal meeting. TUS is scheduling a meeting with the workers tomorrow morning to make the announcement of moving workers to SCC. Many workers from TUS overheard about this news as well worrying that they have to go. We received a message about the same concern of having to move to SCC via Facebook messenger. She said do we really have to go to another factory as a MOU worker who signed the MOU contract to work at TUS. Most of them are MOU workers coming by International Focus. ↵A Kyee Lay said he will update us once the meeting is over tomorrow. He doesn’t want us to inform the Business yet as he might get targeted. He also said some HR staff know he has been informant to Issara. ↵↵Transportation service for emergency needs↵↵Our informant reports that there is no driver available on Sunday for the workers who urgently need to go to hospital. E.g: women to delivery baby. Three cars are available parking at the factory. But they are useless without driver. He wants Issara to talk to the business."
destination_recruiter_name: null
id: 8443
issara_user: "brendan@issarainstitute.org"
issue_category_name: "Labour trafficking, exploitation, and labour-related issues"
kpi_description: "Issues with transportation to workplace"
kpi_level: 2
last_modified: "2020-05-07"
source_recruiter_name: "International Focus General Services Co., Ltd"
supplier_name: "Thai Union Seafood Songkhla (TUS)"
__proto__: Object
      }*/

  let lastInteraction = (dataItem && dataItem.case_interactions !== undefined &&
    dataItem.case_interactions !== null &&
    dataItem.case_interactions.length > 0) ? dataItem.case_interactions[dataItem.case_interactions.length - 1] : {};
  return (

    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      {dataItem?
        <div className={classes.paper}>
          <h3 style={{ marginTop: 0 }}> {`Case ID: ${dataItem.id}`} </h3>
          <Button
            simple
            color="danger"
            className={classes.button}
            onClick={() => props.onClose()}
          >
            <CloseIcon />
          </Button>
          <Divider />
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> Required: </h4>
              <p> <span className={classes.spanLabel}>Id:</span> {dataItem.id} </p>
              <p> <span className={classes.spanLabel}>Supplier:</span> {(dataItem.supplier === null || dataItem.supplier === undefined) ? "" : dataItem.supplier.name} </p>
              <p> <span className={classes.spanLabel}>Country:</span> {(dataItem.country === null || dataItem.country === undefined) ? "" : dataItem.country.name} </p>
              <p> <span className={classes.spanLabel}>Province:</span> {(dataItem.province === null || dataItem.province === undefined) ? "" : dataItem.province.name} </p>
              <p> <span className={classes.spanLabel}>District:</span> {(dataItem.district === null || dataItem.district === undefined) ? "" : dataItem.district.name} </p>
              <p> <span className={classes.spanLabel}>Nationality:</span> {(dataItem.client_nationality === null || dataItem.client_nationality === undefined) ? "" : dataItem.client_nationality.name} </p>
              <p> <span className={classes.spanLabel}>Ethnicity:</span> {(dataItem.client_ethnicity === null || dataItem.client_ethnicity === undefined) ? "" : dataItem.client_ethnicity.name} </p>
              <p> <span className={classes.spanLabel}>Case/Call Type:</span> {(dataItem.case_category === null || dataItem.case_category === undefined ) ? "" : dataItem.case_category.name} </p>
              <p> <span className={classes.spanLabel}>Client Type:</span> {(dataItem.client_type === null || dataItem.client_type === undefined ) ? "" : dataItem.client_type.name} </p>
              <p> <span className={classes.spanLabel}>Client Status:</span> {(dataItem.client_status === null || dataItem.client_status === undefined ) ? "" : dataItem.client_status.name} </p>

            </GridItem>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h5> Call Info: </h5>
              <p> <span className={classes.spanLabel}>Issara Staff:</span> {(lastInteraction.issara_staff === null || lastInteraction.issara_staff === undefined) ? "" : lastInteraction.issara_staff.email} </p>
              <p> <span className={classes.spanLabel}>Interaction Channel:</span> {(lastInteraction.interaction_channel === null || lastInteraction.interaction_channel === undefined) ? "" : lastInteraction.interaction_channel.name} </p>
              <p> <span className={classes.spanLabel}>Interaction Reason:</span> {(lastInteraction.interaction_reason === null || lastInteraction.interaction_reason === undefined) ? "" : lastInteraction.interaction_reason.name} </p>
              <p> <span className={classes.spanLabel}>Interaction Summary:</span>
              <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}> {lastInteraction.summary}</p></p>
              <p> <span className={classes.spanLabel}>Inquiry Type:</span> {lastInteraction.type} </p>
              <p> <span className={classes.spanLabel}>Interacted Date:</span> {lastInteraction.interacted} </p>
              <p> <span className={classes.spanLabel}>Call Created Date:</span> {lastInteraction.created} </p>
              <p> <span className={classes.spanLabel}>Call Last Modified Date:</span> {lastInteraction.last_modified} </p>


            </GridItem>

            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h5> Client Info: </h5>
              <p> <span className={classes.spanLabel}>Nickname:</span> {dataItem.client_nickname} </p>
              <p> <span className={classes.spanLabel}>Line Account:</span> {dataItem.client_line_account} </p>
              <p> <span className={classes.spanLabel}>Facebook Account:</span> {dataItem.client_facebook_account} </p>
              <p> <span className={classes.spanLabel}>Phone Number:</span> {dataItem.client_phonenumber} </p>
              <p> <span className={classes.spanLabel}>Viber Account:</span> {dataItem.client_viber_account} </p>
              <p> <span className={classes.spanLabel}>Gender:</span> {(dataItem.client_gender === null || dataItem.client_gender === undefined ) ? "" : dataItem.client_gender.name} </p>

              <p> <span className={classes.spanLabel}>Staff Notes/Description:</span> <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
                {dataItem.description}</p></p>

              <p> <span className={classes.spanLabel}>Origin Country:</span> {(dataItem.client_origin_country === null || dataItem.client_origin_country === undefined) ? "" : dataItem.client_origin_country.name} </p>
              <p> <span className={classes.spanLabel}>Origin Province:</span> {(dataItem.client_origin_province === null || dataItem.client_origin_province === undefined) ? "" : dataItem.client_origin_province.name} </p>
              <p> <span className={classes.spanLabel}>Origin District:</span> {(dataItem.client_origin_district === null || dataItem.client_origin_district === undefined) ? "" : dataItem.client_origin_district.name} </p>

              <p> <span className={classes.spanLabel}>Crossing Country:</span> {(dataItem.client_crossing_country === null || dataItem.client_crossing_country === undefined) ? "" : dataItem.client_crossing_country.name} </p>
              <p> <span className={classes.spanLabel}>Crossing Province:</span> {(dataItem.client_crossing_province === null || dataItem.client_crossing_province === undefined) ? "" : dataItem.client_crossing_province.name} </p>
              <p> <span className={classes.spanLabel}>Crossing District:</span> {(dataItem.client_crossing_district === null || dataItem.client_crossing_district === undefined) ? "" : dataItem.client_crossing_district.name} </p>


            </GridItem>

            <GridItem  xs={12} sm={12} md={6} lg={6}>
              <h5>Recruitment</h5>
              <p> <span className={classes.spanLabel}>Upstream Broker:</span> {dataItem.source_upstream_broker} </p>
              <p> <span className={classes.spanLabel}>Employer Debt Bondage:</span> {dataItem.debt_bondage} </p>
              <p> <span className={classes.spanLabel}>Employer Debt Bondage Detail:</span> <p style={{ overflow: "overflow-wrap" }}>
                {dataItem.debt_bondage_detail} </p></p>
              <p> <span className={classes.spanLabel}>Broker Debt Bondage:</span> {dataItem.debt_bondage_broker} </p>
              <p> <span className={classes.spanLabel}>Broker Debt Bondage Detail:</span> <p style={{ overflow: "overflow-wrap" }}>
                {dataItem.debt_bondage_detail_broker} </p></p>
              <p> <span className={classes.spanLabel}>Months at job:</span> {dataItem.client_time_at_job} </p>

              <p> <span className={classes.spanLabel}>Contract Type:</span> {(dataItem.client_contract_type === null || dataItem.client_contract_type === undefined ) ? "" : dataItem.client_contract_type.name} </p>
              <p> <span className={classes.spanLabel}>Document Type:</span> {(dataItem.client_document_type === null || dataItem.client_document_type === undefined ) ? "" : dataItem.client_document_type.name} </p>

              <p> <span className={classes.spanLabel}>Source Recruiter:</span> {(dataItem.source_recruiter === null || dataItem.source_recruiter === undefined) ? "" : dataItem.source_recruiter.name} </p>
              <p> <span className={classes.spanLabel}>Destination Recruiter:</span> {(dataItem.destination_recruiter === null || dataItem.destination_recruiter === undefined) ? "" : dataItem.destination_recruiter.name} </p>

              <p><br /></p>

              <h5>Ratings</h5>
              <p> <span className={classes.spanLabel}>Source Broker Rating:</span> {dataItem.rating_source_broker} </p>
              <p> <span className={classes.spanLabel}>Source Recruiter Rating:</span> {dataItem.rating_source_recruiter} </p>
              <p> <span className={classes.spanLabel}>Destination Broker Rating:</span> {dataItem.rating_dest_recruiter} </p>
              <p> <span className={classes.spanLabel}>Destination Employer Rating:</span> {dataItem.rating_dest_employer} </p>
            </GridItem>

            <GridItem xs={12} sm={12} lg={12}>
              <h5>Client Support</h5>
              <p> <span className={classes.spanLabel}>Vot Needs:</span> <p style={{ overflow: "overflow-wrap" }}>
                {dataItem.vot_needs}</p> </p>
              <p> <span className={classes.spanLabel}>Share Info Consent:</span> {dataItem.client_share_info_consent} </p>
              <p> <span className={classes.spanLabel}>Referral Notes:</span> 
              <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
                {dataItem.referral_notes} </p></p>
              <p> <span className={classes.spanLabel}>Next Steps:</span> <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
                {dataItem.next_steps} </p></p>
              <p> <span className={classes.spanLabel}>Next Steps Issara Staff:</span> 
              <p style={{ overflow: "overflow-wrap" }}>
                {(dataItem.next_steps_issara_staff === null || dataItem.next_steps_issara_staff === undefined) ? "" : dataItem.next_steps_issara_staff.email} </p></p>
              <p> <span className={classes.spanLabel}>Referral Action:</span> <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
                {(dataItem.referral_action === null || dataItem.referral_action === undefined ) ? "" : dataItem.referral_action.name} </p></p>
              <p> <span className={classes.spanLabel}>Dead Line Date:</span> {dataItem.dead_line_date} </p>
              <p> <span className={classes.spanLabel}>Final Remarks:</span> <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
                {dataItem.final_remarks} </p></p>
                <p> <span className={classes.spanLabel}>Risk Assessment:</span> <p style={{ overflow: "overflow-wrap" }}>
                {dataItem.risk_assessment} </p></p>

            </GridItem>

            <GridItem xs={12} sm={12} lg={12}>
              <h5>Issues</h5>
              <p className={classes.preBlock}> <span className={classes.spanLabel}>Description:</span> {dataItem.issue_description} </p>
              <p className={classes.preBlock}> <span className={classes.spanLabel}>Offender Description:</span> {dataItem.issue_offender_description} </p>
              <p> <span className={classes.spanLabel}>Workers Affected:</span> {dataItem.issue_workers_affected} </p>
              <p className={classes.preBlock}> <span className={classes.spanLabel}>Workers Affected Description:</span> 
              <p style={{ overflow: "overflow-wrap" }}>{dataItem.issue_workers_affected_description} </p></p>
              <p> <span className={classes.spanLabel}>Getting Better:</span> {dataItem.issue_getting_better} </p>
              <p className={classes.preBlock}> <span className={classes.spanLabel}>Getting Better Description:</span> <p style={{ overflow: "overflow-wrap" }}>{dataItem.issue_getting_better_description}</p> </p>
              <p> <span className={classes.spanLabel}>Issue Category:</span> {(dataItem.issue_category === null || dataItem.issue_category === undefined) ? "" : dataItem.issue_category.name} </p>


              {(dataItem.kpis !== undefined &&
                dataItem.kpis !== null &&
                Array.isArray(dataItem.kpis) === true &&
                dataItem.kpis.length > 0) ? (<KpiSelector
                  issueCategory={(dataItem.issue_category === null || dataItem.issue_category === undefined ) ? 1 : dataItem.issue_category.id}
                  selectedKpis={(() => {
                    let selectedKpis = {};

                    dataItem.kpis.forEach((kpi) => {
                      if( kpi === undefined || kpi === null || kpi.kpi_category === undefined || kpi.kpi_category === null ) {
                        return;
                      }

                      if (selectedKpis[kpi.kpi_category.id] === undefined || selectedKpis[kpi.kpi_category.id] === null) {
                        selectedKpis[kpi.kpi_category.id] = new Array();
                      }
                      selectedKpis[kpi.kpi_category.id].push(kpi.id);
                    });
                    return selectedKpis;

                  })()}
                  displayOnlyMode={true}
                />) : (null)}


            </GridItem>


          </GridContainer>

        </div>
        :
        <p> Loading ... </p>
      }

    </Modal>
  );
}
