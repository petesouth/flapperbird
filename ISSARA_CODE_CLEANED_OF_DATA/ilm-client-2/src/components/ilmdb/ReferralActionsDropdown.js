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

import { fetchReferralActions } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ReferralActionsDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const referralActions = useSelector(state => state.referralActionsReducer.items)
  const dispatch = useDispatch();

  const valueEmpty = " ";
  const [referralActionsId, setReferralActionId] = useState((props.value) ? props.value : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchReferralActions())
    }
  }, [referralActionsId]);



  const classes = useStyles();

  const handleChangeReferralActionId = (e) => {
    setReferralActionId(e.target.value);
    console.log(e.target.value)
    propsOnSelect({
      ...e,
      list: referralActions
    });
  }

  console.log(referralActions)

  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="referralactions-select"
        className={classes.selectLabel}
      >
        Referral Actions
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={referralActionsId}
        onChange={handleChangeReferralActionId}
        inputProps={{
          name: "referralActionsSelect",
          id: "referralActionsSelect"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Referral Actions</MenuItem>
        {referralActions && Object.keys(referralActions).map((obj, i) => {
          return <MenuItem value={referralActions[obj].id} key={utils.giveMeGuid()}> {referralActions[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
