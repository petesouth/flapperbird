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


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);


export default function GendersDropdown(props) {

  const valueEmpty = " ";

  const genderTypes = useSelector(state => [
    { value: valueEmpty, name: "--Select Gender--" },
    { value: 1, name: 'Male' },
    { value: 2, name: 'Female' },
    { value: 3, name: 'Other' },
    { value: 4, name: 'Non-Binary'}
  ])

  const classes = useStyles();

  const handleChangeGenderId = (e) => {
    props.onSelect(e.target.value);
  }


  return (
     <FormControl
       fullWidth
       className={classes.selectFormControl}
     >
       <InputLabel
         htmlFor="contractType-select"
         className={classes.selectLabel}
       >
         Gender
       </InputLabel>
       <Select
         value={props.value? props.value : valueEmpty}
         onChange={handleChangeGenderId}
         inputProps={{
           name: "gendersSelect",
           id: "genders-select"
         }}
       >
         {genderTypes.map((item, i) => {
           return <MenuItem value={item.value} key={i}> {item.name} </MenuItem>
         })}
       </Select>
     </FormControl>
  );
}

// Default values for props:
GendersDropdown.defaultProps = {
  onSelect: (selectedType) => console.log('Selected Gender: ', selectedType),
};
