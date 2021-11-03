import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components

import { useDispatch, useSelector } from "react-redux";

import { fetchSubIndustries } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";

const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function SubIndustriesDropdown(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const industries = useSelector(state => state.subIndustriesReducer.items)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchSubIndustries())
    }
  }, []);

  const handleChangeIndustryId = (e) => {
    props.onSelect({
      ...((e.target.value === '') ? { target: { value: null } } : e),
      list: industries
    });
  }

  let filteredIndustries = new Array();

  if(industries) {
    industries.forEach((industry)=>{
      if(props.industryId === undefined || props.industryId === null || industry.industry === props.industryId ) {
        filteredIndustries.push(industry);
      }
    });
  }

  return (
    <FormControl fullWidth={true}>
      <InputLabel
        htmlFor="country-select"
        className={classes.selectLabel}
      >
        Sub-industry
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={props.value? props.value : ''}
        onChange={handleChangeIndustryId}
        inputProps={{
          name: "industrySelect",
          id: "industry-select"
        }}
      >
        <MenuItem value={''} key={utils.giveMeGuid()}><br/></MenuItem>

        {filteredIndustries && filteredIndustries.map((item, i) => {
          return <MenuItem value={item.id} key={i}> {item.name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

// Default value for props:
SubIndustriesDropdown.defaultProps = {
  onSelect: (selectedIndustry) => console.log('Selected Industry: ', selectedIndustry),
};
