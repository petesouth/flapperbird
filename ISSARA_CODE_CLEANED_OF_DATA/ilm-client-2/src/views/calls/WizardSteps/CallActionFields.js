import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import Button from "components/CustomButtons/Button.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";
import Grid from '@material-ui/core/Grid';
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.js";

import Table from "components/Table/Table.js";
import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";
import ReferralActionsDropdown from "components/ilmdb/ReferralActionsDropdown.js"
import CaseStatusesDropdown from "components/ilmdb/CaseStatusesDropdown";

// material-ui icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import moment from "moment";


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

class CallActionFields extends React.Component {

  constructor(props) {
    super(props);


    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      const { globalEditData } = this.props;

      this.state = {
        vot_needs: (globalEditData) ? globalEditData.vot_needs : undefined,
        client_share_info_consent: (globalEditData) ? globalEditData.client_share_info_consent : undefined,
        referral_notes: (globalEditData) ? globalEditData.referral_notes : undefined,
        next_steps: (globalEditData) ? globalEditData.next_steps : undefined,
        next_steps_issara_staff: (globalEditData && globalEditData.next_steps_issara_staff) ? globalEditData.next_steps_issara_staff.id : undefined,
        referral_action: (globalEditData && globalEditData.referral_action) ? globalEditData.referral_action.id : undefined,
        dead_line_date: (globalEditData) ? globalEditData.dead_line_date : moment().format("YYYY-MM-DD"),
        final_remarks: (globalEditData) ? globalEditData.final_remarks : undefined,
        risk_assessment: (globalEditData) ? globalEditData.risk_assessment : undefined,
        case_status: (globalEditData) ? globalEditData.case_status : 1

      };

    }
  }
  sendState = () => {
    return this.state;
  }
  isValidated = () => {
    return true;
  }

  render() {
    const valueEmpty = " ";

    const { classes, globalEditData } = this.props;

    const simpleButtons = [
      { color: "success", icon: Edit },
      { color: "danger", icon: Close }
    ].map((prop, key) => {
      return (
        <Button
          color={prop.color}
          simple
          className={classes.actionButton}
          key={key}
        >
          <prop.icon className={classes.icon} />
        </Button>
      );
    });



    return (
      <div>
        <form>
          <GridItem>
            <h4 className={classes.infoText}>
              Client Support (Issara Actions)
            </h4>
          </GridItem>

          <GridItem xs={12}>
            <CustomInput
              id={"case_interactions_summary"}
              labelText={"What are the most urgent needs of the client?"}
              isTextArea={true}
              value={this.state.vot_needs}
              formControlProps={{
                fullWidth: true
              }}

              inputProps={{
                onChange: (e) => {
                  this.setState({ vot_needs: e.target.value });
                }
              }}
            />
          </GridItem>

          <GridItem xs={12}>
            <ButtonBar
              value={this.state.client_share_info_consent}
              name={"Consent to pass on details to employer, agency, referral partner?"}
              buttons={[
                { name: "Yes", value: "Yes" },
                { name: "No", value: "No" },
              ]}
              onClick={((name, value) => {
                this.setState({ client_share_info_consent: value });
              })}
            />
          </GridItem>

          
          <GridItem xs={12}>
            <CaseStatusesDropdown value={this.state.case_status}
              onSelect={(e) => {
                this.setState({ case_status: (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value) });
              }} />
          </GridItem>


          <GridItem xs={12}>
            <ReferralActionsDropdown value={this.state.referral_action}
              onSelect={(e) => {
                this.setState({ referral_action: (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value) });
              }} />
          </GridItem>

          <GridItem xs={12}>
            <CustomInput
              id={"case_action_details_summary"}
              value={this.state.referral_notes}
              labelText={"Details on Issara action (Referral Notes)"}
              isTextArea={true}
              formControlProps={{
                fullWidth: true
              }}

              inputProps={{
                onChange: (e) => {
                  this.setState({ referral_notes: e.target.value });
                }
              }}
            />
          </GridItem>

          <GridItem xs={12}>
            <CustomInput
              id={"next-steps"}
              labelText={"Next steps for Issara follow-up and action"}
              value={this.state.next_steps}
              isTextArea={true}
              formControlProps={{
                fullWidth: true
              }}

              inputProps={{
                onChange: (e) => {
                  this.setState({ next_steps: e.target.value });
                }
              }}
            />
          </GridItem>

          <GridItem xs={12}>
            <IssaraStaffDropdown
              value={this.state.next_steps_issara_staff}
              onSelect={(issaraStaffId) => {
                this.setState({ next_steps_issara_staff: issaraStaffId });
              }}
              name={"Responsible Issara focal point"}
            />
          </GridItem>

          <GridContainer>
            <GridItem xs={6}>
              <InputLabel className={classes.label}> Deadline </InputLabel>
              <FormControl justify="space-around">
                <Datetime
                  value={this.state.dead_line_date}
                  id="case_interactions_interaciton_date"
                  timeFormat={false}
                  inputProps={{
                    placeholder: "Deadline Date",
                  }}
                  onChange={(newDate) => {
                    this.setState({ dead_line_date: (newDate && newDate.format !== undefined) ? newDate.format("YYYY-MM-DD") : newDate })
                  }}
                />
              </FormControl>
            </GridItem>

            <GridItem xs={12}>
              <CustomInput
                id={"case_interactions_summary"}
                labelText={"Final Remarks"}
                value={this.state.final_remarks}
                isTextArea={true}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => {
                    this.setState({ final_remarks: e.target.value });
                  }
                }}
              />
            </GridItem>
         

          <GridItem xs={12}>
              <CustomInput
                id={"case_risk_assessment"}
                labelText={"Risk Assessment"}
                value={this.state.risk_assessment}
                isTextArea={true}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => {
                    this.setState({ risk_assessment: e.target.value });
                  }
                }}
              />
            </GridItem>
          </GridContainer>


        </form>

      </div>
    );
  }
}

CallActionFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(CallActionFields);
