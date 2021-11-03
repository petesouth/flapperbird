import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Button from "components/CustomButtons/Button.js";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.js";

import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";


// material-ui icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";


const style = {
  infoText: {
    fontWeight: "300",
    margin: "12px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};

class TeamActionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onSelect: ((props.onSelect) ? props.onSelect : (e) => { })
    };
  }
  sendState = () => {
    return this.state;
  }
  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }
  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "length":
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  }

  isValidated = () => {
    return true;
  }

  render() {
    const { classes } = this.props;

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
              Add/Edit Team Task
          </h4>
          </GridItem>

          <GridContainer className='mt-6'>
            <GridItem xs={6}>
              <InputLabel className={classes.label}> Deadline </InputLabel>
              <FormControl justify="space-around">
                <Datetime
                  id="case_interactions_interaciton_date"
                  timeFormat={false}
                  inputProps={{ placeholder: "Deadline Date" }}
                />
              </FormControl>
            </GridItem>

          </GridContainer>

          <GridContainer>
            <GridItem xs={6}>
              <IssaraStaffDropdown
                onSelect={(e) => { console.log("Issara Staff Taskced by Id Selected:", e); }}
                name={"Tasked By"}
              />
            </GridItem>

            <GridItem xs={6}>
              <IssaraStaffDropdown
                onSelect={(e) => { console.log("Issara Staff Responsible Id Selected:", e); }}
                name={"Responsible Issara focal point"}
              />
            </GridItem>

          </GridContainer>


          <GridContainer>
            <GridItem xs={12}>
              <FormControl fullWidth>
                <CustomInput
                    id={"team_task"}
                    labelText={"A sumamry of the task to be completed"}
                    isTextArea={true}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
              </FormControl>
            </GridItem>

            <GridItem xs={12}>
              <FormControl fullWidth>
                <CustomInput
                    id={"team_general_notes"}
                    labelText={"General Notes"}
                    isTextArea={true}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
              </FormControl>
            </GridItem>
          </GridContainer>

          <GridItem>
            <Button color="success" onClick={this.state.onSelect}>Save</Button>
          </GridItem>

        </form>


      </div>
    );
  }
}


export default withStyles(style)(TeamActionForm);
