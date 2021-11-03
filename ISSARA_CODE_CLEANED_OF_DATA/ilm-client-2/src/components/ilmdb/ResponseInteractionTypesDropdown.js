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

import { fetchResponseInteractionTypes } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ResponseInteractionTypesDropdown(props) {

  const responseinteractiontypes = useSelector(state => state.responseInteractionTypesReducer.items)
  const dispatch = useDispatch();

  // const [responseinteractiontypeId, setResponseInteractionTypeId] = useState(props.defaultValue? props.defaultValue : '');

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchResponseInteractionTypes())
    }
  }, []);


  const classes = useStyles();

  const handleChangeResponseInteractionTypeId = (e) => {
    // setResponseInteractionTypeId(e.target.value);
    props.onSelect(e.target.value);
  }

  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="nationality-select"
        className={classes.selectLabel}
      >
        Response Interaction Types
            </InputLabel>
      <Select
        value={props.value? props.value : ''}
        onChange={handleChangeResponseInteractionTypeId}
        inputProps={{
          name: "responseInteractionTypeSelect",
        }}
      >
        {responseinteractiontypes.map((item, i) => {
          return <MenuItem value={item.id} key={i}> {item.name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

// Default values for props:
ResponseInteractionTypesDropdown.defaultProps = {
  onSelect: (selectedType) => console.log('Selected interaction type: ', selectedType),
};
