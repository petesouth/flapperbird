import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from '@material-ui/core/ListSubheader';

import { fetchFieldworkTypes } from "../../redux/actions/TeamActivityActions";



export default function FieldworkTypeDropdown(props) {
  const dispatch = useDispatch();
  const fieldworkTypes = useSelector(state => state.teamActivityReducer.fieldworkTypes)
  const fetchingFieldworkTypes = useSelector(state => state.teamActivityReducer.fetchingFieldworkTypes)

  useEffect(() => {
    if (!fieldworkTypes || Object.keys(fieldworkTypes).length < 1) {
     dispatch(fetchFieldworkTypes())
    }
  }, [props.value]);

  const handleSelectFieldworkType = (e) => {
    props.onSelect(e.target.value)
  }

  const renderSelectGroup = category => {
    const items = Object.keys(category.types).map((key, i) => {
      return (
        <MenuItem key={i} value={category.types[key]}>
          {category.types[key].name}
        </MenuItem>
      );
    });
    return [<ListSubheader>{category.name}</ListSubheader>, items];
  };

  return (
    fetchingFieldworkTypes?
      <p>  Fetching fieldwork types.. </p>
      :
      <FormControl fullWidth>
        <InputLabel htmlFor="activity-type-select"> Activity Type </InputLabel>
        <Select
          id="activity-type-select"
          value={props.value || {}}
          onChange={handleSelectFieldworkType}
        >
          {fieldworkTypes && Object.values(fieldworkTypes).map(category => {
            return renderSelectGroup(category)
          })}
        </Select>
      </FormControl>
  );
}


// Default values for props:
FieldworkTypeDropdown.defaultProps = {
  onSelect: (fieldworkType) => console.log('Selected fieldwork type: ', fieldworkType)
};
