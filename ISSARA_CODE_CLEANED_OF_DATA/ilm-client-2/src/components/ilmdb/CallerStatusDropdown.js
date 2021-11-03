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

import { fetchClientStatuses } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ClientStatusDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const clientStatuses = useSelector(state => state.clientStatusReducer.items)
  const dispatch = useDispatch();

  const valueEmpty = " ";
  const [clientStatusId, setClientStatusId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchClientStatuses())
    }
  }, [clientStatusId]);



  const classes = useStyles();

  const handleChangeClientStatusId = (e) => {
    setClientStatusId(e.target.value);
    propsOnSelect({
      ...e,
      list: clientStatuses
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
        Client Status
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={clientStatusId}
        onChange={handleChangeClientStatusId}
        inputProps={{
          name: "callTypeSelect",
          id: "callType-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Status of Client</MenuItem>
        {clientStatuses && Object.keys(clientStatuses).map((obj, i) => {
          return <MenuItem value={clientStatuses[obj].id} key={utils.giveMeGuid()}> {clientStatuses[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
