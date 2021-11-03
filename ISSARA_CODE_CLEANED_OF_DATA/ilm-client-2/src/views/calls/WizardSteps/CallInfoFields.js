import React from "react";
import PropTypes from "prop-types";
import moment from 'moment';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";


import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";




import ButtonBar from "components/ButtonBar/ButtonBar.js";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";

import ChannelsDropdown from "components/ilmdb/ChannelsDropdown.js";
import ReasonsDropdown from "components/ilmdb/ReasonsDropdown.js";

import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";

import FormLabel from '@material-ui/core/FormLabel';






// material-ui icons
import utils from "../../../services/utils.js";

import HowHearIssara from "components/ilmdb/HowHearIssara";


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

// WILL BE TAKEN FROM REDUX
const checkboxes = [
  {
    name: 'check-box-1',
    id: 1,
    label: 'Check Box 1',
  },
  {
    name: 'check-box-2',
    id: 2,
    label: 'Check Box 2',
  },
  {
    name: 'check-box-3',
    id: 3,
    label: 'Check Box 3',
  },
  {
    name: 'check-box-4',
    id: 4,
    label: 'Check Box 4',
  },
];


class CallInfoFields extends React.Component {
  constructor(props) {
    super(props);


    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {

      let caseInteractionObj = (props.globalEditData !== undefined &&
        props.globalEditData.case_interactions !== undefined &&
        Array.isArray(props.globalEditData.case_interactions) &&
        props.globalEditData.case_interactions.length > 0) ? props.globalEditData.case_interactions[props.globalEditData.case_interactions.length - 1] : {};


      this.state = {
        id: caseInteractionObj.id,
        issara_staff_id: (caseInteractionObj.issara_staff) ? caseInteractionObj.issara_staff.id : undefined,
        issara_staff: (caseInteractionObj.issara_staff) ? caseInteractionObj.issara_staff : undefined,
        interaction_channel: (caseInteractionObj.interaction_channel) ? caseInteractionObj.interaction_channel.id : undefined,
        interaction_reason: (caseInteractionObj.interaction_reason) ? caseInteractionObj.interaction_reason.id : undefined,
        type: caseInteractionObj.type ? caseInteractionObj.type : 'Incoming',
        summary: caseInteractionObj.summary,
        interacted: (caseInteractionObj.interacted !== undefined) ? caseInteractionObj.interacted : moment().format("YYYY-MM-DD"),
        type: (caseInteractionObj.type !== undefined) ? caseInteractionObj.type : "Incomming",
        case_how_hear_issara: (props.globalEditData) ? props.globalEditData.case_how_hear_issara : undefined

      };

    }
  }


  changeState = (name, value) => {

    this.setState({ [name]: value, [name + "_error"]: undefined });
  }


  sendState() {
    let returnObj = Object.assign({}, this.state);
    returnObj.was_validated = this.isValidated();
    return returnObj;
  }


  isValidated = () => {
    let isValid = true;
    let errorsInState = {};

    if (this.state.issara_staff_id == undefined) {
      errorsInState["issara_staff_id_error"] = (<FormLabel error>Issara Staff must be selected</FormLabel>);
    }

    if (this.state.interaction_channel == undefined) {
      errorsInState["interaction_channel_error"] = (<FormLabel error>Interaction Channel must be selected</FormLabel>);
    }

    if (this.state.interaction_reason == undefined) {
      errorsInState["interaction_reason_error"] = (<FormLabel error>Interaction Reason must be selected</FormLabel>);
    }

    if (this.state.interacted == undefined) {
      errorsInState["interacted_error"] = (<FormLabel error>interacted Date must be selected</FormLabel>);
    }



    if (Object.keys(errorsInState).length > 0) {
      isValid = false;
      this.setState(errorsInState);
    }

    return isValid;
  }

  render = () => {
    const { classes, globalEditData } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Call/Message Info
          </h4>
        </GridItem>

        <div>
          <GridContainer>


            <GridItem xs={12} sm={12} md={12} lg={6}>
              {this.state.issara_staff_id_error}
              <IssaraStaffDropdown
                value={this.state.issara_staff_id}
                onSelect={(staff_id, allUsers) => {
                  let issaraStaffMemeber = {};
                  if (allUsers) {
                    allUsers.forEach((user) => {
                      if (user.id === staff_id) {
                        issaraStaffMemeber = user;
                      }
                    });
                  }
                  this.changeState("issara_staff_id", staff_id);
                  this.changeState("issara_staff", issaraStaffMemeber);

                }}
              />
            </GridItem>


            <GridItem className={classes.buttonBar}>
              <ButtonBar
                value={this.state.type}
                buttons={[
                  { name: "Incoming", value: "Incoming" },
                  { name: "Outgoing", value: "Outgoing" },
                ]}
                onClick={(name, value) => {
                  this.changeState("type", value);
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={12} lg={6} className={classes.newInteractionGridItem}>
              {this.state.interaction_channel_error}
              <ChannelsDropdown key={utils.giveMeGuid()}
                values={this.state.interaction_channel} onSelect={(e) => {
                  console.log("Interaction Channel Selected:", e);
                  this.changeState("interaction_channel", e.target.value);
                }} />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={6} className={classes.newInteractionGridItem}>
              {this.state.interaction_reason_error}
              <ReasonsDropdown key={utils.giveMeGuid()}
                values={this.state.interaction_reason} onSelect={(e) => {
                  console.log("Interaction reason selected:", e);
                  this.changeState("interaction_reason", e.target.value);
                }} />
            </GridItem>
            <GridItem xs={12} className={classes.newInteractionGridItem}>
              {this.state.summary_error}
              <FormControl fullWidth>
                <CustomInput
                  id={"interaction_summary"}
                  labelText={"Summary of the interaction"}
                  isTextArea={true}
                  formControlProps={{
                    fullWidth: true
                  }}
                  value={this.state.summary}
                  inputProps={{
                    onChange: (e) => {
                      this.changeState("summary", e.target.value);
                    }
                  }}
                />
              </FormControl>
            </GridItem>
            <GridContainer justify="space-between" style={{ margin: 0 }}>
              <GridItem>
                <FormControl>
                  {this.state.interacted_error}
                  <Datetime
                    id="case_interactions_interaciton_date"
                    timeFormat={false}
                    value={this.state.interacted}
                    inputProps={{
                      placeholder: "Date of interaction",

                    }}
                    onChange={(newDate) => {
                      this.changeState("interacted", (newDate && newDate.format !== undefined) ? newDate.format("YYYY-MM-DD") : newDate);
                    }}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>



          </GridContainer>
        </div>



        <GridItem>
          <br />
        </GridItem>

        <GridItem>
          <HowHearIssara key={utils.giveMeGuid()} values={this.state.case_how_hear_issara} onChange={(checkedItems) => {
            this.setState({ case_how_hear_issara: checkedItems });
          }} />
        </GridItem>


      </div>
    );
  }
}

CallInfoFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(CallInfoFields);
