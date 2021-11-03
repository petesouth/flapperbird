import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormLabel from '@material-ui/core/FormLabel';

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import CountryProvincesDistrictsDropdown from "components/ilmdb/CountryProvincesDistrictsDropdown.js";
import CaseCategoriesDropdown from "components/ilmdb/CaseCategoriesDropdown.js";
import ClientTypesDropdown from "components/ilmdb/ClientTypesDropdown.js";
import CallerStatusDropdown from "components/ilmdb/CallerStatusDropdown.js";
import NationalitiesDropdown from "components/ilmdb/NationalitiesDropdown.js";
import EtnicitiesDropdown from "components/ilmdb/EthnicitiesDropdown";
import Utils from "services/utils.js";



const style = {
  infoText: {
    fontWeight: "300",
    // margin: "12px 0 16px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};



class RequiredCallFields extends React.Component {
  constructor(props) {
    super(props);

    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      this.state = {
        supplier: (props.globalEditData && props.globalEditData.supplier) ? props.globalEditData.supplier.id : undefined,
        country: (props.globalEditData && props.globalEditData.country) ? props.globalEditData.country : undefined,
        province: (props.globalEditData && props.globalEditData.province) ? props.globalEditData.province : undefined,
        district: (props.globalEditData && props.globalEditData.district) ? props.globalEditData.district : undefined,
        client_nationality: (props.globalEditData && props.globalEditData.client_nationality) ? props.globalEditData.client_nationality.id : undefined,
        client_ethnicity: (props.globalEditData && props.globalEditData.client_ethnicity) ? props.globalEditData.client_ethnicity.id : undefined,
        client_status: (props.globalEditData && props.globalEditData.client_status) ? props.globalEditData.client_status.id : undefined,
        client_type: (props.globalEditData && props.globalEditData.client_type) ? props.globalEditData.client_type.id : undefined,
        case_category: (props.globalEditData && props.globalEditData.case_category ) ? props.globalEditData.case_category.id : undefined
      };
    }

    console.log("RequiredCallFields", this.state);
  }


  sendState() {
    let returnObj = Object.assign({}, this.state);
    returnObj.was_validated = this.isValidated();
    return returnObj;
  }

 

  isValidated = () => {


    let isValid = true;
    let errorsInState = {};

    if (Utils.isEmptyField(this.state.supplier) === true) {
      errorsInState["supplier_error"] = (<FormLabel error>Supplier must be selected</FormLabel>);
    }

    if (Utils.isEmptyField(this.state.country) === true) {
      errorsInState["country_error"] = (<FormLabel error>Country must be selected</FormLabel>);
    }

    if (Utils.isEmptyField(this.state.client_nationality) === true) {
      errorsInState["client_nationality_error"] = (<FormLabel error>Nationality must be selected</FormLabel>);
    }

    //if (Utils.isEmptyField(this.state.client_ethnicity) === true) {
    //  errorsInState["client_ethnicity_error"] = (<FormLabel error>Ethnicity must be selected</FormLabel>);
    //}

    if (Utils.isEmptyField(this.state.client_status) === true) {
      errorsInState["client_status_error"] = (<FormLabel error>CallerStatus must be selected</FormLabel>);
    }

    if (Utils.isEmptyField(this.state.client_type) === true) {
      errorsInState["client_type_error"] = (<FormLabel error>ClientType must be selected</FormLabel>);
    }

    if (Utils.isEmptyField(this.state.case_category) === true) {
      errorsInState["case_category_error"] = (<FormLabel error>CaseCategory must be selected</FormLabel>);
    }


    if (Object.keys(errorsInState).length > 0) {
      isValid = false;
      this.setState(errorsInState);
    }

    return isValid;
  }

  render() {
    const { classes, globalEditData } = this.props;
    const valueEmpty = " ";


    return (
      <form>



        <GridItem xs={12}>
          <h4 className={classes.infoText}>
            Required Info
          </h4>
        </GridItem>

        <GridItem>
          {this.state.supplier_error}
          <SuppliersDropdown value={this.state.supplier} onSelect={(supplierId) => {
            console.log("Supplier Selected:", supplierId);
            this.setState({
              supplier: supplierId,
              supplier_error: undefined
            });
          }} />
        </GridItem>

        <GridItem>
          {this.state.country_error}
          <CountryProvincesDistrictsDropdown country_values={this.state.country}
            province_values={this.state.province}
            district_values={this.state.district}
            onSelect={(e) => {
              console.log("Supplier Selected:", e);
              this.setState({
                country: e.country_id,
                province: e.province_id,
                district: e.district_id,
                country_error: undefined
              });
            }} />
        </GridItem>

        <GridItem>
          {this.state.client_nationality_error}
          <NationalitiesDropdown value={this.state.client_nationality} onSelect={(e) => {
            console.log("Nationality Selected:", e);
            this.setState({ client_nationality: Number.parseInt(e.target.value), client_nationality_error: undefined });
          }} />
        </GridItem>

        <GridItem>
          {this.state.client_ethnicity_error}
          <EtnicitiesDropdown values={this.state.client_ethnicity} onSelect={(e) => {
            console.log("Ethnicity Selected:", e);
            this.setState({ client_ethnicity: Number.parseInt(e.target.value), client_ethnicity_error: undefined });
          }} />
        </GridItem>

        <GridItem>
          {this.state.case_category_error}
          <CaseCategoriesDropdown values={this.state.case_category} onSelect={(e) => {
            console.log("CaseCateogry Selected:", e);
            this.setState({ case_category: (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value), case_category_error: undefined });
          }} />
        </GridItem>

        <GridItem>
          {this.state.client_type_error}
          <ClientTypesDropdown values={this.state.client_type} onSelect={(e) => {
            console.log("ClientType Selected:", e);
            this.setState({ client_type: (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value), client_type_error: undefined });
          }} />
        </GridItem>

        <GridItem>
          {this.state.client_status_error}
          <CallerStatusDropdown values={this.state.client_status} onSelect={(e) => {
            console.log("CallerStatus Selected:", e);
            this.setState({ client_status: (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value), client_status_error: undefined });
          }} />
        </GridItem>

      </form>
    );
  }
}



export default withStyles(style)(RequiredCallFields);
