import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { useDispatch, useSelector } from "react-redux";


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
    ...styles
};

const useStyles = makeStyles(customStyles);

export default function ConsentAnswersDropdown(props) {
    const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


    const consentAnswers = useSelector(state => [
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' },
        { id: 2, name: 'Not sure; forgot to ask and need to check back to confirm' }
    ])
    const dispatch = useDispatch();

    const [shareInfoConsentId, setShareInfoConsentId] = useState(" ");



    const classes = useStyles();

    const handleChangeShareInfoConsentId = (e) => {
        setShareInfoConsentId(e.target.value);
        propsOnSelect({
            ...e,
            list: consentAnswers
        });
    }


    return (
      <FormControl
          fullWidth
          className={classes.selectFormControl}
      >
          <InputLabel
              htmlFor="shareInfoConsent-select"
              className={classes.selectLabel}
          >
              Client Information Consent
          </InputLabel>
          <Select
              key={utils.giveMeGuid()}
              value={shareInfoConsentId}
              onChange={handleChangeShareInfoConsentId}
              inputProps={{
                  name: "shareInfoConsentSelect",
                  id: "shareInfoConsent-select"
              }}
          >
              <MenuItem value={" "} key={utils.giveMeGuid()}>Type of Client Information Consent</MenuItem>
              {consentAnswers && Object.keys(consentAnswers).map((obj, i) => {
                  return <MenuItem value={consentAnswers[obj].id} key={utils.giveMeGuid()}> {consentAnswers[obj].name} </MenuItem>
              })}
          </Select>
      </FormControl>
    );
}
