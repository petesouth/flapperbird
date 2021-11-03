import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { useDispatch, useSelector } from "react-redux";

import { fetchNationalities } from "../../redux/actions/LocaleActions.js";

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

  const nationalities = useSelector(state => state.nationalitiesReducer.items)
  const dispatch = useDispatch();

  const [nationalityId, setNationalityId] = useState((props.value) ? props.value : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchNationalities())
    }
  }, [nationalityId]);


  const classes = useStyles();

  const handleChangeNationalityId = (e) => {
    setNationalityId(e.target.value);
    propsOnSelect({
      ...e,
      list: nationalities
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
        Nationality
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={nationalityId}
        onChange={handleChangeNationalityId}
        inputProps={{
          name: "nationalitySelect",
          id: "nationality-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}>Nationality</MenuItem>
        {nationalities && Object.keys(nationalities).map((obj, i) => {
          return <MenuItem value={nationalities[obj].id} key={utils.giveMeGuid()}> {nationalities[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
