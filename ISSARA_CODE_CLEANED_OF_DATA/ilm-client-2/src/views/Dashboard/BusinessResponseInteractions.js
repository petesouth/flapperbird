import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components

import Timeline from "components/Timeline/Timeline.js";

import WorkIcon from '@material-ui/icons/Work';


const style = {
  newInteractionGridItem: {
    padding: '0 !important',
  },
};


class BusinessResponseInteractions extends React.Component {

  sendState = () => {
    return this.state;
  }

  render() {
    const { classes } = this.props;

    const widgetStories = [
      {
        // First story
        badgeColor: "success",
        badgeIcon: WorkIcon,
        title: "Business Response",
        titleColor: "success",
        body: (
          <div>
            <p> The client said that he has problems with getting cancellation letter. </p>
            <p style={{fontWeight:500, margin: 0}}> Sandar Linn </p>
          </div>
        ),
        footerTitle: "2 March 2020, 13:34"
      },
      {
        // First story
        badgeColor: "success",
        badgeIcon: WorkIcon,
        title: "Business Response",
        titleColor: "success",
        body: (
          <div>
            <p> The client would like to follow-up. </p>
            <p style={{fontWeight:500, margin: 0}}> Brendan </p>
          </div>
        ),
        footerTitle: "3 March 2020, 9:34"
      },
      {
        // Third story
        inverted: true,
        badgeColor: "info",
        badgeIcon: WorkIcon,
        title: "Business Response",
        titleColor: "info",
        body: (
          <div>
            <p> Business responded that they can't issue cancellation letter at this time. </p>
            <p style={{ fontWeight:500 }}> Kotchakorn Klachingchai </p>
          </div>
        ),
        footerTitle: "4 March 2020, 14:34"
      },
      {
        // Second story
        badgeColor: "primary",
        badgeIcon: WorkIcon,
        title: "Business Response",
        titleColor: "primary",
        body: (
          <div>
            <p> The client reported that he has decided to return home since he could not get the job with the provided cancellation letter. </p>
            <p style={{fontWeight:500, margin: 0}}> Jonah Htet </p>
          </div>
        ),
        footerTitle: "6 March 2020, 15:34"
      },
      
    ];

    return (
      <div>
        <Timeline stories={widgetStories}/>
      </div>
    );
  }
}

BusinessResponseInteractions.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(BusinessResponseInteractions);
