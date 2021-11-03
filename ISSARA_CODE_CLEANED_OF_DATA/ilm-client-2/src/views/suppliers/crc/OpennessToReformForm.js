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
import ButtonBar from "../../../components/ButtonBar/ButtonBar.js";

import Button from "components/CustomButtons/Button.js";


import withStyles from "@material-ui/core/styles/withStyles";
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useStyles = makeStyles(styles);



const style = {

  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    scroll: "none",
    width: "100%"
  }

};


class OpennessToReformForm extends React.Component {

  constructor(props) {
    super(props);

    const { globalEditData } = this.props;


    this.state = {
      site_cooperation_with_ethicall_distribution: (globalEditData) ? globalEditData.site_cooperation_with_ethicall_distribution : null,
      business_attitude_toward_suggested_remedies: (globalEditData) ? globalEditData.business_attitude_toward_suggested_remedies : null,
      business_attitude_toward_capacity_and_risks: (globalEditData) ? globalEditData.business_attitude_toward_capacity_and_risks : null,
      business_attitude_toward_promoting_worker_voice: (globalEditData) ? globalEditData.business_attitude_toward_promoting_worker_voice : null,
      business_attitude_toward_worker_treatment: (globalEditData) ? globalEditData.business_attitude_toward_worker_treatment : null,
      business_attitude_toward_issara: (globalEditData) ? globalEditData.business_attitude_toward_issara : null,
      response_openness_comments: (globalEditData) ? globalEditData.response_openness_comments : ''
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
          <ButtonBar name="Level of cooperation on distribution of worker voice channels, outreach, surveys, and ER"
            labelWidth={7}
            readOnly={readOnly}
            value={this.state.site_cooperation_with_ethicall_distribution}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                site_cooperation_with_ethicall_distribution: value
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
          <ButtonBar name="Business attitude toward discussion of risks and suggested remediation"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.business_attitude_toward_suggested_remedies}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                business_attitude_toward_suggested_remedies: value
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
          <ButtonBar name="Business attitude toward capacity and systems development related to identified risks"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.business_attitude_toward_capacity_and_risks}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                business_attitude_toward_capacity_and_risks: value
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
          <ButtonBar name="Business attitude toward promoting worker voice in their industry and supply chain"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.business_attitude_toward_promoting_worker_voice}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                business_attitude_toward_promoting_worker_voice: value
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
          <ButtonBar name="Business attitude toward and treatment of workers"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.business_attitude_toward_worker_treatment}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                business_attitude_toward_worker_treatment: value
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
          <ButtonBar name="Business attitude toward and treatment of Issara team"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.business_attitude_toward_issara}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                business_attitude_toward_issara: value
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
          }}>{(this.state.response_openness_comments && this.state.response_openness_comments !== "" ) ? this.state.response_openness_comments : "N/A"}
          </p> </div>: <CustomInput
            isTextArea={true}
            labelText="Additional Comments"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: (e) => {
                this.setState({
                  ...this.state,
                  response_openness_comments: e.target.value
                })
              }
            }}
            value={this.state.response_openness_comments}
          // helperText="Additional Comments"
          />}

        </GridItem>
      </form>
    );
  }
}


export default withStyles(style)(OpennessToReformForm);
