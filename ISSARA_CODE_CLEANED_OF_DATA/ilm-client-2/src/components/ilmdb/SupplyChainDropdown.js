import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";

let fetch = false;
export default function SupplyChainDropdown(props) {
  const dispatch = useDispatch();
  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const fetchingSupplyChains = useSelector(state => state.supplyChainReducer.fetchingSupplyChains)

  const defaultValue = props.multipleselect? [] : null
  const [selectedSupplyChains, setSelectedSupplyChains] = useState(props.value)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchSupplyChains())
    }
    setSelectedSupplyChains(props.value)
  }, [props]);

  const handleSelectSupplyChain = (e, value, reason) => {
    var newSelectedSupplyChains = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedSupplyChains.push(item.id)
      })
    }
    else {
      newSelectedSupplyChains = value? value.id : null
    }
    setSelectedSupplyChains(newSelectedSupplyChains)
    // Send selected strategic partners to parent component
    props.onSelect(newSelectedSupplyChains)
  }

  var value = defaultValue
  if (!fetchingSupplyChains && supplyChains && selectedSupplyChains) {
    supplyChains.map(item => {
      if (props.multipleselect) {
        if (selectedSupplyChains.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedSupplyChains == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingSupplyChains?
      <p>  Fetching Supply Chains.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={supplyChains}
          disabled={props.disableSupplyChainSelect === true}
          multiple={props.multipleselect}
          onChange={handleSelectSupplyChain}
          value={value}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label={props.label} variant="outlined" fullWidth />
          )}
        />
    </FormControl>
  );
}


// Default values for props:
SupplyChainDropdown.defaultProps = {
  onSelect: (selectedStrategicPartners) => {
    console.log('Selected supplyChains: ', selectedStrategicPartners)
  },
  label: 'Supply Chain'
};
