import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";


import FormControl from "@material-ui/core/FormControl";

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


class GrievanceMechanismFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      grievance_mechanism_encouragement: 1,
      grievance_mechanism_punitive_action: 1,
      grievance_mechanism_credibility: 1,
      grievance_mechanism_hr_staff: 1,
      grievance_mechanism_notes: '',
      grievance_mechanism_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        grievance_mechanism_encouragement: this.props.globalEditData.grievance_mechanism_encouragement,
        grievance_mechanism_punitive_action: this.props.globalEditData.grievance_mechanism_punitive_action,
        grievance_mechanism_credibility: this.props.globalEditData.grievance_mechanism_credibility,
        grievance_mechanism_hr_staff: this.props.globalEditData.grievance_mechanism_hr_staff,
        grievance_mechanism_notes: this.props.globalEditData.grievance_mechanism_notes,
        grievance_mechanism_priority_notes: this.props.globalEditData.grievance_mechanism_priority_notes
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Access to Grievance Mechanisms and Remedy Scores
          </h4>
        </GridItem>
        <GridContainer>
          {/* ENCOURAGEMENT OF USE OF GRIEVANCE MECHANISMS */}
          <GridItem xs={12}>
            <span> <b> Encouragement of use of grievance mechanisms </b> </span>
            <ButtonBar name={
              `All workers are provided with clear information on the nature
               of the grievance mechanisms available to them and how to access
               by both Employer and Agency, during pre-departure training,
               and on arrival at the workplace; discouragement of use of any
               grievance mechanisms, including intimidation or threats of reprisal,
               is not tolerated at any level from any employee or representative of
               the Employer, including supervisors, human resource staff, and
               managers/directors.
              `}
              labelWidth={9}
              value={this.state.grievance_mechanism_encouragement}
              onClick={(name, value) => this.setState({...this.state, grievance_mechanism_encouragement: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* PUNITIVE ACTION TOWARD EMPLOYER STAFF */}
          <GridItem xs={12}>
            <span> <b> Punitive action toward Employer staff who threaten workers
                       regarding use of the grievance mechanism </b> </span>
            <ButtonBar name={
              `Any reports of worker intimidation are investigated immediately
               through formal Employer channels; appropriate punitive action is taken,
               including suspension and termination of contract where intimidating behavior persists.
               The Employer shares any information related to incidents that are being
               investigated with the Agency in a timely manner.
              `}
              labelWidth={9}
              value={this.state.grievance_mechanism_punitive_action}
              onClick={(name, value) => this.setState({...this.state, grievance_mechanism_punitive_action: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* CREDIBLE GRIEVANCE MECHANISMS */}
          <GridItem xs={12}>
            <span> <b> Credible grievance mechanisms with functioning systems for
                       investigation and provision of remediation </b> </span>
            <ButtonBar name={
              `Internal grievance mechanisms (such as a worker welfare committee
               or complaints box) and external grievance mechanisms (such as the
               Issara hotline) are in place with clear protocols for handling
               complaints in a professional manner. Workers can report issues
               anonymously, and systems are in place for recording and investigating
               complaints. Investigations are conducted by a person without conflict
               of interest within the organization.
              `}
              labelWidth={9}
              value={this.state.grievance_mechanism_credibility}
              onClick={(name, value) => this.setState({...this.state, grievance_mechanism_credibility: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* HR STAFF ARE TRAINED */}
          <GridItem xs={12}>
            <span> <b> HR staff are trained </b> </span>
            <ButtonBar name={
              `Training has been provided to HR and other relevant staff
               regarding the implementation of protocols related to grievance mechanisms.
              `}
              labelWidth={9}
              value={this.state.grievance_mechanism_hr_staff}
              onClick={(name, value) => this.setState({...this.state, grievance_mechanism_hr_staff: value})}
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
                value={this.state.grievance_mechanism_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, grievance_mechanism_notes: e.target.value})
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
              value={this.state.grievance_mechanism_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, grievance_mechanism_priority_notes: e.target.value})
              }}
            />
          </GridItem>
          {
          /* SCORE LEGAL CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_legal_current"
          //       labelText="Score Legal Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE LEGAL GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_legal_goal"
          //       labelText="Score Legal Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE ETHICAL CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_ethical_current"
          //       labelText="Score Ethical Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE ETHICAL GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_ethical_goal"
          //       labelText="Score Ethical Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* NOTES ETHICAL PRIORITIES */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_notes_ethical_priorities"
          //       labelText="Notes Ethical Priorities"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE CHARGES CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_charges_current"
          //       labelText="Score Charges Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE CHARGES GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_charges_goal"
          //       labelText="Score Charges Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* NOTES CHARGES PRIORITIES */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_notes_charges_priorities"
          //       labelText="Notes Charges Priorities"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE TRANSPARENCY CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_transparency_current"
          //       labelText="Score Transparency Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE TRANSPARENCY GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_transparency_goal"
          //       labelText="Score Transparency Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* NOTES TRANSPARENCY PRIORITIES */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_notes_transparency_priorities"
          //       labelText="Notes Transparency Priorities"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SECTION 5.1 CURRENT SCORE */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_section_51_current_score"
          //       labelText="Section 5.1 Current Score"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE WAGES CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_wages_current"
          //       labelText="Score Wages Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE WAGES GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_wages_goal"
          //       labelText="Score Wages Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* NOTES WAGES PRIORITIES */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_notes_wages_priorities"
          //       labelText="Notes Wages Priorities"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE SAFE CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_safe_current"
          //       labelText="Score Safe Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE SAFE GOAL */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_safe_goal"
          //       labelText="Score Safe Goal"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* NOTES SAFE PRIORITIES */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_notes_safe_priorities"
          //       labelText="Notes Safe Priorities"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* SCORE GRIEVANCE CURRENT */
          // <GridItem xs={12}>
          //   <FormControl fullWidth>
          //     <CustomInput
          //       id="ethical_recruitment_score_grievance_current"
          //       labelText="Score Grievance Current"
          //       formControlProps={{ fullWidth: true }}
          //       inputProps={{ type: "text" }}
          //     />
          //   </FormControl>
          // </GridItem>
          // /* DATE */
          // <GridItem xs={12} className='mt-2'>
          //   <InputLabel className={classes.label}> Date </InputLabel>
          //   <FormControl fullWidth>
          //     <Datetime
          //       id="ethical_recruitment_date"
          //       timeFormat={false}
          //       inputProps={{ placeholder: "Date" }}
          //     />
          //   </FormControl>
          // </GridItem>
        }
        </GridContainer>
      </div>
    );
  }
}

GrievanceMechanismFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(GrievanceMechanismFields);
