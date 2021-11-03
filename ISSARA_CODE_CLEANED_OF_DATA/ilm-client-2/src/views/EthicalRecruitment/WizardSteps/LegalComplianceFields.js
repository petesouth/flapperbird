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


class LegalComplianceFields extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      legal_complience_labour_laws: 1,
      legal_complience_criminal_laws: 1,
      legal_complience_recruitment_policies: 1,
      legal_complience_notes: '',
      legal_complience_priority_notes: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        legal_complience_labour_laws: this.props.globalEditData.legal_complience_labour_laws,
        legal_complience_criminal_laws: this.props.globalEditData.legal_complience_criminal_laws,
        legal_complience_recruitment_policies: this.props.globalEditData.legal_complience_recruitment_policies,
        legal_complience_notes: this.props.globalEditData.legal_complience_notes,
        legal_complience_priority_notes: this.props.globalEditData.legal_complience_priority_notes,
      })
    }
  }

  sendState() {
    return this.state;
  }

  render() {
    const { classes } = this.props;
    console.log('LABOUR LAW', this.state.legal_complience_labour_laws);

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Legal Compliance
          </h4>
        </GridItem>
        <GridContainer>
          {/* LABOUR LAWS */}
          <GridItem xs={12}>
            <span> <b> Labour laws </b> </span>
            <ButtonBar name={
              `Compliance with all relevant labour laws, including with
               regard to wage, OT, deductions, working hours, and protections for women
               and children.
              `}
              labelWidth={9}
              value={this.state.legal_complience_labour_laws}
              onClick={(name, value) => this.setState({...this.state, legal_complience_labour_laws: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* CRIMINAL LAWS */}
          <GridItem xs={12}>
            <span> <b> Criminal laws </b> </span>
            <ButtonBar name={
              `Compliance with all relevant criminal laws,
               including with regard to forced labour, debt bondage,
               human trafficking, and slavery.
              `}
              labelWidth={9}
              value={this.state.legal_complience_criminal_laws}
              onClick={(name, value) => this.setState({...this.state, legal_complience_criminal_laws: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* RECRUITMENT POLICIES */}
          <GridItem xs={12}>
            <span> <b> Recruitment-oriented policies </b> </span>
            <ButtonBar name={
              `Compliance with all relevant policies
               and ordinances, including those that require registration and payment
               of bonds, and which regulate labour recruitment overall.
              `}
              labelWidth={9}
              value={this.state.legal_complience_recruitment_policies}
              onClick={(name, value) => this.setState({...this.state, legal_complience_recruitment_policies: value})}
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
                value={this.state.legal_complience_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, legal_complience_notes: e.target.value})
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
              value={this.state.legal_complience_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, legal_complience_priority_notes: e.target.value})
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LegalComplianceFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(LegalComplianceFields);
