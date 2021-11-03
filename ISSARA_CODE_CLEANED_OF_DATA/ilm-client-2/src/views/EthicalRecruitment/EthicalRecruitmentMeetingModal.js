import React, {useState, useEffect} from "react";

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


export default function EthicalRecruitmentMeetingModal(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const users = useSelector(state => state.usersReducer.items)
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const meetings = useSelector(state => state.ethicalRecruitmentReducer.items)

  const getSupplierName = (id) => {
    const supplier = suppliers.find((element) => {
      return element.id === id
    });
    return supplier? supplier.name : '-'
  }

  const getRecruiterName = (id) => {
    const recruiter = recruiters.find((element) => {
      return element.id === id
    });
    return recruiter? recruiter.name : '-'
  }

  const getIssaraNames = (ids) => {
    let names = []
    const filteredUsers = ids.map(id => {
      return users.find((user) => {
        return user.id === id
      })
    })
    names = filteredUsers.map(item => {
      return item.first_name
    })
    return names.length > 0? names.join(', ') : '-'
  }

  const meeting = meetings[props.value]

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{marginTop: 0}}> {`Ethical Recruitment Meeting #${props.value}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon/>
        </Button>
        {meeting &&
          <div>
            <Divider />
            <h5> General Information: </h5>
            <p> <span className={classes.spanLabel}> Supplier: </span> {getSupplierName(meeting.supplier)} </p>
            <p> <span className={classes.spanLabel}> Supplier Contacts: </span> {meeting.supplier_contacts || '-'} </p>
            <p> <span className={classes.spanLabel}> Recruiter: </span> {getRecruiterName(meeting.recruiter)} </p>
            <p> <span className={classes.spanLabel}> Recruiter Contacts: </span> {meeting.recruiter_contacts || '-'} </p>
            <p> <span className={classes.spanLabel}> Location: </span> {meeting.location || '-'} </p>
            <p> <span className={classes.spanLabel}> Assessment: </span> {meeting.assesment || '-'} </p>
            <p> <span className={classes.spanLabel}> Issara Focal Points: </span> {getIssaraNames(meeting.issara_staff)} </p>
            <Divider />
            <h5> Legal Compliance: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.legal_complience_labour_laws
                + meeting.legal_complience_criminal_laws
                + meeting.legal_complience_recruitment_policies
                ) / 3
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.legal_complience_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.legal_complience_priority_notes}</pre> </div>
            <Divider />
            <h5> Ethical And Professional Conduct: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.professional_conduct_agency
                + meeting.professional_conduct_employer
                + meeting.professional_conduct_agency_capacity
                + meeting.professional_conduct_employer_capacity
                + meeting.professional_conduct_cooperation_efficiency
                ) / 5
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.professional_conduct_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.professional_conduct_priority_notes}</pre> </div>
            <Divider />
            <h5> Free Of Charge Services For Jobseekers And Workers: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.free_of_charge_recruitment_fees
                + meeting.free_of_charge_transparency
                + meeting.free_of_charge_other_fees
                + meeting.free_of_charge_passport_fees
                + meeting.free_of_charge_destination_fees
                ) / 5
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.free_of_charge_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.free_of_charge_priority_notes}</pre> </div>
            <Divider />
            <h5> Transparent Ethical Terms Of Engagement: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.terms_of_engagement_business_information
                + meeting.terms_of_engagement_job_description
                + meeting.terms_of_engagement_recruitment_process
                + meeting.terms_of_engagement_overall_management

                + meeting.terms_of_engagement_complete_job_information
                + meeting.terms_of_engagement_interview_process
                + meeting.terms_of_engagement_medical_checks
                + meeting.terms_of_engagement_contract_terms

                + meeting.terms_of_engagement_original_contract_provision
                + meeting.terms_of_engagement_predeparture_training
                + meeting.terms_of_engagement_predeparture_training_worker_rights
                + meeting.terms_of_engagement_travel_to_workplace
                ) / 12
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.terms_of_engagement_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.terms_of_engagement_priority_notes}</pre> </div>
            <Divider />
            <h5>
            Transparent Wages, Deductions And Benefits: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.wages_deductions_benefits_information
                + meeting.wages_deductions_benefits_predeparture_training
                + meeting.wages_deductions_benefits_multilingualism
                + meeting.wages_deductions_benefits_digitalization
                ) / 4
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.wages_deductions_benefits_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.wages_deductions_benefits_priority_notes}</pre> </div>
            <Divider />
            <h5>
            Healthy, Safe, Exploitation-Free Working And Living Conditions: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.conditions_health_and_safety
                + meeting.conditions_document_control
                + meeting.conditions_workers_housing
                + meeting.conditions_freedom_of_movement
                ) / 4
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.conditions_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.conditions_priority_notes}</pre> </div>
            <Divider />
            <h5>
            Access To Grievance Mechanisms And Remedy Scores: </h5>
            <p> <span className={classes.spanLabel}> Average Score: </span>
              {
                ( meeting.grievance_mechanism_encouragement
                + meeting.grievance_mechanism_punitive_action
                + meeting.grievance_mechanism_credibility
                + meeting.grievance_mechanism_hr_staff
                ) / 4
              }
            </p>
            <div> <span className={classes.spanLabel}> Notes:</span><pre>{meeting.grievance_mechanism_notes}</pre> </div>
            <div> <span className={classes.spanLabel}> Priority Notes:</span><pre>{meeting.grievance_mechanism_priority_notes}</pre> </div>
          </div>
        }
      </div>
    </Modal>
  );
}
