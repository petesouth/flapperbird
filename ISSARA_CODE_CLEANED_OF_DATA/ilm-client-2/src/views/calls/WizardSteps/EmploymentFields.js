import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import ButtonBar from "components/ButtonBar/ButtonBar.js";

import Button from "components/CustomButtons/Button.js";

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

class EmploymentFields extends React.Component {
  constructor(props) {
    super(props);

    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      this.state = {
        rating_source_broker: (props.globalEditData) ? props.globalEditData.rating_source_broker : undefined,
        rating_source_recruiter: (props.globalEditData) ? props.globalEditData.rating_source_recruiter : undefined,
        rating_dest_recruiter: (props.globalEditData) ? props.globalEditData.rating_dest_recruiter : undefined,
        rating_dest_employer: (props.globalEditData) ? props.globalEditData.rating_dest_employer : undefined
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
    const { classes, globalEditData } = this.props;
    return (
      <form>
        <GridItem>
          <h4 className={classes.infoText}>
            Business Ratings - How Does the client rate the following actors
            that were involved in their recruitment and employment ?
          </h4>
          <h4 style={{ textAlign: 'center' }}> (1 very low, 5 very high) </h4>
        </GridItem>
        <div className='mt-2' />
        <GridItem>
          <ButtonBar name={"Source Broker Rating"}
            value={this.state.rating_source_broker}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}

            onClick={(name, value) => {
              this.setState({ rating_source_broker: value });
            }}
          />
        </GridItem>
        <GridItem>
          <ButtonBar name={"Source Recruiter Rating"}
            value={this.state.rating_source_recruiter}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}

            onClick={(name, value) => {
              this.setState({ rating_source_recruiter: value });
            }}
          />
        </GridItem>
        <GridItem>
          <ButtonBar name={"Destination Broker Rating"}
            value={this.state.rating_dest_recruiter}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}

            onClick={(name, value) => {
              this.setState({ rating_dest_recruiter: value });
            }}
          />
        </GridItem>
        <GridItem>
          <ButtonBar name={"Destination Employer Rating"}
            value={this.state.rating_dest_employer}
            buttons={[
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 }
            ]}

            onClick={(name, value) => {
              this.setState({ rating_dest_employer: value });
            }}
          />
        </GridItem>


      </form>
    );
  }
}

EmploymentFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(EmploymentFields);
