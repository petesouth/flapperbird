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

import { fetchEthnicities } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function NationalitiesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const valueEmpty = " ";

  const ethnicities = useSelector(state => state.ethnicitiesReducer.items)
  const dispatch = useDispatch();

  const [ethnicityId, setEthnicityId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchEthnicities())
    }
  }, [ethnicityId]);


  const classes = useStyles();

  const handleChangeEthnicityd = (e) => {
    setEthnicityId(e.target.value);
    propsOnSelect({
      ...e,
      list: ethnicities
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="nationality-select"
        className={classes.selectLabel}
      >
        Ethnicity
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={ethnicityId}
        onChange={handleChangeEthnicityd}
        inputProps={{
          name: "nationalitySelect",
          id: "nationality-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}>Ethnicity</MenuItem>
        {ethnicities && Object.keys(ethnicities).map((obj, i) => {
          return <MenuItem value={ethnicities[obj].id} key={utils.giveMeGuid()}> {ethnicities[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
