import React, { useState, useEffect } from "react";

import InputLabel from "@material-ui/core/InputLabel";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";


import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  label : {
    margin: '0 16px 16px 0',
    padding: '0 !important',
  },
  container: {
    margin: '0 !important',
  },
  buttonGroup: {
    padding: '0 !important',
  }

}));

export default function ButtonBar(props) {

  const classes = useStyles();


  const { buttons, name, value, required } = props;
  const readOnly = (props.readOnly !== undefined) ? props.readOnly : false;

  const [theValue, setTheValue] = useState(value);

  let list = buttons;

  useEffect(() => {
    setTheValue(value)
  }, [value]);

  //handle objects or arrays
  if (!buttons.map) {
    list = Object.keys(buttons).map(i => buttons[i]);
  }


  const items = list.map((item, i) => {

    let label = item.value;
    if (item.name) {
      label = item.name;
    } else if (item.label) {
      label = item.label
    }

    let defaultChecked = false;

    let element_id = name + '-' + item.id;
    let selected = "default";

    if (item.value && theValue) {
      if (typeof theValue === 'string') {
        if (item.value.toLowerCase() === value.toLowerCase()) {
          selected = "primary";
        }
      } else {
        if (item.value === theValue) {
          selected = "primary";
        }
      }


    }

    return (

      <Button color={selected}
        className={classes.customButtonBar}
        key={i}
        size={"large"}
        id={element_id}
        name={name}
        onClick={() =>{
          if(readOnly === true) {
            return
          }
          
          if( item.value !== theValue) {
            setTheValue(item.value);
          } else {
            setTheValue(null);
          }
          return (props.onClick) ? props.onClick(name, ( item.value !== theValue ) ? item.value : null) : {}} }
      >{label}</Button>


    )
  });


  return (
    <GridContainer className={classes.container}>
      <GridItem xs={props.labelWidth? props.labelWidth : 5} className={classes.label}><InputLabel>{name}</InputLabel></GridItem>
      <GridItem className={classes.buttonGroup}>
        <ButtonGroup variant="contained" aria-label="contained primary button group"
          //exclusive
          onChange={(props.onChange) ? props.onChange : (e) => { }}
          aria-label="text alignment"
        >
          {items}
        </ButtonGroup>
      </GridItem>
    </GridContainer>
  );
}
