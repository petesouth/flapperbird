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


class TransparentWagesFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      wages_deductions_benefits_information: 1,
      wages_deductions_benefits_predeparture_training: 1,
      wages_deductions_benefits_multilingualism: 1,
      wages_deductions_benefits_digitalization: 1,
      wages_deductions_benefits_notes: '',
      wages_deductions_benefits_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        wages_deductions_benefits_information: this.props.globalEditData.wages_deductions_benefits_information,
        wages_deductions_benefits_predeparture_training: this.props.globalEditData.wages_deductions_benefits_predeparture_training,
        wages_deductions_benefits_multilingualism: this.props.globalEditData.wages_deductions_benefits_multilingualism,
        wages_deductions_benefits_digitalization: this.props.globalEditData.wages_deductions_benefits_digitalization,
        wages_deductions_benefits_notes: this.props.globalEditData.wages_deductions_benefits_notes,
        wages_deductions_benefits_priority_notes: this.props.globalEditData.wages_deductions_benefits_priority_notes,
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Transparent Wages, Deductions and Benefits
          </h4>
        </GridItem>
        <GridContainer>
          {/* CONTRACTS PROVIDE TRANSPARENT INFORMATION ON WAGES */}
          <GridItem xs={12}>
            <span> <b> Contracts provide transparent information on wages, deductions
                       and benefits </b>
            </span>
            <ButtonBar name={
              `Workers receive a contract which clearly stipulates all
               arrangements related to pay, deductions, and benefits.
              `}
              labelWidth={9}
              value={this.state.wages_deductions_benefits_information}
              onClick={(name, value) => this.setState({...this.state, wages_deductions_benefits_information: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* PRE-DEPARTURE AND INDUCTION TRAINING */}
          <GridItem xs={12}>
            <span> <b> Pre-departure training provides clear information
                       regarding wages, deductions, benefits, and working conditions </b>
            </span>
            <ButtonBar name={
              `Information related to wages, deductions and benefits,
               including details on bonus and incentive schemes at the workplace,
               target-setting practices, allocation of and ability to earn overtime,
               are provided during pre-departure training, alongside information
               on rules and regulations, health and safety, grievance mechanisms,
               and working conditions. Workers have the opportunity to ask questions,
               and material covered is repeated during induction training at the workplace.
               Key induction information is also provided in writing.
              `}
              labelWidth={9}
              value={this.state.wages_deductions_benefits_predeparture_training}
              onClick={(name, value) => this.setState({...this.state, wages_deductions_benefits_predeparture_training: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* MULTI-LINGUAL TIMESHEETS AND PAYSLIPS */}
          <GridItem xs={12}>
            <span> <b> Multi-lingual timesheets and payslips </b>
            </span>
            <ButtonBar name={
              `The Employer provides timesheets and payslips in the language
               of the worker for every pay period; language used is accurate and
               terms are clear and transparent; template payslips are shared with
               workers during pre-departure training and workers have the opportunity
               to ask questions.
              `}
              labelWidth={9}
              value={this.state.wages_deductions_benefits_multilingualism}
              onClick={(name, value) => this.setState({...this.state, wages_deductions_benefits_multilingualism: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* WORKERS ARE PAID ELECTRONICALLY */}
          <GridItem xs={12}>
            <span> <b> Workers are paid electronically </b>
            </span>
            <ButtonBar name={
              `On arrival in Thailand, the Employer supports workers to set up
               a bank account at a Thai bank. Induction training at the workplace
               includes training on electronic banking and how to remit money.
               Banks used to transfer wages are selected to minimize transaction
               costs to workers.
              `}
              labelWidth={9}
              value={this.state.wages_deductions_benefits_digitalization}
              onClick={(name, value) => this.setState({...this.state, wages_deductions_benefits_digitalization: value})}
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
                value={this.state.wages_deductions_benefits_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, wages_deductions_benefits_notes: e.target.value})
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
              value={this.state.wages_deductions_benefits_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, wages_deductions_benefits_priority_notes: e.target.value})
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

TransparentWagesFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(TransparentWagesFields);
