import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { fetchUsers } from "../../redux/actions/UsersActions";


let fetch = false;

export default function IssaraStaffDropdown(props) {
  const dispatch = useDispatch();
  const users = useSelector(state => state.usersReducer.items);
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers);

  const defaultValue = props.multipleselect? [] : null
  const [selectedUsers, setSelectedUsers] = useState(props.value)

  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchUsers())
    }
    setSelectedUsers(props.value)
  }, [props]);

  const handleSelectUsers = (e, value, reason) => {
    var newSelectedUsers = []
    if (props.multipleselect) {
      // Convert array of Objects to array of IDs
      value.map(item => {
        newSelectedUsers.push(item.id)
      })
    }
    else {
      newSelectedUsers = value? value.id : null
    }
    setSelectedUsers(newSelectedUsers)
    // Send selected suppliers to parent component
    props.onSelect(newSelectedUsers, (fetchingUsers) ? [] : users);
  }

  var value = defaultValue
  if (!fetchingUsers && users && selectedUsers) {
    users.map(item => {
      if (props.multipleselect) {
        if (selectedUsers.includes(item.id)) {
          value.push(item)
        }
      }
      else {
        if (selectedUsers == item.id) {
          value = item
        }
      }
    })
  }

  return (
    fetchingUsers?
      <p>  Fetching suppliers.. </p>
      :
      <FormControl fullWidth>
        <Autocomplete
          id="combo-box-demo"
          options={users}
          multiple={props.multipleselect}
          onChange={handleSelectUsers}
          value={value}
          getOptionLabel={option => {
            
            return (option.is_active !== true ) ? option.email + " (In-Active)" : option.email;
           }}
          renderInput={params => (
            <TextField {...params} label={((props.label !== undefined) ? props.label : "Issara Staff")} variant="outlined" fullWidth />
          )}
        />
      </FormControl>
  );
}


// Default values for props:
IssaraStaffDropdown.defaultProps = {
  onSelect: (selectedUsers) => console.log('Selected suppliers: ', selectedUsers)
};
