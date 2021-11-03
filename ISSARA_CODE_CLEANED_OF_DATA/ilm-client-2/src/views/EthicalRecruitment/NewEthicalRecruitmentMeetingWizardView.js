import React, {useState, useEffect} from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Wizard from "components/Wizard/Wizard.js";

// Tabs
import GeneralInformationFields from "./WizardSteps/GeneralInformationFields.js";
import LegalComplianceFields from "./WizardSteps/LegalComplianceFields.js";
import EthicalProfessionalConductFields from "./WizardSteps/EthicalProfessionalConductFields.js";
import FreeOfChargeServicesFields from "./WizardSteps/FreeOfChargeServicesFields.js";
import TermsOfEngagementFields from "./WizardSteps/TermsOfEngagementFields.js";
import TransparentWagesFields from "./WizardSteps/TransparentWagesFields.js";
import WorkingLivingConditionsFields from "./WizardSteps/WorkingLivingConditionsFields.js";
import GrievanceMechanismFields from "./WizardSteps/GrievanceMechanismFields.js";

import { fetchEthicalRecruitmentMeetings, createEthicalRecruitmentMeeting, updateEthicalRecruitmentMeeting } from "../../redux/actions/EthicalRecruitmentActions";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const customStyles = {
  ...sweetAlertStyles,
};

const useStyles = makeStyles(customStyles);


export default function EthicalRecruitmentMeetingForm(props) {
  const dispatch = useDispatch()
  const classes = useStyles();

  const meetings = useSelector(state => state.ethicalRecruitmentReducer.items)
  const savingMeeting = useSelector(state => state.ethicalRecruitmentReducer.saving)
  const [alert, setAlert] = useState(null)

  const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited meeting
  const [editedMeeting, setEditedMeeting] = useState(null)

  useEffect(() => {
    // Fetch meetings
    if (Object.keys(meetings).length === 0) {
      dispatch(fetchEthicalRecruitmentMeetings())
    }
    if (Object.keys(meetings).length > 0 && id) {
      meetings[id] && setEditedMeeting(meetings[id])
    }
  }, [meetings]);

  const submitForm = (allData) => {
    const payload = {
      ...allData.generalInformation,
      ...allData.legalCompliance,
      ...allData.ethicalProfessionalConduct,
      ...allData.freeOfChargeServices,
      ...allData.termsOfEngagement,
      ...allData.transparentWages,
      ...allData.workingLivingConditions,
      ...allData.grievanceMechanism,
    }

    if (editedMeeting && editedMeeting.createdBy) {
      payload['createdBy'] = editedMeeting.createdBy
    }

    // Update existing meeting if we got ID from URL query otherwise create new
    if (id) {
      dispatch(updateEthicalRecruitmentMeeting(id, payload, successAlert, errorAlert))
    }
    else {
      dispatch(createEthicalRecruitmentMeeting(payload, successAlert, errorAlert))
    }
  }

  const handleConfirmSuccessAlert = () => {
    props.history.push('/admin/ethical-recruitment-meetings')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id? 'Meeting was updated' : 'New meeting has been successfully created'}
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


  return (
    <div>
      {alert}
      <Wizard
        validate
        steps={[
          {
            stepName: "General Information",
            stepComponent: GeneralInformationFields,
            stepId: "generalInformation",
            globalEditData: editedMeeting
          },
          {
            stepName: "Legal Compliance",
            stepComponent: LegalComplianceFields,
            stepId: "legalCompliance",
            globalEditData: editedMeeting
          },
          {
            stepName: "Ethical And Professional Conduct",
            stepComponent: EthicalProfessionalConductFields,
            stepId: "ethicalProfessionalConduct",
            globalEditData: editedMeeting
          },
          {
            stepName: "Free-of-Charge Services to Jobseekers and Workers",
            stepComponent: FreeOfChargeServicesFields,
            stepId: "freeOfChargeServices",
            globalEditData: editedMeeting
          },
          {
            stepName: "Transparent, Ethical Terms of Engagement",
            stepComponent: TermsOfEngagementFields,
            stepId: "termsOfEngagement",
            globalEditData: editedMeeting
          },
          {
            stepName: "Transparent Wages, Deductions and Benefits",
            stepComponent: TransparentWagesFields,
            stepId: "transparentWages",
            globalEditData: editedMeeting
          },
          {
            stepName: "Healthy, Safe, Exploitation-Free Working and Living Conditions",
            stepComponent: WorkingLivingConditionsFields,
            stepId: "workingLivingConditions",
            globalEditData: editedMeeting
          },
          {
            stepName: "Access to Grievance Mechanisms and Remedy Scores",
            stepComponent: GrievanceMechanismFields,
            stepId: "grievanceMechanism",
            globalEditData: editedMeeting
          },
        ]}
        title="Edit/Add Ethical Recruitment Meeting"
        subtitle=""
        finishButtonEnabled={!savingMeeting}
        finishButtonText={"Save"}
        finishButtonClick={
          allData => { submitForm(allData) }
        }
      />
    </div>
  )
}
