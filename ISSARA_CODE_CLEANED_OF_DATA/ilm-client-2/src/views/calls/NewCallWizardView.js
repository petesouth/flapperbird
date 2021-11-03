
import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.js";


// Tabs
import RequiredCallFields from "./WizardSteps/RequiredCallFields.js";
import CallClientInfoFields from "./WizardSteps/CallClientInfoFields.js";
import CallInfoFields from "./WizardSteps/CallInfoFields.js";
import EmploymentFields from "./WizardSteps/EmploymentFields.js";
import RecruiterFields from "./WizardSteps/RecruiterFields.js";
import CallIssues from "./WizardSteps/CallIssues.js";
import CallActionFields from "./WizardSteps/CallActionFields.js";
import CaseInteractions from "./WizardSteps/CaseInteractions.js";


import utils from "services/utils.js";
import moment from "moment";




const valueEmpty = " ";

class NewCallWizardView extends React.Component {

  constructor(props) {
    super(props);


    let steps = [
      {
        stepName: "Required",
        stepComponent: RequiredCallFields,
        stepId: "required",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.required
      },

      {
        stepName: "Call Info",
        stepComponent: CallInfoFields,
        stepId: "callinfo",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.callinfo
      },

      {
        stepName: "Client Info",
        stepComponent: CallClientInfoFields,
        stepId: "clientinfo",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.clientinfo
      },
      {
        stepName: "Recruitment",
        stepComponent: RecruiterFields,
        stepId: "recruitment",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.recruitment
      },

      {
        stepName: "Rating Businesses",
        stepComponent: EmploymentFields,
        stepId: "rating_businesses",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.rating_businesses
      },

      {
        stepName: "Issues",
        stepComponent: CallIssues,
        stepId: "issues",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.issues
      },

      {
        stepName: "Client Support",
        stepComponent: CallActionFields,
        stepId: "client_support",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.client_support
      }
    ];



    // Ill only add the Interactions List.. When an Interactions list exist.  Otherwise.. The list is created with one element
    // inside the "Call Info" tab.  Once this is saved.. or a call is edited.. It will have an interactions list and the tab will
    // show.  FYI... So people know why Im doing this.  It's a business logic thing.
    if (props.loadedItem !== undefined && props.loadedItem.case_interactions !== undefined && props.loadedItem.case_interactions.length > 0) {
      steps.push({
        stepName: "Interactions",
        stepComponent: CaseInteractions,
        stepId: "interactions",
        globalEditData: Object.assign({}, props.loadedItem),
        allDataWizardSaveState: (props.allDataWizardSaveState === undefined) ? undefined : props.allDataWizardSaveState.interactions
      });
    }

    this.state = {
      isSaving: false,
      steps: steps,
      loadedItem: props.loadedItem,
    };

  }



  idOrValue = (obj) => {
    if (obj == " " || obj == "" || obj == undefined) {
      return null
    }
    return (obj && obj.id) ? obj.id : obj;

  }

  createPostedCaseInteractions = (allData) => {
    let postedCaseInteractions = new Array();

    if (this.state.loadedItem && this.state.loadedItem.case_interactions) {
      this.state.loadedItem.case_interactions.forEach((interaction) => {
        postedCaseInteractions.push(utils.removeNulls({
          id: interaction.id,
          issara_staff: this.idOrValue(interaction.issara_staff),
          interaction_channel: this.idOrValue(interaction.interaction_channel),
          interaction_reason: this.idOrValue(interaction.interaction_reason),
          summary: interaction.summary,
          type: interaction.type,
          interacted: interaction.interacted
        }))
      })
    }

    // Data in the form... If it's changed... Ill add whats entered there
    // as a new interaciton.
    let newInteraction = {
      issara_staff: this.idOrValue(allData.callinfo.issara_staff),
      interaction_channel: this.idOrValue(allData.callinfo.interaction_channel),
      interaction_reason: this.idOrValue(allData.callinfo.interaction_reason),
      type: allData.callinfo.type,
      summary: allData.callinfo.summary,
      interacted: allData.callinfo.interacted
    }

    let lastEnteredInteraction = (postedCaseInteractions.length > 0) ? postedCaseInteractions[postedCaseInteractions.length - 1] : {};

    lastEnteredInteraction = utils.removeNulls(lastEnteredInteraction);
    newInteraction = utils.removeNulls(newInteraction);

    if (lastEnteredInteraction.summary !== newInteraction.summary ||
      // lastEnteredInteraction.type !== newInteraction.type ||
      this.idOrValue(lastEnteredInteraction.issara_staff) !== newInteraction.issara_staff ||
      this.idOrValue(lastEnteredInteraction.interaction_channel) !== newInteraction.interaction_channel ||
      this.idOrValue(lastEnteredInteraction.interaction_reason) !== newInteraction.interaction_reason ||
      lastEnteredInteraction.type !== newInteraction.type ||
      lastEnteredInteraction.interacted !== newInteraction.interacted) {
      postedCaseInteractions.push(utils.removeNulls(newInteraction));
    }


    return postedCaseInteractions;


  }

