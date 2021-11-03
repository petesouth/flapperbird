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


export default function DocumentTypeDropdown(props) {

  const documentTypes = useSelector(state => [
    { value: '1', name: 'Undocumented' },
    { value: '2', name: 'Pink card' },
    { value: '3', name: 'CI/TD' },
    { value: '4', name: 'Passport' },
    { value: '5', name: 'Border pass' },
    { value: '6', name: 'NA' }
  ])


  const classes = useStyles();

  const handleChangeDocumentTypeId = (e) => {
    props.onSelect(e.target.value);
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="documentType-select"
        className={classes.selectLabel}
      >
        Document Type
            </InputLabel>
      <Select
        value={props.value? props.value : ''}
        onChange={handleChangeDocumentTypeId}
        inputProps={{
          name: "documentTypeSelect",
          id: "documentType-select"
        }}
      >
        {documentTypes.map((item, i) => {
          return <MenuItem value={item.value} key={i}> {item.name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

// Default values for props:
DocumentTypeDropdown.defaultProps = {
  onSelect: (selectedType) => console.log('Selected documentType: ', selectedType),
};
