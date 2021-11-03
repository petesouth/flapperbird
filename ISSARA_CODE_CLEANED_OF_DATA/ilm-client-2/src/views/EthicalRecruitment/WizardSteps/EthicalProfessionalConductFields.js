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
  },
};


class EthicalProfessionalConductFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      professional_conduct_agency: 1,
      professional_conduct_employer: 1,
      professional_conduct_agency_capacity: 1,
      professional_conduct_employer_capacity: 1,
      professional_conduct_cooperation_efficiency: 1,
      professional_conduct_notes: '',
      professional_conduct_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        professional_conduct_agency: this.props.globalEditData.professional_conduct_agency,
        professional_conduct_employer: this.props.globalEditData.professional_conduct_employer,
        professional_conduct_agency_capacity: this.props.globalEditData.professional_conduct_agency_capacity,
        professional_conduct_employer_capacity: this.props.globalEditData.professional_conduct_employer_capacity,
        professional_conduct_cooperation_efficiency: this.props.globalEditData.professional_conduct_cooperation_efficiency,
        professional_conduct_notes: this.props.globalEditData.professional_conduct_notes,
        professional_conduct_priority_notes: this.props.globalEditData.professional_conduct_priority_notes,
      })
    }
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.professional_conduct_agency)

    return (
      <div>
        <form>
          <GridItem>
            <h4 className={classes.infoText}>
              Ethical And Professional Conduct
            </h4>
          </GridItem>
          <GridContainer>
            {/* AGENCY CONDUCT */}
            <GridItem xs={12}>
              <span> <b> Agency conduct </b> </span>
              <ButtonBar name={
                `Agency, including agency staff and all affiliated
                 representatives, operate with ethics, professional conduct,
                 and fair practice. This includes timely management of recruiters
                 and sub-recruiters, screening and pre-qualifying of potential applicants,
                 and preliminary reference checking and document verification,
                 including age verification, for all applicants.
                `}
                labelWidth={9}
                value={this.state.professional_conduct_agency}
                onClick={(name, value) => this.setState({...this.state, professional_conduct_agency: value})}
                buttons={[
                  { name: "1", value: 1 },
                  { name: "2", value: 2 },
                  { name: "3", value: 3 },
                  { name: "4", value: 4 }
                ]}
              />
            </GridItem>
            {/* EMPLOYER CONDUCT */}
            <GridItem xs={12}>
              <span> <b> Employer conduct </b> </span>
              <ButtonBar name={
                `Employer, including all labour recruitment and
                 human resources staff and affiliated representatives,
                 operate with ethics, professional conduct, and fair practice
                 in line with the ETI Base Code and other customer requirements.
                `}
                labelWidth={9}
                value={this.state.professional_conduct_employer}
                onClick={(name, value) => this.setState({...this.state, professional_conduct_employer: value})}
                buttons={[
                  { name: "1", value: 1 },
                  { name: "2", value: 2 },
                  { name: "3", value: 3 },
                  { name: "4", value: 4 }
                ]}
              />
            </GridItem>
            {/* AGENCY CAPACITY */}
            <GridItem xs={12}>
              <span> <b> Agency capacity </b> </span>
              <ButtonBar name={
                `Agency staff and affiliated representatives have the
                 knowledge, attitude, and capacity to perform duties and
                 interface with jobseekers and Employers in a professional manner.
                `}
                labelWidth={9}
                value={this.state.professional_conduct_agency_capacity}
                onClick={(name, value) => this.setState({...this.state, professional_conduct_agency_capacity: value})}
                buttons={[
                  { name: "1", value: 1 },
                  { name: "2", value: 2 },
                  { name: "3", value: 3 },
                  { name: "4", value: 4 }
                ]}
              />
            </GridItem>
            {/* EMPLOYER CAPACITY */}
            <GridItem xs={12}>
              <span> <b> Employer capacity </b> </span>
              <ButtonBar name={
                `Employer staff and affiliated representatives have
                 the knowledge, attitude, and capacity to perform duties and
                 interface with workers and agencies in a professional manner.
                `}
                labelWidth={9}
                value={this.state.professional_conduct_employer_capacity}
                onClick={(name, value) => this.setState({...this.state, professional_conduct_employer_capacity: value})}
                buttons={[
                  { name: "1", value: 1 },
                  { name: "2", value: 2 },
                  { name: "3", value: 3 },
                  { name: "4", value: 4 }
                ]}
              />
            </GridItem>
            {/* EFFICIENT COOPERATION */}
            <GridItem xs={12}>
              <span> <b> Efficient cooperation </b> </span>
              <ButtonBar name={
                `Agency and Employer cooperate in an effective
                 manner; when worker-related issues arise, each party notifies
                 the other in a clear and timely manner; sufficient lead time
                 is provided to each party to manage processes including
                 worker document extension and repatriation.
                `}
                labelWidth={9}
                value={this.state.professional_conduct_cooperation_efficiency}
                onClick={(name, value) => this.setState({...this.state, professional_conduct_cooperation_efficiency: value})}
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
                  value={this.state.professional_conduct_notes}
                  inputProps={{
                    onChange: e => this.setState({...this.state, professional_conduct_notes: e.target.value})
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
                value={this.state.professional_conduct_priority_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, professional_conduct_priority_notes: e.target.value})
                }}
              />
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

EthicalProfessionalConductFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(EthicalProfessionalConductFields);
