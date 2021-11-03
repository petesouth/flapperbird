import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.js";

import KpiSelector from "components/ilmdb/KpiSelector.js";

import CustomInput from "components/CustomInput/CustomInput.js";

import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";


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


class CallIssuesForm extends React.Component {



  constructor(props) {
    super(props);

    let selectedKpis = {};


    if (this.props.case_issue !== undefined) {


      if (this.props.case_issue.kpis !== undefined && Array.isArray(this.props.case_issue.kpis) === true && this.props.case_issue.kpis.length > 0) {
        this.props.case_issue.kpis.forEach((kpi) => {
          if (selectedKpis[kpi.kpi_category.id] === undefined) {
            selectedKpis[kpi.kpi_category.id] = new Array();
          }
          selectedKpis[kpi.kpi_category.id].push(kpi.id);
        });
      }
    }


    this.state = {
      issue_description: (props.case_issue) ? props.case_issue.issue_description : "",
      issue_offender_description: (props.case_issue) ? props.case_issue.issue_offender_description : "",
      issue_workers_affected: (props.case_issue) ? props.case_issue.issue_workers_affected : "",
      issue_workers_affected_description: (props.case_issue) ? props.case_issue.issue_workers_affected_description : "",
      issue_getting_better: (props.case_issue) ? props.case_issue.issue_getting_better : "",
      issue_getting_better_description: (props.case_issue) ? props.case_issue.issue_getting_better_description : "",
      issue_category: (props.case_issue) ? ((props.case_issue.kpis !== undefined && props.case_issue.kpis.length < 1 ) ? props.case_issue.issue_category : 1) : undefined,
      selectedKpis: selectedKpis,
    };
  }

  changeState = (state) => {
    this.setState(state);
    if( this.props.onStateChange ) {
      this.props.onStateChange(state);
    }
  }

  sendState = () => {
    return this.state;
  }

  isValidated = () => {
    return true;
  }

  handleIssueCategoryChange = (issueCategory) => {
    this.changeState({
      issue_category: issueCategory,
      selectedKpis: {}
    })
  }

  handleKpiChange = (kpiCategory, kpi) => {

    if (this.state.selectedKpis[kpiCategory]) {
      const currentIndex = this.state.selectedKpis[kpiCategory].indexOf(kpi)
      const newChecked = [...this.state.selectedKpis[kpiCategory]];
      if (currentIndex === -1) {
        newChecked.push(kpi);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      this.changeState({
        selectedKpis: {
          ...this.state.selectedKpis,
          [kpiCategory]: newChecked
        }
      })
    }
    else {
      this.changeState({
        selectedKpis: {
          ...this.state.selectedKpis,
          [kpiCategory]: [kpi]
        }
      })
    }
  }


  render = () => {
    console.log(this.state.selectedKpis)
    const { case_issue } = this.props;




    return (
      <div>
        <GridItem>
          <CustomInput
            id={"case_issue_description"}
            labelText={"Issue Description"}
            isTextArea={true}
            formControlProps={{
              fullWidth: true
            }}
            value={this.state.issue_description}
            inputProps={{
              onChange:(e)=> {
                this.changeState({ issue_description: e.target.value});
              }

            }}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            id={"case_issue_offender_description"}
            labelText={"Issue Offender Description"}
            isTextArea={true}
            formControlProps={{
              fullWidth: true
            }}
            value={this.state.issue_offender_description}
            inputProps={{
              onChange:(e)=> {
                this.changeState({ issue_offender_description: e.target.value});
              }

            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <CustomInput
            id="issue_workers_affected"
            labelText="How many workers are affected by this issue?"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "number",
              onChange: (e) => {
                let value = e.target.value;
                if( value < 0 ) {
                  value = 0;
                }
                this.changeState({ issue_workers_affected: value });
              }
            }}
            value={`${parseInt(this.state.issue_workers_affected)}` || undefined}
          />
        </GridItem>

        <GridItem>
          <CustomInput
            id={"case_issue_workers_affected_descriptionn"}
            labelText={"Workers Affected Description (More about the workers Affected)"}
            isTextArea={true}
            formControlProps={{
              fullWidth: true
            }}
            value={this.state.issue_workers_affected_description}
            inputProps={{
              onChange:(e)=> {
                this.changeState({ issue_workers_affected_description: e.target.value});
              }

            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <InputLabel>Is the issue situation improving?</InputLabel>
          <div>
            <FormControlLabel value="yes" control={(<Radio
              checked={this.state.issue_getting_better === 'yes'}
              onChange={() => { this.changeState({ issue_getting_better: "yes" }); }}
              value="yes"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'Yes' }}
            />)} label="Yes" />

            <FormControlLabel value="no" control={(<Radio
              checked={this.state.issue_getting_better === 'no'}
              onChange={() => { this.changeState({ issue_getting_better: "no" }); }}
              value="no"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'No' }}
            />)} label="No" />

          <FormControlLabel value="same" control={(<Radio
              checked={this.state.issue_getting_better === 'same'}
              onChange={() => { this.changeState({ issue_getting_better: "same" }); }}
              value="same"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'About the Same' }}
            />)} label="About the Same" />
          </div>
        </GridItem>
        <GridItem>
          <CustomInput
            id={"case_issue_getting_better_description"}
            labelText={"Describe more about how the issue is getting better or worse"}
            isTextArea={true}
            formControlProps={{
              fullWidth: true
            }}
            value={this.state.issue_getting_better_description}
            inputProps={{
              onChange:(e)=> {
                this.changeState({ issue_getting_better_description: e.target.value});
              }

            }}
          />
        </GridItem>

        <GridItem xs={12}>
          <KpiSelector
            issueCategory={this.state.issue_category}
            selectedKpis={this.state.selectedKpis}
            onSelectIssueCategory={this.handleIssueCategoryChange}
            onSelectKpi={this.handleKpiChange}
          />
        </GridItem>
      </div>
    );
  }
}

CallIssuesForm.propTypes = {
  classes: PropTypes.object,
  case_issue: PropTypes.object,
  onStateChange: PropTypes.func
};

export default withStyles(style)(CallIssuesForm);
