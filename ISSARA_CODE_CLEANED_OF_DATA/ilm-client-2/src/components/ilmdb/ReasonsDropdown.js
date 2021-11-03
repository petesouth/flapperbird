import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { useDispatch, useSelector } from "react-redux";

import { fetchReasons } from "../../redux/actions/CallActions";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ReasonsDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const valueEmpty = " ";

  const reasons = useSelector(state => state.callReasons.items)
  const dispatch = useDispatch();

  const [reasonId, setReasonId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchReasons())
    }
  }, [reasonId]);


  const classes = useStyles();

  const handleReasonChannelId = (e) => {
    setReasonId(e.target.value);
    propsOnSelect({
      ...e,
      list: reasons
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="channel-select"
        className={classes.selectLabel}
      >
        Purpose of Call/Message
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={reasonId}
        onChange={handleReasonChannelId}
        inputProps={{
          name: "reasonSelect",
          id: "reason-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}> Purpose</MenuItem>
        {reasons && Object.keys(reasons).map((obj, i) => {
          return <MenuItem value={reasons[obj].id} key={utils.giveMeGuid()}> {reasons[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
