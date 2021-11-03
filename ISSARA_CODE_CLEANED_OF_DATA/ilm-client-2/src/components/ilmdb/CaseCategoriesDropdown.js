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

import { fetchCaseCategories } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function CaseCategoriesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const caseCategories = useSelector(state => state.caseCategoriesReducer.items)
  const dispatch = useDispatch();

  const valueEmpty = " ";
  const [caseCategoryId, setCaseCategoryId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchCaseCategories())
    }
  }, [caseCategoryId]);



  const classes = useStyles();

  const handleChangeCaseCategoryId = (e) => {
    setCaseCategoryId(e.target.value);
    propsOnSelect({
      ...e,
      list: caseCategories
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
        Case/Call Type
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={caseCategoryId}
        onChange={handleChangeCaseCategoryId}
        inputProps={{
          name: "callTypeSelect",
          id: "callType-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Type of Call/Case</MenuItem>
        {caseCategories && Object.keys(caseCategories).map((obj, i) => {
          return <MenuItem value={caseCategories[obj].id} key={utils.giveMeGuid()}> {caseCategories[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
