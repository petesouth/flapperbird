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


export default function ReferralActionsConsentDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const referralActionsConsent = useSelector(state=> [
    { id: '1', value: 'No' },
    { id: '2', value: 'Yes' },
    { id: '3', value: 'Not sure; forgot to ask and need to check back to confirm' }
  ])
  const dispatch = useDispatch();

  const [referralActionConsentId, setReferralActionConsentId] = useState(" ");



  const classes = useStyles();

  const handleChangeReferralActionConsentId = (e) => {
    setReferralActionConsentId(e.target.value);
    propsOnSelect({
      ...e,
      list: referralActionsConsent
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="referralActionConsent-select"
        className={classes.selectLabel}
      >
        Referral Action Consent
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={referralActionConsentId}
        onChange={handleChangeReferralActionConsentId}
        inputProps={{
          name: "referralActionSelect",
          id: "referralAction-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}>Referral Consent Action</MenuItem>
        {referralActionsConsent && Object.keys(referralActionsConsent).map((obj, i) => {
          return <MenuItem value={referralActionsConsent[obj].id} key={utils.giveMeGuid()}> {referralActionsConsent[obj].value} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
