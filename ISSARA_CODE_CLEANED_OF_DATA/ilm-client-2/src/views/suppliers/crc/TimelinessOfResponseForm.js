import React from "react";


// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { FormControl } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";

import Button from "components/CustomButtons/Button.js";


import withStyles from "@material-ui/core/styles/withStyles";
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useStyles = makeStyles(styles);



const style = {

};


class TimelinessOfResponseForm extends React.Component {

  constructor(props) {
    super(props);

    const { globalEditData } = this.props;

    this.state = {
      duration_of_time_taken_to_respond: (globalEditData) ? globalEditData.duration_of_time_taken_to_respond : null,
      duration_of_time_taken_to_revert_on_action_plan: (globalEditData) ? globalEditData.duration_of_time_taken_to_revert_on_action_plan : null,
      duration_of_time_taken_to_resolve_issues: (globalEditData) ? globalEditData.duration_of_time_taken_to_resolve_issues : null,
      response_timeliness_comments: (globalEditData) ? globalEditData.response_timeliness_comments : ''
    };
  }

  sendState() {
    return this.state;
  }

  render() {
    const { readOnly } = this.props;
    return (
      <form className='mt-2'>
        <GridItem>
          <ButtonBar name="Duration Of Time Taken To Respond"
            readOnly={readOnly}
            value={this.state.duration_of_time_taken_to_respond}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                duration_of_time_taken_to_respond: value
              })
            }}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}
          />
        </GridItem>
        <GridItem>
          <ButtonBar name="Duration Of Time Taken To Revert On Action Plan"
            readOnly={readOnly}
            value={this.state.duration_of_time_taken_to_revert_on_action_plan}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                duration_of_time_taken_to_revert_on_action_plan: value
              })
            }}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}
          />
        </GridItem>
        <GridItem>
          <ButtonBar name="Duration Of Time Taken To Resolve Issues"
            readOnly={readOnly}
            value={this.state.duration_of_time_taken_to_resolve_issues}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                duration_of_time_taken_to_resolve_issues: value
              })
            }}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}
          />
        </GridItem>
        <GridItem>
        {(readOnly === true) ? <div>
            <h5>Additional Comments:</h5>
            <p style={{
            whiteSpace: "pre-wrap",
            wordBreak: "keep-all",
            scroll: "none",
            width: "100%"
          }}>{(this.state.response_timeliness_comments && this.state.response_timeliness_comments !== "" ) ? this.state.response_timeliness_comments : "N/A"}
          </p> </div>: <CustomInput
            isTextArea={true}
            labelText="Additional Comments"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: (e) => {
                this.setState({
                  ...this.state,
                  response_timeliness_comments: e.target.value
                })
              }
            }}
            value={this.state.response_timeliness_comments}
          // helperText="Additional Comments"
          />}
        </GridItem>
      </form>
    );
  }
}


export default withStyles(style)(TimelinessOfResponseForm);
