import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

// core components

import { useDispatch, useSelector } from "react-redux";

import { fetchCountries } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";

const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function CountriesDropdown(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const countries = useSelector(state => state.countriesReducer.items)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchCountries())
    }
  }, []);

  const handleChangeCountryId = (e) => {
    props.onSelect({
      ...e,
      list: countries
    });
  }


  return (
    <FormControl fullWidth={true}>
      <InputLabel
        htmlFor="country-select"
        className={classes.selectLabel}
      >
        Country
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={props.values? props.values : ''}
        onChange={handleChangeCountryId}
        inputProps={{
          name: "countrySelect",
          id: "country-select"
        }}
      >
        {countries && countries.map((item, i) => {
          return <MenuItem value={item.id} key={i}> {item.name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

// Default values for props:
CountriesDropdown.defaultProps = {
  onSelect: (selectedCountry) => console.log('Selected country: ', selectedCountry),
};
