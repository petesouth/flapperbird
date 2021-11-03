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

import { fetchProvinces } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ProvincesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const valueEmpty = " ";

  const provinces = useSelector(state => state.provincesReducer.items);
  const dispatch = useDispatch();

  const [provinceId, setProvinceId,] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchProvinces())
    }
  }, [provinceId]);


  const classes = useStyles();

  const handleChangeProvinceId = (e) => {
    setProvinceId(e.target.value);
    propsOnSelect({
      ...e,
      list: provinces
    });
  }

  let filteredList = {};

  let contryIdNumber = (props.countryId) ? Number.parseInt(props.countryId) : 0;
  if (provinces) {
    Object.keys(provinces).map((province, i) => {
      if (provinces[province].country === contryIdNumber) {
        filteredList[province] = provinces[province];
      }
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
        Province
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={provinceId}
        onChange={handleChangeProvinceId}
        inputProps={{
          name: "provinceSelect",
          id: "province-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>Province</MenuItem>
        {Object.keys(filteredList).map((obj, i) => {
          return <MenuItem value={provinces[obj].id} key={utils.giveMeGuid()}> {provinces[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
