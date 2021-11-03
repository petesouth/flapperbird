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

import { fetchDistricts } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function DistrictsDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const valueEmpty = " ";

  const districts = useSelector(state => state.districtsReducer.items );

  const dispatch = useDispatch();

  const [districtId, setDistrictId] = useState((props.values) ? props.values : valueEmpty);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchDistricts())
    }
  }, [districtId]);


  const classes = useStyles();

  const handleChangeDistrictId = (e) => {
    setDistrictId(e.target.value);
    propsOnSelect({
      ...e,
      list: districts
    });
  }

  let filteredList = {};

  if (districts !== undefined && props.provinceId !== undefined &&
       props.provinceId !== valueEmpty ) {

    let provinceIdNumber = Number.parseInt(props.provinceId);

    Object.keys(districts).map((district, i) => {
      if (districts[district].province === provinceIdNumber) {
        filteredList[district] = districts[district];
      }
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="district-select"
        className={classes.selectLabel}
      >
        District
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={districtId}
        onChange={handleChangeDistrictId}
        inputProps={{
          name: "districtSelect",
          id: "district-select"
        }}
      >
        <MenuItem value={valueEmpty} key={utils.giveMeGuid()}>District</MenuItem>
        {Object.keys(filteredList).map((key, i) => {
          return <MenuItem value={filteredList[key].id} key={utils.giveMeGuid()}> {filteredList[key].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
