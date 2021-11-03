import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Button from "components/CustomButtons/Button.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.js";

import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js"


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


class GeneralInformationFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      supplier: null,
      recruiter: null,
      location: '',
      assesment: '',
      supplier_contacts: '',
      recruiter_contacts: '',
      issara_staff: [],
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        supplier: this.props.globalEditData.supplier,
        recruiter: this.props.globalEditData.recruiter,
        location: this.props.globalEditData.location,
        assesment: this.props.globalEditData.assesment,
        supplier_contacts: this.props.globalEditData.supplier_contacts,
        recruiter_contacts: this.props.globalEditData.recruiter_contacts,
        issara_staff: this.props.globalEditData.issara_staff,
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            General Information
          </h4>
        </GridItem>
        <GridContainer>
          {/* SUPPLIER */}
          <GridItem xs={12}>
            <SuppliersDropdown
              value={this.state.supplier}
              onSelect={supplier => this.setState({...this.state, supplier: supplier})}
            />
          </GridItem>
          {/* SOURCE RECRUITER */}
          <GridItem xs={12}>
            <RecruitersDropdown
              value={this.state.recruiter}
              onSelect={recruiter => this.setState({...this.state, recruiter: recruiter})}
            />
          </GridItem>
          {/* LOCATION */}
          <GridItem xs={12}>
            <CustomInput
              value={this.state.location}
              labelText="Location"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                onChange: e => this.setState({...this.state, location: e.target.value})
              }}
            />
          </GridItem>
          {/* ETHICAL RECRUITMENT Assessment */}
          <GridItem xs={12}>
            <CustomInput
              value={this.state.assesment}
              labelText="Ethical Recruitment Assessment"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                onChange: e => this.setState({...this.state, assesment: e.target.value})
              }}
            />
          </GridItem>
          {/* ETHICAL RECRUITMENT SUPPLIER CONTACTS */}
          <GridItem xs={12}>
            <CustomInput
              value={this.state.supplier_contacts}
              labelText="Ethical Recruitment Supplier Contacts"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                onChange: e => this.setState({...this.state, supplier_contacts: e.target.value})
              }}
            />
          </GridItem>
          {/* ETHICAL RECRUITMENT RECRUITER CONTACTS */}
          <GridItem xs={12}>
            <CustomInput
              value={this.state.recruiter_contacts}
              labelText="Ethical Recruitment Recruiter Contacts"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                onChange: e => this.setState({...this.state, recruiter_contacts: e.target.value})
              }}
            />
          </GridItem>
          {/* ETHICAL RECRUITMENT ISSARA FOCAL POINTS */}
          <GridItem xs={12} className='mt-2'>
            <IssaraStaffDropdown
              value={this.state.issara_staff}
              multipleselect={true}
              onSelect={ users => this.setState({...this.state, issara_staff: users}) }
              name={"Ethical Recruitment Issara Focal Points"}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

GeneralInformationFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(GeneralInformationFields);
