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

import { fetchCaseStatuses } from "../../redux/actions/LocaleActions";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);


export default function CaseStatusesDropdown(props) {

  const valueEmpty = 1;


  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const propsShowLabel = (props.showLabel !== undefined) ? props.showLabel : true;

  const caseStatuses = [{ id: 1, name: "open" }, { id: 2, name: "close"}];
  const [caseStatusId, setCaseStatusId] = useState((props !== undefined && props.value !== undefined) ? props.value : valueEmpty);


  const classes = useStyles();

  const handleChangeCaseStatusId = (e) => {
    setCaseStatusId(e.target.value);
    propsOnSelect({
      ...e,
      list: caseStatuses
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      {((propsShowLabel === true) ? <InputLabel
        htmlFor="casestatuses-select"
        className={classes.selectLabel}
      >
        Case Status
      </InputLabel> : null)}

      <Select
        key={utils.giveMeGuid()}
        value={caseStatusId}
        onChange={handleChangeCaseStatusId}
        inputProps={{
          name: "casestatusesSelect",
          id: "casestatuses-select"
        }}
      >
        {caseStatuses && Object.keys(caseStatuses).map((obj, i) => {
          return <MenuItem value={caseStatuses[obj].id} key={utils.giveMeGuid()}> {caseStatuses[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
