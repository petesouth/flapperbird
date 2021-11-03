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

import { fetchIssueCategories } from "../../redux/actions/IssueActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function IssueCategoriesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const issueCategories = useSelector(state => state.issueCategoriesReducer.items)
  const dispatch = useDispatch();

  const valueEmpty = " ";
  const [issueCategoryId, setCategoryId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchIssueCategories())
    }
  }, [issueCategoryId]);


  const classes = useStyles();

  const handleChangeProvinceId = (e) => {
    setCategoryId(e.target.value);
    propsOnSelect({
      ...e,
      list: issueCategories
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="province-select"
        className={classes.selectLabel}
      >
        Issue Category
      </InputLabel>
      <Select  xs={12} sm={12} md={12} lg={12}
        key={utils.giveMeGuid()}
        value={issueCategoryId}
        onChange={handleChangeProvinceId}
        inputProps={{
          name: "provinceSelect",
          id: "province-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Issue Category</MenuItem>
        {issueCategories && Object.keys(issueCategories).map((obj, i) => {
          return <MenuItem value={issueCategories[obj].id} key={utils.giveMeGuid()}> {issueCategories[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
