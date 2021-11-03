import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";


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


class WorkingLivingConditionsFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      conditions_health_and_safety: 1,
      conditions_document_control: 1,
      conditions_workers_housing: 1,
      conditions_freedom_of_movement: 1,
      conditions_notes: '',
      conditions_priority_notes: '',
    };
  }

  sendState() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.globalEditData !== this.props.globalEditData) {
      this.setState({
        conditions_health_and_safety: this.props.globalEditData.conditions_health_and_safety,
        conditions_document_control: this.props.globalEditData.conditions_document_control,
        conditions_workers_housing: this.props.globalEditData.conditions_workers_housing,
        conditions_freedom_of_movement: this.props.globalEditData.conditions_freedom_of_movement,
        conditions_notes: this.props.globalEditData.conditions_notes,
        conditions_priority_notes: this.props.globalEditData.conditions_priority_notes
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridItem>
          <h4 className={classes.infoText}>
            Healthy, Safe, Exploitation-Free Working and Living Conditions
          </h4>
        </GridItem>
        <GridContainer>
          {/* OCCUPATIONAL HEALTH AND SAFETY */}
          <GridItem xs={12}>
            <span> <b> Occupational health and safety </b> </span>
            <ButtonBar name={
              `The Employer ensures a working environment free from hazards and
               risks to the health and safety of workers; workplace incidents
               and injuries are reported to the Agency in a timely manner and
               appropriate action is taken to reduce, or eliminate, workplace hazards.
              `}
              labelWidth={9}
              value={this.state.conditions_health_and_safety}
              onClick={(name, value) => this.setState({...this.state, conditions_health_and_safety: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* DOCUMENT CONTROL BY WORKERS */}
          <GridItem xs={12}>
            <span> <b> Document control by workers </b> </span>
            <ButtonBar name={
              `Identity and work documents of workers are held by and/or
               controlled by workers. If Employers are providing safe storage
               of worker passport and documents, workers can freely access documents
               at any time with minimal delay.
              `}
              labelWidth={9}
              value={this.state.conditions_document_control}
              onClick={(name, value) => this.setState({...this.state, conditions_document_control: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* WORKER HOUSING. */}
          <GridItem xs={12}>
            <span> <b> Worker housing </b> </span>
            <ButtonBar name={
              `Workers are provided with hygienic, safe and decent
               accommodation, as well as transport to the workplace if necessary.
               Basic provisions such as mattress, pillow, blanket, and light
               are provided, and arrangements are made to ensure workers have
               adequate privacy. Key housing and transportation information is
               provided in writing; including information on housing costs
               and how these should be paid; a housing committee is set up to
               enable workers to raise issues related to housing in a formal manner.
              `}
              labelWidth={9}
              value={this.state.conditions_workers_housing}
              onClick={(name, value) => this.setState({...this.state, conditions_workers_housing: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* FREEDOM OF MOVEMENT */}
          <GridItem xs={12}>
            <span> <b> Freedom of movement </b> </span>
            <ButtonBar name={
              `Workers are free to enter and exit their housing
               premises at any time.
              `}
              labelWidth={9}
              value={this.state.conditions_freedom_of_movement}
              onClick={(name, value) => this.setState({...this.state, conditions_freedom_of_movement: value})}
              buttons={[
                { name: "1", value: 1 },
                { name: "2", value: 2 },
                { name: "3", value: 3 },
                { name: "4", value: 4 }
              ]}
            />
          </GridItem>
          {/* NOTES */}
          <GridItem xs={12}>
            <FormControl fullWidth>
              <CustomInput
                labelText="Notes"
                helperText="Notes and points of interest from the discussion"
                formControlProps={{ fullWidth: true }}
                isTextArea={true}
                value={this.state.conditions_notes}
                inputProps={{
                  onChange: e => this.setState({...this.state, conditions_notes: e.target.value})
                }}
              />
            </FormControl>
          </GridItem>
          {/* PRIORITY NOTES */}
          <GridItem xs={12}>
            <CustomInput
              labelText="Priority Notes"
              helperText="Notes on priority issues to be fixed or improved, as discussed by the businesses"
              formControlProps={{ fullWidth: true }}
              isTextArea={true}
              value={this.state.conditions_priority_notes}
              inputProps={{
                onChange: e => this.setState({...this.state, conditions_priority_notes: e.target.value})
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

WorkingLivingConditionsFields.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(WorkingLivingConditionsFields);
