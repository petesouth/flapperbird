import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";


const style = {
  infoText: {
    fontWeight: "300",
    // margin: "12px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};


class TermsOfEngagementFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      terms_of_engagement_business_information: 1,
      terms_of_engagement_job_description: 1,
      terms_of_engagement_recruitment_process: 1,
      terms_of_engagement_overall_management: 1,
      terms_of_engagement_complete_job_information: 1,
      terms_of_engagement_interview_process: 1,
      terms_of_engagement_medical_checks: 1,
      terms_of_engagement_contract_terms: 1,
      terms_of_engagement_original_contract_provision: 1,
      terms_of_engagement_predeparture_training: 1,
      terms_of_engagement_predeparture_training_worker_rights: 1,
      terms_of_engagement_travel_to_workplace: 1,
      terms_of_engagement_notes: '',
      terms_of_engagement_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        terms_of_engagement_business_information: this.props.globalEditData.terms_of_engagement_business_information,
        terms_of_engagement_job_description: this.props.globalEditData.terms_of_engagement_job_description,
        terms_of_engagement_recruitment_process: this.props.globalEditData.terms_of_engagement_recruitment_process,
        terms_of_engagement_overall_management: this.props.globalEditData.terms_of_engagement_overall_management,
        terms_of_engagement_complete_job_information: this.props.globalEditData.terms_of_engagement_complete_job_information,
        terms_of_engagement_interview_process: this.props.globalEditData.terms_of_engagement_interview_process,
        terms_of_engagement_medical_checks: this.props.globalEditData.terms_of_engagement_medical_checks,
        terms_of_engagement_contract_terms: this.props.globalEditData.terms_of_engagement_contract_terms,
        terms_of_engagement_original_contract_provision: this.props.globalEditData.terms_of_engagement_original_contract_provision,
        terms_of_engagement_predeparture_training: this.props.globalEditData.terms_of_engagement_predeparture_training,
        terms_of_engagement_predeparture_training_worker_rights: this.props.globalEditData.terms_of_engagement_predeparture_training_worker_rights,
        terms_of_engagement_travel_to_workplace: this.props.globalEditData.terms_of_engagement_travel_to_workplace,
        terms_of_engagement_notes: this.props.globalEditData.terms_of_engagement_notes,
        terms_of_engagement_priority_notes: this.props.globalEditData.terms_of_engagement_priority_notes
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Transparent, Ethical Terms of Engagement
          </h4>
        </GridItem>
        <GridContainer>
          {/* DISCLOSURE */}
          <GridItem xs={12}>
            <span> <b> Disclosure of Agency and Employer information </b> </span>
            <ButtonBar name={
              `Prior to entering into the business agreement, Agency and Employer
               disclose full information about their respective businesses.
               This includes company profile, registration license,
               and key policies and procedures for joint due diligence.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_business_information}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_business_information: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* JOB DESCRIPTION */}
          <GridItem xs={12}>
            <span>
              <b> Timely Employer provision of complete job description and hiring
                  criteria to agency </b>
            </span>
            <ButtonBar name={
              `The Employer provides comprehensive information regarding the
               job description, location, industry of the business, nature of
               work, assigned department, wages, working hours, and realistic
               expectation of over time (OT), as well as other relevant working
               and employment conditions to the Agency 2 weeks prior to the start
               of the recruitment process. The Employer provides a written checklist
               of hiring criteria to the Agency, which is used to document worker
               eligibility for the role during screening and interview and provided
               to the Employer alongside other interview records.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_job_description}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_job_description: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* RECRUITMENT PROCESS  */}
          <GridItem xs={12}>
            <span>
              <b> Transparent disclosure of recruitment process to workers </b>
            </span>
            <ButtonBar name={
              `Applicants are fully informed of all documents, job requirements,
               medical check-up processes, estimated timing, and next steps for
               all stages of the recruitment process when first recruited,
               verbally and in writing.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_recruitment_process}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_recruitment_process: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* VETTING PROCESS */}
          <GridItem xs={12}>
            <span>
              <b> Efficient and transparent overall management of source-side
                  jobseeker vetting processes by the agency </b>
            </span>
            <ButtonBar name={
              `The Employer is provided with a written report of all suitable
               applicants after in-person interviews have been conducted.
               The Agency competently coordinates applicant interviews,
               including arranging travel and lodging accommodations.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_overall_management}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_overall_management: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* COMPLETE JOB INFORMATION */}
          <GridItem xs={12}>
            <span>
              <b> Complete job information provided to applicants prior to interview </b>
            </span>
            <ButtonBar name={
              `The Employer and the agency ensure that jobseekers have a
               full understanding of the exact job that they are signing up for,
               down to the department, shift, onsite working conditions,
               living conditions, and average available amount of overtime work (OT)
               prior to interview. Jobseekers are shown photos and videos of
               the exact department of the job being recruited for, with verbal
               description from the recruitment agency, and all questions are
               competently and completely answered.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_complete_job_information}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_complete_job_information: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* INTERVIEW PROCESS */}
          <GridItem xs={12}>
            <span>
              <b> Professional management of the interview process </b>
            </span>
            <ButtonBar name={
              `Interviews are conducted privately and confidentially in an
               ethical manner. Applicants are informed of the results of their
               interview; in cases where an applicant is not successful reasons
               are provided in a transparent manner.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_interview_process}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_interview_process: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* MEDICAL CHECK */}
          <GridItem xs={12}>
            <span>
              <b> Ethical handling of medical checks </b>
            </span>
            <ButtonBar name={
              `Medical check-ups are handled in a professional manner,
               whether required in one or both countries; workersare informed
               of results of their medical check confidentially.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_medical_checks}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_medical_checks: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* CONTRACT TERMS */}
          <GridItem xs={12}>
            <span>
              <b> Clarity and timeliness of provision of contract terms </b>
            </span>
            <ButtonBar name={
              `Jobseekers receive a verbal explanation of the terms and conditions
               of employment prior to interview. Immediately after passing the interview, workers are
               provided with an unsigned, written copy of the MOU contract to take home
               and have the opportunity to ask questions, either on the day or over the
               course of the month prior to contract signing.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_contract_terms}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_contract_terms: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* COUNTER-SIGNED CONTRACT */}
          <GridItem xs={12}>
            <span>
              <b> Provision of original counter-signed contract </b>
            </span>
            <ButtonBar name={
              `Jobseekers receive an original signed and counter-signed MOU contract,
               signed by the Thai business or authorized signatory, including written
               information regarding the job workplace, job description, and
               contact information prior to their departure to Thailand.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_original_contract_provision}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_original_contract_provision: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* PRE-DEPARTURE TRAINING EFFECTIVENESS */}
          <GridItem xs={12}>
            <span>
              <b> Pre-departure training effectiveness </b>
            </span>
            <ButtonBar name={
              `Content and training approaches effectively inform jobseekers
               about their workplace, worker rights, living conditions,
               Employer obligations and responsibilities, company policies,
               rules and regulations, and guidance on how to seek assistance.
               Key messages are shared in writing.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_predeparture_training}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_predeparture_training: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* PRE-DEPARTURE PROVISION OF WRITTEN AND DIGITAL INFORMATION */}
          <GridItem xs={12}>
            <span>
              <b> Pre-departure provision of written and digital information
                  regarding workers’ rights </b>
            </span>
            <ButtonBar name={
              `Jobseekers are provided with written materials explaining their rights
               in the destination country (for example the Issara workers’ rights booklet), as well as other useful information on living
               and working in Thailand (for example online resources such as the Issara
               Golden Dreams app). Contact information is provided for persons and
               organizations that provide support to workers in Thailand.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_predeparture_training_worker_rights}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_predeparture_training_worker_rights: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* TRAVEL TO THE WORKPLACE AT DESTINATION */}
          <GridItem xs={12}>
            <span>
              <b> Travel to the workplace at destination </b>
            </span>
            <ButtonBar name={
              `Source-side recruitment agency is managing transport for workers
               to the Myanmar border. The Employer coordinates with the Agency
               regarding transport of workers from the Myanmar border to their workplace;
               the Agency is efficiently taking part in travel to the Thai workplace
               and workplace inspection, including assurances of efficient, safe travel,
               proper handling of travel fees and cost, and thorough work and living place inspection.
              `}
              labelWidth={9}
              value={this.state.terms_of_engagement_travel_to_workplace}
              onClick={(name, value) => this.setState({...this.state, terms_of_engagement_travel_to_workplace: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* NOTES */}
          <GridItem xs={12}>
            <FormControl fullWidth>
              <CustomInput
                labelText="Notes"
                helperText="Notes and points of interest from the discussion"
                formControlProps={{ fullWidth: true }}
                isTextArea={true}
                value={this.state.terms_of_engagement_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, terms_of_engagement_notes: e.target.value})
                }}
              />
            </FormControl>
          </GridItem>
          {/* PRIORITY NOTES */}
          <GridItem xs={12}>
            <CustomInput
              labelText="Priority Notes"
              helperText="Notes on priority issues to be fixed or improved, as discussed by the businesses"
              formControlProps={{ fullWidth: true }}
              isTextArea={true}
              value={this.state.terms_of_engagement_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, terms_of_engagement_priority_notes: e.target.value})
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

TermsOfEngagementFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(TermsOfEngagementFields);
