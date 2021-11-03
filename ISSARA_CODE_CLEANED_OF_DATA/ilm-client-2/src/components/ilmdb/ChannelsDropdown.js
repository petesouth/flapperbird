import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { useDispatch, useSelector } from "react-redux";

import { fetchChannels } from "../../redux/actions/CallActions";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import utils from "../../services/utils.js";


const customStyles = {
  ...styles
};

const useStyles = makeStyles(customStyles);

let fetch = false;

export default function ChannelsDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  
  const valueEmpty = " ";
  const [channelId, setChannelId] = useState((props.values) ? props.values : valueEmpty);


  const channels = useSelector(state => state.callChannels.items)
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchChannels())
    }
  }, [channelId]);


  const classes = useStyles();

  const handleChangeChannelId = (e) => {
    setChannelId(e.target.value);
    propsOnSelect({
      ...e,
      list: channels
    });
  }


  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
    >
      <InputLabel
        htmlFor="channel-select"
        className={classes.selectLabel}
      >
        Worker Voice Channel
      </InputLabel>
      <Select
        key={utils.giveMeGuid()}
        value={channelId}
        onChange={handleChangeChannelId}
        inputProps={{
          name: "channelSelect",
          id: "channel-select"
        }}
      >
        <MenuItem value={" "} key={utils.giveMeGuid()}>Worker Voice Channel</MenuItem>
        {channels && Object.keys(channels).map((obj, i) => {
          return <MenuItem value={channels[obj].id} key={utils.giveMeGuid()}> {channels[obj].name} </MenuItem>
        })}
      </Select>
    </FormControl>
  );
}
