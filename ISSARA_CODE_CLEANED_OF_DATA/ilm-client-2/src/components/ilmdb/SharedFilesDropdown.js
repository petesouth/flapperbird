import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

// core components

import { useDispatch, useSelector } from "react-redux";


import { fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";

const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function SharedFilesDropdown(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sharedFiles = useSelector(state => state.sharedFilesReducer.sharedFiles);
  const sharedFilesMap = useSelector(state => state.sharedFilesReducer.sharedFilesMap);
  
  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchSharedFiles())
    }
  }, []);

  const handleChangeSharedFileId = (e) => {
    props.onSelect({
      ...e,
      list: sharedFiles
    });
  }


  return (
    <FormControl fullWidth={true}>
      <InputLabel
        htmlFor="sharedfiles-select"
        className={classes.selectLabel}
      >
        Shared Files
            </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={props.values? props.values : ''}
        onChange={handleChangeSharedFileId}
        inputProps={{
          name: "sharedFilesSelect",
          id: "sharedFiles-select"
        }}
      >
        {sharedFiles && sharedFiles.map((item, i) => {
          return <MenuItem value={item.id} key={i}> {item.name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

// Default values for props:
SharedFilesDropdown.defaultProps = {
  onSelect: (selectedSharedFile) => console.log('Selected sharedFile: ', selectedSharedFile),
};
