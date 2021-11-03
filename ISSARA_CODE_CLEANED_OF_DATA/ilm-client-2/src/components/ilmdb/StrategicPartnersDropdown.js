import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchStrategicPartners } from "../../redux/actions/StrategicPartnerActions";

const fuzzysort = require('fuzzysort')


let fetch = false;
export default function StrategicPartnersDropdown(props) {
  const dispatch = useDispatch();
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)

  const defaultValue = props.multipleselect? [] : null
  const [selectedStrategicPartners, setSelectedStrategicPartners] = useState(props.value)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchStrategicPartners())
    }
    setSelectedStrategicPartners(props.value)
  }, [props]);

  const handleSelectStrategicPartner = (e, value, reason) => {
    var newSelectedStrategicPartners = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedStrategicPartners.push(item.id)
      })
    }
    else {
      newSelectedStrategicPartners = value? value.id : null
    }
    setSelectedStrategicPartners(newSelectedStrategicPartners)
    // Send selected strategic partners to parent component
    props.onSelect(newSelectedStrategicPartners)
  }

  var value = defaultValue
  if (!fetchingStrategicPartners && strategicPartners && selectedStrategicPartners) {
    strategicPartners.map(item => {
      if (props.multipleselect) {
        if (selectedStrategicPartners.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedStrategicPartners == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingStrategicPartners?
      <p>  Fetching strategic partners.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={strategicPartners}
          multiple={props.multipleselect}
          onChange={handleSelectStrategicPartner}
          value={value}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label={props.label} variant="outlined" fullWidth />
          )}
          filterOptions={
            (options, state) => {
              if (state.inputValue) {
                const results = fuzzysort.go(state.inputValue, options, {
                  key: 'name',
                  allowTypo: true,
                  limit: 100, // don't return more than 100 results
                  threshold: -10000, // don't return really bad results
                })
                return results.map(result => result.obj)
              }
              // show only 100 partners by default to speed up rendering
              return options.slice(0, 100)
            }
          }
        />
    </FormControl>
  );
}


// Default values for props:
StrategicPartnersDropdown.defaultProps = {
  onSelect: (selectedStrategicPartners) => {
    console.log('Selected strategic partners: ', selectedStrategicPartners)
  },
  label: 'Strategic Partner'
};
