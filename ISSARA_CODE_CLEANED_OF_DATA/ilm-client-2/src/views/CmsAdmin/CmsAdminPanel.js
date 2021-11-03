import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const useStyles = makeStyles(styles);


export default function CmsAdminPanel() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card style={{marginTop: 0}}>
          <CardHeader color="rose" icon>
            <h4 className={classes.cardIconTitle}>CMS Django Admin (DB ADMIN)</h4>
          </CardHeader>
          <CardBody>
          <a href={process.env.REACT_APP_API_ADMIN_URL} target="_blank">External CMS Site >></a>
         </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}
