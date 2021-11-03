import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.js";

import CallIssuesForm from "./CallIssuesForm.js"


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


class CallIssues extends React.Component {



  constructor(props) {
    super(props);

    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      this.state = {
        issue_description: (props.globalEditData) ? props.globalEditData.issue_description : undefined,
        issue_offender_description: (props.globalEditData) ? props.globalEditData.issue_offender_description : undefined,
        
        issue_workers_affected: (props.globalEditData) ? props.globalEditData.issue_workers_affected : undefined,
        issue_workers_affected_description: (props.globalEditData) ? props.globalEditData.issue_workers_affected_description : undefined,
        issue_getting_better: (props.globalEditData) ? props.globalEditData.issue_getting_better : undefined,
        issue_getting_better_description: (props.globalEditData) ? props.globalEditData.issue_getting_better_description : undefined,
        issue_category: (props.globalEditData && props.globalEditData.issue_category) ? props.globalEditData.issue_category.id : 1,
        kpis: (props.globalEditData) ? props.globalEditData.kpis : undefined,
        selectedKpis: (()=>{
          let selected = {};
          if( props.globalEditData !== undefined && props.globalEditData.kpis !== undefined && props.globalEditData.kpis.forEach !== undefined ) {
            props.globalEditData.kpis.forEach((kpi)=>{
              if( selected[kpi.kpi_category.id] === undefined || selected[kpi.kpi_category.id] === null) {
                selected[kpi.kpi_category.id] = new Array();
              }
              selected[kpi.kpi_category.id].push(kpi.id);
            });
          }
          return selected;
        
        })()
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
    const { classes } = this.props;
    const case_issue = {
      issue_category: this.state.issue_category,
      kpis: this.state.kpis,
      issue_description: this.state.issue_description,
      issue_offender_description: this.state.issue_offender_description,
      issue_workers_affected: this.state.issue_workers_affected,
      issue_workers_affected_description: this.state.issue_workers_affected_description,
      issue_getting_better: this.state.issue_getting_better,
      issue_getting_better_description: this.state.issue_getting_better_description,
      selectedKpis: this.state.selectedKpis
    };



    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Issues at this workplace
          </h4>
        </GridItem>
        <GridItem>
          <p>
            <b> Instructions: </b>
            <br />
            If the client is adding more information or updates on a previously reported issue,
            please click the green pen by the relevant KPI to update.
            <br />
            If the client is reporting a new issue at the workplace, please click the green New Issue button.
          </p>
        </GridItem>


        <GridItem>
          {(<div>
            <CallIssuesForm case_issue={case_issue} onStateChange={(state) => {
              this.setState(Object.assign({}, state));
            }} /></div>)}

        </GridItem>
      </div>
    );
  }
}

CallIssues.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(CallIssues);
