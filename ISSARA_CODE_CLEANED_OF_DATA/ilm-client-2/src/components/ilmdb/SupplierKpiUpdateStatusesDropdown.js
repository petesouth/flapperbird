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

import { fetchSupplierUpdateStatuses } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function SupplierKpiUpdateStatusesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const valueEmpty = " ";

  const supplierKpiUpdateStatuses = useSelector(state => state.supplierKpiUpdateStatusReducer.items)
  const dispatch = useDispatch();

  const [supplierKpiUpateStatusId, setSupplierKpiUpdateStatusId] = useState((props.value !== null && props.value !== undefined) ? props.value : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchSupplierUpdateStatuses())
    }
  }, [supplierKpiUpateStatusId]);


  const classes = useStyles();

  const handleChangeSupplierKpiUpdateStatusId = (e) => {
    setSupplierKpiUpdateStatusId(e.target.value);
    propsOnSelect({
      ...e,
      list: supplierKpiUpdateStatuses
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="supplier-kpi-update-status-select"
        className={classes.selectLabel}
      >
        Status of progress on this KPI
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={supplierKpiUpateStatusId}
        onChange={handleChangeSupplierKpiUpdateStatusId}
        inputProps={{
          name: "nationalitySelect",

          id: "nationality-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}>Status of KPI Progress</MenuItem>
        {supplierKpiUpdateStatuses && Object.keys(supplierKpiUpdateStatuses).map((obj, i) => {
          return <MenuItem value={supplierKpiUpdateStatuses[obj].id} key={utils.giveMeGuid()}> {supplierKpiUpdateStatuses[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
