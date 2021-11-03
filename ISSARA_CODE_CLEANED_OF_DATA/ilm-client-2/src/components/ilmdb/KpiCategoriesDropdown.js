import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchKPICategoryList } from "../../redux/actions/IssueActions.js";


export default function KpiCategoriesDropdown(props) {
  const dispatch = useDispatch();

  const kpiCategories = useSelector(state => state.kpisReducer.kpicategoryitems);
  const fetchingKpiCategories = useSelector(state => state.kpisReducer.fetchingKPICategories);

  const defaultValue = props.multipleselect? [] : null
  const [selectedKpiCategories, setSelectedKpiCategories] = useState(props.value)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchKPICategoryList())
    }
    setSelectedKpiCategories(props.value)
  }, [props]);

  const handleSelectKpiCategory = (e, value) => {
    var newSelectedKpiCategories = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedKpiCategories.push(item.id)
      })
    }
    else {
      newSelectedKpiCategories = value? value.id : null
    }
    setSelectedKpiCategories(newSelectedKpiCategories)
    // Send selected kpi categories to parent component
    props.onSelect(newSelectedKpiCategories)
  }

  var value = defaultValue
  if (!fetchingKpiCategories && kpiCategories && selectedKpiCategories) {
    kpiCategories.map(item => {
      if (props.multipleselect) {
        if (selectedKpiCategories.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedKpiCategories == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingKpiCategories?
      <p>  Fetching KPI categories.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={kpiCategories}
          multiple={props.multipleselect}
          onChange={handleSelectKpiCategory}
          value={value}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label={"KPI category"} variant="outlined" fullWidth />
          )}
        />
      </FormControl>
  );
}


// Default values for props:
KpiCategoriesDropdown.defaultProps = {
  onSelect: (selectedKpiCategories) => console.log('Selected KPI category: ', selectedKpiCategories)
};
