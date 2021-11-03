import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Timeline from "components/Timeline/Timeline.js";

// material-ui icons
import CallIcon from '@material-ui/icons/Call';
import AddIcon from '@material-ui/icons/Add';
import utils from "services/utils.js";


const style = {
  newInteractionGridItem: {
    // padding: '0 6px !important',
  },
  buttonBar: {
    marginLeft: '-15px !important'
  }
};


class CaseInteractions extends React.Component {
  constructor(props) {
    super(props);

    if (props.allDataWizardSaveState !== undefined) {
      this.state = Object.assign({}, props.allDataWizardSaveState);
    } else {
      let { globalEditData } = this.props;

      this.state = {
        case_interactions: (globalEditData !== undefined && globalEditData.case_interactions !== undefined) ? globalEditData.case_interactions : []
      }
    }
  }

  sendState = () => {
    return this.state;
  }

  render() {
    const { classes } = this.props;


    const widgetStories = [];

    this.state.case_interactions.forEach((interaction) => {
      widgetStories.push({
        badgeColor: "success",
        badgeIcon: CallIcon,
        title: (interaction.interaction_channel) ? interaction.interaction_channel.name : "",
        titleColor: "success",
        body: (
          <div>
            <p style={{ fontWeight: 500, margin: 0 }}>{(interaction.issara_staff) ? interaction.issara_staff.email : ""}</p>
            <p style={{ fontWeight: 500, margin: 0 }}>{(interaction.interaction_reason) ? interaction.interaction_reason.name : ""}</p>
            <p>{interaction.summary}</p>

          </div>
        ),
        footerTitle: interaction.interacted
      });
    });

    return (
      <div>
        <Timeline key={utils.giveMeGuid()} stories={widgetStories} />
      </div>
    );
  }
}

CaseInteractions.propTypes = {
  classes: PropTypes.object,
  globalEditData: PropTypes.object,
};

export default withStyles(style)(CaseInteractions);
