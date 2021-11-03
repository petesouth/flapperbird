import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchSuppliers } from "../../redux/actions/SupplierActions";

const fuzzysort = require('fuzzysort')



export default function SuppliersDropdown(props) {
  const dispatch = useDispatch();
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const defaultValue = props.multipleselect ? [] : null
  const filterSuppliers = props.filterSuppliers ? props.filterSuppliers : null;

  const [selectedSuppliers, setSelectedSuppliers] = useState(props.value)

  const suppliers = useSelector(state => state.suppliersReducer.items)


  useEffect(() => {
    if (!suppliers || suppliers.length < 1) {
      dispatch(fetchSuppliers())
    }
  }, [])

  useEffect(() => {
    setSelectedSuppliers(props.value)
  }, [props]);

  const handleSelectSupplier = (e, value, reason) => {
    var newSelectedSuppliers = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedSuppliers.push(item.id)
      })
    }
    else {
      newSelectedSuppliers = value? value.id : null
    }
    setSelectedSuppliers(newSelectedSuppliers)
    // Send selected suppliers to parent component
    props.onSelect(newSelectedSuppliers)
  }

  var value = defaultValue
  if (!fetchingSuppliers && suppliers && selectedSuppliers) {
    suppliers.map(item => {
      if (props.multipleselect) {
        if (selectedSuppliers.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedSuppliers == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingSuppliers?
      <p>  Fetching suppliers.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={(()=>{
            let returnSuppliers = [];


            if( filterSuppliers !== null &&
              filterSuppliers !== undefined &&
              filterSuppliers.length > 0 ) {
                suppliers.forEach((item)=>{
                  if(filterSuppliers.includes(item.id)) {
                    returnSuppliers.push(item);
                  }
                });
            } else {
              returnSuppliers = suppliers;
            }
            return returnSuppliers;
          })()}
          multiple={props.multipleselect}
          onChange={handleSelectSupplier}
          value={value}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label={"Supplier"} variant="outlined" fullWidth />
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
              // show only 100 suppliers by default to speed up rendering
              return options.slice(0, 100)
            }
          }
        />
      </FormControl>
  );
}


// Default values for props:
SuppliersDropdown.defaultProps = {
  onSelect: (selectedSuppliers) => console.log('Selected suppliers: ', selectedSuppliers)
};