  saveCall = (allData) => {

    if (allData.required.was_validated === false ||
      allData.callinfo.was_validated === false) {
      return; // No Op.
    }

    console.log("This is the data for submit", allData);
    let postedCaseInteractions = this.createPostedCaseInteractions(allData);

    let call = {

      // Required
      supplier: this.idOrValue(allData.required.supplier),
      last_modified:  moment().format("YYYY-MM-DD"),
      country: this.idOrValue(allData.required.country),
      province: (allData.required.province === valueEmpty) ? null : this.idOrValue(allData.required.province),
      district: this.idOrValue(allData.required.district),
      client_nationality: this.idOrValue(allData.required.client_nationality),
      client_ethnicity: this.idOrValue(allData.required.client_ethnicity),
      case_category: this.idOrValue(allData.required.case_category),
      client_status: this.idOrValue(allData.required.client_status),
      client_type: (allData.required.client_type === undefined || allData.required.client_type === valueEmpty) ? null : this.idOrValue(allData.required.client_type),

      // client info
      client_nickname: allData.clientinfo.client_nickname,
      description: allData.clientinfo.description,
      client_line_account: allData.clientinfo.client_line_account,
      client_facebook_account: allData.clientinfo.client_facebook_account,
      client_phonenumber: allData.clientinfo.client_phonenumber,
      client_viber_account: allData.clientinfo.client_viber_account,
      client_gender: (allData.clientinfo.client_gender === valueEmpty || allData.clientinfo.client_gender === undefined) ? null : allData.clientinfo.client_gender,
      client_origin_country: (allData.required.client_origin_country === valueEmpty || allData.clientinfo.client_origin_country === undefined) ? null : this.idOrValue(allData.clientinfo.client_origin_country),
      client_origin_province: (allData.required.client_origin_province === valueEmpty || allData.clientinfo.client_origin_province === undefined) ? null : this.idOrValue(allData.clientinfo.client_origin_province),
      client_origin_district: (allData.required.client_origin_district === valueEmpty || allData.clientinfo.client_origin_district === undefined) ? null : this.idOrValue(allData.clientinfo.client_origin_district),
      client_crossing_country: (allData.required.client_crossing_country === valueEmpty || allData.clientinfo.client_crossing_country === undefined) ? null : this.idOrValue(allData.clientinfo.client_crossing_country),
      client_crossing_province: (allData.required.client_crossing_province === valueEmpty || allData.clientinfo.client_crossing_province === undefined) ? null : this.idOrValue(allData.clientinfo.client_crossing_province),
      client_crossing_district: (allData.required.client_crossing_district === valueEmpty || allData.clientinfo.client_crossing_district === undefined) ? null : this.idOrValue(allData.clientinfo.client_crossing_district),


      case_how_hear_issara: allData.callinfo.case_how_hear_issara,

      // recruitment
      source_upstream_broker: allData.recruitment.source_upstream_broker,
      debt_bondage: allData.recruitment.debt_bondage,
      debt_bondage_detail: allData.recruitment.debt_bondage_detail,

      debt_bondage_broker: allData.recruitment.debt_bondage_broker,
      debt_bondage_detail_broker: allData.recruitment.debt_bondage_detail_broker,

      client_time_at_job: this.idOrValue(allData.recruitment.client_time_at_job),
      client_contract_type: this.idOrValue(allData.recruitment.client_contract_type),
      client_document_type: this.idOrValue(allData.recruitment.client_document_type),
      source_recruiter: this.idOrValue(allData.recruitment.source_recruiter),
      destination_recruiter: this.idOrValue(allData.recruitment.destination_recruiter),


      // rating_businesses
      rating_source_broker: (allData.rating_businesses.rating_source_broker === undefined || allData.rating_businesses.rating_source_broker === valueEmpty) ? null : allData.rating_businesses.rating_source_broker,
      rating_source_recruiter: (allData.rating_businesses.rating_source_recruiter === undefined || allData.rating_businesses.rating_source_recruiter === valueEmpty) ? null : allData.rating_businesses.rating_source_recruiter,
      rating_dest_recruiter: (allData.rating_businesses.rating_dest_recruiter === undefined || allData.rating_businesses.rating_dest_recruiter === valueEmpty) ? null : allData.rating_businesses.rating_dest_recruiter,
      rating_dest_employer: (allData.rating_businesses.rating_dest_employer === undefined || allData.rating_businesses.rating_dest_employer === valueEmpty) ? null : allData.rating_businesses.rating_dest_employer,

      // issues
      issue_category: this.idOrValue(allData.issues.issue_category),
      kpis: (() => {

        let arrayKpiIds = [];
        let issue_category = this.idOrValue(allData.issues.issue_category);
        if (issue_category === 1 && allData.issues.selectedKpis !== undefined && Object.keys(allData.issues.selectedKpis).length > 0) {

          Object.keys(allData.issues.selectedKpis).forEach((rowKpisKey) => {
            let rowKpis = allData.issues.selectedKpis[rowKpisKey];
            if (rowKpis && rowKpis.length > 0) {
              rowKpis.forEach((kpi) => {
                arrayKpiIds.push(kpi);
              });
            }

          });
        }

        return arrayKpiIds;
      })(),

      issue_description: allData.issues.issue_description,
      issue_offender_description: allData.issues.issue_offender_description,
      issue_workers_affected: allData.issues.issue_workers_affected || 0,
      issue_workers_affected_description: allData.issues.issue_workers_affected_description,

      issue_getting_better: allData.issues.issue_getting_better,
      issue_getting_better_description: allData.issues.issue_getting_better_description,


      // Client Support
      vot_needs: allData.client_support.vot_needs,
      case_status: allData.client_support.case_status,
      client_share_info_consent: allData.client_support.client_share_info_consent,
      referral_notes: allData.client_support.referral_notes,
      client_share_info_consent: allData.client_support.client_share_info_consent,
      next_steps: allData.client_support.next_steps,
      next_steps_issara_staff: this.idOrValue(allData.client_support.next_steps_issara_staff),
      dead_line_date: (allData.client_support.dead_line_date !== undefined && 
                       allData.client_support.dead_line_date !== null && 
                       allData.client_support.dead_line_date !== "" ) ? allData.client_support.dead_line_date : null,
      final_remarks: allData.client_support.final_remarks,
      risk_assessment: allData.client_support.risk_assessment,
      referral_action: this.idOrValue(allData.client_support.referral_action),

      posted_case_interactions: postedCaseInteractions,
      interactiontype: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].type : "",
      interaction_summary: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].summary : "",
      interacted: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].interacted : "",
      interaction_reason: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].interaction_reason : "",
      interaction_channel: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].interaction_channel : "",
      interaction_issara_staff: (postedCaseInteractions && postedCaseInteractions.length > 0 ) ? postedCaseInteractions[postedCaseInteractions.length - 1].issara_staff : ""
    }; // End of Structure Definition



    if (this.state.loadedItem !== undefined && this.state.loadedItem.id !== undefined) {
      call.id = this.state.loadedItem.id;
    }

    // Take all the data minded from allData, also return allData so I can
    // Instantly reset the state if this.props.saveCall fails/errors
    this.props.saveCall(call, allData);


  }

  render = () => {

    return (<div>
      <div>
        {this.state.alert}
      </div>
      <div>
        <Wizard
          key={utils.giveMeGuid()}
          validate
          steps={this.state.steps}
          title={"Edit/Add Worker Call: " + ((this.state.loadedItem !== undefined && this.state.loadedItem.id !== undefined) ? this.state.loadedItem.id : "")}
          subtitle=""
          finishButtonEnabled={true}
          finishButtonText={"Save"}
          finishButtonClick={(allData) => {
            this.saveCall(allData);
          }}
        />
      </div>
    </div>);

  }


}


NewCallWizardView.propTypes = {

};


export default (NewCallWizardView);
