import React from "react";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import NewEthicalRecruitmentMeetingWizardView from "./NewEthicalRecruitmentMeetingWizardView.js"


export default function () {
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} lg={12}>
        <NewEthicalRecruitmentMeetingWizardView/>
      </GridItem>
    </GridContainer>
  )
}
