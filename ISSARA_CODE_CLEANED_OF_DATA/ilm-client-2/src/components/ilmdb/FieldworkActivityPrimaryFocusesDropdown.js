import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

import { fetchFieldworkPrimaryFocuses } from "../../redux/actions/TeamActivityActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";

const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function FieldworkActivityPrimaryFocusesDropdown(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const fieldworkPrimaryFocuses = useSelector(state => state.teamActivityReducer.fieldworkPrimaryFocuses)
  const fetchingFieldworkPrimaryFocuses = useSelector(state => state.teamActivityReducer.fetchingFieldworkPrimaryFocuses)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchFieldworkPrimaryFocuses())
    }
  }, []);

  const handleChangePrimaryFocusId = (e) => {
    props.onSelect(e.target.value)
  }

  return (
    fetchingFieldworkPrimaryFocuses?
      <p>  Fetching primary focuses.. </p>
      :
      <FormControl fullWidth={true}>
        <InputLabel
          htmlFor="activity-primary-focus-select"
          className={classes.selectLabel}
        >
            Activity Primary Focus
        </InputLabel>
        <Select
          id="activity-primary-focus-select"
          value={props.value? props.value : ''}
          onChange={handleChangePrimaryFocusId}
        >
          {fieldworkPrimaryFocuses.map((item, i) => {
            return <MenuItem value={item.id} key={i}> {item.name} </MenuItem>
          })}
        </Select>
      </FormControl>
  );
}

// Default values for props:
FieldworkActivityPrimaryFocusesDropdown.defaultProps = {
  onSelect: (selectedPrimaryFocus) => console.log('Selected primary focus: ', selectedPrimaryFocus),
};
