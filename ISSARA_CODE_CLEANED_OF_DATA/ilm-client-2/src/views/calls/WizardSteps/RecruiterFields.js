import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";


import { FormControl } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";

import DocumentTypesDropdown from "components/ilmdb/DocumentTypesDropdown.js";
import ContractTypesDropdown from "components/ilmdb/ContractTypesDropdown.js";


import InputLabel from "@material-ui/core/InputLabel";

import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Button from "components/CustomButtons/Button.js";

const style = {
  infoText: {
    fontWeight: "300",
    marginBottom: "-20px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};

class RecruiterFields extends React.Component {
  constructor(props) {
    super(props);


    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      this.state = {
        source_upstream_broker: (props.globalEditData && props.globalEditData.source_upstream_broker) ? props.globalEditData.source_upstream_broker : "N/A",
        debt_bondage: (props && props.globalEditData) ? props.globalEditData.debt_bondage : undefined,
        debt_bondage_detail: (props && props.globalEditData) ? props.globalEditData.debt_bondage_detail : undefined,

        debt_bondage_broker: (props && props.globalEditData) ? props.globalEditData.debt_bondage_broker : undefined,
        debt_bondage_detail_broker: (props && props.globalEditData) ? props.globalEditData.debt_bondage_detail_broker : undefined,

        client_time_at_job: (props && props.globalEditData) ? props.globalEditData.client_time_at_job : undefined,

        client_contract_type: (props && props.globalEditData && props.globalEditData.client_contract_type) ? props.globalEditData.client_contract_type.id : undefined,
        client_document_type: (props && props.globalEditData && props.globalEditData.client_document_type) ? props.globalEditData.client_document_type.id : undefined,
        source_recruiter: (props && props.globalEditData && props.globalEditData.source_recruiter) ? props.globalEditData.source_recruiter.id : undefined,
        destination_recruiter: (props && props.globalEditData && props.globalEditData.destination_recruiter) ? props.globalEditData.destination_recruiter.id : undefined,
      };
    }
  }
  sendState = () => {
    return this.state;
  }


  isValidated = () => {
    return true;
  }

  render = () => {
    const { classes, globalEditData } = this.props;
    return (
      <form>
        <GridItem sm={12}>
          <h4 className={classes.infoText}>
            Recruitment
          </h4>
        </GridItem>
        <GridItem xs={12}>
          <CustomInput
            id="source_upstream_broker"
            labelText="Source Upstream Broker"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              onChange: (e) => {
                this.setState({ source_upstream_broker: e.target.value });
              }
            }}
            value={this.state.source_upstream_broker} 
          />
        </GridItem>
        <GridItem xs={12}>
          <CustomInput
            id="client_time_at_job"
            labelText="How many months working at this workplace?"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "number",
              onChange: (e) => {
                this.setState({ client_time_at_job: e.target.value });
              }
            }}
            value={`${parseInt(this.state.client_time_at_job)}` || undefined}
          />
        </GridItem>


        <GridItem xs={12}>
          <InputLabel>Employer Debt Bondage?</InputLabel>
          <div>
            <FormControlLabel value="yes" control={(<Radio
              checked={this.state.debt_bondage === 'yes'}
              onChange={() => { this.setState({ debt_bondage: "yes" }); }}
              value="yes"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'Yes' }}
            />)} label="Yes" />

            <FormControlLabel value="no" control={(<Radio
              checked={this.state.debt_bondage === 'no'}
              onChange={() => { this.setState({ debt_bondage: "no" }); }}
              value="no"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'No' }}
            />)} label="No" />
          </div>
        </GridItem>

        <GridItem xs={12}>
          <CustomInput
            id="debt_details"
            labelText="If there is employer debt bondage, please provide details on amounts, to whom, how paid, etc"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "textarea",
              onChange: (e) => {
                this.setState({ debt_bondage_detail: e.target.value });
              }
            }}
            value={this.state.debt_bondage_detail}
          />
        </GridItem>


        <GridItem xs={12}>
          <InputLabel>Broker Debt Bondage?</InputLabel>
          <div>
            <FormControlLabel value="yes" control={(<Radio
              checked={this.state.debt_bondage_broker === 'yes'}
              onChange={() => { this.setState({ debt_bondage_broker: "yes" }); }}
              value="yes"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'Yes' }}
            />)} label="Yes" />

            <FormControlLabel value="no" control={(<Radio
              checked={this.state.debt_bondage_broker === 'no'}
              onChange={() => { this.setState({ debt_bondage_broker: "no" }); }}
              value="no"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'No' }}
            />)} label="No" />
          </div>
        </GridItem>

        <GridItem xs={12}>
          <CustomInput
            id="debt_details"
            labelText="If there is broker debt bondage, please provide details on amounts, to whom, how paid, etc"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "textarea",
              onChange: (e) => {
                this.setState({ debt_bondage_detail_broker: e.target.value });
              }
            }}
            value={this.state.debt_bondage_detail_broker}
          />
        </GridItem>



        <GridItem xs={12}>
          <ContractTypesDropdown value={this.state.client_contract_type} onSelect={(contractTypeId) => {
            this.setState({ client_contract_type: contractTypeId });
          }} />
        </GridItem>

        <GridItem xs={12}>
          <DocumentTypesDropdown value={this.state.client_document_type} onSelect={(documentTypeId) => {
            this.setState({ client_document_type: documentTypeId });
          }} />
        </GridItem>

        <GridItem xs={12}>
          <RecruitersDropdown value={this.state.source_recruiter} label={"Source Recruiter"} onSelect={(recruiterId) => {
            this.setState({ source_recruiter: recruiterId });
          }} />
        </GridItem>

        <GridItem xs={12}>
          <RecruitersDropdown value={this.state.destination_recruiter} label={"Destination Recruiter"} onSelect={(recruiterId) => {
            this.setState({ destination_recruiter: recruiterId });
          }} />
        </GridItem>

      </form>
    );
  }
}

RecruiterFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(RecruiterFields);
