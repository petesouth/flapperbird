import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import { fetchCallHHI } from "../../redux/actions/CallActions.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...customCheckboxRadioSwitch,
  title: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  GridContainer: {
    marginTop: '1em !important',
    paddingLeft: '6px !important',
  },
  gridItem: {
    padding: '0 !important',
  },
  customLabel: {
    color: 'rgba(0, 0, 0, 0.87)'
  }
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function HowHearIssara(props) {

  const dispatch = useDispatch()
  const classes = useStyles()

  const howHearIssara = useSelector(state => state.callHHI.items)
  const howHearIssaraLoading = useSelector(state => state.callHHI.fetchingCallHHI)



  const [checked, setChecked] = useState((props.values) ? props.values : []);

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchCallHHI())
    }
  }, []);

  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    // send updated list of checked items to parent component
    props.onChange(newChecked)
  };

  return (
    <div>
      <p className={classes.title}> How did the client hear about Issara? (check all that apply) </p>
      {howHearIssara && howHearIssara.length > 0 ?
        <GridContainer className={classes.GridContainer}>
          {howHearIssara.map(item => (
            <GridItem key={utils.giveMeGuid()}
              className={classes.gridItem} xs={12} sm={6} lg={6} xl={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    key={utils.giveMeGuid()}
                    checked={checked.includes(item.id)}
                    tabIndex={-1}
                    onClick={() => handleToggle(item.id)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label + ' ' + classes.customLabel,
                  root: classes.labelRoot
                }}
                label={item.name}
              />
            </GridItem>
          ))
          }
        </GridContainer>
        :
        <p> Loading... </p>
      }
    </div>
  );
}
