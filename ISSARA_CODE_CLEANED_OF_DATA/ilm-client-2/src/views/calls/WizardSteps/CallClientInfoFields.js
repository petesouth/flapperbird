import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";


import FormLabel from '@material-ui/core/FormLabel';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import Button from "components/CustomButtons/Button.js";

import CountryProvincesDistrictsDropdown from "components/ilmdb/CountryProvincesDistrictsDropdown.js";
import { TextareaAutosize } from '@material-ui/core';

import { FormControl } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";
import GendersDropdown from "components/ilmdb/GendersDropdown";
import Utils from "../../../services/utils";

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
  },
};

class CallClientInfoFields extends React.Component {
  constructor(props) {
    super(props);

    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      this.state = {
        client_nickname: (props.globalEditData) ? props.globalEditData.client_nickname : "",
        description: (props.globalEditData) ? props.globalEditData.description : "",
        client_line_account: (props.globalEditData) ? props.globalEditData.client_line_account : "",
        client_facebook_account: (props.globalEditData) ? props.globalEditData.client_facebook_account : "",
        client_phonenumber: (props.globalEditData) ? props.globalEditData.client_phonenumber : "",
        client_viber_account: (props.globalEditData) ? props.globalEditData.client_viber_account : "",

        client_gender: (props.globalEditData && props.globalEditData.client_gender) ? props.globalEditData.client_gender.id : undefined,

        client_origin_country: (props.globalEditData) ? props.globalEditData.client_origin_country : "",
        client_origin_province: (props.globalEditData) ? props.globalEditData.client_origin_province : "",
        client_origin_district: (props.globalEditData) ? props.globalEditData.client_origin_district : "",

        client_crossing_country: (props.globalEditData) ? props.globalEditData.client_crossing_country : "",
        client_crossing_province: (props.globalEditData) ? props.globalEditData.client_crossing_province : "",
        client_crossing_district: (props.globalEditData) ? props.globalEditData.client_crossing_district : ""

      };
    }
  }
  sendState = () => {
    return this.state;
  }


  isValidated = () => {


    let isValid = true;
    let errorsInState = {};

    if (Utils.isEmptyField(("" + this.state.client_gender).trim()) === true) {
      errorsInState["client_gender_error"] = (<FormLabel error>Gender must be selected</FormLabel>);
    }
    
    if (Object.keys(errorsInState).length > 0) {
      isValid = false;
      this.setState(errorsInState);
    }

    return isValid;
  }
 
  render = () => {
    const { classes } = this.props;
    return (
      <form>
        <GridItem>
          <h4 className={classes.infoText}>
            Client Info
          </h4>
        </GridItem>
        <GridItem>
          <CustomInput
            id={"case_description"}
            labelText={"Staff Notes/Description"}
            isTextArea={true}
            formControlProps={{
              fullWidth: true
            }}
            value={this.state.description}
            inputProps={{
              onChange: (e) => {
                this.setState({ description: e.target.value })
              }
            }}

          />
        </GridItem>

        <GridContainer>
          <GridItem xs={6}>
            <CustomInput
              id="client_nickname"
              labelText="Client name / nickname"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: (e) => {
                  this.setState({ client_nickname: e.target.value })
                }
              }}
              helpText="client_nickname"
              value={this.state.client_nickname}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomInput
              id="client_line_account"
              labelText="LINE ID"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: (e) => {
                  this.setState({ client_line_account: e.target.value })
                }
              }}
              value={this.state.client_line_account}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomInput
              id="client_facebook_account"
              labelText="Facebook name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: (e) => {
                  this.setState({ client_facebook_account: e.target.value })
                }
              }}
              value={this.state.client_facebook_account}
            />
          </GridItem>

          <GridItem xs={6}>
            <CustomInput
              id="client_phonenumber"
              labelText="Phone number"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: (e) => {
                  this.setState({ client_phonenumber: e.target.value })
                }
              }}
              helpText="client_phonenumber"
              value={this.state.client_phonenumber}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomInput
              id="client_viber_account"
              labelText="Viber account"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: (e) => {
                  this.setState({ client_viber_account: e.target.value })
                }
              }}
              helpText="client_viber_account"
              value={this.state.client_viber_account}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6}>
            {this.state.client_gender_error}
            <GendersDropdown id="genderDropdown_clientInfo"
              value={this.state.client_gender}
              onSelect={(value) => {
                this.setState({ client_gender: value });
              }} />
          </GridItem>

        </GridContainer>


        <GridContainer>
          <GridItem xs={6}>
            <Card>
              <CardHeader>
                <h4>Origin</h4>
              </CardHeader>
              <CardBody>
                <CountryProvincesDistrictsDropdown country_values={this.state.client_origin_country}
                  province_values={this.state.client_origin_province}
                  district_values={this.state.client_origin_district}
                  onSelect={(e) => {
                    console.log("Supplier Selected:", e);
                    this.setState({
                      client_origin_country: e.country_id,
                      client_origin_province: e.province_id,
                      client_origin_district: e.district_id
                    });
                  }} />
                <div className='mt-1' />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={6}>
            <Card>
              <CardHeader>
                <h4>Crossing</h4>
              </CardHeader>
              <CardBody>
                <CountryProvincesDistrictsDropdown country_values={this.state.client_crossing_country}
                  province_values={this.state.client_crossing_province}
                  district_values={this.state.client_crossing_district}
                  onSelect={(e) => {
                    console.log("Supplier Selected:", e);
                    this.setState({
                      client_crossing_country: e.country_id,
                      client_crossing_province: e.province_id,
                      client_crossing_district: e.district_id
                    });
                  }} />
                <div className='mt-1' />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

      </form>
    );
  }
}

CallClientInfoFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(CallClientInfoFields);
