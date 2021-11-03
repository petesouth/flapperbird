import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchRecruiters } from "../../redux/actions/RecruiterActions";

const fuzzysort = require('fuzzysort')

let fetch = false;

export default function RecruitersDropdown(props) {
  const dispatch = useDispatch();

  const recruiters = useSelector(state => state.recruitersReducer.items)

  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)

  const defaultValue = props.multipleselect? [] : null
  const [selectedRecruiters, setSelectedRecruiters] = useState(props.value)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchRecruiters())
    }
    setSelectedRecruiters(props.value)
  }, [props]);

  const handleSelectRecruiters = (e, value, reason) => {
    var newSelectedRecruiters = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedRecruiters.push(item.id)
      })
    }
    else {
      newSelectedRecruiters = value? value.id : null
    }
    setSelectedRecruiters(newSelectedRecruiters)
    // Send selected recruiters to parent component
    props.onSelect(newSelectedRecruiters)
  }

  var value = defaultValue
  if (!fetchingRecruiters && recruiters && selectedRecruiters) {
    recruiters.map(item => {
      if (props.multipleselect) {
        if (selectedRecruiters.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedRecruiters == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingRecruiters?
      <p>  Fetching recruiters.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={recruiters}
          multiple={props.multipleselect}
          onChange={handleSelectRecruiters}
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
              // show only 100 recruiters by default to speed up rendering
              return options.slice(0, 100)
            }
          }
        />
      </FormControl>
    );
}


// Default values for props:
RecruitersDropdown.defaultProps = {
  onSelect: (selectedRecruiters) => {
    console.log('Selected recruiters: ', selectedRecruiters)
  },
  label: 'Recruiter'
};
