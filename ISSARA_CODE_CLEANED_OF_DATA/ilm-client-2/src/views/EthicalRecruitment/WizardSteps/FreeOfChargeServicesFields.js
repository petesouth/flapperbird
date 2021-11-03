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


class FreeOfChargeServicesFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      free_of_charge_recruitment_fees: 1,
      free_of_charge_transparency: 1,
      free_of_charge_other_fees: 1,
      free_of_charge_passport_fees: 1,
      free_of_charge_destination_fees: 1,
      free_of_charge_notes: '',
      free_of_charge_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        free_of_charge_recruitment_fees: this.props.globalEditData.free_of_charge_recruitment_fees,
        free_of_charge_transparency: this.props.globalEditData.free_of_charge_transparency,
        free_of_charge_other_fees: this.props.globalEditData.free_of_charge_other_fees,
        free_of_charge_passport_fees: this.props.globalEditData.free_of_charge_passport_fees,
        free_of_charge_destination_fees: this.props.globalEditData.free_of_charge_destination_fees,
        free_of_charge_notes: this.props.globalEditData.free_of_charge_notes,
        free_of_charge_priority_notes: this.props.globalEditData.free_of_charge_priority_notes,
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Free-of-Charge Services to Jobseekers and Workers
          </h4>
        </GridItem>
        <GridContainer>
          {/* VILLAGE */}
          <GridItem xs={12}>
            <span> <b> No village-level sub-broker recruitment fees charged to jobseekers </b> </span>
            <ButtonBar name={
              `No fees or costs of recruitment of jobseekers from the
               village/community level are passed on to the jobseeker,
               without exception; all of these recruitment costs,
               including transport from the village to the location of interview
               are covered by the Employer or recruitment agency.
              `}
              labelWidth={9}
              value={this.state.free_of_charge_recruitment_fees}
              onClick={(name, value) => this.setState({...this.state, free_of_charge_recruitment_fees: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* TRANSPARENT DISCLOSURE */}
          <GridItem xs={12}>
            <span> <b> Transparent disclosure of sub-broker involvement and fees </b> </span>
            <ButtonBar name={
              `Agency discloses complete information, in writing, to the Employer
               regarding all parties, costs, and processes involved in the
               recruitment of the jobseeker.
              `}
              labelWidth={9}
              value={this.state.free_of_charge_transparency}
              onClick={(name, value) => this.setState({...this.state, free_of_charge_transparency: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* SOURCE SIDE */}
          <GridItem xs={12}>
            <span>
              <b> No other source-side costs of recruitment, job processing,
                  or migration charged to jobseekers </b>
            </span>
            <ButtonBar name={
              `No other fees or costs of recruitment, vetting, and job processing
               are passed onto the jobseeker, including accommodation, medical checks,
               transportation, e-smart card processing and maintenance during processing;
               all of these recruitment costs are covered by the Employer or Agency..
              `}
              labelWidth={9}
              value={this.state.free_of_charge_other_fees}
              onClick={(name, value) => this.setState({...this.state, free_of_charge_other_fees: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* PASSPORT APPLICATION FEES */}
          <GridItem xs={12}>
            <span> <b> Passport application fees </b> </span>
            <ButtonBar name={
              `Workers who do not have a valid passport receive clear information
               on options and costs for applying for a passport. Workers can opt
               to apply independently or use Agency services; and are provided with
               a receipt after completing the process. Service fees must be reasonable
               and disclosed to the jobseeker. The worker covers the cost of the passport itself.
              `}
              labelWidth={9}
              value={this.state.free_of_charge_passport_fees}
              onClick={(name, value) => this.setState({...this.state, free_of_charge_passport_fees: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* DESTINATION SIDE */}
          <GridItem xs={12}>
            <span>
              <b> No destination-side costs of recruitment, job processing, or
                  documentation charged to workers </b>
            </span>
            <ButtonBar name={
              `No fees or costs of recruitment, job processing, document processing,
               document renewal, or labour management are passed onto the worker,
               including visas, work permits, and medical checks; all of these
               recruitment costs are covered by the Employer or Agency.
              `}
              labelWidth={9}
              value={this.state.free_of_charge_destination_fees}
              onClick={(name, value) => this.setState({...this.state, free_of_charge_destination_fees: value})}
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
                value={this.state.free_of_charge_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, free_of_charge_notes: e.target.value})
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
              value={this.state.free_of_charge_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, free_of_charge_priority_notes: e.target.value})
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

FreeOfChargeServicesFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(FreeOfChargeServicesFields);
