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

import { fetchClientTypes } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ClientTypesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const clientTypes = useSelector(state => state.clientTypesReducer.items)
  const dispatch = useDispatch();

  const valueEmpty = " ";
  const [clientTypeId, setClientTypeId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchClientTypes())
    }
  }, [clientTypeId]);



  const classes = useStyles();

  const handleChangeClientTypeId = (e) => {
    setClientTypeId(e.target.value);
    propsOnSelect({
      ...e,
      list: clientTypes
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="callType-select"
        className={classes.selectLabel}
      >
        Client Type
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={clientTypeId}
        onChange={handleChangeClientTypeId}
        inputProps={{
          name: "callTypeSelect",
          id: "callType-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Type of Client</MenuItem>
        {clientTypes && Object.keys(clientTypes).map((obj, i) => {
          return <MenuItem value={clientTypes[obj].id} key={utils.giveMeGuid()}> {clientTypes[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
