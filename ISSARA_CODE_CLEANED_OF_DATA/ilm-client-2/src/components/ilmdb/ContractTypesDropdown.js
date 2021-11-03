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


export default function ContractTypesDropdown(props) {

  const contractTypes = useSelector(state => [
    { value: 1, name: 'Daily worker' },
    { value: 2, name: 'Piece work' },
    { value: 3, name: 'Seasonal worker' },
    { value: 4, name: 'Full-time position' },
    { value: 5, name: 'Other' }
  ])

  const classes = useStyles();

  const handleChangeContractTypeId = (e) => {
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
         Contract Type
       </InputLabel>
       <Select
         value={props.value? props.value : ''}
         onChange={handleChangeContractTypeId}
         inputProps={{
           name: "contractTypeSelect",
           id: "contractType-select"
         }}
       >
         {contractTypes.map((item, i) => {
           return <MenuItem value={item.value} key={i}> {item.name} </MenuItem>
         })}
       </Select>
     </FormControl>
  );
}

// Default values for props:
ContractTypesDropdown.defaultProps = {
  onSelect: (selectedType) => console.log('Selected contractType: ', selectedType),
};
