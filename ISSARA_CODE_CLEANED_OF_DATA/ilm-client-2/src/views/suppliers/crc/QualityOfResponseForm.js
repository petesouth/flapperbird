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


class QualityOfResponseForm extends React.Component {

  constructor(props) {
    super(props);

    const { globalEditData } = this.props;

    this.state = {
      avg_worker_response_feedback: (globalEditData) ? globalEditData.avg_worker_response_feedback : null,
      avg_worker_recruitment_mngmt_feedback: (globalEditData) ? globalEditData.avg_worker_recruitment_mngmt_feedback : null,
      issara_tech_assessment_response_quality_hr: (globalEditData) ? globalEditData.issara_tech_assessment_response_quality_hr : null,
      issara_tech_assessment_response_quality_production: (globalEditData) ? globalEditData.issara_tech_assessment_response_quality_production : null,
      issara_tech_assessment_response_quality_sr_mngmt: (globalEditData) ? globalEditData.issara_tech_assessment_response_quality_sr_mngmt : null,
      response_quality_comments: (globalEditData) ? globalEditData.response_quality_comments : '',
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
          <ButtonBar name="Level of satisfaction of workers with business response to issues"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.avg_worker_response_feedback}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                avg_worker_response_feedback: value
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
          <ButtonBar name="Level of satisfaction of workers with labour recruitment and management in this workplace"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.avg_worker_recruitment_mngmt_feedback}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                avg_worker_recruitment_mngmt_feedback: value
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
          <ButtonBar name="Issara technical assessment of quality of response: HR department"
           readOnly={readOnly}
           labelWidth={7}
            value={this.state.issara_tech_assessment_response_quality_hr}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                issara_tech_assessment_response_quality_hr: value
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
          <ButtonBar name="Issara technical assessment of quality of response: Production "
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.issara_tech_assessment_response_quality_production}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                issara_tech_assessment_response_quality_production: value
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
          <ButtonBar name="Issara technical assessment of quality of response: Senior management"
            readOnly={readOnly}
            labelWidth={7}
            value={this.state.issara_tech_assessment_response_quality_sr_mngmt}
            onClick={(name, value) => {
              this.setState({
                ...this.state,
                issara_tech_assessment_response_quality_sr_mngmt: value
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
          }}>{(this.state.response_quality_comments && this.state.response_quality_comments !== "" ) ? this.state.response_quality_comments : "N/A"}
          </p> </div>: <CustomInput
            isTextArea={true}
            labelText="Additional Comments"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: (e) => {
                this.setState({
                  ...this.state,
                  response_quality_comments: e.target.value
                })
              }
            }}
            value={this.state.response_quality_comments}
          // helperText="Additional Comments"
          />}
        </GridItem>
      </form>
    );
  }
}


export default withStyles(style)(QualityOfResponseForm);
